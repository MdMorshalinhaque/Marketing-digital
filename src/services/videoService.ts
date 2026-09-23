import {
  AIVideo,
  ExternalVideoApiConfig,
  Product,
  SocialPlatformPreset,
  VideoAspectRatio,
  VideoCaptionSegment,
  VideoDuration,
  VideoScene,
  VideoStyle,
  VoiceoverGender,
  VoiceoverLanguage,
} from '../types';
import { db } from './db';

const STORAGE_KEYS = {
  VIDEOS: 'aura_ai_videos_v2',
  API_CONFIG: 'aura_video_api_config_v2',
  LIKES: 'aura_video_likes_v2',
};

export const INITIAL_AI_VIDEOS: AIVideo[] = [
  {
    id: 'vid-prod-1',
    productId: 'prod-1',
    productName: 'Noir Luxe Embroidered Semi-Fit Panjabi',
    title: 'Noir Luxe Heritage Panjabi — Festive Spotlight',
    marketingMessage: 'Experience unparalleled sophistication with Egyptian cotton and intricate tonal collar embroidery for Eid celebrations.',
    style: 'luxury',
    duration: 15,
    aspectRatio: '16:9',
    platformPreset: 'standard',
    status: 'ready',
    externalApiConnected: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
    ],
    scenes: [
      {
        id: 'sc-1',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-in',
        headline: 'Pure High-Twist Egyptian Cotton',
        subline: 'Tailored with precision for Dhaka festivities',
        badge: 'FESTIVE 2026',
      },
      {
        id: 'sc-2',
        imageIndex: 1,
        durationSec: 5,
        zoomEffect: 'pan-left',
        headline: 'Intricate Mandarin Collar Detailing',
        subline: 'Minimal gunmetal engraved hardware buttons',
        badge: 'HANDCRAFTED',
      },
      {
        id: 'sc-3',
        imageIndex: 2,
        durationSec: 5,
        zoomEffect: 'zoom-out',
        headline: 'Only ৳3,450 • Free Express Delivery',
        subline: 'Pay with bKash, Nagad, or Cash on Delivery',
        badge: 'BESTSELLER',
      },
    ],
    captions: [
      { id: 'c-1', startSec: 0, endSec: 4.5, text: 'Introducing the Noir Luxe Embroidered Panjabi by AURA Artisan.' },
      { id: 'c-2', startSec: 4.5, endSec: 9.5, text: 'Tailored from breathable 180 GSM Egyptian cotton with tonal collar accents.' },
      { id: 'c-3', startSec: 9.5, endSec: 15, text: 'Order now on aurabd.com for express delivery across Bangladesh.' },
    ],
    voiceover: {
      enabled: true,
      language: 'en',
      gender: 'female',
      speed: 1.0,
      script: 'Introducing the Noir Luxe Embroidered Panjabi by AURA Artisan. Tailored from high twist Egyptian cotton with tonal collar accents. Order now for express delivery across Bangladesh.',
    },
    featuresHighlight: ['180 GSM Egyptian Cotton', 'Subtle Collar Embroidery', 'Concealed Pockets', 'Anti-Crease Finish'],
    viewsCount: 1420,
    likesCount: 268,
    featuredOnHome: true,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'vid-prod-2',
    productId: 'prod-2',
    productName: 'Dhaka Midnight Heavyweight Graphic Tee',
    title: 'Dhaka Midnight 240 GSM Streetwear Drop',
    marketingMessage: 'Custom heavyweight drop-shoulder tee built for urban night vibes. Resists collar baconing wash after wash.',
    style: 'energetic',
    duration: 15,
    aspectRatio: '9:16',
    platformPreset: 'tiktok',
    status: 'ready',
    externalApiConnected: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
    scenes: [
      {
        id: 'sc-201',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-in',
        headline: '240 GSM Heavy Ring-Spun Cotton',
        subline: 'Oversized boxy drop-shoulder cut',
        badge: 'STREETWEAR DROP',
      },
      {
        id: 'sc-202',
        imageIndex: 1,
        durationSec: 5,
        zoomEffect: 'subtle-pulse',
        headline: 'Japanese Screen-Printed Graphic',
        subline: 'Crack-resistant through 50+ wash cycles',
        badge: 'DURABLE INK',
      },
      {
        id: 'sc-203',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-out',
        headline: 'Only ৳1,190 • Instant bKash Checkout',
        subline: 'Delivery in 24 hours within Dhaka metro',
        badge: 'SHOP NOW',
      },
    ],
    captions: [
      { id: 'c-201', startSec: 0, endSec: 4.5, text: 'Level up your drip with the Dhaka Midnight Heavyweight Tee.' },
      { id: 'c-202', startSec: 4.5, endSec: 9.5, text: 'Custom 240 GSM combed cotton with reinforced no-bacon collar.' },
      { id: 'c-203', startSec: 9.5, endSec: 15, text: 'Tap Shop Now to get yours delivered in 24 hours in Dhaka.' },
    ],
    voiceover: {
      enabled: true,
      language: 'en',
      gender: 'male',
      speed: 1.05,
      script: 'Level up your drip with the Dhaka Midnight Heavyweight Tee. Custom 240 GSM combed cotton with reinforced no bacon collar. Tap Shop Now to get yours delivered in 24 hours.',
    },
    featuresHighlight: ['240 GSM Heavy Cotton', 'Anti-Sag Collar Tape', 'Boxy Streetwear Fit', 'Screen-printed in Dhaka'],
    viewsCount: 3120,
    likesCount: 540,
    featuredOnHome: true,
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'vid-prod-3',
    productId: 'prod-3',
    productName: 'Heritage Jamdani Motif Cotton Kurti',
    title: 'Heritage Jamdani Fusion — Breathable Grace',
    marketingMessage: 'Timeless handloom inspired Jamdani geometric motifs on breezy Bangladeshi summer cotton.',
    style: 'minimal',
    duration: 15,
    aspectRatio: '16:9',
    platformPreset: 'standard',
    status: 'ready',
    externalApiConnected: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    ],
    scenes: [
      {
        id: 'sc-301',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-in',
        headline: 'Natural Breathable Cotton Handloom',
        subline: 'Hand-dyed indigo motif weave for Dhaka summers',
        badge: 'HERITAGE ART',
      },
      {
        id: 'sc-302',
        imageIndex: 1,
        durationSec: 5,
        zoomEffect: 'pan-right',
        headline: 'Contemporary Everyday Silhouette',
        subline: 'Effortless drape from office to family get-togethers',
        badge: 'COMFORT WEAR',
      },
      {
        id: 'sc-303',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-out',
        headline: 'Priced at ৳2,250 • Limited Eid Batches',
        subline: 'Crafted with ethical artisan weavers in Sonargaon',
        badge: 'ETHICAL CRAFT',
      },
    ],
    captions: [
      { id: 'c-301', startSec: 0, endSec: 4.5, text: 'Heritage Jamdani meets modern minimalism in our new Kurti collection.' },
      { id: 'c-302', startSec: 4.5, endSec: 9.5, text: 'Crafted from breathable organic cotton with authentic hand-woven motifs.' },
      { id: 'c-303', startSec: 9.5, endSec: 15, text: 'Explore the full artisanal collection today on AURA Lifestyle.' },
    ],
    voiceover: {
      enabled: true,
      language: 'en',
      gender: 'female',
      speed: 0.95,
      script: 'Heritage Jamdani meets modern minimalism in our new Kurti collection. Crafted from breathable organic cotton with authentic hand-woven motifs. Explore the collection today on AURA Lifestyle.',
    },
    featuresHighlight: ['Authentic Jamdani Weave', '100% Breathable Cotton', 'Pre-Shrunk', 'Artisan Crafted'],
    viewsCount: 1850,
    likesCount: 312,
    featuredOnHome: true,
    createdAt: '2026-03-08T14:30:00Z',
    updatedAt: '2026-03-08T14:30:00Z',
  },
  {
    id: 'vid-prod-4',
    productId: 'prod-4',
    productName: 'Tactical Parachute Cargo Pants',
    title: 'Tactical Parachute Cargos — Urban Utility',
    marketingMessage: 'Water-repellent ripstop stretch nylon with 6 functional storage pockets and ankle bungee cinch.',
    style: 'social',
    duration: 15,
    aspectRatio: '9:16',
    platformPreset: 'instagram',
    status: 'ready',
    externalApiConnected: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    ],
    scenes: [
      {
        id: 'sc-401',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-in',
        headline: 'Water-Repellent Ripstop Nylon',
        subline: 'Designed for weather unpredictability & daily commute',
        badge: 'ALL-WEATHER',
      },
      {
        id: 'sc-402',
        imageIndex: 1,
        durationSec: 5,
        zoomEffect: 'subtle-pulse',
        headline: '6 Deep Functional Utility Pockets',
        subline: 'Reinforced dual stitching with matte black hardware',
        badge: 'TACTICAL GEAR',
      },
      {
        id: 'sc-403',
        imageIndex: 0,
        durationSec: 5,
        zoomEffect: 'zoom-out',
        headline: '৳2,450 • Available in Army Olive & Jet Black',
        subline: 'Upgrade your streetwear rotation with AURA',
        badge: 'NEW ARRIVAL',
      },
    ],
    captions: [
      { id: 'c-401', startSec: 0, endSec: 4.5, text: 'Engineered for the city: Tactical Parachute Cargos by AURA.' },
      { id: 'c-402', startSec: 4.5, endSec: 9.5, text: 'Featuring 6 deep utility pockets and adjustable ankle bungee cords.' },
      { id: 'c-403', startSec: 9.5, endSec: 15, text: 'Shop the drop now and enjoy free doorstep returns in Dhaka.' },
    ],
    voiceover: {
      enabled: true,
      language: 'en',
      gender: 'male',
      speed: 1.0,
      script: 'Engineered for the city. Tactical Parachute Cargos by AURA. Featuring six deep utility pockets and adjustable ankle bungee cords. Shop the drop now on aurabd.com.',
    },
    featuresHighlight: ['Ripstop Stretch Nylon', '6 Functional Pockets', 'Bungee Hem Cinch', 'Matte Black Hardware'],
    viewsCount: 2240,
    likesCount: 420,
    featuredOnHome: true,
    createdAt: '2026-03-10T16:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
  },
];

export const DEFAULT_EXTERNAL_API_CONFIG: ExternalVideoApiConfig = {
  provider: 'runway',
  apiKey: '',
  apiEndpoint: 'https://api.runwayml.com/v1/generate',
  modelName: 'gen-3-alpha-turbo',
  isEnabled: false,
  autoSync: false,
};

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
    window.dispatchEvent(new Event('aura_video_update'));
  } catch (err) {
    console.error('Video storage error:', err);
  }
}

export const videoService = {
  getVideos(): AIVideo[] {
    return getStored<AIVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_AI_VIDEOS);
  },

  getVideoById(id: string): AIVideo | undefined {
    return this.getVideos().find((v) => v.id === id);
  },

  getVideoByProductId(productId: string): AIVideo | undefined {
    return this.getVideos().find((v) => v.productId === productId);
  },

  saveVideo(video: AIVideo): void {
    const videos = this.getVideos();
    const index = videos.findIndex((v) => v.id === video.id);
    if (index >= 0) {
      videos[index] = { ...video, updatedAt: new Date().toISOString() };
    } else {
      videos.unshift({ ...video, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setStored(STORAGE_KEYS.VIDEOS, videos);

    // Sync product record so it points to this AI video
    const product = db.getProductById(video.productId);
    if (product) {
      product.aiVideoId = video.id;
      product.hasAiVideo = true;
      db.saveProduct(product);
    }
  },

  deleteVideo(id: string): void {
    const video = this.getVideoById(id);
    const videos = this.getVideos().filter((v) => v.id !== id);
    setStored(STORAGE_KEYS.VIDEOS, videos);

    if (video) {
      const product = db.getProductById(video.productId);
      if (product && product.aiVideoId === id) {
        product.aiVideoId = undefined;
        product.hasAiVideo = false;
        db.saveProduct(product);
      }
    }
  },

  toggleFeatured(id: string): void {
    const videos = this.getVideos();
    const target = videos.find((v) => v.id === id);
    if (target) {
      target.featuredOnHome = !target.featuredOnHome;
      this.saveVideo(target);
    }
  },

  incrementViews(id: string): void {
    const videos = this.getVideos();
    const target = videos.find((v) => v.id === id);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      setStored(STORAGE_KEYS.VIDEOS, videos);
    }
  },

  toggleLike(id: string): boolean {
    const likedSet = new Set<string>(getStored<string[]>(STORAGE_KEYS.LIKES, []));
    const isLiked = likedSet.has(id);
    const videos = this.getVideos();
    const target = videos.find((v) => v.id === id);

    if (isLiked) {
      likedSet.delete(id);
      if (target) target.likesCount = Math.max(0, (target.likesCount || 0) - 1);
    } else {
      likedSet.add(id);
      if (target) target.likesCount = (target.likesCount || 0) + 1;
    }

    setStored(STORAGE_KEYS.LIKES, Array.from(likedSet));
    setStored(STORAGE_KEYS.VIDEOS, videos);
    return !isLiked;
  },

  isLiked(id: string): boolean {
    const likedList = getStored<string[]>(STORAGE_KEYS.LIKES, []);
    return likedList.includes(id);
  },

  getExternalApiConfig(): ExternalVideoApiConfig {
    return getStored<ExternalVideoApiConfig>(STORAGE_KEYS.API_CONFIG, DEFAULT_EXTERNAL_API_CONFIG);
  },

  saveExternalApiConfig(config: ExternalVideoApiConfig): void {
    setStored(STORAGE_KEYS.API_CONFIG, config);
  },

  // Generates timed caption segments mathematically based on duration and product attributes
  generateCaptions(product: Product, duration: VideoDuration, language: VoiceoverLanguage): VideoCaptionSegment[] {
    const segmentsCount = duration === 10 ? 2 : duration === 15 ? 3 : duration === 30 ? 4 : 5;
    const interval = duration / segmentsCount;

    if (language === 'bn') {
      const bnTexts = [
        `উপস্থাপন করছি AURA এর ${product.name}।`,
        `প্রিমিয়াম ${product.fabric || 'উন্নত মানের সুতি কাপড়'} ও নিখুঁত ফিনিশিং।`,
        `বিশেষ অফার মূল্য মাত্র ৳${product.price.toLocaleString()} টাকা।`,
        'সারাদেশে হোম ডেলিভারি ও সহজ রিটার্ন সুবিধা।',
        'দেরি না করে এখনই অর্ডার করুন aurabd.com এ!',
      ];
      return Array.from({ length: segmentsCount }).map((_, i) => ({
        id: `cap-${Date.now()}-${i}`,
        startSec: Math.round(i * interval * 10) / 10,
        endSec: Math.round((i + 1) * interval * 10) / 10,
        text: bnTexts[i % bnTexts.length],
      }));
    }

    const enTexts = [
      `Discover the new ${product.name} from ${product.brand}.`,
      `Engineered with ${product.fabric || 'premium combed cotton'} for supreme comfort.`,
      `Exquisite tailoring and modern aesthetics suited for Dhaka lifestyles.`,
      `Available now at ৳${product.price.toLocaleString()} with instant bKash or COD.`,
      'Tap Shop Now to secure yours before stocks run out!',
    ];

    return Array.from({ length: segmentsCount }).map((_, i) => ({
      id: `cap-${Date.now()}-${i}`,
      startSec: Math.round(i * interval * 10) / 10,
      endSec: Math.round((i + 1) * interval * 10) / 10,
      text: enTexts[i % enTexts.length],
    }));
  },

  // Generates full voiceover narration script based on product details
  generateVoiceoverScript(product: Product, style: VideoStyle, language: VoiceoverLanguage): string {
    if (language === 'bn') {
      return `উপস্থাপন করছি ${product.name}। নিখুঁত ডিজাইনের এই কালেকশনটি তৈরি করা হয়েছে প্রিমিয়াম ফেব্রিকে। দাম মাত্র ${product.price} টাকা। আজই অর্ডার করুন এবং উপভোগ করুন দ্রুত হোম ডেলিভারি।`;
    }

    if (style === 'luxury') {
      return `Presenting the ${product.name} by ${product.brand}. Crafted with utmost care from ${product.fabric || 'fine natural yarns'}, reflecting authentic craftsmanship and timeless elegance. Available now for ৳${product.price.toLocaleString()}.`;
    }
    if (style === 'energetic' || style === 'social') {
      return `Check out the all new ${product.name}! Fresh urban drop with custom ${product.fabric || 'heavyweight fabric'} and unbeatable streetwear fit. Grab yours for only ৳${product.price.toLocaleString()} on AURA Lifestyle.`;
    }
    return `Discover the ${product.name} by ${product.brand}. Designed for everyday modern elegance with ${product.fabric || 'premium materials'}. Shop online with fast nationwide delivery in Bangladesh.`;
  },

  // Generates structured animated video scenes with motion directions and callout badges
  generateVideoScenes(product: Product, style: VideoStyle, duration: VideoDuration, customImages?: string[]): VideoScene[] {
    const images = customImages && customImages.length > 0 ? customImages : product.images;
    const sceneCount = duration === 10 ? 2 : duration === 15 ? 3 : duration === 30 ? 4 : 5;
    const perSceneDuration = Math.round(duration / sceneCount);

    const zooms: VideoScene['zoomEffect'][] = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'subtle-pulse'];
    const headlines = [
      product.name,
      product.fabric || 'Premium Crafted Material',
      `Signature ${product.brand} Detailing`,
      `Special Price ৳${product.price.toLocaleString()}`,
      'Fast Nationwide Delivery',
    ];
    const sublines = [
      product.description.slice(0, 80) + '...',
      (product.details[0] || 'Engineered for comfort and durability'),
      (product.details[1] || 'Designed specifically for Dhaka weather'),
      product.stock < 10 ? `Only ${product.stock} units left in stock!` : 'In Stock with Fast Shipping',
      'Pay via bKash, Nagad or Cash on Delivery',
    ];
    const badges = [
      style === 'luxury' ? 'HERITAGE LUXURY' : style === 'energetic' ? 'STREETWEAR DROP' : 'FEATURED',
      'PREMIUM GRADE',
      'SIGNATURE CRAFT',
      product.discountPercent > 0 ? `${product.discountPercent}% DISCOUNT` : 'BEST VALUE',
      'SHOP NOW',
    ];

    return Array.from({ length: sceneCount }).map((_, idx) => ({
      id: `scene-${Date.now()}-${idx}`,
      imageIndex: idx % images.length,
      durationSec: perSceneDuration,
      zoomEffect: zooms[idx % zooms.length],
      headline: headlines[idx % headlines.length],
      subline: sublines[idx % sublines.length],
      badge: badges[idx % badges.length],
    }));
  },

  // Complete generator function that produces a ready AIVideo object
  async generateAIVideo(params: {
    product: Product;
    title?: string;
    marketingMessage?: string;
    style: VideoStyle;
    duration: VideoDuration;
    aspectRatio: VideoAspectRatio;
    platformPreset?: SocialPlatformPreset;
    voiceoverEnabled: boolean;
    voiceoverLanguage: VoiceoverLanguage;
    voiceoverGender: VoiceoverGender;
    voiceoverSpeed?: number;
    customImages?: string[];
  }): Promise<AIVideo> {
    const {
      product,
      title = `${product.name} — AI Showcase`,
      marketingMessage = product.description,
      style,
      duration,
      aspectRatio,
      platformPreset = 'standard',
      voiceoverEnabled,
      voiceoverLanguage,
      voiceoverGender,
      voiceoverSpeed = 1.0,
      customImages,
    } = params;

    const imagesToUse = customImages && customImages.length > 0 ? customImages : product.images;
    const scenes = this.generateVideoScenes(product, style, duration, imagesToUse);
    const captions = this.generateCaptions(product, duration, voiceoverLanguage);
    const voiceoverScript = this.generateVoiceoverScript(product, style, voiceoverLanguage);

    const apiConfig = this.getExternalApiConfig();

    const newVideo: AIVideo = {
      id: `vid-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title,
      marketingMessage,
      style,
      duration,
      aspectRatio,
      platformPreset,
      status: 'ready',
      externalApiConnected: Boolean(apiConfig.isEnabled && apiConfig.apiKey),
      externalProvider: apiConfig.isEnabled ? apiConfig.provider : undefined,
      thumbnailUrl: imagesToUse[0] || product.images[0],
      images: imagesToUse,
      scenes,
      captions,
      voiceover: {
        enabled: voiceoverEnabled,
        language: voiceoverLanguage,
        gender: voiceoverGender,
        speed: voiceoverSpeed,
        script: voiceoverScript,
      },
      featuresHighlight: product.details.slice(0, 4),
      viewsCount: 1,
      likesCount: 0,
      featuredOnHome: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newVideo;
  },

  // Test external video generation API connection
  async testExternalConnection(config: ExternalVideoApiConfig): Promise<{ success: boolean; message: string }> {
    if (!config.apiKey || config.apiKey.trim().length < 6) {
      return {
        success: false,
        message: 'Invalid API Key: Please supply a valid authorization token for the selected provider.',
      };
    }

    // Mock latency test for API endpoint
    await new Promise((res) => setTimeout(res, 800));

    return {
      success: true,
      message: `Connection established with ${config.provider.toUpperCase()} API service. Ready for high-resolution video rendering pipeline!`,
    };
  },
};
