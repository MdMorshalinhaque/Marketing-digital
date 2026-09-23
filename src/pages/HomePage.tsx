import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Flame,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { ProductCard } from '../components/ProductCard';
import { AIVideoShowcase } from '../components/video/AIVideoShowcase';

export const HomePage: React.FC = () => {
  const { navigate, showToast } = useShop();
  const products = db.getProducts();
  const categories = db.getCategories();
  const reviews = db.getReviews().slice(0, 4);

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const specialOffers = products.filter((p) => p.discountPercent >= 20 || p.isSpecialOffer).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80"
            alt="AURA Lifestyle Fashion"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NEW DROPS • EID & SUMMER '26</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Contemporary Bengali Craft. <br />
              <span className="text-amber-400">Urban Streetwear Drapes.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed font-normal">
              Designed in Dhaka for modern young adults. From minimalist luxury embroidered Panjabis
              to heavyweight 240 GSM drop-shoulder tees, tailored Jamdani fusion wear, and parachute cargos.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={() => navigate({ type: 'shop' })}
                className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <ShoppingBag className="w-4 h-4 text-stone-950" />
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>

              <button
                id="hero-festive-btn"
                onClick={() => navigate({ type: 'shop', category: 'cat-panjabi' })}
                className="px-6 py-3.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 text-stone-100 font-semibold text-sm border border-stone-700 transition"
              >
                Festive & Panjabi Collection
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">50k+</p>
                <p className="text-xs text-stone-400 font-medium">Happy Customers in BD</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">24-48h</p>
                <p className="text-xs text-stone-400 font-medium">Dhaka Hub Delivery</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-stone-400 font-medium">Locally Crafted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => navigate({ type: 'shop' })}
            className="text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-800 flex items-center gap-1 group transition"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate({ type: 'shop', category: cat.id })}
              className="group cursor-pointer rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-stone-400 hover:shadow-md transition duration-300 flex flex-col"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <span className="absolute bottom-2 left-2 right-2 text-center text-xs font-bold text-white drop-shadow-sm">
                  {cat.name}
                </span>
              </div>
              <div className="p-2.5 text-center bg-stone-50">
                <span className="text-[11px] text-stone-500 font-medium">
                  {cat.itemCount} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Video Showcase Carousel Section */}
      <AIVideoShowcase />

      {/* 3. Special Offers & Flash Discount Section with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-10 border border-amber-900/40 shadow-xl overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-amber-900/50">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-stone-950" />
                <span>Limited Eid Flash Drop</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Up to 25% Off + Extra 10% with Coupon Code
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/80">
                Use promo code <strong className="text-white underline decoration-amber-400">AURA10</strong> at checkout for an extra 10% discount on all orders above ৳1,000.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3">
              <div className="text-center bg-stone-950/70 border border-amber-800/60 rounded-xl px-3.5 py-2 min-w-[64px]">
                <span className="text-2xl font-black text-amber-400 leading-none block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Hours</span>
              </div>
              <span className="text-2xl font-bold text-amber-400">:</span>
              <div className="text-center bg-stone-950/70 border border-amber-800/60 rounded-xl px-3.5 py-2 min-w-[64px]">
                <span className="text-2xl font-black text-amber-400 leading-none block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Mins</span>
              </div>
              <span className="text-2xl font-bold text-amber-400">:</span>
              <div className="text-center bg-stone-950/70 border border-amber-800/60 rounded-xl px-3.5 py-2 min-w-[64px]">
                <span className="text-2xl font-black text-amber-400 leading-none block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Secs</span>
              </div>
            </div>
          </div>

          {/* Offer products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {specialOffers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Selling Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Dhaka Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Best Selling Products
            </h2>
          </div>
          <button
            onClick={() => navigate({ type: 'shop', query: 'bestseller' })}
            className="text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-800 flex items-center gap-1 group transition"
          >
            <span>View All Bestsellers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Brand Heritage Banner / Story Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-100 border border-stone-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              The AURA Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              Ethical Local Craftsmanship Meets Global Street Aesthetics
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every garment at AURA begins with carefully selected raw natural cotton yarns, pure
              Jamdani handloom weaves from Rupganj artisans, and heavy-duty 240 GSM knitted interlock
              fabrics. Tailored in Dhaka by master craftsmen who receive fair living wages.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pre-shrunk, breathable cotton designed for Bangladesh climate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Precision reinforced bar-tack stitching on all denim & cargos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Doorstep exchange courier service across 64 districts</span>
              </div>
            </div>
            <div className="pt-3">
              <button
                onClick={() => navigate({ type: 'about' })}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition inline-flex items-center gap-2"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
              alt="Artisan Craftsmanship"
              className="rounded-2xl object-cover h-56 w-full shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
              alt="Urban Dhaka Drop"
              className="rounded-2xl object-cover h-56 w-full shadow-sm mt-6"
            />
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Fresh Off The Loom
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigate({ type: 'shop', query: 'new' })}
            className="text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-800 flex items-center gap-1 group transition"
          >
            <span>View All New Releases</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Verified Customer Reviews / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Real Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            Loved by Thousands Across Bangladesh
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Read unedited reviews from verified customers in Dhaka, Chittagong, Sylhet, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-stone-900">{rev.userName}</h5>
                  <p className="text-[11px] text-stone-500">{rev.userCity}</p>
                </div>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
