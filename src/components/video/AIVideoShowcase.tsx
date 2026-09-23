import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  ShoppingBag,
  ArrowRight,
  Clock,
  X,
  Eye,
  Heart,
  Flame,
} from 'lucide-react';
import { AIVideo, Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { videoService } from '../../services/videoService';
import { db } from '../../services/db';
import { ProductVideoPlayer } from './ProductVideoPlayer';

interface AIVideoShowcaseProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const AIVideoShowcase: React.FC<AIVideoShowcaseProps> = ({
  className = '',
  title = 'AI Video Showcase',
  subtitle = 'Experience Bangladeshi craftsmanship through short, cinematic AI-generated product videos.',
}) => {
  const { navigate, addToCart } = useShop();
  const [videos, setVideos] = useState<AIVideo[]>(() =>
    videoService.getVideos().filter((v) => v.featuredOnHome || v.status === 'ready')
  );
  const [selectedVideo, setSelectedVideo] = useState<AIVideo | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'luxury' | 'energetic' | 'social'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredVideos = activeFilter === 'all'
    ? videos
    : videos.filter((v) => v.style === activeFilter || (activeFilter === 'social' && v.aspectRatio === '9:16'));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenVideo = (video: AIVideo) => {
    videoService.incrementViews(video.id);
    setSelectedVideo(video);
  };

  const handleQuickBuy = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size = product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    const color = product.colors.length > 0 ? product.colors[0]?.name : 'Default';
    addToCart(product, size, color, 1);
  };

  return (
    <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${className}`}>
      {/* Header with Title and Carousel Nav Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>INTERACTIVE AI CATALOG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filter Pills & Nav Controls */}
        <div className="flex items-center gap-3">
          {/* Filter options */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Drops
            </button>
            <button
              onClick={() => setActiveFilter('luxury')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'luxury' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Festive & Luxury
            </button>
            <button
              onClick={() => setActiveFilter('energetic')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'energetic' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Streetwear
            </button>
            <button
              onClick={() => setActiveFilter('social')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'social' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              9:16 Reels
            </button>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-sm transition active:scale-95"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-sm transition active:scale-95"
              aria-label="Next videos"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredVideos.map((video) => {
          const product = db.getProductById(video.productId);
          if (!product) return null;

          return (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Video Thumbnail / Preview Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                <img
                  src={video.thumbnailUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                {/* AI Badge & Duration */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>AI VIDEO</span>
                  </span>
                  {video.aspectRatio === '9:16' && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/80 text-[10px] font-bold text-purple-200 border border-purple-500/30">
                      REEL 9:16
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono font-bold text-stone-200 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-stone-300" />
                  <span>{video.duration}s</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Lower caption preview */}
                <div className="absolute bottom-2.5 left-3 right-3 text-left">
                  <p className="text-[11px] text-stone-200 line-clamp-1 font-medium italic">
                    "{video.captions[0]?.text || video.marketingMessage}"
                  </p>
                </div>
              </div>

              {/* Product Info & Action Card */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-left">
                  <div className="text-[11px] uppercase font-bold text-amber-700 tracking-wider">
                    {product.brand}
                  </div>
                  <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {video.marketingMessage || product.description}
                  </p>
                </div>

                {/* Price & Shop CTA */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400">Price</div>
                    <div className="text-base font-extrabold text-stone-900 font-mono">
                      ৳{product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ type: 'product-details', productId: product.id });
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={(e) => handleQuickBuy(product, e)}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Videos Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate({ type: 'ai-videos' })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition shadow-sm"
        >
          <span>Explore All AI Product Videos ({videos.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white backdrop-blur-md transition border border-white/10"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <ProductVideoPlayer
              video={selectedVideo}
              product={db.getProductById(selectedVideo.productId)}
              autoplay={true}
              loop={true}
              onShopClick={() => {
                const prod = db.getProductById(selectedVideo.productId);
                if (prod) {
                  setSelectedVideo(null);
                  navigate({ type: 'product-details', productId: prod.id });
                }
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
