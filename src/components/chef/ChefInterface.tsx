import React from 'react';
import { 
  ChefHat, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  UtensilsCrossed,
  ShieldAlert,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { OrderTicket, OrderStatus } from '../../types/restaurant';
import { User } from '../../types/auth';
import { KitchenDisplay } from '../kds/KitchenDisplay';

interface ChefInterfaceProps {
  user: User;
  orders: OrderTicket[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddNewTestOrder: () => void;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ChefInterface: React.FC<ChefInterfaceProps> = ({
  user,
  orders,
  onUpdateOrderStatus,
  onAddNewTestOrder,
  onLogout,
  soundEnabled,
  onToggleSound,
}) => {
  const activeFlameCount = orders.filter((o) => o.status === 'cooking').length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'served').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dedicated Chef Station Header Bar */}
      <header className="bg-slate-900 border-b border-orange-500/30 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Chef Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500 text-white shadow-sm">
                  Chef Station
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">
                {user.station || 'Head Chef • Karahi & Tandoor Station'}
              </p>
            </div>
          </div>

          {/* Quick Chef Controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={onAddNewTestOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-bold transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Order</span>
            </button>

            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Toggle Audio Bell"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-slate-700 text-xs font-bold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Chef Shift Stats Bar */}
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Incoming</div>
            <div className="text-base font-black text-amber-400">{newOrdersCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">On Fire</div>
            <div className="text-base font-black text-orange-400">{activeFlameCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Plated Ready</div>
            <div className="text-base font-black text-emerald-400">{readyOrdersCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Delivered</div>
            <div className="text-base font-black text-blue-400">{completedCount}</div>
          </div>
        </div>
      </header>

      {/* Embedded KDS Kanban Pipeline */}
      <main className="flex-1">
        <KitchenDisplay
          orders={orders}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onAddNewTestOrder={onAddNewTestOrder}
        />
      </main>
    </div>
  );
};
