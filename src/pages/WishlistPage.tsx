import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  User as UserIcon,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    moveAllWishlistToCart,
    addToCart,
    navigate,
    currentUser,
  } = useShop();

  // Local size and color selections per product for instant customization
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  const allProducts = db.getProducts();
  const wishlistedProducts = wishlist
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleColorSelect = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleMoveSingle = (product: Product) => {
    const size = selectedSizes[product.id] || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const color = selectedColors[product.id] || (product.colors.length > 0 ? product.colors[0]?.name : 'Default');
    moveToCart(product.id, size, color);
  };

  const handleAddToCartKeepInWishlist = (product: Product) => {
    const size = selectedSizes[product.id] || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const color = selectedColors[product.id] || (product.colors.length > 0 ? product.colors[0]?.name : 'Default');
    addToCart(product, size, color, 1);
  };

  // Recommended products for empty state or bottom tray
  const recommendedProducts = allProducts.filter((p) => !wishlist.includes(p.id)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-stone-500">
        <button
          onClick={() => navigate({ type: 'home' })}
          className="hover:text-stone-900 transition"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold">Wishlist</span>
      </nav>

      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                My Saved Wishlist
              </h1>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* User Account Linkage Badge */}
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                Linked to <strong>{currentUser.name}</strong> ({currentUser.email})
              </span>
              <span className="hidden sm:inline text-stone-400">•</span>
              <span className="hidden sm:inline text-stone-500">
                Saved items persist across your login sessions
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                id="wishlist-clear-all-btn"
                onClick={clearWishlist}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <button
                id="wishlist-move-all-btn"
                onClick={moveAllWishlistToCart}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-stone-900/10"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Move All to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Items List */}
      {wishlistedProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map((product) => {
              const currentSize =
                selectedSizes[product.id] || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
              const currentColor =
                selectedColors[product.id] || (product.colors.length > 0 ? product.colors[0]?.name : 'Default');
              const inStock = product.stock > 0;

              return (
                <div
                  key={product.id}
                  id={`wishlist-item-${product.id}`}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top Image + Badges */}
                  <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => navigate({ type: 'product-details', productId: product.id })}
                      className="w-full h-full object-cover object-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount & Special Tag Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {product.discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
                          -{product.discountPercent}% OFF
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 text-[10px] font-extrabold shadow-sm">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Quick Remove from Wishlist button */}
                    <button
                      id={`remove-wishlist-${product.id}`}
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-stone-500 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-sm transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Stock indicator badge */}
                    <div className="absolute bottom-2 left-2">
                      {inStock ? (
                        product.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-900/90 text-amber-200 text-[10px] font-bold backdrop-blur-sm">
                            Only {product.stock} left in Dhaka!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 text-[10px] font-bold backdrop-blur-sm">
                            In Stock
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-900/90 text-rose-200 text-[10px] font-bold backdrop-blur-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="uppercase tracking-wider font-semibold text-stone-400">
                          {product.brand}
                        </span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          ★ {product.rating} ({product.reviewCount})
                        </span>
                      </div>

                      <h3
                        onClick={() => navigate({ type: 'product-details', productId: product.id })}
                        className="font-bold text-stone-900 text-sm leading-snug cursor-pointer hover:text-amber-800 transition line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-extrabold text-stone-900">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-stone-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {product.originalPrice > product.price && (
                          <span className="text-xs font-semibold text-emerald-700">
                            Save ৳{(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Size Selector for instant Move-To-Cart */}
                    {product.sizes.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[11px] font-semibold text-stone-600">
                          <span>Size:</span>
                          <span className="text-stone-900 font-bold">{currentSize}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeSelect(product.id, sz)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                                currentSize === sz
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Preview */}
                    {product.colors.length > 1 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[11px] font-semibold text-stone-600">
                          <span>Color:</span>
                          <span className="text-stone-900 font-bold">{currentColor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {product.colors.map((c) => (
                            <button
                              key={c.name}
                              onClick={() => handleColorSelect(product.id, c.name)}
                              title={c.name}
                              style={{ backgroundColor: c.hex }}
                              className={`w-6 h-6 rounded-full border transition flex items-center justify-center ${
                                currentColor === c.name
                                  ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                                  : 'border-stone-300 opacity-80 hover:opacity-100'
                              }`}
                            >
                              {currentColor === c.name && (
                                <Check
                                  className={`w-3 h-3 ${
                                    c.hex === '#ffffff' ? 'text-stone-900' : 'text-white'
                                  }`}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons: Move to Cart & Remove */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <button
                        id={`move-to-cart-btn-${product.id}`}
                        onClick={() => handleMoveSingle(product)}
                        disabled={!inStock}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                          inStock
                            ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-md shadow-stone-900/10'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-300" />
                        <span>{inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                      </button>

                      <div className="flex items-center justify-between gap-2 text-xs">
                        <button
                          onClick={() => handleAddToCartKeepInWishlist(product)}
                          disabled={!inStock}
                          className="text-stone-600 hover:text-stone-900 font-semibold py-1 hover:underline disabled:opacity-50"
                        >
                          Add to Cart (Keep Saved)
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold py-1 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center ring-8 ring-rose-50/50">
            <Heart className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Your wishlist is currently empty
            </h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Save your favorite items by tapping the heart icon on any product in our Shop or Product Details pages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-stone-900/10"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={() => navigate({ type: 'shop', category: 'cat-panjabi' })}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-800 font-bold text-xs sm:text-sm transition"
            >
              View Festive Panjabis
            </button>
          </div>
        </div>
      )}

      {/* Recommended Items Section */}
      {recommendedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                You Might Also Like
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Trending Bangladeshi Essentials
              </h3>
            </div>
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="text-xs font-bold text-stone-700 hover:text-amber-800 transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate({ type: 'product-details', productId: prod.id })}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer hover:shadow-md transition p-3 space-y-2.5"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 relative">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.discountPercent > 0 && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold">
                      -{prod.discountPercent}%
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400">{prod.brand}</p>
                  <p className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800 transition">
                    {prod.name}
                  </p>
                  <p className="text-xs font-extrabold text-stone-900 mt-1">
                    ৳{prod.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
