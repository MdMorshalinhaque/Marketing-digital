import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Play,
  RotateCcw,
  Check,
  Upload,
  Plus,
  Trash2,
  Volume2,
  Subtitles,
  Sliders,
  Settings,
  Share2,
  ExternalLink,
  Layers,
  Clock,
  Tv,
  Smartphone,
  Square,
  AlertCircle,
  HelpCircle,
  Save,
  Wand2,
} from 'lucide-react';
import {
  AIVideo,
  ExternalVideoApiConfig,
  Product,
  SocialPlatformPreset,
  VideoAspectRatio,
  VideoCaptionSegment,
  VideoDuration,
  VideoStyle,
  VoiceoverGender,
  VoiceoverLanguage,
} from '../../types';
import { db } from '../../services/db';
import { videoService } from '../../services/videoService';
import { ProductVideoPlayer } from './ProductVideoPlayer';

interface AIVideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (video: AIVideo) => void;
  initialProductId?: string;
  initialVideo?: AIVideo | null;
}

export const AIVideoGeneratorModal: React.FC<AIVideoGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialProductId,
  initialVideo,
}) => {
  const products = db.getProducts();

  // Generator form state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialVideo?.productId || initialProductId || (products[0]?.id ?? '')
  );
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const [title, setTitle] = useState<string>(
    initialVideo?.title || (selectedProduct ? `${selectedProduct.name} — AI Showcase` : '')
  );
  const [marketingMessage, setMarketingMessage] = useState<string>(
    initialVideo?.marketingMessage || selectedProduct?.description || ''
  );
  const [videoStyle, setVideoStyle] = useState<VideoStyle>(initialVideo?.style || 'luxury');
  const [duration, setDuration] = useState<VideoDuration>(initialVideo?.duration || 15);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(initialVideo?.aspectRatio || '16:9');
  const [platformPreset, setPlatformPreset] = useState<SocialPlatformPreset>(
    initialVideo?.platformPreset || 'standard'
  );

  // Selected Images
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialVideo?.images || selectedProduct?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // Voiceover settings
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(initialVideo?.voiceover?.enabled ?? true);
  const [voiceoverLang, setVoiceoverLang] = useState<VoiceoverLanguage>(initialVideo?.voiceover?.language || 'en');
  const [voiceoverGender, setVoiceoverGender] = useState<VoiceoverGender>(initialVideo?.voiceover?.gender || 'female');
  const [voiceoverSpeed, setVoiceoverSpeed] = useState<number>(initialVideo?.voiceover?.speed || 1.0);
  const [voiceoverScript, setVoiceoverScript] = useState<string>(
    initialVideo?.voiceover?.script || (selectedProduct ? videoService.generateVoiceoverScript(selectedProduct, videoStyle, voiceoverLang) : '')
  );

  // Captions
  const [captions, setCaptions] = useState<VideoCaptionSegment[]>(
    initialVideo?.captions || (selectedProduct ? videoService.generateCaptions(selectedProduct, duration, voiceoverLang) : [])
  );

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatusText, setGenerationStatusText] = useState<string>('');
  const [previewVideo, setPreviewVideo] = useState<AIVideo | null>(initialVideo || null);

  // External API Config Modal/Drawer Tab
  const [showApiConfig, setShowApiConfig] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<ExternalVideoApiConfig>(() => videoService.getExternalApiConfig());
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);

  // Active subtab in generator
  const [activeTab, setActiveTab] = useState<'basics' | 'media' | 'voiceover' | 'captions' | 'api'>('basics');

  // Update defaults when selected product changes
  useEffect(() => {
    if (selectedProduct && !initialVideo) {
      setTitle(`${selectedProduct.name} — AI Showcase`);
      setMarketingMessage(selectedProduct.description);
      setSelectedImages(selectedProduct.images);
      const newScript = videoService.generateVoiceoverScript(selectedProduct, videoStyle, voiceoverLang);
      setVoiceoverScript(newScript);
      const newCaps = videoService.generateCaptions(selectedProduct, duration, voiceoverLang);
      setCaptions(newCaps);
    }
  }, [selectedProductId]);

  if (!isOpen) return null;

  // Handle AI Auto-generate script
  const handleAutoGenerateScript = () => {
    if (!selectedProduct) return;
    const newScript = videoService.generateVoiceoverScript(selectedProduct, videoStyle, voiceoverLang);
    setVoiceoverScript(newScript);
    const newCaps = videoService.generateCaptions(selectedProduct, duration, voiceoverLang);
    setCaptions(newCaps);
  };

  // Add custom image url
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setSelectedImages([...selectedImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Remove image from video sequence
  const handleRemoveImage = (index: number) => {
    if (selectedImages.length <= 1) return;
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  // Add caption row
  const handleAddCaption = () => {
    const lastCap = captions[captions.length - 1];
    const newStart = lastCap ? lastCap.endSec : 0;
    const newEnd = Math.min(duration, newStart + 4);
    const newCap: VideoCaptionSegment = {
      id: `cap-${Date.now()}`,
      startSec: newStart,
      endSec: newEnd,
      text: 'New promotional highlight for this product.',
    };
    setCaptions([...captions, newCap]);
  };

  // Edit caption text
  const handleUpdateCaption = (id: string, text: string) => {
    setCaptions(captions.map((c) => (c.id === id ? { ...c, text } : c)));
  };

  // Remove caption
  const handleRemoveCaption = (id: string) => {
    setCaptions(captions.filter((c) => c.id !== id));
  };

  // Test voice speech synthesis
  const handleTestSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voiceoverScript);
    utterance.rate = voiceoverSpeed;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voiceoverLang === 'bn') {
        const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        const preferred = voices.find((v) =>
          voiceoverGender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')
        );
        if (preferred) utterance.voice = preferred;
      }
    }
    window.speechSynthesis.speak(utterance);
  };

  // Test external API
  const handleTestApi = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    try {
      const res = await videoService.testExternalConnection(apiConfig);
      setApiTestResult(res);
      if (res.success) {
        videoService.saveExternalApiConfig(apiConfig);
      }
    } catch {
      setApiTestResult({ success: false, message: 'Connection test timed out.' });
    } finally {
      setIsTestingApi(false);
    }
  };

  // Generate Video Pipeline
  const handleGenerateVideo = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStatusText('Analyzing product visuals & silhouette...');

    // Progress simulation for AI pipeline
    await new Promise((r) => setTimeout(r, 450));
    setGenerationProgress(40);
    setGenerationStatusText('Synthesizing camera zoom keyframes and transitions...');

    await new Promise((r) => setTimeout(r, 450));
    setGenerationProgress(75);
    setGenerationStatusText('Aligning captions and voiceover narration tempo...');

    await new Promise((r) => setTimeout(r, 400));
    setGenerationProgress(95);
    setGenerationStatusText('Finalizing video presentation container...');

    await new Promise((r) => setTimeout(r, 300));

    const generated = await videoService.generateAIVideo({
      product: selectedProduct,
      title,
      marketingMessage,
      style: videoStyle,
      duration,
      aspectRatio,
      platformPreset,
      voiceoverEnabled,
      voiceoverLanguage: voiceoverLang,
      voiceoverGender,
      voiceoverSpeed,
      customImages: selectedImages,
    });

    // Overwrite customized voiceover script and captions if edited
    generated.voiceover.script = voiceoverScript;
    generated.captions = captions;

    setPreviewVideo(generated);
    setIsGenerating(false);
    setGenerationProgress(100);
  };

  // Save Video to Database & Product Page
  const handleSaveToProduct = () => {
    if (!previewVideo) return;
    videoService.saveVideo(previewVideo);
    onSaved(previewVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span>AI Video Generator</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {apiConfig.isEnabled ? `${apiConfig.provider.toUpperCase()} API` : 'PRO ENGINE'}
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Generate high-converting product promotional videos with voiceover, captions, and zoom motion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('api')}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'api'
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              title="External Video API Settings"
            >
              <Settings className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">API Config</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-200 bg-white overflow-x-auto text-xs font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('basics')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'basics' ? 'border-amber-800 text-stone-900 font-bold' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Product & Style</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'media' ? 'border-amber-800 text-stone-900 font-bold' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Photos & Angles ({selectedImages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('voiceover')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'voiceover' ? 'border-amber-800 text-stone-900 font-bold' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>3. AI Voiceover</span>
          </button>
          <button
            onClick={() => setActiveTab('captions')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'captions' ? 'border-amber-800 text-stone-900 font-bold' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>4. Subtitles ({captions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'api' ? 'border-amber-800 text-stone-900 font-bold' : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>5. External API Bridge</span>
          </button>
        </div>

        {/* Modal Main Body (Split Grid: Left Form Controls / Right Live Video Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* TAB 1: BASICS & STYLE */}
            {activeTab === 'basics' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Product Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Select Target Product
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ৳{p.price.toLocaleString()} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Video Title & Campaign Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Noir Luxe Heritage Panjabi — Festive Drop"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                {/* Video Description / Marketing Message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Marketing Message / Hook
                    </label>
                    <button
                      onClick={handleAutoGenerateScript}
                      className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Auto-Generate with AI</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={marketingMessage}
                    onChange={(e) => setMarketingMessage(e.target.value)}
                    placeholder="Key highlights, fabric details, occasion, and call to action..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                {/* Video Style Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Video Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'luxury', label: 'Luxury', desc: 'Serif, slow zooms, cinematic gold tones' },
                      { id: 'energetic', label: 'Energetic', desc: 'Fast cuts, bold typography, streetwear' },
                      { id: 'minimal', label: 'Minimal', desc: 'Clean, architectural, subtle transitions' },
                      { id: 'professional', label: 'Professional', desc: 'Balanced catalog, commercial grade' },
                      { id: 'social', label: 'Social Media', desc: 'Trendy, high engagement, punchy callouts' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setVideoStyle(st.id as VideoStyle)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                          videoStyle === st.id
                            ? 'bg-amber-50 border-amber-700 ring-1 ring-amber-700'
                            : 'bg-stone-50 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold text-stone-900 capitalize">{st.label}</span>
                        <span className="text-[10px] text-stone-500 mt-1 leading-tight">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Aspect Ratio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Duration
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {([10, 15, 30, 60] as VideoDuration[]).map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold transition border ${
                            duration === dur
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                          }`}
                        >
                          {dur}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio / Format */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Format / Target Platform
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAspectRatio('16:9');
                          setPlatformPreset('standard');
                        }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition border flex items-center justify-center gap-1 ${
                          aspectRatio === '16:9'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>16:9 Wide</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAspectRatio('9:16');
                          setPlatformPreset('instagram');
                        }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition border flex items-center justify-center gap-1 ${
                          aspectRatio === '9:16'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>9:16 Reel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAspectRatio('1:1');
                          setPlatformPreset('standard');
                        }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition border flex items-center justify-center gap-1 ${
                          aspectRatio === '1:1'
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>1:1 Square</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Media Preset when 9:16 is chosen */}
                {aspectRatio === '9:16' && (
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1.5">
                      Social Media Optimization Preset
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'instagram', label: 'Instagram Reels' },
                        { id: 'tiktok', label: 'TikTok' },
                        { id: 'youtube_shorts', label: 'YouTube Shorts' },
                        { id: 'facebook', label: 'Facebook Stories' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setPlatformPreset(preset.id as SocialPlatformPreset)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            platformPreset === preset.id
                              ? 'bg-purple-900 text-white shadow-sm'
                              : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-100/50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MEDIA & ANGLES */}
            {activeTab === 'media' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Product Angle Sequence</h3>
                    <p className="text-xs text-stone-500">
                      The AI camera smoothly pans and zooms between these verified product images.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group shadow-sm"
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold">
                        Scene #{idx + 1}
                      </div>
                      {selectedImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Custom Image */}
                <div className="pt-3 border-t border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Add High-Resolution Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or cloud storage URL"
                      className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Angle</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AI VOICEOVER */}
            {activeTab === 'voiceover' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Enable AI Narration</div>
                      <div className="text-[11px] text-stone-500">Play spoken product commentary synchronized with video motion</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={voiceoverEnabled}
                      onChange={(e) => setVoiceoverEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>

                {voiceoverEnabled && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      {/* Language */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Language</label>
                        <select
                          value={voiceoverLang}
                          onChange={(e) => setVoiceoverLang(e.target.value as VoiceoverLanguage)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                        >
                          <option value="en">English (Global)</option>
                          <option value="bn">বাংলা (Bengali)</option>
                          <option value="hi">हिन्दी (Hindi)</option>
                        </select>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Voice Gender</label>
                        <select
                          value={voiceoverGender}
                          onChange={(e) => setVoiceoverGender(e.target.value as VoiceoverGender)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                        >
                          <option value="female">Female (Warm & Clear)</option>
                          <option value="male">Male (Deep & Narrative)</option>
                        </select>
                      </div>

                      {/* Speed */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Speaking Speed</label>
                        <select
                          value={voiceoverSpeed}
                          onChange={(e) => setVoiceoverSpeed(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-semibold"
                        >
                          <option value="0.85">0.85x (Relaxed Luxury)</option>
                          <option value="1.0">1.0x (Natural Pace)</option>
                          <option value="1.15">1.15x (Energetic)</option>
                          <option value="1.25">1.25x (Fast Social)</option>
                        </select>
                      </div>
                    </div>

                    {/* Narration Script Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-stone-700">Narration Script</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAutoGenerateScript}
                            className="text-xs text-amber-800 hover:text-amber-900 font-semibold"
                          >
                            Regenerate
                          </button>
                          <button
                            type="button"
                            onClick={handleTestSpeech}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Preview Voice</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        value={voiceoverScript}
                        onChange={(e) => setVoiceoverScript(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs leading-relaxed text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SUBTITLES & CAPTIONS */}
            {activeTab === 'captions' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Synchronized Captions</h3>
                    <p className="text-xs text-stone-500">Edit subtitle timestamps and text before publishing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCaption}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Caption Line</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {captions.map((cap, i) => (
                    <div
                      key={cap.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3"
                    >
                      <span className="px-2 py-1 rounded bg-stone-200 font-mono text-[10px] font-bold text-stone-700 shrink-0">
                        {cap.startSec}s–{cap.endSec}s
                      </span>
                      <input
                        type="text"
                        value={cap.text}
                        onChange={(e) => handleUpdateCaption(cap.id, e.target.value)}
                        className="flex-1 bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCaption(cap.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: EXTERNAL API BRIDGE */}
            {activeTab === 'api' && (
              <div className="space-y-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">External AI Video Generation Architecture</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                      Connect high-performance generative video endpoints (Runway Gen-3, Luma Dream Machine, Kling AI, Google Veo) or use our built-in canvas presentation engine.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Provider</label>
                      <select
                        value={apiConfig.provider}
                        onChange={(e) =>
                          setApiConfig({ ...apiConfig, provider: e.target.value as ExternalVideoApiConfig['provider'] })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                      >
                        <option value="runway">RunwayML (Gen-3 Alpha Turbo)</option>
                        <option value="luma">Luma Dream Machine API</option>
                        <option value="kling">Kling AI Video v1.5</option>
                        <option value="veo">Google Veo 3.1 Lite</option>
                        <option value="custom">Custom Webhook / Video Server</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Model Preset</label>
                      <input
                        type="text"
                        value={apiConfig.modelName || ''}
                        onChange={(e) => setApiConfig({ ...apiConfig, modelName: e.target.value })}
                        placeholder="e.g. gen-3-alpha-turbo"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">API Key / Bearer Token</label>
                    <input
                      type="password"
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                      placeholder="sk_live_..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={apiConfig.isEnabled}
                        onChange={(e) => setApiConfig({ ...apiConfig, isEnabled: e.target.checked })}
                        className="rounded text-stone-900"
                      />
                      <span>Enable External Video Synthesis</span>
                    </label>

                    <button
                      type="button"
                      disabled={isTestingApi}
                      onClick={handleTestApi}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition disabled:opacity-50"
                    >
                      {isTestingApi ? 'Connecting...' : 'Test Connection'}
                    </button>
                  </div>

                  {apiTestResult && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        apiTestResult.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {apiTestResult.success ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{apiTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar (Generate button) */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ready to synthesize {duration}s video</span>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateVideo}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs transition flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Rendering Video ({generationProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>{previewVideo ? 'Regenerate Video' : 'Generate AI Video'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Video Preview Player & Save Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Live Player Preview
                </span>
                {previewVideo && (
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    ✓ Render Ready
                  </span>
                )}
              </div>

              {/* Player Container */}
              {isGenerating ? (
                <div className="aspect-[16/9] rounded-3xl bg-stone-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 shadow-inner">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30 animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-stone-100">{generationStatusText}</div>
                    <div className="text-xs text-stone-400 font-mono">{generationProgress}% Completed</div>
                  </div>
                  <div className="w-48 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${generationProgress}%` }}
                      className="h-full bg-amber-400 transition-all duration-300"
                    />
                  </div>
                </div>
              ) : previewVideo ? (
                <div className="space-y-3">
                  <ProductVideoPlayer
                    video={previewVideo}
                    product={selectedProduct}
                    autoplay={true}
                    loop={true}
                    overrideAspectRatio={aspectRatio}
                  />

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1 text-xs text-stone-600">
                    <div className="flex items-center justify-between font-semibold text-stone-900">
                      <span>{previewVideo.title}</span>
                      <span className="font-mono">{previewVideo.duration}s</span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {previewVideo.voiceover?.script}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleGenerateVideo}
                  className="aspect-[16/9] rounded-3xl bg-stone-100 border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-200 group-hover:bg-amber-400 text-stone-700 group-hover:text-stone-950 flex items-center justify-center transition mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-800">No Preview Generated Yet</h4>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Click "Generate AI Video" to process images, voiceover, and animations for this product.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Final Save Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!previewVideo || isGenerating}
                onClick={handleSaveToProduct}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save to Product Page</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
