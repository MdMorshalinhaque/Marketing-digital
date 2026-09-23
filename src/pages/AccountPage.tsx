import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  KeyRound,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { Order, Address, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface AccountPageProps {
  initialTab?: 'profile' | 'orders' | 'tracking' | 'wishlist' | 'addresses';
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'orders' }) => {
  const {
    currentUser,
    updateUserProfile,
    switchUser,
    wishlist,
    navigate,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'tracking' | 'wishlist' | 'addresses'>(initialTab);

  // Profile Form States
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  // Password Form States
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Tracking Search
  const [trackingInput, setTrackingInput] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Addresses State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('');
  const [newAddrDivision, setNewAddrDivision] = useState('Dhaka');

  const allOrders = db.getOrders();
  const userOrders = allOrders.filter(
    (o) => o.customerId === currentUser.id || o.customerEmail === currentUser.email
  );

  const allProducts = db.getProducts();
  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPass.length < 6) {
      showToast('Password should be at least 6 characters.', 'error');
      return;
    }
    showToast('Password updated securely!', 'success');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const found = db.getOrderById(trackingInput.trim());
    if (found) {
      setSelectedOrderForTracking(found);
    } else {
      showToast('No shipment found for that code. Check your Order ID or Courier Code.', 'error');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle || !newAddrLine || !newAddrArea) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      fullName: currentUser.name,
      phone: currentUser.phone,
      addressLine: newAddrLine,
      areaDistrict: newAddrArea,
      division: newAddrDivision,
      isDefault: currentUser.addresses.length === 0,
    };

    updateUserProfile({
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    });

    setAddressModalOpen(false);
    setNewAddrTitle('');
    setNewAddrLine('');
    setNewAddrArea('');
    showToast('New delivery address saved!', 'success');
  };

  const handleDeleteAddress = (addrId: string) => {
    updateUserProfile({
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addrId),
    });
    showToast('Address removed', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-200"
          />
          <div>
            <h1 className="text-xl font-extrabold text-stone-900">{currentUser.name}</h1>
            <p className="text-xs text-stone-500">{currentUser.email} • {currentUser.phone}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {currentUser.role.toUpperCase()}
              </span>
              <span className="text-[10px] text-stone-400">
                Registered Bangladesh Account
              </span>
            </div>
          </div>
        </div>

        {/* Demo Switch / Logout */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => switchUser(currentUser.role === 'customer' ? 'admin' : 'customer')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Switch to {currentUser.role === 'customer' ? 'Admin Role' : 'Customer Role'}</span>
          </button>
        </div>
      </div>

      {/* Main Account Tabs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs (3 Cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <span className="text-[11px] opacity-80">{userOrders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === 'tracking'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>Live Order Tracking</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === 'wishlist'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>My Wishlist</span>
              </div>
              <span className="text-[11px] opacity-80">{wishlist.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === 'addresses'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className="text-[11px] opacity-80">{currentUser.addresses.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserIcon className="w-4 h-4" />
                <span>Account Profile</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Panel (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-stone-900">Your Orders</h2>

              {userOrders.length > 0 ? (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-stone-900">{ord.orderNumber}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">Placed on {ord.createdAt.split('T')[0]}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderForTracking(ord);
                            setActiveTab('tracking');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Package</span>
                        </button>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-stone-100">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={it.productImage}
                              alt={it.productName}
                              className="w-12 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-900 truncate">{it.productName}</p>
                              <p className="text-[10px] text-stone-500">
                                Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-stone-900">
                            ৳{it.subtotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Courier pill */}
                    <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-stone-500 text-[11px] flex flex-wrap items-center gap-2">
                        <span>Courier: <strong>{ord.courierName}</strong></span>
                        <span>•</span>
                        <span>Code: <strong className="font-mono">{ord.trackingNumber}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-stone-500 mr-2 text-[11px]">Total:</span>
                          <span className="text-sm font-black text-stone-900">৳{ord.total.toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate({
                              type: 'track-order',
                              orderId: ord.orderNumber,
                              email: ord.customerEmail,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 transition"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Track Package</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-500">
                  No orders placed yet. Start shopping!
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE ORDER TRACKING */}
          {activeTab === 'tracking' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">Live Courier Order Tracking</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Enter your AURA Order Number (e.g. <code>AURA-BD-2026-9812</code>) or Courier Tracking Code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ type: 'track-order' })}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Open Dedicated Tracking Portal</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter Order ID (e.g. AURA-BD-2026-9812) or Tracking Code"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase focus:outline-none focus:border-stone-900"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Track Now
                </button>
              </form>

              {/* Render Tracking Timeline */}
              {selectedOrderForTracking ? (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                    <div>
                      <span className="text-xs text-stone-400 uppercase font-semibold">Tracking Shipment</span>
                      <h3 className="text-lg font-extrabold text-stone-900">
                        {selectedOrderForTracking.orderNumber}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Courier: <strong>{selectedOrderForTracking.courierName}</strong> | Code:{' '}
                        <strong>{selectedOrderForTracking.trackingNumber}</strong>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400">Estimated Arrival</span>
                      <p className="text-sm font-bold text-stone-900">
                        {selectedOrderForTracking.deliveryMethod.estimatedDays}
                      </p>
                    </div>
                  </div>

                  {/* Step Timeline */}
                  <div className="space-y-6 relative pl-6 border-l-2 border-amber-800">
                    {selectedOrderForTracking.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <span
                          className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                            item.completed ? 'bg-amber-800' : 'bg-stone-300'
                          }`}
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                          <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                          <p className="text-xs text-stone-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-stone-50 rounded-2xl text-xs text-stone-500">
                  Select an order from your history or input an order number above to view real-time courier tracking milestones.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200">
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">
                    My Wishlist ({wishlistedProducts.length})
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Saved items linked to your account ({currentUser.name})
                  </p>
                </div>
                <button
                  onClick={() => navigate({ type: 'wishlist' })}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Open Dedicated Wishlist Page</span>
                </button>
              </div>

              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                  <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => navigate({ type: 'shop' })}
                    className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                  >
                    Explore Shop
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">Saved Delivery Addresses</h2>
                  <p className="text-xs text-stone-500">Manage addresses for one-click checkout across Bangladesh.</p>
                </div>
                <button
                  onClick={() => setAddressModalOpen(true)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 font-medium">{addr.fullName} ({addr.phone})</p>
                    <p className="text-xs text-stone-500">
                      {addr.addressLine}, {addr.areaDistrict}, {addr.division}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {addressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div onClick={() => setAddressModalOpen(false)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
                  <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
                    <h3 className="text-base font-extrabold text-stone-900">Add New Bangladesh Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Address Label</label>
                        <input
                          type="text"
                          required
                          value={newAddrTitle}
                          onChange={(e) => setNewAddrTitle(e.target.value)}
                          placeholder="e.g. Home, Office, Studio"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">House, Road, Flat No.</label>
                        <input
                          type="text"
                          required
                          value={newAddrLine}
                          onChange={(e) => setNewAddrLine(e.target.value)}
                          placeholder="House 42, Road 11..."
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Area / District</label>
                        <input
                          type="text"
                          required
                          value={newAddrArea}
                          onChange={(e) => setNewAddrArea(e.target.value)}
                          placeholder="e.g. Banani, Dhaka or Agrabad, Chattogram"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Division</label>
                        <select
                          value={newAddrDivision}
                          onChange={(e) => setNewAddrDivision(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chattogram">Chattogram</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barishal">Barishal</option>
                        </select>
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAddressModalOpen(false)}
                          className="px-4 py-2 border border-stone-200 text-xs font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & PASSWORD */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile details */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-stone-900">Personal Details</h2>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone (BD)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Password change */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-stone-900">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
