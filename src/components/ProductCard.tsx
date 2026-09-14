import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]?.name, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]?.name, 1);
    navigate({ type: 'checkout' });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const currentImage =
    isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate({ type: 'product-details', productId: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:border-stone-400 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              NEW DROP
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist toggle icon */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlist}
          aria-label="Toggle Wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-stone-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Stock status indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-amber-900/90 text-amber-200 text-[10px] font-bold text-center backdrop-blur-sm">
            Only {product.stock} items left in Dhaka Hub!
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1">
            <span className="uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>

          {/* Available Sizes preview */}
          <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-500 font-medium">
            <span className="text-stone-400">Sizes:</span>
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-stone-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-stone-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={handleQuickAdd}
              className="w-full py-2 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-700" />
              <span>Add to Cart</span>
            </button>
            <button
              id={`buy-now-btn-${product.id}`}
              onClick={handleBuyNow}
              className="w-full py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
