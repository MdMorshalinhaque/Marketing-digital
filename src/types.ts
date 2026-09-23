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
  aiVideoId?: string;
  hasAiVideo?: boolean;
  createdAt: string;
}

export type VideoStyle = 'professional' | 'minimal' | 'luxury' | 'energetic' | 'social';
export type VideoDuration = 10 | 15 | 30 | 60;
export type VideoAspectRatio = '16:9' | '9:16' | '1:1';
export type VoiceoverLanguage = 'en' | 'bn' | 'hi';
export type VoiceoverGender = 'female' | 'male';
export type SocialPlatformPreset = 'instagram' | 'tiktok' | 'youtube_shorts' | 'facebook' | 'standard';

export interface VideoCaptionSegment {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
}

export interface VoiceoverConfig {
  enabled: boolean;
  language: VoiceoverLanguage;
  gender: VoiceoverGender;
  speed: number;
  script: string;
}

export interface VideoScene {
  id: string;
  imageIndex: number;
  durationSec: number;
  zoomEffect: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'subtle-pulse';
  headline: string;
  subline: string;
  badge?: string;
}

export interface AIVideo {
  id: string;
  productId: string;
  productName: string;
  title: string;
  marketingMessage: string;
  style: VideoStyle;
  duration: VideoDuration;
  aspectRatio: VideoAspectRatio;
  platformPreset?: SocialPlatformPreset;
  status: 'ready' | 'generating' | 'failed' | 'draft';
  externalApiConnected: boolean;
  externalProvider?: 'runway' | 'luma' | 'kling' | 'veo' | 'custom';
  videoUrl?: string;
  thumbnailUrl: string;
  images: string[];
  scenes: VideoScene[];
  captions: VideoCaptionSegment[];
  voiceover: VoiceoverConfig;
  featuresHighlight: string[];
  viewsCount: number;
  likesCount: number;
  featuredOnHome: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalVideoApiConfig {
  provider: 'runway' | 'luma' | 'kling' | 'veo' | 'custom';
  apiKey: string;
  apiEndpoint?: string;
  modelName?: string;
  isEnabled: boolean;
  autoSync: boolean;
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
  | { type: 'ai-videos'; videoId?: string; productId?: string }
  | { type: 'account'; tab?: 'profile' | 'orders' | 'tracking' | 'wishlist' | 'addresses' }
  | { type: 'track-order'; orderId?: string; email?: string }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'admin'; tab?: 'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'reviews' | 'users' | 'ai-videos' };
