import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    selectedDeliveryCharge,
    cartTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    navigate,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!cartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const percentFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h2 className="text-base font-extrabold text-stone-900">Your Shopping Cart</h2>
              <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-bold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setCartDrawerOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="bg-amber-50/70 p-3 border-b border-amber-200/60 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div>
                <p className="text-stone-700 font-medium">
                  Add <strong className="text-amber-900 font-bold">৳{amountNeededForFreeShipping.toLocaleString()}</strong> more to get <span className="font-bold text-emerald-700">FREE Delivery</span> across Bangladesh!
                </p>
                <div className="w-full bg-amber-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-700 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${percentFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You qualify for FREE Nationwide Delivery! 🎉</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">Your cart is currently empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our latest drops including festive panjabis, graphic tees, and streetwear accessories.
                  </p>
                </div>
                <button
                  id="empty-cart-explore-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate({ type: 'shop' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Explore New Arrivals
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 transition"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setCartDrawerOpen(false);
                            navigate({ type: 'product-details', productId: item.product.id });
                          }}
                          className="text-xs font-bold text-stone-900 truncate hover:text-amber-800 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Size: <strong className="text-stone-700">{item.selectedSize}</strong> | Color:{' '}
                        <strong className="text-stone-700">{item.selectedColor}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 bg-white rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-stone-900">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-stone-400">
                            ৳{item.product.price.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
              {/* Coupon Code Input */}
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-৳
                      {discountAmount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 font-bold transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. AURA10, DHAKA20)"
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase placeholder:normal-case focus:outline-none focus:border-stone-900"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}
                </form>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-stone-900">
                    {selectedDeliveryCharge === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `৳${selectedDeliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-stone-900">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="view-full-cart-page-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate({ type: 'cart' });
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition text-center"
                >
                  View Cart Page
                </button>
                <button
                  id="drawer-proceed-checkout-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate({ type: 'checkout' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
