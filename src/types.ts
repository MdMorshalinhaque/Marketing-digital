export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  images: string[];
  description: string;
  details: string[];
  fabric: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item composite id
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine: string;
  areaDistrict: string;
  division: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  wishlist?: string[];
  createdAt: string;
}

export interface OrderTimelineItem {
  status: string;
  title: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  deliveryMethod: {
    id: string;
    name: string;
    fee: number;
    estimatedDays: string;
  };
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDetails?: {
    transactionId?: string;
    senderNumber?: string;
    paidAt?: string;
  };
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingNumber: string;
  courierName: string;
  timeline: OrderTimelineItem[];
  customerNotes?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
  expiresAt: string;
  usageCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  selectedSizes: string[];
  selectedColors: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popularity';
  inStockOnly: boolean;
  searchQuery: string;
}

export type PageView =
  | { type: 'home' }
  | { type: 'shop'; category?: string; query?: string }
  | { type: 'product-details'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'wishlist' }
  | { type: 'account'; tab?: 'profile' | 'orders' | 'tracking' | 'wishlist' | 'addresses' }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'admin'; tab?: 'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'reviews' | 'users' };
