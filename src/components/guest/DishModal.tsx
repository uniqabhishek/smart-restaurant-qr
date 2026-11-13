import React, { useState } from 'react';
import { X, Flame, ShieldAlert, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, PortionOption, CartItem } from '../../types/restaurant';

interface DishModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose, onAddToCart }) => {
  if (!dish) return null;

  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(
    dish.portions[0] || { name: 'Small', priceOffset: 0, serves: 'Single' }
  );
  const [spiceLevel, setSpiceLevel] = useState<number>(dish.spiceLevel);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const unitPrice = dish.price + selectedPortion.priceOffset;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const item: CartItem = {
      id: `${dish.id}-${selectedPortion.name}-${Date.now()}`,
      menuItemId: dish.id,
      name: dish.name,
      price: unitPrice,
      portion: selectedPortion.name,
      quantity,
      spiceLevel,
      specialInstructions: specialInstructions.trim(),
      image: dish.image,
    };
    onAddToCart(item);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dish Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 flex-shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close Dish Details"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {dish.isSpecial && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
              Chef's Special
            </span>
          )}

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {dish.name}
                </h3>
                {dish.urduName && (
                  <p className="text-sm font-arabic text-amber-400 font-semibold mt-0.5">
                    {dish.urduName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-orange-400">
                  Rs {unitPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Configuration Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200">
          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {dish.description}
          </p>

          {/* Allergens warning pills (as highlighted in Reel) */}
          {dish.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-bold">Contains Allergens: </span>
                <span>{dish.allergens.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Portion Size Selector (Step 2/6 in Reel) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Portion Size
              </label>
              <span className="text-[11px] text-slate-400">{selectedPortion.serves}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {dish.portions.map((portion) => {
                const isSelected = selectedPortion.name === portion.name;
                return (
                  <button
                    key={portion.name}
                    type="button"
                    onClick={() => setSelectedPortion(portion)}
                    className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/15 text-orange-300 shadow-md shadow-orange-500/10'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{portion.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {portion.priceOffset === 0
                        ? 'Base Price'
                        : `+Rs ${portion.priceOffset}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level Gauge (Step 2/6 in Reel) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Spice Level ({spiceLevel === 0 ? 'Mild / No Heat' : spiceLevel === 1 ? 'Mild Heat' : spiceLevel === 2 ? 'Medium Heat' : spiceLevel === 3 ? 'Hot' : 'Extra Hot'})
              </label>
            </div>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              {[0, 1, 2, 3, 4].map((level) => {
                const isActive = level <= spiceLevel;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                      level === spiceLevel
                        ? 'bg-gradient-to-t from-red-600 to-orange-500 text-white shadow-md'
                        : isActive
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>{level === 0 ? '🌿' : '🌶️'.repeat(level)}</span>
                    <span className="text-[10px] uppercase font-mono">{level === 0 ? '0' : `${level}/4`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Cooking Instructions */}
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-slate-400 block mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra ginger, crispy..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              maxLength={100}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAdd}
            disabled={addedAnimation}
            className={`flex-1 flex items-center justify-between px-5 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 active:scale-[0.98]'
            }`}
          >
            <span>{addedAnimation ? 'Added to Order!' : 'Add to Order'}</span>
            <span className="font-extrabold flex items-center gap-1.5">
              {addedAnimation ? <Check className="w-4 h-4" /> : `Rs ${totalPrice.toLocaleString()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
