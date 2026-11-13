import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UtensilsCrossed, 
  Volume2, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { OrderTicket, OrderStatus } from '../../types/restaurant';
import { sounds } from '../../utils/audio';

interface KitchenDisplayProps {
  orders: OrderTicket[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddNewTestOrder: () => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNewTestOrder,
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newOrders = orders.filter((o) => o.status === 'new');
  const cookingOrders = orders.filter((o) => o.status === 'cooking');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const servedOrders = orders.filter((o) => o.status === 'served').slice(-5);

  const getElapsedMinutes = (timestamp: number) => {
    const diffMs = currentTime - timestamp;
    const totalSec = Math.max(0, Math.floor(diffMs / 1000));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (timestamp: number) => {
    const mins = (currentTime - timestamp) / (60 * 1000);
    if (mins < 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (mins < 15) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse';
  };

  const renderTicketCard = (order: OrderTicket, currentColumn: 'new' | 'cooking' | 'ready' | 'served') => {
    const elapsed = getElapsedMinutes(order.createdAt);
    const timerClass = getTimerColor(order.createdAt);

    return (
      <div
        key={order.id}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3 hover:border-slate-700 transition-all"
      >
        <div>
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">
                #{order.orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                Table {order.tableId}
              </span>
            </div>
            
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${timerClass}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{elapsed}</span>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="py-3 space-y-2.5">
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-baseline justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-orange-400">
                      {item.quantity}
                    </span>
                    <span className="font-bold text-slate-100">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {item.portion}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-7 text-[11px]">
                  {item.spiceLevel > 0 && (
                    <span className="text-red-400 font-bold">
                      {'🌶️'.repeat(item.spiceLevel)} (Spice {item.spiceLevel}/4)
                    </span>
                  )}
                  {item.allergens.length > 0 && (
                    <span className="text-amber-400 font-semibold bg-amber-500/10 px-1 rounded border border-amber-500/20">
                      Allergy: {item.allergens.join(', ')}
                    </span>
                  )}
                </div>

                {item.specialInstructions && (
                  <p className="text-[11px] text-orange-300 italic pl-7 bg-orange-500/5 py-0.5 rounded">
                    "{item.specialInstructions}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button to Advance Pipeline */}
        <div className="pt-2 border-t border-slate-800">
          {currentColumn === 'new' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'cooking');
                sounds.playKitchenBell();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-extrabold text-xs text-white shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Start Cooking</span>
            </button>
          )}

          {currentColumn === 'cooking' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'ready');
                sounds.playKitchenBell();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-extrabold text-xs text-white shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Ready to Serve</span>
            </button>
          )}

          {currentColumn === 'ready' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'served');
                sounds.playKitchenBell();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-extrabold text-xs text-white shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Mark Delivered / Served</span>
            </button>
          )}

          {currentColumn === 'served' && (
            <div className="text-center text-[11px] text-slate-500 font-semibold py-1">
              Delivered to Table {order.tableId}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col">
      {/* KDS Header Banner (As shown in Reel: "1 tablet • zero shouting") */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              KITCHEN <span className="text-orange-500">• LIVE</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Tablet Display
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "1 tablet • zero shouting" • Orders flow straight from guest smartphone QR scans
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddNewTestOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Incoming Order</span>
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
            {new Date(currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Kanban Board Columns: NEW -> COOKING -> READY */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: NEW */}
        <div className="flex flex-col bg-slate-900/50 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h2 className="text-sm font-black tracking-wider uppercase text-amber-300">
                NEW ORDERS
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-400 text-black">
              {newOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {newOrders.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-600 text-xs text-center p-4">
                <UtensilsCrossed className="w-6 h-6 mb-2 opacity-40" />
                No incoming tickets right now
              </div>
            ) : (
              newOrders.map((o) => renderTicketCard(o, 'new'))
            )}
          </div>
        </div>

        {/* Column 2: COOKING */}
        <div className="flex flex-col bg-slate-900/50 border border-orange-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
              <h2 className="text-sm font-black tracking-wider uppercase text-orange-400">
                COOKING IN WOK
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-orange-500 text-white">
              {cookingOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {cookingOrders.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-600 text-xs text-center p-4">
                <Flame className="w-6 h-6 mb-2 opacity-40" />
                Nothing on the flame
              </div>
            ) : (
              cookingOrders.map((o) => renderTicketCard(o, 'cooking'))
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="flex flex-col bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-black tracking-wider uppercase text-emerald-400">
                READY FOR RUNNER
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-black">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-600 text-xs text-center p-4">
                <CheckCircle2 className="w-6 h-6 mb-2 opacity-40" />
                All ready dishes delivered
              </div>
            ) : (
              readyOrders.map((o) => renderTicketCard(o, 'ready'))
            )}
          </div>
        </div>
      </div>

      {/* Recently Served Archive footer */}
      {servedOrders.length > 0 && (
        <div className="max-w-7xl mx-auto w-full mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <span>Recently Served Archive:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {servedOrders.map((o) => (
              <div
                key={o.id}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2"
              >
                <span className="font-bold text-slate-300">#{o.orderNumber}</span>
                <span>• Table {o.tableId}</span>
                <span className="text-emerald-400 font-mono">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
