import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Flame,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setCartDrawerOpen,
    currentView,
    navigate,
    currentUser,
    switchUser,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const categories = db.getCategories();
  const allProducts = db.getProducts();

  // Filtered preview products for quick search popup
  const searchResults = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ type: 'shop', query: searchQuery.trim() });
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (type: string) => currentView.type === type;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-[#1c1917] text-stone-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="inline-flex items-center gap-1 bg-amber-900/40 text-amber-300 font-medium px-2 py-0.5 rounded text-[11px] border border-amber-800/50">
              <Sparkles className="w-3 h-3 text-amber-400" />
              EID & SUMMER '26
            </span>
            <span>
              Free Express Delivery inside Dhaka on orders above ৳2,500 | 🇧🇩 Proudly Made in Bangladesh
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-stone-400">
            <button
              onClick={() => navigate({ type: 'track-order' })}
              className="hover:text-white transition flex items-center gap-1.5 text-amber-300/90 font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </button>
            <span>|</span>
            <span>Hotline: +880 9612-AURA-BD</span>
            <span>|</span>
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>bKash & Nagad Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Brand */}
          <div
            id="aura-brand-logo"
            onClick={() => navigate({ type: 'home' })}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xl tracking-tighter shadow-sm group-hover:scale-105 transition-transform duration-200">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-stone-900 leading-none">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-stone-500 uppercase">
                Dhaka • Lifestyle
              </span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search panjabi, tees, kurtis, cargos, sneakers..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-sm text-stone-900 rounded-full border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Quick Live Search Results Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div
                id="search-live-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-3 py-1.5 flex justify-between items-center">
                  <span>Search Suggestions</span>
                  <span className="text-[10px]">{searchResults.length} results</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-stone-100">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate({ type: 'product-details', productId: p.id });
                          setSearchFocused(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl cursor-pointer transition"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                          <p className="text-xs text-stone-500">{p.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-stone-900">৳{p.price.toLocaleString()}</p>
                          {p.originalPrice > p.price && (
                            <p className="text-[11px] text-stone-400 line-through">
                              ৳{p.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-semibold text-stone-800 hover:text-amber-800 transition flex items-center justify-center gap-1 mt-1"
                    >
                      View all matching products <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-stone-500">
                    No products found for "{searchQuery}". Try "panjabi" or "tee".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Switcher / Mode indicator */}
            <button
              id="admin-dashboard-btn"
              onClick={() => navigate({ type: 'admin', tab: 'overview' })}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                currentView.type === 'admin'
                  ? 'bg-amber-900 text-white border-amber-900'
                  : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-200 hover:border-amber-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Portal</span>
            </button>

            {/* User Profile / Account Dropdown */}
            <div className="relative">
              <button
                id="user-account-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-stone-100 text-stone-700 transition"
                aria-label="User Account"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden xl:inline text-xs font-semibold text-stone-800 max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="hidden xl:inline w-3 h-3 text-stone-400" />
              </button>

              {userDropdownOpen && (
                <div
                  id="user-dropdown-panel"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-stone-800 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500">Logged in as</p>
                    <p className="text-sm font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-1 text-sm">
                    <button
                      onClick={() => {
                        navigate({ type: 'account', tab: 'profile' });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 transition"
                    >
                      <UserIcon className="w-4 h-4 text-stone-500" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate({ type: 'account', tab: 'orders' });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 transition"
                    >
                      <Package className="w-4 h-4 text-stone-500" />
                      <span>Order History</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate({ type: 'track-order' });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 transition"
                    >
                      <Truck className="w-4 h-4 text-stone-500" />
                      <span>Track Order</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate({ type: 'wishlist' });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 transition"
                    >
                      <Heart className="w-4 h-4 text-stone-500" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate({ type: 'admin', tab: 'overview' });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 transition text-amber-800 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Admin Management</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-1 text-xs">
                    <div className="px-4 py-1.5 text-stone-400 font-semibold uppercase text-[10px]">
                      Switch Demo Role
                    </div>
                    <button
                      onClick={() => {
                        switchUser('customer');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 hover:bg-stone-50 flex items-center justify-between ${
                        currentUser.role === 'customer' ? 'font-bold text-amber-800' : 'text-stone-600'
                      }`}
                    >
                      <span>Tanvir (Customer)</span>
                      {currentUser.role === 'customer' && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchUser('admin');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 hover:bg-stone-50 flex items-center justify-between ${
                        currentUser.role === 'admin' ? 'font-bold text-amber-800' : 'text-stone-600'
                      }`}
                    >
                      <span>Farhan (Admin)</span>
                      {currentUser.role === 'admin' && <span>✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigate({ type: 'wishlist' })}
              className="relative p-2.5 rounded-full hover:bg-stone-100 text-stone-700 transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 text-xs font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-between border-t border-stone-100 py-3 text-sm font-medium text-stone-700">
          <div className="flex items-center gap-8">
            <button
              id="nav-link-home"
              onClick={() => navigate({ type: 'home' })}
              className={`hover:text-stone-950 transition relative py-1 ${
                isActive('home') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              Home
              {isActive('home') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              id="nav-link-shop"
              onClick={() => navigate({ type: 'shop' })}
              className={`hover:text-stone-950 transition relative py-1 ${
                isActive('shop') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              Shop All
              {isActive('shop') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            <button
              id="nav-link-ai-videos"
              onClick={() => navigate({ type: 'ai-videos' })}
              className={`hover:text-stone-950 transition relative py-1 flex items-center gap-1.5 ${
                isActive('ai-videos') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Videos</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                NEW
              </span>
              {isActive('ai-videos') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            {/* Categories dropdown or direct links */}
            <div className="relative group">
              <button
                onClick={() => navigate({ type: 'shop' })}
                className="flex items-center gap-1 hover:text-stone-950 transition py-1 text-stone-600"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 px-2 hidden group-hover:block z-50 animate-in fade-in duration-150">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate({ type: 'shop', category: cat.id })}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-lg flex items-center justify-between transition"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      {cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="nav-link-offers"
              onClick={() => navigate({ type: 'shop', query: 'offer' })}
              className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-bold transition py-1"
            >
              <Flame className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>Special Offers & Discounts</span>
            </button>

            <button
              id="nav-link-track"
              onClick={() => navigate({ type: 'track-order' })}
              className={`hover:text-stone-950 transition relative py-1 flex items-center gap-1.5 ${
                isActive('track-order') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-stone-500" />
              <span>Track Order</span>
              {isActive('track-order') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            <button
              id="nav-link-about"
              onClick={() => navigate({ type: 'about' })}
              className={`hover:text-stone-950 transition relative py-1 ${
                isActive('about') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              About Us
              {isActive('about') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            <button
              id="nav-link-contact"
              onClick={() => navigate({ type: 'contact' })}
              className={`hover:text-stone-950 transition relative py-1 ${
                isActive('contact') ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              Contact Us
              {isActive('contact') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Banani Flagship Store: Open Today until 10:00 PM
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-800">
            <button
              onClick={() => {
                navigate({ type: 'home' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => {
                navigate({ type: 'shop' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate({ type: 'ai-videos' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Videos Lookbook</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded font-bold">
                NEW
              </span>
            </button>

            <button
              onClick={() => {
                navigate({ type: 'wishlist' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Wishlist</span>
              </span>
              {wishlistCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              ) : (
                <ArrowRight className="w-4 h-4 text-stone-400" />
              )}
            </button>

            <button
              onClick={() => {
                navigate({ type: 'track-order' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Track Order</span>
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Categories sub-list */}
            <div className="pl-3 py-1 border-l-2 border-stone-200 space-y-1">
              <p className="text-xs uppercase tracking-wider font-bold text-stone-400">Categories</p>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigate({ type: 'shop', category: c.id });
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 text-xs text-stone-600 hover:text-stone-950"
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                navigate({ type: 'shop', query: 'offer' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg text-amber-800 font-bold hover:bg-amber-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-700" />
                Special Offers / Discounts
              </span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>

            <button
              onClick={() => {
                navigate({ type: 'about' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>About Us</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate({ type: 'contact' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate({ type: 'admin', tab: 'overview' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg bg-stone-900 text-white font-semibold flex items-center justify-between mt-2"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Dashboard
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
