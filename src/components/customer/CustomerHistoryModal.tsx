import React from 'react';
import { 
  X, 
  Award, 
  Clock, 
  Receipt, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag,
  ExternalLink 
} from 'lucide-react';
import { User } from '../../types/auth';
import { OrderTicket } from '../../types/restaurant';

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: OrderTicket[];
}

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
}) => {
  if (!isOpen) return null;

  const points = user?.loyaltyPoints || 120;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              {user?.avatar || '📱'}
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {user?.name || 'Guest Customer'}
              </h2>
              <p className="text-xs text-slate-400">
                {user?.email || 'Dine-In Customer Account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Profile"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loyalty Points Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                RestoFlow Rewards
              </div>
              <div className="text-lg font-black text-white">
                {points} Points Available
              </div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Gold Member
          </div>
        </div>

        {/* Orders List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            Recent Dining Receipts & Orders
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No orders placed yet this session
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">
                      Order #{order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Table {order.tableId}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      order.status === 'served'
                        ? 'bg-blue-500/20 text-blue-300'
                        : order.status === 'ready'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 divide-y divide-slate-800/60">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-1 flex justify-between text-[11px]">
                      <span>{it.quantity}x {it.name} ({it.portion})</span>
                      <span className="font-mono text-slate-400">Rs {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">
                    Paid via {order.paymentMethod?.replace('_', ' ') || 'QR digital'}
                  </span>
                  <span className="font-black text-orange-400">
                    Total: Rs {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
