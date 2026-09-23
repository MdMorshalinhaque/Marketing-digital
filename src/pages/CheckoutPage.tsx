import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Phone,
  MapPin,
  Sparkles,
  Printer,
  Copy,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { Order, OrderItem, Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    selectedDeliveryCharge,
    selectedDeliveryId,
    setSelectedDeliveryId,
    setSelectedDeliveryCharge,
    cartTotal,
    clearCart,
    currentUser,
    navigate,
    showToast,
  } = useShop();

  // Multi-step: 1 = Shipping info, 2 = Delivery method, 3 = Payment & confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Customer & Shipping Form State
  const defaultAddress = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
  const [fullName, setFullName] = useState(defaultAddress?.fullName || currentUser.name);
  const [phone, setPhone] = useState(defaultAddress?.phone || currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [addressLine, setAddressLine] = useState(defaultAddress?.addressLine || '');
  const [areaDistrict, setAreaDistrict] = useState(defaultAddress?.areaDistrict || 'Dhanmondi, Dhaka');
  const [division, setDivision] = useState(defaultAddress?.division || 'Dhaka');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('bkash');
  const [bkashNumber, setBkashNumber] = useState(currentUser.phone || '01712345678');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [nagadNumber, setNagadNumber] = useState(currentUser.phone || '01712345678');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [cardName, setCardName] = useState(currentUser.name);
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('890');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery options
  const deliveryOptions = [
    {
      id: 'del-std-dhaka',
      name: 'Inside Dhaka Standard (24-48 Hours)',
      fee: 70,
      estimated: '1-2 business days',
    },
    {
      id: 'del-express-dhaka',
      name: 'Express Same-Day Dhaka Priority',
      fee: 150,
      estimated: 'Same day if ordered before 2 PM',
    },
    {
      id: 'del-outside-dhaka',
      name: 'Outside Dhaka (All 64 Districts - 48-72h)',
      fee: 130,
      estimated: '2-3 business days via Steadfast/Pathao',
    },
  ];

  // Validation
  const isShippingValid = fullName.trim() && phone.trim() && addressLine.trim() && areaDistrict.trim();

  const handleConfirmOrder = () => {
    if (!isShippingValid) {
      showToast('Please complete your shipping address before placing order.', 'error');
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `ord-${Date.now()}`;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `AURA-BD-2026-${randomSuffix}`;
      const trackingNumber = `PTH-BD-${Math.floor(1000000 + Math.random() * 9000000)}`;

      const shippingAddressObj: Address = {
        id: `addr-${Date.now()}`,
        title: 'Delivery Address',
        fullName,
        phone,
        email,
        addressLine,
        areaDistrict,
        division,
        isDefault: false,
      };

      const items: OrderItem[] = cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        productImage: c.product.images[0],
        size: c.selectedSize,
        color: c.selectedColor,
        quantity: c.quantity,
        unitPrice: c.product.price,
        subtotal: c.product.price * c.quantity,
      }));

      // Deduct stock
      cart.forEach((c) => {
        db.updateStock(c.product.id, c.quantity);
      });

      const selectedMethod =
        deliveryOptions.find((d) => d.id === selectedDeliveryId) || deliveryOptions[0];

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerId: currentUser.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: shippingAddressObj,
        items,
        deliveryMethod: {
          id: selectedMethod.id,
          name: selectedMethod.name,
          fee: selectedDeliveryCharge,
          estimatedDays: selectedMethod.estimated,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentDetails: {
          transactionId:
            paymentMethod === 'bkash'
              ? bkashTrxId || `BKASH${Math.random().toString(36).substring(2, 9).toUpperCase()}`
              : paymentMethod === 'nagad'
              ? nagadTrxId || `NAGAD${Math.random().toString(36).substring(2, 9).toUpperCase()}`
              : paymentMethod === 'card'
              ? `SSL${Math.random().toString(36).substring(2, 9).toUpperCase()}`
              : undefined,
          senderNumber: paymentMethod === 'bkash' ? bkashNumber : paymentMethod === 'nagad' ? nagadNumber : undefined,
          paidAt: paymentMethod !== 'cod' ? new Date().toISOString() : undefined,
        },
        subtotal: cartSubtotal,
        discountAmount,
        couponCode: appliedCoupon?.code,
        deliveryFee: selectedDeliveryCharge,
        total: cartTotal,
        orderStatus: 'pending',
        trackingNumber,
        courierName: 'Pathao Courier Express',
        timeline: [
          {
            status: 'pending',
            title: 'Order Placed & Confirmed',
            timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            completed: true,
            description: `Payment mode: ${paymentMethod.toUpperCase()}. Order confirmed and allocated to Dhaka Banani hub.`,
          },
          {
            status: 'processing',
            title: 'Preparing & Packing at Banani Hub',
            timestamp: 'Scheduled today',
            completed: false,
            description: 'Garments quality-checked, tagged, and packed into premium box.',
          },
          {
            status: 'shipped',
            title: 'Courier Handover',
            timestamp: 'Scheduled next',
            completed: false,
            description: `Rider assigned from ${deliveryOptions.find((d) => d.id === selectedDeliveryId)?.name}.`,
          },
          {
            status: 'delivered',
            title: 'Delivery Handover',
            timestamp: selectedMethod.estimated,
            completed: false,
            description: 'Parcel handover at doorstep.',
          },
        ],
        customerNotes: deliveryNotes,
        createdAt: new Date().toISOString(),
      };

      db.saveOrder(newOrder);
      setConfirmedOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      showToast(`Order ${orderNumber} placed successfully! 🎉`, 'success');
    }, 1200);
  };

  // If order is completed, show Order Confirmation screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-black text-stone-900">Thank You For Your Order!</h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Your order has been recorded in the AURA Dhaka logistics center. We've sent a confirmation SMS to{' '}
            <strong className="text-stone-900">{confirmedOrder.customerPhone}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase">Order Number</p>
              <h3 className="text-xl font-extrabold text-stone-900">{confirmedOrder.orderNumber}</h3>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-stone-400 font-semibold uppercase">Tracking Code</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                {confirmedOrder.trackingNumber}
              </span>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Purchased Items ({confirmedOrder.items.length})
            </h4>
            <div className="divide-y divide-stone-100">
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <img
                    src={it.productImage}
                    alt={it.productName}
                    className="w-14 h-16 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{it.productName}</p>
                    <p className="text-[11px] text-stone-500">
                      Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-stone-900">
                    ৳{it.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">৳{confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            {confirmedOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({confirmedOrder.couponCode})</span>
                <span>-৳{confirmedOrder.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge ({confirmedOrder.deliveryMethod.name})</span>
              <span className="font-semibold text-stone-900">
                {confirmedOrder.deliveryFee === 0 ? 'FREE' : `৳${confirmedOrder.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-950 pt-2 border-t border-stone-200">
              <span>Total Paid / Payable</span>
              <span className="text-lg text-stone-900">৳{confirmedOrder.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 pt-1">
              <span>Payment Method:</span>
              <span className="font-bold uppercase text-stone-800">
                {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pay to rider)' : confirmedOrder.paymentMethod}
              </span>
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
            <h5 className="font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              Delivery Destination:
            </h5>
            <p className="text-stone-700 font-medium">{confirmedOrder.shippingAddress.fullName} ({confirmedOrder.shippingAddress.phone})</p>
            <p className="text-stone-600">
              {confirmedOrder.shippingAddress.addressLine}, {confirmedOrder.shippingAddress.areaDistrict}, {confirmedOrder.shippingAddress.division}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() =>
                navigate({
                  type: 'track-order',
                  orderId: confirmedOrder.orderNumber,
                  email: confirmedOrder.customerEmail,
                })
              }
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Track Order In Real Time</span>
            </button>
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="w-full py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition text-center"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart empty guard
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500">Please add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
          <button
            onClick={() => setStep(1)}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition ${
              step >= 1 ? 'text-stone-900 font-bold' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                step >= 1
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-400 border-stone-300'
              }`}
            >
              1
            </span>
            <span className="text-xs">Shipping Address</span>
          </button>

          <button
            onClick={() => isShippingValid && setStep(2)}
            disabled={!isShippingValid}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition ${
              step >= 2 ? 'text-stone-900 font-bold' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                step >= 2
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-400 border-stone-300'
              }`}
            >
              2
            </span>
            <span className="text-xs">Delivery Option</span>
          </button>

          <button
            onClick={() => isShippingValid && setStep(3)}
            disabled={!isShippingValid}
            className={`relative z-10 flex flex-col items-center gap-1.5 transition ${
              step === 3 ? 'text-stone-900 font-bold' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                step === 3
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-400 border-stone-300'
              }`}
            >
              3
            </span>
            <span className="text-xs">Payment & Place</span>
          </button>
        </div>
      </div>

      {/* Main Form + Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Forms (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Shipping Details */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-extrabold text-stone-900">Step 1: Delivery Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number (BD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address / House & Road <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House 14, Road 8/A, Block B..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Area / District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={areaDistrict}
                    onChange={(e) => setAreaDistrict(e.target.value)}
                    placeholder="e.g. Dhanmondi, Dhaka or Nasirabad, Chittagong"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Division</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  >
                    <option value="Dhaka">Dhaka Division</option>
                    <option value="Chattogram">Chattogram Division</option>
                    <option value="Sylhet">Sylhet Division</option>
                    <option value="Rajshahi">Rajshahi Division</option>
                    <option value="Khulna">Khulna Division</option>
                    <option value="Barishal">Barishal Division</option>
                    <option value="Rangpur">Rangpur Division</option>
                    <option value="Mymensingh">Mymensingh Division</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Please call before arriving or leave with building security guard."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!isShippingValid}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Continue to Delivery Option</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
                <Truck className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-extrabold text-stone-900">Step 2: Choose Delivery Method</h3>
              </div>

              <div className="space-y-3">
                {deliveryOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      selectedDeliveryId === opt.id
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="checkout-delivery"
                        checked={selectedDeliveryId === opt.id}
                        onChange={() => {
                          setSelectedDeliveryId(opt.id);
                          setSelectedDeliveryCharge(opt.fee);
                        }}
                        className="mt-1 text-stone-900 focus:ring-stone-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-900">{opt.name}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{opt.estimated}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-stone-900">
                      {cartSubtotal >= 2500 ? (
                        <span className="text-emerald-700">FREE</span>
                      ) : (
                        `৳${opt.fee}`
                      )}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 flex items-center gap-1.5 hover:bg-stone-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
                <CreditCard className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-extrabold text-stone-900">
                  Step 3: Select Bangladesh Payment Method
                </h3>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'bkash'
                      ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500 text-rose-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-black text-rose-600">bKash</span>
                  <span className="text-[10px] text-stone-500">Merchant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500 text-orange-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-black text-orange-600">Nagad</span>
                  <span className="text-[10px] text-stone-500">Instant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 text-emerald-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-700">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500">Pay on Handover</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-blue-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-black text-blue-700">Card Payment</span>
                  <span className="text-[10px] text-stone-500">Visa / Mastercard</span>
                </button>
              </div>

              {/* bKash Payment Simulation Form */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">bKash Merchant Checkout</span>
                    <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Merchant: 01886-AURA01
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Enter your personal 11-digit bKash wallet number. You will receive an automated verification prompt.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Your bKash Number</label>
                      <input
                        type="text"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        bKash Transaction ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={bkashTrxId}
                        onChange={(e) => setBkashTrxId(e.target.value)}
                        placeholder="e.g. 9KL42M90XZ"
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl uppercase focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nagad Payment Simulation Form */}
              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-900">Nagad Merchant Gateway</span>
                    <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Merchant ID: AURA_BD
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Your Nagad Mobile Number</label>
                      <input
                        type="text"
                        value={nagadNumber}
                        onChange={(e) => setNagadNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Nagad TrxID / Reference</label>
                      <input
                        type="text"
                        value={nagadTrxId}
                        onChange={(e) => setNagadTrxId(e.target.value)}
                        placeholder="Auto-generated if empty"
                        className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl uppercase focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Details */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-900">Cash on Delivery (COD)</h4>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Pay in cash directly to our courier rider when the package arrives at your doorstep.
                    Please keep exact cash (<strong>৳{cartTotal.toLocaleString()}</strong>) ready for smooth handover.
                  </p>
                </div>
              )}

              {/* Card Payment Simulation Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3 text-xs">
                  <span className="font-bold text-blue-900 block">
                    Debit / Credit Card (SSLCommerz Gateway)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Order Button */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 flex items-center gap-1.5 hover:bg-stone-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  id="confirm-order-submit-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing & Dispatching Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Confirm Order (৳{cartTotal.toLocaleString()})</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              Order Review ({cart.length} items)
            </h3>

            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-2.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-stone-500">
                      Size: {item.selectedSize} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-stone-900">
                  {selectedDeliveryCharge === 0 ? 'FREE' : `৳${selectedDeliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="text-lg text-stone-900">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
