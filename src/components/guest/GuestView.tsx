import React, { useState } from 'react';
import { 
  Wifi, 
  Copy, 
  Check, 
  Sparkles, 
  Bell, 
  Search, 
  Flame, 
  ShieldAlert, 
  Plus, 
  ShoppingBag,
  Clock,
  ChevronRight,
  Receipt,
  Utensils
} from 'lucide-react';
import { 
  TableId, 
  MenuItem, 
  CartItem, 
  OrderTicket, 
  DishCategory,
  WaiterCall,
  ReviewSubmission
} from '../../types/restaurant';
import { INITIAL_MENU_ITEMS, RESTAURANT_WIFI } from '../../data/menuData';
import { DishModal } from './DishModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { ReviewModal } from './ReviewModal';
import { sounds } from '../../utils/audio';

interface GuestViewProps {
  tableId: TableId;
  activeOrder: OrderTicket | null;
  onPlaceOrder: (items: CartItem[]) => void;
  onCallWaiter: (reason: string) => void;
  onPayBill: (paymentDetails: {
    method: 'cash' | 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer';
    splitWays: number;
    tipAmount: number;
    finalTotal: number;
  }) => void;
  onSubmitReview: (review: ReviewSubmission) => void;
  isPhoneFrame: boolean;
  activeWaiterCall: WaiterCall | null;
}

const CATEGORIES: { id: DishCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Dishes', icon: '🍽️' },
  { id: 'karahi_mains', label: 'Karahi & Mains', icon: '🥘' },
  { id: 'bbq_tandoor', label: 'Grills & BBQ', icon: '🍢' },
  { id: 'biryani_rice', label: 'Royal Biryani', icon: '🍚' },
  { id: 'breads_sides', label: 'Naan & Sides', icon: '🫓' },
  { id: 'desserts', label: 'Desserts', icon: '🍨' },
  { id: 'drinks', label: 'Beverages', icon: '🥤' },
];

export const GuestView: React.FC<GuestViewProps> = ({
  tableId,
  activeOrder,
  onPlaceOrder,
  onCallWaiter,
  onPayBill,
  onSubmitReview,
  isPhoneFrame,
  activeWaiterCall,
}) => {
  // State
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeDishForModal, setActiveDishForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);

  // Copy Wifi password handler
  const handleCopyWifi = () => {
    navigator.clipboard.writeText(RESTAURANT_WIFI.password);
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2000);
  };

  // Add item to cart
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.menuItemId === item.menuItemId && i.portion === item.portion && i.specialInstructions === item.specialInstructions
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  // Quick add today's special
  const handleQuickAddSpecial = (dish: MenuItem) => {
    const item: CartItem = {
      id: `${dish.id}-special-${Date.now()}`,
      menuItemId: dish.id,
      name: dish.name,
      price: dish.price,
      portion: dish.portions[0]?.name || 'Small',
      quantity: 1,
      spiceLevel: dish.spiceLevel,
      specialInstructions: 'Chef recommendation',
      image: dish.image,
    };
    handleAddToCart(item);
    setIsCartOpen(true);
  };

  // Filtered dishes
  const filteredDishes = INITIAL_MENU_ITEMS.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.urduName && dish.urduName.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const specialDish = INITIAL_MENU_ITEMS.find((d) => d.id === 'dish-8') || INITIAL_MENU_ITEMS[0];

  // Helper for Order Tracker Step
  const getStepStatus = (step: 'received' | 'cooking' | 'ready' | 'served') => {
    if (!activeOrder) return 'upcoming';
    const status = activeOrder.status;
    if (step === 'received') return 'completed';
    if (step === 'cooking') {
      if (status === 'cooking') return 'current';
      if (status === 'ready' || status === 'served') return 'completed';
      return 'upcoming';
    }
    if (step === 'ready') {
      if (status === 'ready') return 'current';
      if (status === 'served') return 'completed';
      return 'upcoming';
    }
    if (step === 'served') {
      return status === 'served' ? 'completed' : 'upcoming';
    }
    return 'upcoming';
  };

  const containerContent = (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-28">
      {/* 1. Guest Top Bar */}
      <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-xs text-white shadow-md">
            T{tableId}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white">Table {tableId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">Dine-In • Live Connected</p>
          </div>
        </div>

        {/* Waiter Call Button */}
        <button
          onClick={() => setIsWaiterModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeWaiterCall && activeWaiterCall.status === 'pending'
              ? 'bg-amber-500 text-slate-950 animate-pulse shadow-lg shadow-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{activeWaiterCall && activeWaiterCall.status === 'pending' ? 'Waiter Called...' : 'Call Waiter'}</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto w-full">
        {/* 2. Step 4 in Reel: Guest Wi-Fi Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Complimentary Guest Wi-Fi
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-white mt-0.5">
                <span className="font-bold">{RESTAURANT_WIFI.ssid}</span>
                <span className="text-slate-500">•</span>
                <span className="text-orange-400">{RESTAURANT_WIFI.password}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCopyWifi}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex-shrink-0"
          >
            {wifiCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* 3. Live Order Tracker Banner (if order exists for table) */}
        {activeOrder && (
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-xs font-black tracking-wider uppercase text-orange-400">
                  Live Order #{activeOrder.orderNumber}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                Rs {activeOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Stepper (Received -> Cooking -> Ready -> Served) */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[
                { key: 'received', label: 'Received' },
                { key: 'cooking', label: 'Cooking' },
                { key: 'ready', label: 'Ready' },
                { key: 'served', label: 'Served' }
              ].map((step, idx) => {
                const status = getStepStatus(step.key as any);
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed';

                return (
                  <div key={idx} className="text-center">
                    <div 
                      className={`h-1.5 rounded-full mb-1.5 transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-orange-500 to-amber-400 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span 
                      className={`text-[10px] font-bold block truncate ${
                        isCurrent 
                          ? 'text-orange-400' 
                          : isCompleted 
                          ? 'text-emerald-400' 
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Items summary */}
            <div className="text-[11px] text-slate-400 truncate mb-3">
              {activeOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
            </div>

            {/* Action buttons on active order */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Split Bill & Pay</span>
              </button>
              <button
                onClick={() => setIsReviewOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700/80 flex items-center gap-1"
              >
                <span>⭐ Rate Us</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Step 4 in Reel: In-App Upselling Banner ("TODAY'S SPECIAL") */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={specialDish.image}
              alt={specialDish.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-amber-500/30"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Today's Special
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                {specialDish.name}
              </h4>
              <p className="text-xs font-bold text-orange-400">
                Rs {specialDish.price.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleQuickAddSpecial(specialDish)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1 flex-shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* 5. Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search dishes, karahi, naan, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* 6. Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 7. Dishes Grid (Step 2/6 in Reel) */}
        <div className="space-y-3">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setActiveDishForModal(dish)}
              className="bg-slate-900 border border-slate-800/90 hover:border-orange-500/40 rounded-2xl p-3 flex gap-3 cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-950">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {dish.isSpecial && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                    Special
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                      {dish.name}
                    </h4>
                  </div>
                  {dish.urduName && (
                    <div className="text-[11px] font-arabic text-amber-400 font-semibold">
                      {dish.urduName}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {dish.description}
                  </p>
                </div>

                {/* Badges: Spice level + Allergens + Price */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    {dish.spiceLevel > 0 && (
                      <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {dish.spiceLevel}/4
                      </span>
                    )}
                    {dish.allergens.length > 0 && (
                      <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {dish.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-orange-400">
                      Rs {dish.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      aria-label={`Customize and add ${dish.name} to order`}
                      className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-3 left-0 right-0 px-4 z-40 max-w-xl mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-2xl shadow-orange-500/40 flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span>{cartTotalCount} {cartTotalCount === 1 ? 'dish' : 'dishes'} in order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black">Rs {cartSubtotal.toLocaleString()}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Dish Customizer Modal */}
      <DishModal
        dish={activeDishForModal}
        onClose={() => setActiveDishForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        tableId={tableId}
        onUpdateQuantity={(id, qty) => {
          if (qty <= 0) {
            setCartItems((prev) => prev.filter((i) => i.id !== id));
          } else {
            setCartItems((prev) =>
              prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
            );
          }
        }}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        onSubmitOrder={() => {
          onPlaceOrder(cartItems);
          setCartItems([]);
          setIsCartOpen(false);
          sounds.playKitchenBell();
        }}
      />

      {/* Waiter Call Modal */}
      {isWaiterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
              <Bell className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Call Waiter to Table {tableId}</h3>
              <p className="text-xs text-slate-400 mt-1">
                What do you need assistance with?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                'Call Waiter',
                'Refill Water',
                'Bring Cutlery',
                'Clean Table',
                'Request Bill',
                'Special Dietary'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    onCallWaiter(reason);
                    setIsWaiterModalOpen(false);
                    sounds.playWaiterAlert();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsWaiterModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-400 pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bill & Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        order={activeOrder}
        tableId={tableId}
        onPaymentSuccess={(details) => {
          setIsCheckoutOpen(false);
          onPayBill(details);
          setIsReviewOpen(true);
        }}
      />

      {/* 1-Tap Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        tableId={tableId}
        orderId={activeOrder?.id}
        onSubmitReview={onSubmitReview}
      />
    </div>
  );

  // If Phone Frame Preview is enabled on desktop
  if (isPhoneFrame) {
    return (
      <div className="py-6 px-4 flex items-center justify-center min-h-[calc(100vh-60px)] bg-slate-950">
        <div className="w-full max-w-[420px] rounded-[44px] p-3 bg-gradient-to-b from-slate-700 to-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-slate-700 relative">
          {/* Speaker notch */}
          <div className="w-32 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
          </div>
          <div className="rounded-[36px] overflow-hidden bg-slate-950 max-h-[780px] overflow-y-auto border border-slate-800">
            {containerContent}
          </div>
          {/* Home indicator pill */}
          <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return containerContent;
};
