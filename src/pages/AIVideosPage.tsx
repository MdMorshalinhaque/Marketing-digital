import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  ShoppingBag,
  Clock,
  Volume2,
  Subtitles,
  Smartphone,
  Tv,
  ArrowRight,
  Filter,
  Eye,
  Heart,
  Share2,
  Check,
} from 'lucide-react';
import { AIVideo, Product, VideoStyle } from '../types';
import { db } from '../services/db';
import { videoService } from '../services/videoService';
import { useShop } from '../context/ShopContext';
import { ProductVideoPlayer } from '../components/video/ProductVideoPlayer';

export const AIVideosPage: React.FC = () => {
  const { navigate, addToCart, showToast } = useShop();
  const [videos, setVideos] = useState<AIVideo[]>(() => videoService.getVideos());
  const [selectedVideo, setSelectedVideo] = useState<AIVideo | null>(videos[0] || null);
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<'all' | '16:9' | '9:16'>('all');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleUpdate = () => {
      const refreshed = videoService.getVideos();
      setVideos(refreshed);
      if (selectedVideo) {
        const updated = refreshed.find((v) => v.id === selectedVideo.id);
        if (updated) setSelectedVideo(updated);
      }
    };
    window.addEventListener('aura_video_update', handleUpdate);
    return () => window.removeEventListener('aura_video_update', handleUpdate);
  }, [selectedVideo]);

  const filteredVideos = videos.filter((v) => {
    const matchesStyle = filterStyle === 'all' || v.style === filterStyle;
    const matchesFormat = filterFormat === 'all' || v.aspectRatio === filterFormat;
    return matchesStyle && matchesFormat;
  });

  const selectedProduct: Product | undefined = selectedVideo
    ? db.getProductById(selectedVideo.productId)
    : undefined;

  const handleSelectVideo = (video: AIVideo) => {
    videoService.incrementViews(video.id);
    setSelectedVideo(video);
  };

  const handleToggleLike = (video: AIVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowLiked = videoService.toggleLike(video.id);
    setLikedMap((prev) => ({ ...prev, [video.id]: isNowLiked }));
    showToast(isNowLiked ? 'Added to liked videos' : 'Removed from liked videos', 'info');
  };

  const handleQuickAdd = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size = prod.sizes.length > 0 ? prod.sizes[0] : 'Standard';
    const color = prod.colors.length > 0 ? prod.colors[0]?.name : 'Default';
    addToCart(prod, size, color, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>AURA AI REELS & VIDEO SHOWCASE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Watch. Discover. Shop in Motion.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Short, engaging AI-generated video lookbooks showcasing our contemporary Panjabis, heavyweight tees, Jamdani fusion wear, and streetwear cargo drops.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setFilterFormat('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterFormat === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFilterFormat('16:9')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                filterFormat === '16:9' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>16:9 Cinema</span>
            </button>
            <button
              onClick={() => setFilterFormat('9:16')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                filterFormat === '9:16' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Reels</span>
            </button>
          </div>

          {/* Style Filter */}
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="all">All Aesthetics</option>
            <option value="luxury">Festive & Luxury</option>
            <option value="energetic">Streetwear Drop</option>
            <option value="minimal">Minimal Handloom</option>
            <option value="social">Social Media Trending</option>
          </select>
        </div>
      </div>

      {/* Featured Video Cinema / Spotlight Module */}
      {selectedVideo && (
        <div className="bg-stone-950 rounded-3xl p-4 sm:p-8 text-white border border-stone-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Product Video Player */}
            <div className="lg:col-span-7">
              <ProductVideoPlayer
                key={selectedVideo.id}
                video={selectedVideo}
                product={selectedProduct}
                autoplay={true}
                loop={true}
              />
            </div>

            {/* Right: Product & Video Story Module */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    NOW PLAYING • {selectedVideo.duration}s
                  </span>
                  <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
                    {selectedVideo.style}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedVideo.title}
                </h2>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {selectedVideo.marketingMessage}
                </p>
              </div>

              {/* Product Quick Purchase Card */}
              {selectedProduct && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-900 border border-white/10"
                    />
                    <div className="space-y-1">
                      <div className="text-xs uppercase font-bold text-amber-400">
                        {selectedProduct.brand}
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {selectedProduct.name}
                      </h4>
                      <div className="text-base font-extrabold text-amber-300 font-mono">
                        ৳{selectedProduct.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  {selectedVideo.featuresHighlight?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedVideo.featuresHighlight.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-stone-200"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => navigate({ type: 'product-details', productId: selectedProduct.id })}
                      className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Shop This Look</span>
                    </button>

                    <button
                      onClick={(e) => handleQuickAdd(selectedProduct, e)}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Catalog Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">
            All AI Product Lookbooks ({filteredVideos.length})
          </h2>
          <span className="text-xs text-stone-500">Click any card to load into video player</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((vid) => {
            const prod = db.getProductById(vid.productId);
            const isCurrent = selectedVideo?.id === vid.id;

            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`group rounded-3xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer flex flex-col ${
                  isCurrent
                    ? 'border-amber-700 ring-2 ring-amber-700 shadow-xl'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-lg'
                }`}
              >
                {/* Media Container */}
                <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>AI VIDEO</span>
                    </span>
                    {vid.aspectRatio === '9:16' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-900/80 text-[10px] font-bold text-purple-200">
                        9:16 REEL
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-stone-200 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {vid.duration}s
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950 scale-110'
                          : 'bg-white/90 text-stone-900 group-hover:bg-amber-400 group-hover:scale-110'
                      }`}
                    >
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <p className="text-[11px] text-stone-200 line-clamp-1 italic font-medium">
                      "{vid.captions[0]?.text || vid.title}"
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {vid.marketingMessage}
                    </p>
                  </div>

                  {prod && (
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-400">Price</div>
                        <div className="text-sm font-extrabold text-stone-900 font-mono">
                          ৳{prod.price.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({ type: 'product-details', productId: prod.id });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
