import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Minimize,
  Subtitles,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Share2,
  Check,
  Zap,
} from 'lucide-react';
import { AIVideo, Product, VideoScene } from '../../types';
import { useShop } from '../../context/ShopContext';
import { videoService } from '../../services/videoService';

interface ProductVideoPlayerProps {
  video: AIVideo;
  product?: Product;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  onShopClick?: () => void;
  overrideAspectRatio?: '16:9' | '9:16' | '1:1';
}

export const ProductVideoPlayer: React.FC<ProductVideoPlayerProps> = ({
  video,
  product,
  autoplay = false,
  loop = false,
  className = '',
  onShopClick,
  overrideAspectRatio,
}) => {
  const { addToCart, showToast, navigate } = useShop();

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // in seconds
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(video.voiceover?.enabled ?? true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(video.voiceover?.speed || 1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHoveringControls, setIsHoveringControls] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const duration = video.duration || 15;
  const aspectRatio = overrideAspectRatio || video.aspectRatio || '16:9';

  // Find active scene based on currentTime
  const currentScene: VideoScene = useMemo(() => {
    if (!video.scenes || video.scenes.length === 0) {
      return {
        id: 'sc-default',
        imageIndex: 0,
        durationSec: duration,
        zoomEffect: 'zoom-in',
        headline: video.title || video.productName,
        subline: video.marketingMessage,
        badge: 'AI PRODUCT VIDEO',
      };
    }
    const sceneDuration = duration / video.scenes.length;
    const sceneIndex = Math.min(
      Math.floor(currentTime / sceneDuration),
      video.scenes.length - 1
    );
    return video.scenes[sceneIndex] || video.scenes[0];
  }, [currentTime, duration, video.scenes, video.title, video.productName, video.marketingMessage]);

  // Current active caption
  const activeCaption = useMemo(() => {
    if (!captionsEnabled || !video.captions) return null;
    return video.captions.find(
      (c) => currentTime >= c.startSec && currentTime <= c.endSec
    );
  }, [currentTime, captionsEnabled, video.captions]);

  // Active image
  const currentImage = useMemo(() => {
    const images = video.images && video.images.length > 0 ? video.images : [video.thumbnailUrl];
    return images[currentScene.imageIndex % images.length] || video.thumbnailUrl;
  }, [video.images, video.thumbnailUrl, currentScene.imageIndex]);

  // Setup Web Speech Synthesis for Voiceover
  const speakNarration = () => {
    if (!voiceoverEnabled || isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const script = video.voiceover?.script || video.marketingMessage;
    if (!script) return;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (video.voiceover.language === 'bn') {
        const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        const preferred = voices.find((v) =>
          video.voiceover.gender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george')
        );
        if (preferred) utterance.voice = preferred;
      }
    }

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying && !isEnded) {
      const step = 0.05; // 50ms interval for smooth progression
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + step * playbackSpeed;
          if (next >= duration) {
            if (loop) {
              speakNarration();
              return 0;
            }
            setIsPlaying(false);
            setIsEnded(true);
            stopNarration();
            return duration;
          }
          return next;
        });
      }, 50);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, isEnded, duration, loop, playbackSpeed]);

  // Voiceover triggers on play/pause/mute
  useEffect(() => {
    if (isPlaying && !isEnded && !isMuted && voiceoverEnabled) {
      if (currentTime < 1) {
        speakNarration();
      }
    } else {
      stopNarration();
    }

    return () => {
      stopNarration();
    };
  }, [isPlaying, isMuted, voiceoverEnabled]);

  const handlePlayPause = () => {
    if (isEnded) {
      setCurrentTime(0);
      setIsEnded(false);
      setIsPlaying(true);
      speakNarration();
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      stopNarration();
    } else {
      setIsPlaying(true);
      if (currentTime === 0) {
        videoService.incrementViews(video.id);
      }
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsEnded(false);
    setIsPlaying(true);
    speakNarration();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = progress * duration;
    setCurrentTime(newTime);
    if (isEnded) {
      setIsEnded(false);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (isPlaying) speakNarration();
    } else {
      setIsMuted(true);
      stopNarration();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Video link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleQuickAdd = () => {
    if (product) {
      const size = product.sizes.length > 0 ? product.sizes[0] : 'Standard';
      const color = product.colors.length > 0 ? product.colors[0]?.name : 'Default';
      addToCart(product, size, color, 1);
    } else if (onShopClick) {
      onShopClick();
    } else {
      navigate({ type: 'product-details', productId: video.productId });
    }
  };

  // Zoom / Pan CSS animation calculation based on currentTime
  const progressRatio = (currentTime % (duration / (video.scenes?.length || 1))) / (duration / (video.scenes?.length || 1));
  const getMotionTransform = (zoomEffect: VideoScene['zoomEffect']) => {
    switch (zoomEffect) {
      case 'zoom-in':
        return `scale(${1 + progressRatio * 0.12})`;
      case 'zoom-out':
        return `scale(${1.12 - progressRatio * 0.1})`;
      case 'pan-left':
        return `scale(1.08) translateX(${-progressRatio * 4}%)`;
      case 'pan-right':
        return `scale(1.08) translateX(${progressRatio * 4}%)`;
      case 'subtle-pulse':
        return `scale(${1 + Math.sin(progressRatio * Math.PI) * 0.06})`;
      default:
        return 'scale(1.04)';
    }
  };

  // Style-specific styling classes
  const styleConfig = useMemo(() => {
    switch (video.style) {
      case 'luxury':
        return {
          badgeBg: 'bg-stone-950/85 text-amber-300 border-amber-400/40',
          accentColor: 'text-amber-400',
          progressBar: 'bg-amber-400',
          fontHeadline: 'font-serif tracking-tight',
        };
      case 'energetic':
        return {
          badgeBg: 'bg-red-600 text-white border-red-500',
          accentColor: 'text-red-400',
          progressBar: 'bg-red-500',
          fontHeadline: 'font-black tracking-tighter uppercase',
        };
      case 'minimal':
        return {
          badgeBg: 'bg-stone-900/80 text-stone-200 border-stone-700',
          accentColor: 'text-stone-300',
          progressBar: 'bg-stone-200',
          fontHeadline: 'font-sans font-medium tracking-normal',
        };
      case 'social':
        return {
          badgeBg: 'bg-purple-900/90 text-purple-200 border-purple-500/40',
          accentColor: 'text-purple-300',
          progressBar: 'bg-purple-400',
          fontHeadline: 'font-bold tracking-tight',
        };
      default:
        return {
          badgeBg: 'bg-stone-900/80 text-amber-400 border-amber-400/30',
          accentColor: 'text-amber-400',
          progressBar: 'bg-amber-400',
          fontHeadline: 'font-bold',
        };
    }
  }, [video.style]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoveringControls(true)}
      onMouseLeave={() => setIsHoveringControls(false)}
      className={`relative rounded-3xl overflow-hidden bg-stone-950 text-white select-none group shadow-xl ${
        aspectRatio === '9:16'
          ? 'aspect-[9/16] max-w-[380px] mx-auto'
          : aspectRatio === '1:1'
          ? 'aspect-square'
          : 'aspect-[16/9]'
      } ${className}`}
    >
      {/* 1. Video Canvas / Animated Media Layer */}
      <div className="absolute inset-0 overflow-hidden bg-stone-950">
        {video.videoUrl ? (
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            autoPlay={autoplay}
            loop={loop}
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            {/* Visual product frame with smooth hardware-accelerated zoom */}
            <img
              src={currentImage}
              alt={video.productName}
              style={{
                transform: getMotionTransform(currentScene.zoomEffect),
                transition: 'transform 0.08s linear',
              }}
              className="w-full h-full object-cover object-center will-change-transform filter brightness-95"
            />

            {/* Subtle cinematic gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/40 pointer-events-none" />

            {/* Social media format badges for 9:16 */}
            {aspectRatio === '9:16' && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-stone-200 border border-white/10 uppercase">
                  {video.platformPreset === 'tiktok'
                    ? 'TikTok Reel'
                    : video.platformPreset === 'instagram'
                    ? 'Instagram Reel'
                    : video.platformPreset === 'youtube_shorts'
                    ? 'YouTube Short'
                    : 'Vertical Video'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* AI Video Badge */}
          <div
            title="Generated with AI Product Motion & Voiceover"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-400 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide text-[11px]">AI VIDEO</span>
          </div>

          {currentScene.badge && (
            <span
              className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-md ${styleConfig.badgeBg}`}
            >
              {currentScene.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share Video"
            className="w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md transition border border-white/10"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Mute Toggle in top right for instant ease */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md transition border border-white/10"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. Center Interactive Tap / Play Trigger */}
      <div
        onClick={handlePlayPause}
        className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
      >
        {(!isPlaying || isEnded) && (
          <button
            aria-label={isEnded ? 'Replay' : 'Play'}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-950/80 hover:bg-amber-400 text-amber-400 hover:text-stone-950 flex items-center justify-center backdrop-blur-md border border-amber-400/40 shadow-2xl transition-all duration-300 transform hover:scale-110 group-hover:opacity-100"
          >
            {isEnded ? (
              <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
            )}
          </button>
        )}
      </div>

      {/* 4. Dynamic Lower-Third & Storyline Overlay */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 px-4 sm:px-6 pointer-events-none z-20 space-y-2">
        {/* Active Scene Headline */}
        <div className="space-y-1 transition-all duration-300">
          <div className="inline-block px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] tracking-widest uppercase font-bold text-amber-400">
            {video.productName}
          </div>
          <h3 className={`text-lg sm:text-2xl text-white drop-shadow-md leading-tight ${styleConfig.fontHeadline}`}>
            {currentScene.headline}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 drop-shadow line-clamp-2 max-w-lg">
            {currentScene.subline}
          </p>
        </div>

        {/* Live Synchronized Subtitles / Captions */}
        {activeCaption && captionsEnabled && (
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-stone-100 font-medium shadow-lg animate-in fade-in duration-200">
              <Subtitles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeCaption.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modern Bottom Player Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent transition-opacity duration-200 z-30 ${
          isHoveringControls || !isPlaying || isEnded ? 'opacity-100' : 'opacity-0 sm:opacity-90'
        }`}
      >
        {/* Scrubbing Progress Bar */}
        <div
          onClick={handleSeek}
          className="relative w-full h-1.5 sm:h-2 bg-stone-800/80 hover:h-2.5 rounded-full cursor-pointer transition-all duration-150 mb-3 group/bar"
        >
          {/* Progress fill */}
          <div
            style={{ width: `${(currentTime / duration) * 100}%` }}
            className={`h-full rounded-full relative transition-all duration-75 ${styleConfig.progressBar}`}
          >
            {/* Scrubber thumb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-stone-900 scale-0 group-hover/bar:scale-100 transition-transform" />
          </div>
        </div>

        {/* Control Bar Actions */}
        <div className="flex items-center justify-between text-xs text-stone-300">
          {/* Left Controls: Play, Replay, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="p-1.5 hover:text-white transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-1.5 hover:text-white transition"
              title="Replay from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 hover:text-white transition flex items-center gap-1"
              title={isMuted ? 'Unmute voiceover' : 'Mute voiceover'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-stone-200" />}
            </button>

            {/* Timecode */}
            <span className="font-mono text-[11px] text-stone-400 tabular-nums">
              0:{Math.floor(currentTime).toString().padStart(2, '0')} / 0:{duration.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Right Controls: CC, Speed, Shop CTA, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Captions Toggle */}
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              title={captionsEnabled ? 'Turn captions off' : 'Turn captions on'}
              className={`p-1.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                captionsEnabled ? 'text-amber-400 bg-white/10' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CC</span>
            </button>

            {/* Speed Toggle */}
            <button
              onClick={() => {
                const speeds = [0.8, 1.0, 1.25, 1.5];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              title="Change playback speed"
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-stone-200 transition"
            >
              {playbackSpeed}x
            </button>

            {/* Quick Instant Buy / Shop Button */}
            <button
              onClick={handleQuickAdd}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Shop Now</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-white transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
