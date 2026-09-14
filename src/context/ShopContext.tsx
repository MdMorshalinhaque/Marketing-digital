import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon, User, PageView } from '../types';
import { db } from '../services/db';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ShopContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  selectedDeliveryCharge: number;
  setSelectedDeliveryCharge: (charge: number) => void;
  selectedDeliveryId: string;
  setSelectedDeliveryId: (id: string) => void;
  cartTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;

  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveToCart: (productId: string, size?: string, color?: string) => void;
  moveAllWishlistToCart: () => void;
  isInWishlist: (productId: string) => boolean;

  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  currentView: PageView;
  navigate: (view: PageView) => void;

  currentUser: User;
  switchUser: (role: 'customer' | 'admin') => void;
  updateUserProfile: (user: User) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => db.getCurrentUser());

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const user = db.getCurrentUser();
    return db.getUserWishlist(user.id);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedDeliveryCharge, setSelectedDeliveryCharge] = useState<number>(70); // Inside Dhaka default
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('del-std-dhaka');
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<PageView>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // When active user account changes, synchronize their specific wishlist
  useEffect(() => {
    if (currentUser?.id) {
      const userWishlist = db.getUserWishlist(currentUser.id);
      setWishlist(userWishlist);
    }
  }, [currentUser?.id]);

  // Persist wishlist linked to current user account
  useEffect(() => {
    if (currentUser?.id) {
      db.saveUserWishlist(currentUser.id, wishlist);
    }
  }, [wishlist, currentUser?.id]);

  // Listen to DB updates
  useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentUserState(db.getCurrentUser());
    };
    window.addEventListener('aura_db_update', handleDbUpdate);
    return () => window.removeEventListener('aura_db_update', handleDbUpdate);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const chosenSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const chosenColor = color || (product.colors.length > 0 ? product.colors[0].name : 'Default');
    const cartItemId = `${product.id}_${chosenSize}_${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" (${chosenSize}) to cart`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from shopping cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from wishlist', 'info');
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist has been cleared', 'info');
  };

  const moveToCart = (productId: string, size?: string, color?: string) => {
    const product = db.getProductById(productId);
    if (!product) return;
    const chosenSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const chosenColor = color || (product.colors.length > 0 ? product.colors[0]?.name : 'Default');
    addToCart(product, chosenSize, chosenColor, 1);
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast(`Moved "${product.name}" to shopping cart!`, 'success');
  };

  const moveAllWishlistToCart = () => {
    const products = wishlist
      .map((id) => db.getProductById(id))
      .filter((p): p is Product => Boolean(p));

    if (products.length === 0) return;

    products.forEach((product) => {
      const chosenSize = product.sizes.length > 0 ? product.sizes[0] : 'Standard';
      const chosenColor = product.colors.length > 0 ? product.colors[0]?.name : 'Default';
      addToCart(product, chosenSize, chosenColor, 1);
    });

    setWishlist([]);
    showToast(`Moved ${products.length} item${products.length > 1 ? 's' : ''} to cart!`, 'success');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const freeShippingThreshold = 2500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      const raw = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      discountAmount = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Delivery fee waiver if coupon FREEDEL or if cartSubtotal >= freeShippingThreshold
  const finalDeliveryCharge =
    appliedCoupon?.code === 'FREEDEL' || cartSubtotal >= freeShippingThreshold
      ? 0
      : selectedDeliveryCharge;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + finalDeliveryCharge);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const available = db.getCoupons().filter((c) => c.isActive);
    const found = available.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo coupon code.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum order of ৳${found.minOrderValue.toLocaleString()}. (Current: ৳${cartSubtotal.toLocaleString()})`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied! You saved ৳${found.discountType === 'percentage' ? `${found.discountValue}%` : found.discountValue}`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const navigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchUser = (role: 'customer' | 'admin') => {
    const users = db.getUsers();
    const target = users.find((u) => u.role === role);
    if (target) {
      db.setCurrentUser(target);
      setCurrentUserState(target);
      showToast(`Switched account to: ${target.name} (${role.toUpperCase()})`, 'info');
    }
  };

  const updateUserProfile = (updated: User) => {
    db.saveUser(updated);
    setCurrentUserState(updated);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        selectedDeliveryCharge: finalDeliveryCharge,
        setSelectedDeliveryCharge,
        selectedDeliveryId,
        setSelectedDeliveryId,
        cartTotal,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        moveAllWishlistToCart,
        isInWishlist,
        cartDrawerOpen,
        setCartDrawerOpen,
        currentView,
        navigate,
        currentUser,
        switchUser,
        updateUserProfile,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within a ShopProvider');
  return ctx;
};
