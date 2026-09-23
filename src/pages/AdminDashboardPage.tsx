import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  X,
  Search,
  Tag,
  Users,
  Eye,
  RefreshCw,
  Sparkles,
  Film,
  Smartphone,
  Tv,
  Settings,
  Subtitles,
  Volume2,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { videoService } from '../services/videoService';
import { Product, Order, Coupon, AIVideo } from '../types';
import { AIVideoGeneratorModal } from '../components/video/AIVideoGeneratorModal';
import { ProductVideoPlayer } from '../components/video/ProductVideoPlayer';

export const AdminDashboardPage: React.FC = () => {
  const { showToast, navigate } = useShop();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'ai-videos'>('overview');

  // AI Videos state
  const [aiVideos, setAiVideos] = useState<AIVideo[]>(() => videoService.getVideos());
  const [selectedAiVideoForEdit, setSelectedAiVideoForEdit] = useState<AIVideo | null>(null);
  const [isAiVideoGeneratorOpen, setIsAiVideoGeneratorOpen] = useState<boolean>(false);
  const [previewingVideo, setPreviewingVideo] = useState<AIVideo | null>(null);
  const [videoSearch, setVideoSearch] = useState<string>('');
  const [videoStyleFilter, setVideoStyleFilter] = useState<string>('all');

  // Products state
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders());
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(() => db.getCoupons());
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // New product form states
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('AURA Streetwear');
  const [prodCategory, setProdCategory] = useState('men');
  const [prodPrice, setProdPrice] = useState('1850');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('2200');
  const [prodStock, setProdStock] = useState('45');
  const [prodFabric, setProdFabric] = useState('100% Combed Cotton, 240 GSM Heavyweight');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80');

  // New coupon form states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('15');
  const [newCouponMin, setNewCouponMin] = useState('1500');

  // Refresh lists
  const refreshData = () => {
    setProducts(db.getProducts());
    setOrders(db.getOrders());
    setCoupons(db.getCoupons());
    setAiVideos(videoService.getVideos());
  };

  const handleDeleteAiVideo = (id: string) => {
    if (window.confirm('Are you sure you want to delete this AI promotional video?')) {
      videoService.deleteVideo(id);
      refreshData();
      showToast('AI Video removed from product page', 'info');
    }
  };

  const handleToggleFeaturedVideo = (id: string) => {
    videoService.toggleFeatured(id);
    refreshData();
    showToast('Video homepage spotlight updated', 'success');
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  // Product CRUD
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('AURA Streetwear');
    setProdCategory('men');
    setProdPrice('1850');
    setProdOriginalPrice('2200');
    setProdStock('45');
    setProdFabric('100% Combed Cotton, 240 GSM Heavyweight');
    setProdDescription('Premium contemporary drop tailored specifically for the Dhaka urban aesthetic.');
    setProdImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCategory(p.category);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice.toString());
    setProdStock(p.stock.toString());
    setProdFabric(p.fabric);
    setProdDescription(p.description);
    setProdImageUrl(p.images[0]);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(prodPrice);
    const origNum = Number(prodOriginalPrice) || priceNum;
    const discount = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

    const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const prodObj: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName,
      slug: editingProduct ? editingProduct.slug : slug,
      brand: prodBrand,
      category: prodCategory,
      price: priceNum,
      originalPrice: origNum,
      discountPercent: discount,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      images: [prodImageUrl, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Black', hex: '#18181b' },
        { name: 'Olive', hex: '#556b2f' },
      ],
      stock: Number(prodStock),
      fabric: prodFabric,
      details: ['Pre-shrunk finish', 'Reinforced seams', 'Made in Bangladesh'],
      description: prodDescription,
      isBestseller: true,
      isNewArrival: true,
      isSpecialOffer: discount > 15,
      tags: [prodCategory, prodBrand, 'New', 'Dhaka'],
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    db.saveProduct(prodObj);
    refreshData();
    setIsProductModalOpen(false);
    showToast(`Product "${prodName}" saved successfully!`, 'success');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      db.deleteProduct(id);
      refreshData();
      showToast('Product deleted from inventory', 'info');
    }
  };

  // Inventory Quick Adjust
  const handleAdjustStock = (prodId: string, delta: number) => {
    const target = products.find((p) => p.id === prodId);
    if (!target) return;
    const updatedStock = Math.max(0, target.stock + delta);
    const updated = { ...target, stock: updatedStock };
    db.saveProduct(updated);
    refreshData();
  };

  // Order Status Change
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const updatedTimeline = target.timeline.map((step) => {
      if (step.status === newStatus) {
        return {
          ...step,
          completed: true,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        };
      }
      return step;
    });

    const updatedOrder: Order = {
      ...target,
      orderStatus: newStatus,
      paymentStatus: newStatus === 'delivered' ? 'paid' : target.paymentStatus,
      timeline: updatedTimeline,
    };

    db.saveOrder(updatedOrder);
    refreshData();
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(updatedOrder);
    }
    showToast(`Order status updated to "${newStatus.toUpperCase()}"`, 'success');
  };

  // Coupon Creation
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newC: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderValue: Number(newCouponMin),
      description: `${newCouponValue}${newCouponType === 'percentage' ? '%' : '৳'} off discount voucher`,
      expiresAt: '2026-12-31',
      isActive: true,
      usageCount: 0,
    };

    db.saveCoupon(newC);
    refreshData();
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    showToast(`Coupon code ${newC.code} activated!`, 'success');
  };

  const handleToggleCoupon = (couponId: string) => {
    const target = coupons.find((c) => c.id === couponId);
    if (!target) return;
    const updated: Coupon = { ...target, isActive: !target.isActive };
    db.saveCoupon(updated);
    refreshData();
    showToast(`Coupon ${target.code} ${updated.isActive ? 'enabled' : 'disabled'}`, 'info');
  };

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.orderStatus === orderStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              AURA HQ Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Admin Store Manager
          </h1>
          <p className="text-xs text-stone-500">
            Real-time management for products, Bangladesh orders, Dhaka hub inventory, and coupons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Dhaka Stock & Inventory</span>
          {lowStockProducts.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
              {lowStockProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Codes ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-videos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'ai-videos'
              ? 'bg-stone-900 text-amber-400 shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Videos & Reels ({aiVideos.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Total Revenue
              </span>
              <h3 className="text-2xl font-black text-stone-900">
                ৳{totalRevenue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% vs last month
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <h3 className="text-2xl font-black text-stone-900">{totalOrdersCount}</h3>
              <p className="text-[11px] text-stone-500">From all 8 Bangladesh divisions</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Average Order Value
              </span>
              <h3 className="text-2xl font-black text-stone-900">
                ৳{averageOrderValue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-stone-500">Per transaction basket</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Low Stock Alerts
              </span>
              <h3 className={`text-2xl font-black ${lowStockProducts.length > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
                {lowStockProducts.length} Items
              </h3>
              <p className="text-[11px] text-stone-500">Items under 15 units in Banani hub</p>
            </div>
          </div>

          {/* Recent Orders table preview */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-extrabold text-stone-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60">
                      <td className="p-3 font-bold text-stone-900">{ord.orderNumber}</td>
                      <td className="p-3">
                        <div className="font-bold">{ord.customerName}</div>
                        <div className="text-[10px] text-stone-400">{ord.customerPhone}</div>
                      </td>
                      <td className="p-3 uppercase font-bold text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-stone-100">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right font-extrabold text-stone-900">
                        ৳{ord.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-100">
                  <tr>
                    <th className="p-3.5">Order ID & Date</th>
                    <th className="p-3.5">Customer Details</th>
                    <th className="p-3.5">Delivery Destination</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60">
                      <td className="p-3.5">
                        <div className="font-extrabold text-stone-900">{ord.orderNumber}</div>
                        <div className="text-[10px] text-stone-400">{ord.createdAt.split('T')[0]}</div>
                        <div className="text-[10px] text-amber-900 font-semibold">
                          {ord.items.length} items
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-stone-800">{ord.customerName}</div>
                        <div className="text-[11px] text-stone-500">{ord.customerPhone}</div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="truncate text-stone-700 font-medium">
                          {ord.shippingAddress.areaDistrict}, {ord.shippingAddress.division}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Courier: {ord.courierName} ({ord.trackingNumber})
                        </div>
                      </td>

                      <td className="p-3.5 font-black text-stone-900">
                        ৳{ord.total.toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {ord.paymentMethod}
                        </span>
                        <span className="block text-[10px] text-stone-500 mt-0.5 capitalize">
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e: any) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-bold bg-stone-50 focus:outline-none focus:border-stone-900"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog by name, brand, category..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-100">
                  <tr>
                    <th className="p-3.5">Garment</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price (৳)</th>
                    <th className="p-3.5">Dhaka Stock</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/60">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-amber-800 font-semibold">{p.brand}</p>
                        </div>
                      </td>

                      <td className="p-3.5 capitalize font-medium text-stone-600">{p.category}</td>

                      <td className="p-3.5 font-bold text-stone-900">
                        ৳{p.price.toLocaleString()}
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-400 line-through ml-1.5">
                            ৳{p.originalPrice}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            p.stock < 15
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      <td className="p-3.5 text-stone-700 font-medium">
                        ★ {p.rating} ({p.reviewCount})
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  Dhaka Central Warehouse Stock Management
                </h3>
                <p className="text-xs text-stone-500">
                  Quick increment or decrement units as factory batches arrive from Narayanganj & Gazipur mills.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    p.stock < 15
                      ? 'border-rose-300 bg-rose-50/40'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-14 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-400">{p.brand}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.stock < 15
                            ? 'bg-rose-600 text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {p.stock} in Stock
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAdjustStock(p.id, -5)}
                      className="w-7 h-7 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                      title="Deduct 5"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p.id, 10)}
                      className="w-7 h-7 rounded-lg border border-stone-200 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                      title="Add 10"
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">Promo Vouchers</h3>
              <p className="text-xs text-stone-500">Configure seasonal discounts and influencer coupons.</p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Voucher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-3xl border space-y-3 ${
                  c.isActive
                    ? 'bg-white border-stone-200 shadow-sm'
                    : 'bg-stone-100 border-stone-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(c.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-stone-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Min Order: ৳{c.minOrderValue.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-stone-400">Valid until {c.expiresAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI VIDEOS & REELS MANAGEMENT */}
      {activeTab === 'ai-videos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top AI Video Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Total AI Videos
              </span>
              <h3 className="text-2xl font-black text-stone-900">{aiVideos.length}</h3>
              <p className="text-[11px] text-stone-500">Synthesized product lookbooks</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Total Lookbook Views
              </span>
              <h3 className="text-2xl font-black text-stone-900">
                {aiVideos.reduce((sum, v) => sum + (v.viewsCount || 0), 0).toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold">Across Storefront & Reels</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Customer Likes
              </span>
              <h3 className="text-2xl font-black text-stone-900">
                {aiVideos.reduce((sum, v) => sum + (v.likesCount || 0), 0).toLocaleString()}
              </h3>
              <p className="text-[11px] text-stone-500">Customer engagement reactions</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Synthesis Engine
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-extrabold text-stone-900">
                  {videoService.getExternalApiConfig().isEnabled
                    ? `${videoService.getExternalApiConfig().provider.toUpperCase()} API`
                    : 'Built-in Canvas Studio'}
                </h3>
              </div>
              <p className="text-[11px] text-stone-500">
                {videoService.getExternalApiConfig().isEnabled ? 'Cloud Generative API' : 'Demo & Local Engine Ready'}
              </p>
            </div>
          </div>

          {/* Action Bar & Filter Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  placeholder="Search video title or product..."
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <select
                value={videoStyleFilter}
                onChange={(e) => setVideoStyleFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-stone-50 text-stone-800"
              >
                <option value="all">All Styles</option>
                <option value="luxury">Luxury Style</option>
                <option value="energetic">Energetic Streetwear</option>
                <option value="minimal">Minimal Handloom</option>
                <option value="social">Social Media (9:16)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedAiVideoForEdit(null);
                  setIsAiVideoGeneratorOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Generate AI Video</span>
              </button>
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiVideos
              .filter((v) => {
                const matchesSearch =
                  v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
                  v.productName.toLowerCase().includes(videoSearch.toLowerCase());
                const matchesStyle = videoStyleFilter === 'all' || v.style === videoStyleFilter;
                return matchesSearch && matchesStyle;
              })
              .map((video) => {
                const product = db.getProductById(video.productId);

                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Header with aspect ratio & play button */}
                      <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{video.style.toUpperCase()}</span>
                          </span>
                          {video.aspectRatio === '9:16' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-900/80 text-[10px] font-bold text-purple-200">
                              9:16 REEL
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-stone-200 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {video.duration}s
                        </div>

                        {/* Play trigger overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setPreviewingVideo(video)}
                            className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg hover:scale-110 transition"
                          >
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </button>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 text-left">
                          <p className="text-[11px] text-stone-200 line-clamp-1 italic font-medium">
                            "{video.captions[0]?.text || video.marketingMessage}"
                          </p>
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="text-[11px] uppercase font-bold text-amber-800">
                            {product?.brand || 'AURA'}
                          </div>
                          <h4 className="text-base font-bold text-stone-900 line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                            {video.marketingMessage}
                          </p>
                        </div>

                        {/* Metadata details */}
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-stone-600">
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-3.5 h-3.5 text-stone-500" /> Voiceover:
                            </span>
                            <span className="font-semibold text-stone-800">
                              {video.voiceover.enabled
                                ? `${video.voiceover.gender} (${video.voiceover.language.toUpperCase()})`
                                : 'Disabled'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-stone-600">
                            <span className="flex items-center gap-1">
                              <Subtitles className="w-3.5 h-3.5 text-stone-500" /> Subtitles:
                            </span>
                            <span className="font-semibold text-stone-800">
                              {video.captions.length} timed lines
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-stone-600">
                            <span>Views & Engagement:</span>
                            <span className="font-mono font-bold text-stone-800">
                              {video.viewsCount || 0} views • {video.likesCount || 0} likes
                            </span>
                          </div>
                        </div>

                        {/* Homepage Featured Toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-semibold text-stone-700">
                            Featured on Homepage Showcase
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleFeaturedVideo(video.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                              video.featuredOnHome
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            }`}
                          >
                            {video.featuredOnHome ? '★ Featured' : 'Not Featured'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAiVideoForEdit(video);
                            setIsAiVideoGeneratorOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit / Regenerate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate({ type: 'product-details', productId: video.productId })}
                          className="p-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                          title="View on Product Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAiVideo(video.id)}
                        className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition"
                        title="Delete AI Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-extrabold text-stone-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Garment to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Signature Boxy Tee"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sub-Brand Label</label>
                  <select
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="AURA Streetwear">AURA Streetwear</option>
                    <option value="AURA Artisan">AURA Artisan</option>
                    <option value="AURA Contemporary">AURA Contemporary</option>
                    <option value="AURA Essentials">AURA Essentials</option>
                    <option value="AURA Denim Lab">AURA Denim Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Collection</option>
                    <option value="panjabi">Panjabi & Festive</option>
                    <option value="streetwear">Streetwear Drops</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price in Taka (৳)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Fabric & GSM Details</label>
                <input
                  type="text"
                  value={prodFabric}
                  onChange={(e) => setProdFabric(e.target.value)}
                  placeholder="e.g. 100% Combed Cotton, 240 GSM"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Main Image URL</label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCouponModalOpen(false)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900">Create New Promo Voucher</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Voucher Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. SUMMER25, DHAKA30"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e: any) => setNewCouponType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Taka (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Min Order Amount (৳)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  Activate Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedOrderDetails(null)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h4 className="font-extrabold text-stone-900 text-base">{selectedOrderDetails.orderNumber}</h4>
                <p className="text-[11px] text-stone-500">Placed on {selectedOrderDetails.createdAt}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900">Customer & Shipping:</span>
                <p className="text-stone-700">{selectedOrderDetails.customerName} ({selectedOrderDetails.customerPhone})</p>
                <p className="text-stone-600">{selectedOrderDetails.shippingAddress.addressLine}, {selectedOrderDetails.shippingAddress.areaDistrict}, {selectedOrderDetails.shippingAddress.division}</p>
                <p className="text-stone-500 text-[11px]">Courier: {selectedOrderDetails.courierName} | Code: {selectedOrderDetails.trackingNumber}</p>
              </div>

              <div>
                <span className="font-bold text-stone-900 block mb-2">Items Purchased:</span>
                <div className="divide-y divide-stone-100">
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={it.productImage} className="w-8 h-10 rounded object-cover" />
                        <div>
                          <p className="font-bold text-stone-800">{it.productName}</p>
                          <p className="text-[10px] text-stone-500">Size: {it.size} | Color: {it.color} × {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">৳{it.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-extrabold">
                <span>Total Amount:</span>
                <span>৳{selectedOrderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-stone-900 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm truncate max-w-sm">
                  {previewingVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingVideo(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProductVideoPlayer
              video={previewingVideo}
              product={db.getProductById(previewingVideo.productId)}
              autoplay={true}
              loop={true}
              className="w-full"
            />

            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
              <span className="capitalize">Style: {previewingVideo.style} • {previewingVideo.duration}s</span>
              <button
                type="button"
                onClick={() => setPreviewingVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Video Generator Modal */}
      {isAiVideoGeneratorOpen && (
        <AIVideoGeneratorModal
          isOpen={isAiVideoGeneratorOpen}
          onClose={() => {
            setIsAiVideoGeneratorOpen(false);
            setSelectedAiVideoForEdit(null);
          }}
          initialProductId={selectedAiVideoForEdit?.productId || undefined}
          initialVideo={selectedAiVideoForEdit || null}
          onSaved={(savedVideo) => {
            refreshData();
            showToast('AI Video saved to product lookbook!', 'success');
          }}
        />
      )}
    </div>
  );
};
