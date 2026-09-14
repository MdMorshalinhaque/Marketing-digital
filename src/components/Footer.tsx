import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { navigate, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      showToast('Thank you! Promo coupon code AURA10 is ready for your first order!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-800/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-stone-100 font-bold text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">
                24-48h Dhaka, 48-72h across all 64 districts in Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-800/50">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-stone-100 font-bold text-sm">7-Day Easy Exchange</h4>
              <p className="text-xs text-stone-400 mt-1">
                Hassle-free size swaps and returns with doorstep courier pickup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-800/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-stone-100 font-bold text-sm">Secure BD Payments</h4>
              <p className="text-xs text-stone-400 mt-1">
                bKash, Nagad, Cards & Cash on Delivery (COD) with order inspection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-800/50">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-stone-100 font-bold text-sm">Dedicated Customer Care</h4>
              <p className="text-xs text-stone-400 mt-1">
                Direct hotline support 7 days a week: 9:00 AM - 10:00 PM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate({ type: 'home' })}
              className="cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-extrabold text-lg">
                A
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight">AURA</span>
                <span className="text-[10px] tracking-[0.25em] font-semibold text-amber-400 block uppercase">
                  Dhaka • Bangladesh
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Contemporary Bangladeshi lifestyle & fashion. Blending traditional craftsmanship
              (Jamdani, handloom cotton, festive jacquards) with modern metropolitan streetwear
              tailored for the urban youth of Bangladesh.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-2">
                Join the AURA Insider Club
              </h5>
              <p className="text-xs text-stone-400 mb-3">
                Subscribe for exclusive drop alerts, private Eid sales & 10% off your first order.
              </p>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>You're subscribed! Use promo code <strong>AURA10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-panjabi' })}
                  className="hover:text-amber-400 transition"
                >
                  Panjabi & Festive Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-tees' })}
                  className="hover:text-amber-400 transition"
                >
                  Drop-Shoulder Graphic Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-kurti' })}
                  className="hover:text-amber-400 transition"
                >
                  Kurtis & Handloom Fusion
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-bottoms' })}
                  className="hover:text-amber-400 transition"
                >
                  Denim & Parachute Cargos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-outerwear' })}
                  className="hover:text-amber-400 transition"
                >
                  French Terry Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'shop', category: 'cat-accessories' })}
                  className="hover:text-amber-400 transition"
                >
                  Dhaka Canvas Totes & Wallets
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate({ type: 'account', tab: 'tracking' })}
                  className="hover:text-amber-400 transition"
                >
                  Track Courier Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'contact' })}
                  className="hover:text-amber-400 transition"
                >
                  Shipping & Delivery Timeframes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'contact' })}
                  className="hover:text-amber-400 transition"
                >
                  7-Day Return & Size Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'contact' })}
                  className="hover:text-amber-400 transition"
                >
                  Payment FAQs (bKash/Nagad)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'about' })}
                  className="hover:text-amber-400 transition"
                >
                  Our Sustainability & Fabric Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'admin', tab: 'overview' })}
                  className="text-amber-500 hover:text-amber-400 font-semibold transition"
                >
                  Admin Portal Access
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Store Info */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Contact & Store Hub
            </h5>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Banani Flagship Store:</strong>
                  <br />
                  House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+880 9612-AURA-BD / 01711-234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>care@auralifestyle.bd</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Follow @AURALifestyleBD
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="#facebook"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening AURA Facebook Community (50k+ Members)');
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center transition border border-stone-800 text-xs font-bold"
                >
                  FB
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening AURA Instagram (@auralifestyle.bd)');
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center transition border border-stone-800 text-xs font-bold"
                >
                  IG
                </a>
                <a
                  href="#tiktok"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening AURA TikTok (@auralifestyle)');
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center transition border border-stone-800 text-xs font-bold"
                >
                  TT
                </a>
                <a
                  href="#youtube"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening AURA YouTube Channel');
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center transition border border-stone-800 text-xs font-bold"
                >
                  YT
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-stone-400 mr-2">We Accept in BD:</span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-rose-400 font-bold rounded">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-orange-400 font-bold rounded">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-purple-400 font-bold rounded">
              Rocket
            </span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-blue-400 font-bold rounded">
              Visa
            </span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-red-400 font-bold rounded">
              Mastercard
            </span>
            <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-emerald-400 font-bold rounded">
              Cash on Delivery (COD)
            </span>
          </div>

          <div className="text-center md:text-right">
            <p>© 2026 AURA Lifestyle Bangladesh. All rights reserved.</p>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Crafted with authentic pride in Dhaka, Bangladesh.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
