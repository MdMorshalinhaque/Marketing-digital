import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { ProductCard } from '../components/ProductCard';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    selectedDeliveryCharge,
    setSelectedDeliveryCharge,
    selectedDeliveryId,
    setSelectedDeliveryId,
    cartTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    navigate,
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const allProducts = db.getProducts();
  const recommended = allProducts.slice(0, 4);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const deliveryOptions = [
    {
      id: 'del-std-dhaka',
      name: 'Inside Dhaka Standard (24-48 Hours)',
      fee: 70,
      badge: 'Most Popular',
    },
    {
      id: 'del-express-dhaka',
      name: 'Express Same-Day Dhaka Priority',
      fee: 150,
      badge: 'Super Fast',
    },
    {
      id: 'del-outside-dhaka',
      name: 'Outside Dhaka (All 64 Districts - 48-72h)',
      fee: 130,
      badge: 'Nationwide',
    },
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-stone-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Looks like you haven't added anything yet. Explore our curated Eid drop and streetwear collections.
          </p>
        </div>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-8 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm hover:bg-stone-800 transition shadow-md"
        >
          Browse New Collections
        </button>

        <div className="pt-16 max-w-5xl mx-auto text-left">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Trending Items in Dhaka</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your items, apply vouchers, and select Bangladesh delivery preferences.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      {/* Free Shipping Progress Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {amountNeededForFreeShipping > 0 ? (
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex justify-between font-semibold text-stone-800">
              <span>
                Add <strong className="text-amber-900">৳{amountNeededForFreeShipping.toLocaleString()}</strong> more for FREE delivery across Bangladesh!
              </span>
              <span>{Math.round((cartSubtotal / freeShippingThreshold) * 100)}%</span>
            </div>
            <div className="w-full bg-amber-200/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Congratulations! You have unlocked FREE Nationwide Delivery across Bangladesh!</span>
          </div>
        )}
      </div>

      {/* 2-Column Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-stone-100 bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-sm">
            {cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  onClick={() => navigate({ type: 'product-details', productId: item.product.id })}
                  className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl object-cover bg-stone-100 flex-shrink-0 cursor-pointer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        {item.product.brand}
                      </span>
                      <h3
                        onClick={() => navigate({ type: 'product-details', productId: item.product.id })}
                        className="text-sm font-bold text-stone-900 hover:text-amber-800 cursor-pointer transition mt-0.5"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Size: <strong className="text-stone-800">{item.selectedSize}</strong> | Color:{' '}
                        <strong className="text-stone-800">{item.selectedColor}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-950 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-950 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-stone-900">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-stone-400">
                          ৳{item.product.price.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Method Selection */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-800" />
              <h3 className="font-extrabold text-sm text-stone-900">Select Delivery Method (Bangladesh)</h3>
            </div>

            <div className="space-y-2">
              {deliveryOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedDeliveryId === opt.id
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={selectedDeliveryId === opt.id}
                      onChange={() => {
                        setSelectedDeliveryId(opt.id);
                        setSelectedDeliveryCharge(opt.fee);
                      }}
                      className="text-stone-900 focus:ring-stone-900"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">{opt.name}</p>
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-stone-900">
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      `৳${opt.fee}`
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Promo Coupon Form */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Have a Promo Voucher?
              </label>
              {appliedCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-emerald-700">
                        Saved ৳{discountAmount.toLocaleString()} on your order
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. AURA10, DHAKA20"
                      className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase focus:outline-none focus:border-stone-900"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] text-stone-500">
                    <span>Try:</span>
                    <button
                      type="button"
                      onClick={() => applyCoupon('AURA10')}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                    >
                      AURA10 (10% off)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCoupon('DHAKA20')}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                    >
                      DHAKA20 (20% off)
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-stone-900">
                  {selectedDeliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `৳${selectedDeliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-950 pt-3 border-t border-stone-200">
                <span>Order Total</span>
                <span className="text-xl text-stone-900">৳{cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-stone-400 text-right">Includes all Bangladeshi VAT & taxes</p>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => navigate({ type: 'checkout' })}
              className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            {/* Trust badges */}
            <div className="pt-2 text-[11px] text-stone-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted checkout & 100% bKash / COD protection</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>7-Day doorstep size exchange warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
