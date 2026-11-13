import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { CartItem, TableId } from '../../types/restaurant';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableId: TableId;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onSubmitOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  tableId,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST/Service tax
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Your Table Order</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Table {tableId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {items.length} {items.length === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-slate-400">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-300 text-base mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our delicious menu and tap on any dish to customize and add it to your table order.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700/80 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {item.portion}
                    </span>
                    {item.spiceLevel > 0 && (
                      <span className="text-red-400">
                        {'🌶️'.repeat(item.spiceLevel)}
                      </span>
                    )}
                  </div>

                  {item.specialInstructions && (
                    <p className="text-[10px] text-slate-400 italic mt-1 truncate">
                      Note: {item.specialInstructions}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                    <span className="text-xs font-bold text-orange-400">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Service (5%)</span>
                <span className="text-white font-medium">Rs {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Order Total</span>
                <span className="text-orange-400 text-base">Rs {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onSubmitOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-sm text-white shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Send Order to Live Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Goes directly to kitchen display • Zero waiter delay
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
