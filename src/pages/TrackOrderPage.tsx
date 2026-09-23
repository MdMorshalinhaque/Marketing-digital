import React, { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Phone,
  ArrowRight,
  Copy,
  Check,
  Printer,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CreditCard,
  Sparkles,
  RefreshCw,
  HelpCircle,
  RotateCcw,
  Building2,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { Order, OrderTimelineItem } from '../types';

interface TrackOrderPageProps {
  initialOrderId?: string;
  initialEmail?: string;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderId = '',
  initialEmail = '',
}) => {
  const { navigate, showToast, currentUser } = useShop();

  // Search input state
  const [orderIdInput, setOrderIdInput] = useState<string>(initialOrderId);
  const [emailInput, setEmailInput] = useState<string>(initialEmail);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Result state
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Copy tracking number feedback
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);
  const [copiedOrderNum, setCopiedOrderNum] = useState<boolean>(false);

  // If initial props are passed (e.g. from checkout or account page), auto-search on mount
  useEffect(() => {
    if (initialOrderId.trim() && initialEmail.trim()) {
      executeTrack(initialOrderId.trim(), initialEmail.trim());
    } else if (initialOrderId.trim() && currentUser?.email) {
      setEmailInput(currentUser.email);
      executeTrack(initialOrderId.trim(), currentUser.email);
    }
  }, [initialOrderId, initialEmail]);

  // Find recent orders for quick autofill
  const userRecentOrders = db
    .getOrders()
    .filter(
      (o) =>
        (currentUser && (o.customerId === currentUser.id || o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()))
    )
    .slice(0, 3);

  const executeTrack = (orderQuery: string, emailQuery: string) => {
    setSearchError(null);
    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      if (!orderQuery.trim()) {
        setSearchError('Please provide your Order ID or Courier Tracking Number.');
        setTrackedOrder(null);
        setIsSearching(false);
        return;
      }

      if (!emailQuery.trim()) {
        setSearchError('Please provide the email address used when placing the order.');
        setTrackedOrder(null);
        setIsSearching(false);
        return;
      }

      const result = db.getOrderByOrderAndEmail(orderQuery.trim(), emailQuery.trim());

      if (result.order) {
        setTrackedOrder(result.order);
        setSearchError(null);
      } else if (result.error === 'email_mismatch') {
        setTrackedOrder(null);
        setSearchError(
          'Order ID was located, but the email address does not match our records for this parcel. For security, please enter the exact email used during checkout.'
        );
      } else {
        setTrackedOrder(null);
        setSearchError(
          `No order was found matching "${orderQuery}". Please verify your order number in your confirmation email or SMS.`
        );
      }
      setIsSearching(false);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderIdInput, emailInput);
  };

  const handleQuickFill = (orderNumber: string, email: string) => {
    setOrderIdInput(orderNumber);
    setEmailInput(email);
    executeTrack(orderNumber, email);
  };

  const handleCopy = (text: string, type: 'tracking' | 'orderNum') => {
    navigator.clipboard.writeText(text);
    if (type === 'tracking') {
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    } else {
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2000);
    }
    showToast('Copied to clipboard!', 'info');
  };

  const handlePrintSlip = () => {
    window.print();
  };

  // Helper for status badge styling
  const getStatusConfig = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Order Placed & Pending Verification',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          stepIndex: 1,
          accentColor: 'text-amber-600',
          bgAccent: 'bg-amber-500',
        };
      case 'processing':
        return {
          label: 'Packed & Quality Checked at Hub',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
          stepIndex: 2,
          accentColor: 'text-blue-600',
          bgAccent: 'bg-blue-500',
        };
      case 'shipped':
        return {
          label: 'Handed to Courier Partner (In Transit)',
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          stepIndex: 3,
          accentColor: 'text-indigo-600',
          bgAccent: 'bg-indigo-500',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery Today',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          stepIndex: 4,
          accentColor: 'text-purple-600',
          bgAccent: 'bg-purple-500',
        };
      case 'delivered':
        return {
          label: 'Package Delivered & Received',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          stepIndex: 5,
          accentColor: 'text-emerald-600',
          bgAccent: 'bg-emerald-500',
        };
      case 'cancelled':
        return {
          label: 'Order Cancelled',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          stepIndex: 0,
          accentColor: 'text-rose-600',
          bgAccent: 'bg-rose-500',
        };
      default:
        return {
          label: 'Processing Order',
          badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
          stepIndex: 2,
          accentColor: 'text-stone-600',
          bgAccent: 'bg-stone-500',
        };
    }
  };

  const stepsList = [
    { title: 'Order Placed', desc: 'Received & verified' },
    { title: 'Packed at Hub', desc: 'Quality checked' },
    { title: 'In Transit', desc: 'Courier dispatch' },
    { title: 'Out for Delivery', desc: 'Rider on route' },
    { title: 'Delivered', desc: 'Doorstep handover' },
  ];

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20 pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => navigate({ type: 'home' })}
            className="hover:text-stone-900 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button
            onClick={() => navigate({ type: 'account', tab: 'orders' })}
            className="hover:text-stone-900 transition"
          >
            Account
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-900">Track Order</span>
        </nav>

        {/* Page Header Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80 text-xs font-bold shadow-sm">
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            <span>AURA NATIONWIDE DISPATCH & LOGISTICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Track Your Delivery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Enter your order number and the email address used during purchase to check real-time package milestones, rider status, and tracking codes.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Order ID Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="track-order-id"
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Order ID or Tracking Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="track-order-id"
                    type="text"
                    required
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    placeholder="e.g. AURA-BD-2026-9812 or PTH-BD-8904123"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 uppercase font-mono font-medium focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                  />
                </div>
                <p className="text-[11px] text-stone-400">
                  Found on your order confirmation SMS, email, or invoice receipt.
                </p>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="track-email"
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Billing Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="track-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. tanvir.ahmed@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                  />
                </div>
                <p className="text-[11px] text-stone-400">
                  The email used during checkout to protect your order details.
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {searchError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800 space-y-1">
                  <p className="font-bold">Lookup Unsuccessful</p>
                  <p>{searchError}</p>
                </div>
              </div>
            )}

            {/* Submit Action & Quick Demo Samples */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-500">Quick Test Samples:</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('AURA-BD-2026-9812', 'tanvir.ahmed@gmail.com')}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-mono font-medium transition border border-stone-200"
                >
                  AURA-BD-2026-9812 (Shipped)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('AURA-BD-2026-9745', 'tanvir.ahmed@gmail.com')}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-mono font-medium transition border border-stone-200"
                >
                  AURA-BD-2026-9745 (Delivered)
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-7 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Searching Logistics...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>Track Package Now</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick links for logged-in user's own orders */}
          {userRecentOrders.length > 0 && !trackedOrder && (
            <div className="mt-6 pt-5 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-700 mb-2">
                Your Recent Orders ({currentUser.name}):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {userRecentOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => handleQuickFill(ord.orderNumber, ord.customerEmail)}
                    className="p-3 text-left rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 transition text-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                      <span className="text-[10px] uppercase font-bold text-amber-800">
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1">
                      {ord.items.length} item(s) • ৳{ord.total.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TRACKED ORDER RESULTS DISPLAY */}
        {trackedOrder && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
            {/* 1. Header Overview & Progress Stepper */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8">
              {/* Top Banner Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                        getStatusConfig(trackedOrder.orderStatus).badgeClass
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <span>{getStatusConfig(trackedOrder.orderStatus).label}</span>
                    </span>

                    <span className="text-xs text-stone-400 font-mono">
                      Placed on{' '}
                      {new Date(trackedOrder.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                      {trackedOrder.orderNumber}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopy(trackedOrder.orderNumber, 'orderNum')}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                      title="Copy Order Number"
                    >
                      {copiedOrderNum ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Right side: Estimated Delivery Date and Print Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left sm:text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                      Estimated Delivery
                    </span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {trackedOrder.deliveryMethod.estimatedDays}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      {trackedOrder.deliveryMethod.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    title="Print Delivery Slip"
                  >
                    <Printer className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">Print Slip</span>
                  </button>
                </div>
              </div>

              {/* Progress Milestones Stepper Bar */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Shipment Progression
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${
                        trackedOrder.orderStatus === 'cancelled'
                          ? 0
                          : Math.min(
                              100,
                              ((getStatusConfig(trackedOrder.orderStatus).stepIndex - 1) / 4) * 100
                            )
                      }%`,
                    }}
                  />

                  {/* Step Circles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {stepsList.map((step, idx) => {
                      const currentStep = getStatusConfig(trackedOrder.orderStatus).stepIndex;
                      const isComplete = idx + 1 <= currentStep;
                      const isCurrent = idx + 1 === currentStep;

                      return (
                        <div
                          key={idx}
                          className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center p-2 rounded-2xl sm:p-0 bg-stone-50/50 sm:bg-transparent"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm flex-shrink-0 ${
                              isComplete
                                ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                                : 'bg-stone-200 text-stone-500'
                            } ${isCurrent ? 'scale-110 ring-amber-200 font-black' : ''}`}
                          >
                            {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>

                          <div className="space-y-0.5">
                            <p
                              className={`text-xs font-bold ${
                                isComplete ? 'text-stone-900' : 'text-stone-400'
                              }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-[11px] text-stone-500 hidden sm:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Courier Partner & Dispatch Info Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-sm flex-shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 block">
                      Assigned Courier Partner
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-stone-900">
                      {trackedOrder.courierName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Doorstep contactless delivery with inspection option before payment
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs flex items-center gap-2">
                    <span className="text-stone-400">Tracking Code:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {trackedOrder.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(trackedOrder.trackingNumber, 'tracking')}
                      className="text-stone-400 hover:text-stone-700 transition"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="tel:+8809612287223"
                    className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>Courier Support</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Package History Timeline & Destination Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Chronological Package History (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="text-base font-extrabold text-stone-900">
                      Package Milestone History
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {trackedOrder.timeline.length} Updates Recorded
                  </span>
                </div>

                {/* Timeline Tree */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {trackedOrder.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Checkpoint Dot */}
                      <div
                        className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition ${
                          item.completed
                            ? 'bg-amber-600'
                            : 'bg-stone-300'
                        }`}
                      />

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.completed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                            )}
                          </h4>
                          <span className="text-[11px] font-mono text-stone-400">
                            {item.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Live GPS & Courier Sync Enabled</span>
                  </span>
                  <span>Times shown in BST (UTC+6)</span>
                </div>
              </div>

              {/* Right Column: Destination Address & Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Destination Card */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                      Delivery Destination
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block font-semibold">Recipient</span>
                      <p className="text-sm font-extrabold text-stone-900">
                        {trackedOrder.shippingAddress.fullName}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-400 block font-semibold">Contact Phone</span>
                      <p className="font-mono font-medium text-stone-800">
                        {trackedOrder.shippingAddress.phone}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-400 block font-semibold">Street & House</span>
                      <p className="text-stone-800">
                        {trackedOrder.shippingAddress.addressLine}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-stone-400 block font-semibold">Area / District</span>
                        <p className="text-stone-800">{trackedOrder.shippingAddress.areaDistrict}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-semibold">Division</span>
                        <p className="text-stone-800">{trackedOrder.shippingAddress.division}</p>
                      </div>
                    </div>

                    {trackedOrder.customerNotes && (
                      <div className="pt-2 border-t border-stone-100">
                        <span className="text-stone-400 block font-semibold">Delivery Instructions</span>
                        <p className="italic text-stone-600">"{trackedOrder.customerNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Overview */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                      Payment & Billing
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Payment Method:</span>
                      <span className="font-bold uppercase text-stone-900">
                        {trackedOrder.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : trackedOrder.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Payment Status:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          trackedOrder.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {trackedOrder.paymentStatus}
                      </span>
                    </div>

                    {trackedOrder.paymentDetails?.transactionId && (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-stone-500">TrxID:</span>
                        <span className="text-stone-800">
                          {trackedOrder.paymentDetails.transactionId}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-stone-100 space-y-1.5">
                      <div className="flex justify-between text-stone-500">
                        <span>Items Subtotal:</span>
                        <span>৳{trackedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      {trackedOrder.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount Applied ({trackedOrder.couponCode || 'Promo'}):</span>
                          <span>-৳{trackedOrder.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-500">
                        <span>Delivery Fee:</span>
                        <span>৳{trackedOrder.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
                        <span>Total Amount:</span>
                        <span>৳{trackedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Package Items Ordered */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-700" />
                  <h3 className="text-base font-extrabold text-stone-900">
                    Items in this Package ({trackedOrder.items.length})
                  </h3>
                </div>
                <span className="text-xs text-stone-500">All items packaged in secure AURA box</span>
              </div>

              <div className="divide-y divide-stone-100">
                {trackedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        className="w-16 h-20 rounded-2xl object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-stone-900">{it.productName}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          <span>Size: <strong>{it.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong>{it.color}</strong></span>
                          <span>•</span>
                          <span>Qty: <strong>{it.quantity}</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate({ type: 'product-details', productId: it.productId })
                          }
                          className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 pt-0.5"
                        >
                          <span>View Product</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400 block">Unit: ৳{it.unitPrice}</span>
                      <span className="text-sm font-black text-stone-900">
                        ৳{it.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Need Help / Customer Support Assistance Card */}
            <div className="rounded-3xl bg-stone-900 text-stone-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 max-w-xl">
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Have questions regarding your delivery?</span>
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Our Dhaka dispatch support team can coordinate directly with the delivery rider to reschedule your drop-off or change instructions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ type: 'contact' })}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold transition shadow-sm"
                >
                  Contact Support Hotline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackedOrder(null);
                    setOrderIdInput('');
                    setEmailInput('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
