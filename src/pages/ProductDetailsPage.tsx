import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Ruler,
  Share2,
  X,
  MessageSquare,
} from 'lucide-react';
import { Product, Review } from '../types';
import { useShop } from '../context/ShopContext';
import { db } from '../services/db';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  productId: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate, showToast } = useShop();
  const product = db.getProductById(productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // New review form states
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Product not found</h2>
        <p className="text-xs text-stone-500">The product you are looking for may have sold out or been removed.</p>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Set defaults
  const activeSize = selectedSize || product.sizes[0];
  const activeColor = selectedColor || product.colors[0]?.name;
  const inWishlist = isInWishlist(product.id);
  const reviews = db.getReviews(product.id);
  const allProducts = db.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, activeSize, activeColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, activeSize, activeColor, quantity);
    navigate({ type: 'checkout' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const reviewObj: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor.trim(),
      userCity: newReviewCity.trim() || 'Dhaka, Bangladesh',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 1,
    };

    db.saveReview(reviewObj);
    showToast('Thank you! Your verified review has been submitted.', 'success');
    setReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  const savings = product.originalPrice - product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-stone-500">
        <button onClick={() => navigate({ type: 'home' })} className="hover:text-stone-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button onClick={() => navigate({ type: 'shop' })} className="hover:text-stone-900">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-md">
                -{product.discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                inWishlist
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-stone-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImageIndex === idx
                      ? 'border-stone-900 shadow-md ring-1 ring-stone-900'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Options, & Checkout Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                {product.brand}
              </span>
              <button
                onClick={handleShare}
                className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-xs font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Stock pill */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-extrabold text-stone-900">{product.rating}</span>
                <span className="text-[11px] text-stone-500">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-stone-300">•</span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stock} left in Dhaka Hub)
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-stone-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              {savings > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                  Save ৳{savings.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              Inclusive of all VAT & local taxes. Eligible for cash on delivery across Bangladesh.
            </p>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-stone-800">
              <span>Color: <span className="font-normal text-stone-600">{activeColor}</span></span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`group relative p-0.5 rounded-full border-2 transition ${
                    activeColor === c.name ? 'border-stone-900 scale-110' : 'border-transparent hover:border-stone-300'
                  }`}
                  title={c.name}
                >
                  <span
                    className="block w-6 h-6 rounded-full border border-stone-300 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Size Guide Trigger */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span>Select Size</span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-amber-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide (BD)</span>
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                    activeSize === sz
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-200 bg-white rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-stone-500 hover:text-stone-900 transition"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-stone-500 hover:text-stone-900 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-800" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                id="pdp-wishlist-toggle-btn"
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : 'text-stone-500'}`} />
                <span>{inWishlist ? 'Saved in Account Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Return Information Breakdown */}
          <div className="divide-y divide-stone-100 rounded-2xl bg-white border border-stone-200 p-4 space-y-3 text-xs">
            <div className="flex items-start gap-3 pb-3">
              <Truck className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900">Bangladesh Nationwide Shipping</h5>
                <p className="text-stone-500 mt-0.5">
                  • <strong>Inside Dhaka:</strong> 24-48 Hours (৳70) <br />
                  • <strong>Outside Dhaka:</strong> 48-72 Hours (৳130) <br />
                  • <strong>FREE Delivery</strong> on all orders above ৳2,500.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 pb-3">
              <RotateCcw className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900">7-Day Doorstep Exchange Policy</h5>
                <p className="text-stone-500 mt-0.5">
                  Wrong size or fit? Our courier rider will pick up and exchange your garment right at your doorstep.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3">
              <ShieldCheck className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900">100% Authentic BD Craft Guarantee</h5>
                <p className="text-stone-500 mt-0.5">
                  Inspected & packaged at our Banani central distribution facility.
                </p>
              </div>
            </div>
          </div>

          {/* Fabric and Description */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Product Description & Fabric
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">{product.description}</p>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
              <p className="font-semibold text-stone-800">Fabric Composition:</p>
              <p className="text-stone-600 mt-0.5">{product.fabric}</p>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {product.details.map((dt, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800 flex-shrink-0" />
                  <span>{dt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold text-stone-900">Customer Reviews</h3>
            <p className="text-xs text-stone-500 mt-1">
              Verified feedback from buyers across Dhaka and Bangladesh
            </p>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{r.userName}</h5>
                    <p className="text-[11px] text-stone-500">{r.userCity}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic">"{r.comment}"</p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                  <span>Reviewed on {r.date}</span>
                  {r.verifiedPurchase && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
            No reviews yet for this garment. Be the first to review!
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-6">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSizeGuideOpen(false)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-800" />
                Standard Size Chart (Inches)
              </h4>
              <button onClick={() => setSizeGuideOpen(false)} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Measurements are in inches. For a relaxed drop-shoulder or streetwear drape, we recommend ordering your true size.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold">
                  <tr>
                    <th className="p-2 rounded-l-lg">Size</th>
                    <th className="p-2">Chest</th>
                    <th className="p-2">Length</th>
                    <th className="p-2 rounded-r-lg">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-600">
                  <tr>
                    <td className="p-2 font-bold text-stone-900">S (38)</td>
                    <td className="p-2">38 - 39"</td>
                    <td className="p-2">28"</td>
                    <td className="p-2">17.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-stone-900">M (40)</td>
                    <td className="p-2">40 - 41"</td>
                    <td className="p-2">29"</td>
                    <td className="p-2">18.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-stone-900">L (42)</td>
                    <td className="p-2">42 - 43"</td>
                    <td className="p-2">30"</td>
                    <td className="p-2">19.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-stone-900">XL (44)</td>
                    <td className="p-2">44 - 45"</td>
                    <td className="p-2">31"</td>
                    <td className="p-2">20.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-stone-900">XXL (46)</td>
                    <td className="p-2">46 - 48"</td>
                    <td className="p-2">32"</td>
                    <td className="p-2">21.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
              💡 Still unsure about sizing? WhatsApp our Dhaka fitting concierge at <strong>+880 1711-234567</strong> for personalized assistance.
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setReviewModalOpen(false)} className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="font-extrabold text-stone-900 text-base">Write a Customer Review</h4>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City / Area</label>
                <input
                  type="text"
                  value={newReviewCity}
                  onChange={(e) => setNewReviewCity(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Review Comments</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="How was the fabric, fitting, and delivery experience?"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-xs font-bold rounded-xl text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
