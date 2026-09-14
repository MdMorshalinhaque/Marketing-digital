import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  initialCategory?: string;
  initialQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, initialQuery }) => {
  const { searchQuery, setSearchQuery } = useShop();
  const allProducts = db.getProducts();
  const categories = db.getCategories();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Extract all available brands, sizes, colors
  const brands = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.brand)));
  }, [allProducts]);

  const allAvailableSizes = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '30', '32', '34'];
  const allAvailableColors = [
    { name: 'Black', hex: '#18181b' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Navy', hex: '#1e293b' },
    { name: 'Olive', hex: '#556b2f' },
    { name: 'Tan', hex: '#d2b48c' },
    { name: 'Charcoal', hex: '#3f3f46' },
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      const activeSearch = initialQuery || searchQuery;
      if (activeSearch && activeSearch.trim() !== '') {
        const q = activeSearch.toLowerCase();
        if (q === 'offer' || q === 'special') {
          if (!p.isSpecialOffer && p.discountPercent < 15) return false;
        } else if (q === 'bestseller') {
          if (!p.isBestseller) return false;
        } else if (q === 'new') {
          if (!p.isNewArrival) return false;
        } else {
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
      }

      // Price filter
      if (p.price > priceRange) {
        return false;
      }

      // Rating filter
      if (selectedRating > 0 && p.rating < selectedRating) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Sizes filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => p.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Colors filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) =>
          p.colors.some((pc) => pc.name.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      // In-stock only
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [
    allProducts,
    selectedCategory,
    initialQuery,
    searchQuery,
    priceRange,
    selectedRating,
    selectedBrand,
    selectedSizes,
    selectedColors,
    inStockOnly,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(6000);
    setSelectedRating(0);
    setSelectedBrand('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange < 6000 ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (inStockOnly ? 1 : 0);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {selectedCategory !== 'all'
              ? categories.find((c) => c.id === selectedCategory)?.name || 'Collection'
              : initialQuery
              ? `Results for "${initialQuery}"`
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing <strong>{filteredProducts.length}</strong> authentic handcrafted & streetwear items in Bangladesh
          </p>
        </div>

        {/* Sort and Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            id="mobile-filter-open-btn"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="featured">Featured / Popular</option>
              <option value="price-asc">Price: Low to High (৳)</option>
              <option value="price-desc">Price: High to Low (৳)</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-400 font-semibold">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Category: {categories.find((c) => c.id === selectedCategory)?.name}
              <X
                className="w-3 h-3 cursor-pointer hover:text-stone-950"
                onClick={() => setSelectedCategory('all')}
              />
            </span>
          )}
          {priceRange < 6000 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Under ৳{priceRange.toLocaleString()}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-950" onClick={() => setPriceRange(6000)} />
            </span>
          )}
          {selectedRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              ★ {selectedRating}+ Stars
              <X className="w-3 h-3 cursor-pointer hover:text-stone-950" onClick={() => setSelectedRating(0)} />
            </span>
          )}
          {selectedBrand !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Brand: {selectedBrand}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-950" onClick={() => setSelectedBrand('all')} />
            </span>
          )}
          {selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium"
            >
              Size {s}
              <X className="w-3 h-3 cursor-pointer hover:text-stone-950" onClick={() => toggleSize(s)} />
            </span>
          ))}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer hover:text-stone-950" onClick={() => setInStockOnly(false)} />
            </span>
          )}
          <button
            id="reset-all-filters-btn"
            onClick={resetFilters}
            className="text-xs text-amber-800 hover:text-amber-900 font-bold underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-stone-200/90 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-800" />
              <span>Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Categories</h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white font-bold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                <span>{allProducts.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] text-stone-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-700">Max Price</h4>
              <span className="font-extrabold text-stone-900">৳{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="100"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>৳500</span>
              <span>৳3,000</span>
              <span>৳6,000+</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Brand / Sub-label</h4>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
            >
              <option value="all">All Sub-labels</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Sizes</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {allAvailableSizes.map((s) => {
                const isSelected = selectedSizes.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Customer Rating</h4>
            <div className="space-y-1">
              {[4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setSelectedRating(selectedRating === star ? 0 : star);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                    selectedRating === star
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span>{star}.0 & above</span>
                  </div>
                  {selectedRating === star && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* In stock toggle */}
          <div className="pt-3 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 w-4 h-4"
              />
              <span>In Stock Only (Dhaka Hub)</span>
            </label>
          </div>
        </aside>

        {/* Product Grid & States */}
        <div className="lg:col-span-3 space-y-8">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-stone-200">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                            currentPage === pageNum
                              ? 'bg-stone-900 text-white'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No products match your filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your price range, clearing size or color filters, or searching for other items.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl p-5 flex flex-col justify-between">
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-extrabold text-base text-stone-900">Filter Products</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 rounded-full text-stone-400 hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-stone-700">Category</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`p-2 rounded-xl text-xs font-semibold border ${
                        selectedCategory === 'all'
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`p-2 rounded-xl text-xs font-semibold border truncate ${
                          selectedCategory === c.id
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="space-y-2 pt-3 border-t border-stone-100">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Max Price</span>
                    <span>৳{priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>

                {/* Mobile Sizes */}
                <div className="space-y-2 pt-3 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase text-stone-700">Sizes</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {allAvailableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          selectedSizes.includes(s)
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply/Reset Button in Mobile Drawer */}
              <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-2">
                <button
                  onClick={resetFilters}
                  className="py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
