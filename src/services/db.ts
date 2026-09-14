import { Product, Category, Order, Coupon, Review, User } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_products_v1',
  CATEGORIES: 'aura_categories_v1',
  ORDERS: 'aura_orders_v1',
  COUPONS: 'aura_coupons_v1',
  REVIEWS: 'aura_reviews_v1',
  USERS: 'aura_users_v1',
  CURRENT_USER: 'aura_current_user_v1',
  WISHLIST: 'aura_wishlist_v1',
  CART: 'aura_cart_v1',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-panjabi',
    name: 'Panjabi & Festive',
    slug: 'panjabi-festive',
    description: 'Modern tailored panjabis, jacquards, and festive fusion wear crafted for Bangladeshi celebrations.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
    featured: true,
  },
  {
    id: 'cat-tees',
    name: 'Tees & Drop-Shoulder',
    slug: 'tees-tops',
    description: 'Heavyweight 240 GSM combed cotton graphic tees and everyday minimalist basics.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
    featured: true,
  },
  {
    id: 'cat-kurti',
    name: 'Kurtis & Fusion',
    slug: 'kurtis-fusion',
    description: 'Contemporary handloom Jamdani and breathable cotton tunics for effortless modern grace.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    itemCount: 7,
    featured: true,
  },
  {
    id: 'cat-bottoms',
    name: 'Denim & Cargos',
    slug: 'denim-bottoms',
    description: 'Relaxed vintage washed denims, parachute utility cargos, and tailored pleated trousers.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    itemCount: 9,
    featured: true,
  },
  {
    id: 'cat-outerwear',
    name: 'Hoodies & Jackets',
    slug: 'hoodies-outerwear',
    description: 'Heavy French terry pullovers, corduroy overshirts, and breezy light jackets.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    itemCount: 6,
    featured: true,
  },
  {
    id: 'cat-accessories',
    name: 'Bags & Accessories',
    slug: 'accessories',
    description: 'Authentic leather wallets, Dhaka graphic canvas totes, and handcrafted jewelry.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    itemCount: 10,
    featured: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Noir Luxe Embroidered Semi-Fit Panjabi',
    slug: 'noir-luxe-embroidered-panjabi',
    brand: 'AURA Artisan',
    category: 'cat-panjabi',
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 48,
    isBestseller: true,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Meticulously crafted from high-twist Egyptian cotton blend with intricate minimal tonal embroidery on the mandarin collar and placket. Designed with a contemporary semi-fitted silhouette suited for Friday prayers, Eid celebrations, and evening gatherings.',
    details: [
      'Premium 100% fine spun combed cotton',
      'Mandarin collar with gunmetal engraved metal buttons',
      'Deep dual concealed side pockets',
      'Comfortable side vents for easy movement',
      'Dry clean or gentle hand wash recommended'
    ],
    fabric: 'High-twist Combed Cotton (180 GSM)',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Jet Noir', hex: '#18181b' },
      { name: 'Midnight Navy', hex: '#1e293b' },
      { name: 'Ivory Cream', hex: '#f4f4f5' }
    ],
    stock: 24,
    tags: ['Panjabi', 'Eid', 'Festive', 'Traditional', 'Menswear'],
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Dhaka Midnight Heavyweight Graphic Tee',
    slug: 'dhaka-midnight-heavyweight-graphic-tee',
    brand: 'AURA Streetwear',
    category: 'cat-tees',
    price: 1190,
    originalPrice: 1450,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 94,
    isBestseller: true,
    isNewArrival: false,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Inspired by the bustling night skyline of Dhaka. Crafted from custom-knitted 240 GSM combed cotton with drop shoulders, boxy fit, and high-density screen print that resists peeling through countless washes.',
    details: [
      '240 GSM heavy interlock cotton',
      'Pre-shrunk to prevent shrinkage after wash',
      'Relaxed drop-shoulder oversized boxy silhouette',
      'Ribbed 1.25" crewneck collar with reinforced tape',
      'Silkscreen printed with eco-friendly Japanese inks'
    ],
    fabric: '100% Ring-Spun Cotton (240 GSM)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Washed Black', hex: '#27272a' },
      { name: 'Vintage White', hex: '#fafaf9' },
      { name: 'Forest Moss', hex: '#2e3a2f' }
    ],
    stock: 45,
    tags: ['Oversized', 'Graphic Tee', 'Streetwear', 'Unisex', 'Dhaka'],
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Heritage Jamdani Motif Fusion Kurti',
    slug: 'heritage-jamdani-fusion-kurti',
    brand: 'AURA Contemporary',
    category: 'cat-kurti',
    price: 2890,
    originalPrice: 3600,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 36,
    isBestseller: true,
    isNewArrival: true,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Celebrating Bengal heritage with contemporary ease. Subtle geometric Jamdani-inspired woven motifs across breathable handspun cotton voile. A modern A-line cut that pairs gracefully with cigarette pants, palazzos, or relaxed denim.',
    details: [
      'Pure organic Bengal handloom cotton',
      'Subtle woven geometric borders',
      'Pleated yoke with mother-of-pearl buttons',
      'Three-quarter slit sleeves with cuff accents',
      'Extremely breathable for tropical Bangladesh climate'
    ],
    fabric: 'Handloom Cotton Voile with Jamdani weave',
    sizes: ['34', '36', '38', '40', '42'],
    colors: [
      { name: 'Ivory Gold', hex: '#fefce8' },
      { name: 'Blush Terracotta', hex: '#b45309' },
      { name: 'Indigo Cloud', hex: '#0f766e' }
    ],
    stock: 18,
    tags: ['Kurti', 'Jamdani', 'Women', 'Festive', 'Handloom'],
    createdAt: '2026-02-18T14:30:00Z',
  },
  {
    id: 'prod-4',
    name: 'Relaxed Vintage Washed Wide-Leg Denim',
    slug: 'relaxed-vintage-washed-denim',
    brand: 'AURA Denim Lab',
    category: 'cat-bottoms',
    price: 2450,
    originalPrice: 3100,
    discountPercent: 21,
    rating: 4.7,
    reviewCount: 52,
    isBestseller: false,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavyweight 13.5 oz non-stretch Japanese washed denim. Cut with a relaxed mid-rise waist and generous straight-wide leg profile for that effortless 90s streetwear drape.',
    details: [
      '13.5 oz 100% durable cotton denim',
      'Authentic stone-wash with subtle whisker fading',
      'YKK brass zip fly with heavy duty shank button',
      'Reinforced bar-tack stitching at stress points',
      'Classic 5-pocket styling with AURA debossed leather patch'
    ],
    fabric: '13.5 oz Ringspun Denim',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Vintage Mid Indigo', hex: '#3b82f6' },
      { name: 'Washed Charcoal', hex: '#3f3f46' },
      { name: 'Raw Deep Blue', hex: '#1e3a8a' }
    ],
    stock: 30,
    tags: ['Denim', 'Jeans', 'Streetwear', 'Pants'],
    createdAt: '2026-01-25T09:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Breezy Linen Cuban Collar Resort Shirt',
    slug: 'breezy-linen-cuban-collar-shirt',
    brand: 'AURA Essentials',
    category: 'cat-tees',
    price: 2150,
    originalPrice: 2600,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 29,
    isBestseller: false,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tailored from European flax linen blended with organic cotton. The open camp collar and airy drape make it the ultimate choice for humid monsoon and hot summer days in Dhaka and Cox’s Bazar weekends.',
    details: [
      '60% Linen, 40% Long-Staple Cotton',
      'Relaxed camp / Cuban open collar',
      'Natural wooden buttons',
      'Straight hem with side vents for untucked styling',
      'Breathable, moisture-wicking and soft against skin'
    ],
    fabric: 'Linen Cotton Slub (155 GSM)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage Olive', hex: '#556b2f' },
      { name: 'Sand Dune', hex: '#d2b48c' },
      { name: 'Crisp Linen White', hex: '#ffffff' }
    ],
    stock: 22,
    tags: ['Linen', 'Shirt', 'Resort', 'Summer', 'Menswear'],
    createdAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Heavy French Terry Oversized Hoodie',
    slug: 'heavy-french-terry-oversized-hoodie',
    brand: 'AURA Streetwear',
    category: 'cat-outerwear',
    price: 2750,
    originalPrice: 3400,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 67,
    isBestseller: true,
    isNewArrival: false,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Substantial 400 GSM brushed loopback French terry. Features a double-layered structured hood without drawstrings for a modern architectural silhouette, kangaroo pouch, and micro-embroidered AURA chest insignia.',
    details: [
      '400 GSM ultra-heavy French terry',
      'Clean drawstring-free double lined hood',
      'Ribbed side expansion panels',
      'Kangaroo hand pocket with concealed phone stash',
      'Tailored oversized drop-shoulder cut'
    ],
    fabric: '100% Heavy French Terry Cotton (400 GSM)',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal Ash', hex: '#334155' },
      { name: 'Raw Espresso', hex: '#451a03' },
      { name: 'Oatmeal Heather', hex: '#e2e8f0' }
    ],
    stock: 35,
    tags: ['Hoodie', 'Winter', 'Streetwear', 'Sweatshirt'],
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Dhaka Tech Utility Parachute Cargos',
    slug: 'dhaka-tech-utility-parachute-cargos',
    brand: 'AURA Streetwear',
    category: 'cat-bottoms',
    price: 2250,
    originalPrice: 2850,
    discountPercent: 21,
    rating: 4.7,
    reviewCount: 41,
    isBestseller: false,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered for metropolitan city commuting. Lightweight yet rip-resistant cotton nylon blend with 6 ergonomic utility pockets, bungee cord adjustable cuffs, and an elasticated waistband with integrated webbing belt.',
    details: [
      'Water-repellent ripstop cotton-nylon blend',
      'Adjustable bungee cords at ankle hem for customizable taper',
      'Deep bellows 3D cargo pockets with velcro flaps',
      'Built-in quick-release buckle belt',
      'Ultra lightweight and quick-drying'
    ],
    fabric: 'Cotton Nylon Ripstop Blend',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Khaki', hex: '#78716c' },
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Army Camo Green', hex: '#3f4e3c' }
    ],
    stock: 28,
    tags: ['Cargo', 'Techwear', 'Pants', 'Streetwear'],
    createdAt: '2026-02-14T15:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Handcrafted Amar Shohor Canvas Tote Bag',
    slug: 'amar-shohor-canvas-tote-bag',
    brand: 'AURA Crafts',
    category: 'cat-accessories',
    price: 650,
    originalPrice: 850,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 112,
    isBestseller: true,
    isNewArrival: false,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavyweight 16 oz natural unbleached cotton canvas screen-printed with iconic Dhaka street typography. Reinforced box-stitched straps capable of carrying up to 15kg of books, laptops, and daily essentials with inner zip pocket.',
    details: [
      '16 oz heavy natural unbleached cotton canvas',
      'Reinforced cross-stitched handles with 12" drop',
      'Concealed interior zipper pocket for smartphone and keys',
      'Magnetic brass snap button closure',
      'Eco-friendly, reusable, and machine washable'
    ],
    fabric: '16 oz Unbleached Organic Cotton Canvas',
    sizes: ['One Size (16" x 15" x 4")'],
    colors: [
      { name: 'Raw Ecru', hex: '#fdfbf7' },
      { name: 'Midnight Charcoal', hex: '#27272a' }
    ],
    stock: 75,
    tags: ['Tote Bag', 'Accessories', 'Dhaka', 'Eco-friendly'],
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Minimalist Full-Grain Leather Low-Top Sneaker',
    slug: 'minimalist-leather-low-top-sneaker',
    brand: 'AURA Footwear',
    category: 'cat-accessories',
    price: 3850,
    originalPrice: 4800,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 38,
    isBestseller: false,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from supple full-grain cowhide leather sourced from Hazaribagh artisans. Features an anti-odor calfskin lining, high-density cushioned memory foam insole, and stitched Italian Margom-style rubber cupsole.',
    details: [
      'Full-grain natural cowhide leather upper',
      'Orthopedic memory foam footbed with arch support',
      '100% natural vulcanized non-slip rubber sole',
      'Waxed cotton tonal laces',
      'Subtle gold-foil model stamping on outer heel'
    ],
    fabric: 'Full-Grain Genuine Cowhide Leather',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Triple White', hex: '#ffffff' },
      { name: 'Chalk Off-White', hex: '#f4f4f5' },
      { name: 'Noir Black Sole', hex: '#18181b' }
    ],
    stock: 19,
    tags: ['Shoes', 'Sneakers', 'Leather', 'Footwear'],
    createdAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Royal Jacquard Silk Festive Panjabi - Emerald',
    slug: 'royal-jacquard-silk-festive-panjabi',
    brand: 'AURA Artisan',
    category: 'cat-panjabi',
    price: 4950,
    originalPrice: 6200,
    discountPercent: 20,
    rating: 5.0,
    reviewCount: 24,
    isBestseller: true,
    isNewArrival: true,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A regal showstopper for weddings and festive gatherings. Rich jacquard self-weave silk with subtle iridescent sheen, accented by antique copper buttons and tailored slim-regular drape.',
    details: [
      'Silk blend jacquard self-woven fabric',
      'Traditional mandarin collar with hand-stitched border',
      'Hand-cast antique metal buttons',
      'Dual deep side pockets',
      'Dry clean only'
    ],
    fabric: 'Raw Silk Cotton Blend Jacquard',
    sizes: ['38', '40', '42', '44'],
    colors: [
      { name: 'Emerald Forest', hex: '#064e3b' },
      { name: 'Ruby Wine', hex: '#881337' },
      { name: 'Royal Gold Ochre', hex: '#78350f' }
    ],
    stock: 15,
    tags: ['Panjabi', 'Wedding', 'Silk', 'Festive', 'Eid'],
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Waffle Knit Breathable Minimalist Crewneck',
    slug: 'waffle-knit-minimalist-crewneck',
    brand: 'AURA Essentials',
    category: 'cat-tees',
    price: 1350,
    originalPrice: 1650,
    discountPercent: 18,
    rating: 4.6,
    reviewCount: 22,
    isBestseller: false,
    isNewArrival: true,
    isSpecialOffer: false,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Structured honeycomb thermal texture that provides ventilation in warm weather and warmth when layered. Clean hems and ribbed neckline for a timeless Scandinavian-Bangladeshi minimal aesthetic.',
    details: [
      'Heavyweight 220 GSM waffle textured cotton',
      'Breathable thermal honeycomb weave',
      'Reinforced side split hems',
      'Pre-washed for non-shrinkage'
    ],
    fabric: '100% Combed Thermal Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cocoa Brown', hex: '#5c4033' },
      { name: 'Slate Blue', hex: '#475569' },
      { name: 'Oatmeal', hex: '#e2e8f0' }
    ],
    stock: 27,
    tags: ['Tee', 'Waffle', 'Minimalist', 'Basics'],
    createdAt: '2026-02-12T09:30:00Z',
  },
  {
    id: 'prod-12',
    name: 'Artisan Full Grain Leather Minimal Cardholder',
    slug: 'artisan-leather-minimal-cardholder',
    brand: 'AURA Crafts',
    category: 'cat-accessories',
    price: 750,
    originalPrice: 1050,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 54,
    isBestseller: true,
    isNewArrival: false,
    isSpecialOffer: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Slimline wallet handcrafted from vegetable-tanned full-grain local leather. Features 6 card slots, a central cash compartment, and RFID blocking lining for modern security on Dhaka metro.',
    details: [
      'Vegetable-tanned full-grain cowhide',
      'Built-in RFID blocking shield protection',
      'Holds 6-8 cards and folded banknotes',
      'Hand-burnished beeswax edges'
    ],
    fabric: 'Vegetable Tanned Cowhide Leather',
    sizes: ['One Size (4" x 3")'],
    colors: [
      { name: 'Cognac Tan', hex: '#9a3412' },
      { name: 'Obsidian Black', hex: '#18181b' },
      { name: 'Deep Espresso', hex: '#451a03' }
    ],
    stock: 40,
    tags: ['Wallet', 'Leather', 'Cardholder', 'Gift'],
    createdAt: '2026-01-18T13:00:00Z',
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'AURA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 500,
    description: '10% discount on orders above ৳1,000 across the entire store',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
    usageCount: 142,
  },
  {
    id: 'coup-2',
    code: 'DHAKA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2500,
    maxDiscount: 1000,
    description: 'Flat 20% discount on streetwear & festive wear above ৳2,500',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
    usageCount: 89,
  },
  {
    id: 'coup-3',
    code: 'EIDVIBES',
    discountType: 'fixed',
    discountValue: 300,
    minOrderValue: 2000,
    description: '৳300 instant cashback off festive and panjabi orders above ৳2,000',
    isActive: true,
    expiresAt: '2026-08-30T23:59:59Z',
    usageCount: 215,
  },
  {
    id: 'coup-4',
    code: 'FREEDEL',
    discountType: 'fixed',
    discountValue: 130,
    minOrderValue: 1500,
    description: 'Free Nationwide Delivery across all 64 districts in Bangladesh',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
    usageCount: 304,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@gmail.com',
    phone: '01712345678',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home (Dhanmondi)',
        fullName: 'Tanvir Ahmed',
        phone: '01712345678',
        email: 'tanvir.ahmed@gmail.com',
        addressLine: 'House 14, Road 8/A, Dhanmondi R/A',
        areaDistrict: 'Dhanmondi, Dhaka',
        division: 'Dhaka',
        postalCode: '1209',
        isDefault: true,
      },
      {
        id: 'addr-2',
        title: 'Office (Gulshan)',
        fullName: 'Tanvir Ahmed',
        phone: '01712345678',
        email: 'tanvir.ahmed@gmail.com',
        addressLine: 'Level 6, Navana Tower, Gulshan-1',
        areaDistrict: 'Gulshan, Dhaka',
        division: 'Dhaka',
        postalCode: '1212',
        isDefault: false,
      }
    ],
    wishlist: ['prod-1', 'prod-3', 'prod-7'],
    createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'usr-admin-1',
    name: 'Farhan Chowdhury (Admin)',
    email: 'admin@auralifestyle.bd',
    phone: '01886123456',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-admin',
        title: 'Headquarters',
        fullName: 'Farhan Chowdhury',
        phone: '01886123456',
        email: 'admin@auralifestyle.bd',
        addressLine: 'House 42, Road 11, Block D, Banani',
        areaDistrict: 'Banani, Dhaka',
        division: 'Dhaka',
        postalCode: '1213',
        isDefault: true,
      }
    ],
    wishlist: ['prod-2'],
    createdAt: '2025-11-01T09:00:00Z',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'AURA-BD-2026-9812',
    customerId: 'usr-customer-1',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir.ahmed@gmail.com',
    customerPhone: '01712345678',
    shippingAddress: {
      id: 'addr-1',
      title: 'Home (Dhanmondi)',
      fullName: 'Tanvir Ahmed',
      phone: '01712345678',
      email: 'tanvir.ahmed@gmail.com',
      addressLine: 'House 14, Road 8/A, Dhanmondi R/A',
      areaDistrict: 'Dhanmondi, Dhaka',
      division: 'Dhaka',
      postalCode: '1209',
      isDefault: true,
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Noir Luxe Embroidered Semi-Fit Panjabi',
        productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        size: '42',
        color: 'Jet Noir',
        quantity: 1,
        unitPrice: 3450,
        subtotal: 3450,
      },
      {
        productId: 'prod-8',
        productName: 'Handcrafted Amar Shohor Canvas Tote Bag',
        productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        size: 'One Size',
        color: 'Raw Ecru',
        quantity: 1,
        unitPrice: 650,
        subtotal: 650,
      }
    ],
    deliveryMethod: {
      id: 'del-std-dhaka',
      name: 'Inside Dhaka Standard (24-48 Hours)',
      fee: 70,
      estimatedDays: '1-2 business days',
    },
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    paymentDetails: {
      transactionId: 'BKASH98231XKL',
      senderNumber: '01712345678',
      paidAt: '2026-03-12T14:35:00Z',
    },
    subtotal: 4100,
    discountAmount: 410,
    couponCode: 'AURA10',
    deliveryFee: 70,
    total: 3760,
    orderStatus: 'shipped',
    trackingNumber: 'PTH-BD-8904123',
    courierName: 'Pathao Courier Express',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed & Verified',
        timestamp: '12 Mar 2026, 02:35 PM',
        completed: true,
        description: 'Order confirmed with bKash digital payment.',
      },
      {
        status: 'processing',
        title: 'Packed at Dhaka Central Hub',
        timestamp: '12 Mar 2026, 05:20 PM',
        completed: true,
        description: 'Garments quality-checked, tagged, and boxed at Banani Hub.',
      },
      {
        status: 'shipped',
        title: 'Dispatched with Courier',
        timestamp: '13 Mar 2026, 10:15 AM',
        completed: true,
        description: 'Handed over to Pathao rider (Tracking: PTH-BD-8904123).',
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        timestamp: 'Estimated 14 Mar 2026',
        completed: false,
        description: 'Rider will call your mobile before reaching Dhanmondi.',
      },
      {
        status: 'delivered',
        title: 'Delivered to Customer',
        timestamp: 'Pending delivery',
        completed: false,
        description: 'Parcel handover complete and signature confirmed.',
      }
    ],
    createdAt: '2026-03-12T14:35:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'AURA-BD-2026-9745',
    customerId: 'usr-customer-1',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir.ahmed@gmail.com',
    customerPhone: '01712345678',
    shippingAddress: {
      id: 'addr-1',
      title: 'Home (Dhanmondi)',
      fullName: 'Tanvir Ahmed',
      phone: '01712345678',
      email: 'tanvir.ahmed@gmail.com',
      addressLine: 'House 14, Road 8/A, Dhanmondi R/A',
      areaDistrict: 'Dhanmondi, Dhaka',
      division: 'Dhaka',
      postalCode: '1209',
      isDefault: true,
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Dhaka Midnight Heavyweight Graphic Tee',
        productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        size: 'L',
        color: 'Washed Black',
        quantity: 2,
        unitPrice: 1190,
        subtotal: 2380,
      }
    ],
    deliveryMethod: {
      id: 'del-std-dhaka',
      name: 'Inside Dhaka Standard (24-48 Hours)',
      fee: 70,
      estimatedDays: '1-2 business days',
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    subtotal: 2380,
    discountAmount: 0,
    deliveryFee: 70,
    total: 2450,
    orderStatus: 'delivered',
    trackingNumber: 'STF-BD-442190',
    courierName: 'Steadfast Courier',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        timestamp: '01 Mar 2026, 11:20 AM',
        completed: true,
        description: 'Cash on Delivery selected.',
      },
      {
        status: 'processing',
        title: 'Processed & Packed',
        timestamp: '01 Mar 2026, 03:00 PM',
        completed: true,
        description: 'Quality tested and packed.',
      },
      {
        status: 'shipped',
        title: 'Shipped',
        timestamp: '02 Mar 2026, 09:40 AM',
        completed: true,
        description: 'Handed over to Steadfast courier.',
      },
      {
        status: 'delivered',
        title: 'Delivered & Paid',
        timestamp: '03 Mar 2026, 01:15 PM',
        completed: true,
        description: 'Delivered to Dhanmondi residence. ৳2,450 collected via COD.',
      }
    ],
    createdAt: '2026-03-01T11:20:00Z',
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Saifur Rahman',
    userCity: 'Uttara, Dhaka',
    rating: 5,
    comment: 'The fabric quality of this Panjabi is unreal! Truly Egyptian cotton feel, perfect sizing (42 fit me like bespoke tailoring), and the subtle embroidery on the collar looks very sophisticated.',
    date: '2026-03-04',
    verifiedPurchase: true,
    helpfulCount: 14,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Nadia Chowdhury',
    userCity: 'Nasirabad, Chattogram',
    rating: 5,
    comment: 'Bought this as an Eid gift for my brother. Received in Chittagong in just 48 hours via Steadfast courier. Premium packaging box too!',
    date: '2026-03-08',
    verifiedPurchase: true,
    helpfulCount: 9,
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Arafat Hossain',
    userCity: 'Mirpur DOHS, Dhaka',
    rating: 5,
    comment: 'Finally a Bangladeshi streetwear brand getting 240 GSM drop shoulder right! Collar doesn’t bacon after washing, print is crisp. 10/10.',
    date: '2026-03-06',
    verifiedPurchase: true,
    helpfulCount: 22,
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userName: 'Samira Huq',
    userCity: 'Banani, Dhaka',
    rating: 5,
    comment: 'Wore this Jamdani motif kurti to a rooftop family get-together. So comfortable and breathable in Dhaka weather, received so many compliments!',
    date: '2026-02-26',
    verifiedPurchase: true,
    helpfulCount: 11,
  },
  {
    id: 'rev-5',
    productId: 'prod-8',
    userName: 'Maisha Tabassum',
    userCity: 'Zindabazar, Sylhet',
    rating: 5,
    comment: 'Love the "Amar Shohor Dhaka" artwork! The canvas is thick and holds my 15-inch laptop with water bottle easily without tearing.',
    date: '2026-02-20',
    verifiedPurchase: true,
    helpfulCount: 18,
  }
];

// Helper to safely get from localStorage with initial fallback
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('aura_db_update'));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Database Service API
export const db = {
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },

  updateStock(productId: string, quantityToDeduct: number): void {
    const products = this.getProducts();
    const target = products.find((p) => p.id === productId);
    if (target) {
      target.stock = Math.max(0, target.stock - quantityToDeduct);
      setStored(STORAGE_KEYS.PRODUCTS, products);
    }
  },

  getCategories(): Category[] {
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory(cat: Category): void {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === cat.id);
    if (idx >= 0) {
      categories[idx] = cat;
    } else {
      categories.push(cat);
    }
    setStored(STORAGE_KEYS.CATEGORIES, categories);
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CATEGORIES, categories);
  },

  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(idOrOrderNum: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === idOrOrderNum || o.orderNumber.toLowerCase() === idOrOrderNum.toLowerCase() || o.trackingNumber.toLowerCase() === idOrOrderNum.toLowerCase());
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.unshift(order);
    }
    setStored(STORAGE_KEYS.ORDERS, orders);
  },

  updateOrderStatus(orderId: string, newStatus: Order['orderStatus']): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = newStatus;
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      const statusTitleMap: Record<Order['orderStatus'], string> = {
        pending: 'Order Verification Pending',
        processing: 'Packed at Hub',
        shipped: 'Handed to Courier Rider',
        out_for_delivery: 'Out for Delivery Today',
        delivered: 'Delivered & Completed',
        cancelled: 'Order Cancelled'
      };

      order.timeline.push({
        status: newStatus,
        title: statusTitleMap[newStatus],
        timestamp: dateStr,
        completed: true,
        description: `Status updated by dispatch team to: ${newStatus.toUpperCase()}`,
      });
      setStored(STORAGE_KEYS.ORDERS, orders);
    }
  },

  getCoupons(): Coupon[] {
    return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  saveCoupon(coupon: Coupon): void {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      coupons[idx] = coupon;
    } else {
      coupons.push(coupon);
    }
    setStored(STORAGE_KEYS.COUPONS, coupons);
  },

  deleteCoupon(id: string): void {
    const coupons = this.getCoupons().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.COUPONS, coupons);
  },

  getReviews(productId?: string): Review[] {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return all.filter((r) => r.productId === productId);
    }
    return all;
  },

  saveReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
  },

  deleteReview(id: string): void {
    const reviews = this.getReviews().filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
  },

  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User {
    const users = this.getUsers();
    const stored = getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored) {
      const found = users.find((u) => u.id === stored.id);
      if (found) return found;
    }
    return users[0]; // Tanvir Ahmed customer by default
  },

  setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    setStored(STORAGE_KEYS.USERS, users);
    const curr = this.getCurrentUser();
    if (curr.id === user.id) {
      this.setCurrentUser(user);
    }
  },

  getUserWishlist(userId: string): string[] {
    const user = this.getUsers().find((u) => u.id === userId);
    if (user && Array.isArray(user.wishlist)) {
      return user.wishlist;
    }
    try {
      const raw = localStorage.getItem(`aura_user_wishlist_${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return userId === 'usr-admin-1' ? ['prod-2'] : ['prod-1', 'prod-3', 'prod-7'];
  },

  saveUserWishlist(userId: string, productIds: string[]): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.wishlist = productIds;
      this.saveUser(user);
    }
    try {
      localStorage.setItem(`aura_user_wishlist_${userId}`, JSON.stringify(productIds));
    } catch {}
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    window.dispatchEvent(new Event('aura_db_update'));
  }
};
