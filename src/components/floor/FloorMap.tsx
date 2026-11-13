import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Users, 
  Clock, 
  Receipt, 
  UtensilsCrossed, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { TableState, TableId, WaiterCall, OrderTicket } from '../../types/restaurant';

interface FloorMapProps {
  tables: TableState[];
  waiterCalls: WaiterCall[];
  orders: OrderTicket[];
  onAcknowledgeCall: (callId: string, tableId: TableId) => void;
  onSelectTableForGuestView: (tableId: TableId) => void;
  onTriggerTestCall: (tableId: TableId) => void;
  onClearTable: (tableId: TableId) => void;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  tables,
  waiterCalls,
  orders,
  onAcknowledgeCall,
  onSelectTableForGuestView,
  onTriggerTestCall,
  onClearTable,
}) => {
  const [selectedTable, setSelectedTable] = useState<TableState | null>(null);

  const pendingCalls = waiterCalls.filter((c) => c.status === 'pending');

  const getTableOrder = (tableId: TableId) => {
    return orders.find((o) => o.tableId === tableId && o.status !== 'served') || null;
  };

  const getTableStatusColor = (table: TableState) => {
    const isCalled = pendingCalls.some((c) => c.tableId === table.id);
    if (isCalled) return 'border-amber-400 bg-amber-500/20 text-amber-300';
    if (table.status === 'order_active') return 'border-orange-500 bg-orange-500/15 text-orange-300';
    if (table.status === 'occupied') return 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
    return 'border-slate-800 bg-slate-900/60 text-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto w-full mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              FLOOR <span className="text-orange-500">• LIVE</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Staff Service Radar
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Staff sees it all" • Visual floor map with real-time waiter radar waves & active order tracking
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span className="text-slate-300">Order Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 font-bold">Waiter Called</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="text-slate-400">Available</span>
          </div>
        </div>
      </div>

      {/* Active Waiter Call Notification Bar (Reel Step 5/6: "🔔 Table 4 • Call waiter") */}
      {pendingCalls.length > 0 && (
        <div className="max-w-7xl mx-auto w-full mb-5 space-y-2">
          {pendingCalls.map((call) => (
            <div
              key={call.id}
              className="bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border-2 border-amber-400/80 rounded-2xl p-4 shadow-xl shadow-amber-500/10 flex items-center justify-between gap-4 animate-bounce"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">
                      🔔 Table {call.tableId} • {call.reason}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-black">
                      ATTENTION NEEDED
                    </span>
                  </div>
                  <p className="text-xs text-amber-200 mt-0.5">
                    Guest tapped assistance button on smartphone {Math.floor((Date.now() - call.createdAt) / 1000)}s ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAcknowledgeCall(call.id, call.tableId)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Acknowledge / On My Way</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Interactive Floor Layout Canvas */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Map 2D Viewport */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative min-h-[500px] flex flex-col justify-between shadow-2xl overflow-hidden">
          {/* Subtle architectural grid lines */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          {/* Top Floor Boundaries: Entrance & Kitchen Pass */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3 mb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-[11px]">
                🚪 MAIN ENTRANCE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono text-[11px]">
                👨‍🍳 KITCHEN PASS & RUNNER DESK
              </span>
            </div>
          </div>

          {/* Interactive Tables Grid */}
          <div className="relative flex-1 grid grid-cols-3 sm:grid-cols-3 gap-5 sm:gap-8 items-center justify-items-center p-2 sm:p-6 z-10">
            {tables.map((table) => {
              const hasCall = pendingCalls.some((c) => c.tableId === table.id);
              const order = getTableOrder(table.id);
              const isSelected = selectedTable?.id === table.id;

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className="relative group cursor-pointer flex flex-col items-center"
                >
                  {/* Radar Wave Pulse Animation when Waiter Called! (Exactly matching Reel) */}
                  {hasCall && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-amber-400/40 radar-ring pointer-events-none -m-3" />
                      <div className="absolute inset-0 rounded-full bg-orange-500/30 radar-ring pointer-events-none -m-6" />
                    </>
                  )}

                  {/* Table Shape Container */}
                  <div
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 shadow-lg ${
                      table.shape === 'round'
                        ? 'rounded-full'
                        : table.shape === 'booth'
                        ? 'rounded-3xl border-dashed'
                        : 'rounded-2xl'
                    } ${getTableStatusColor(table)} ${
                      isSelected ? 'ring-4 ring-orange-500 ring-offset-2 ring-offset-slate-950 scale-105' : 'hover:scale-102'
                    }`}
                  >
                    {/* Table Number Pill */}
                    <span className="text-sm sm:text-base font-black tracking-tight">
                      Table {table.id}
                    </span>

                    {/* Table shape badge & capacity */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Users className="w-3 h-3" />
                      <span>{table.capacity}p</span>
                    </div>

                    {/* Order or Call Status pill */}
                    {hasCall ? (
                      <span className="mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-black animate-pulse">
                        CALLING!
                      </span>
                    ) : order ? (
                      <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400">
                        #{order.orderNumber} ({order.status})
                      </span>
                    ) : (
                      <span className="mt-1 text-[9px] text-slate-500 capitalize">
                        {table.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floor Boundary */}
          <div className="border-t border-slate-800/80 pt-3 mt-4 text-center text-xs text-slate-500 z-10">
            RestoFlow Live Floor Layout • Tap any table to inspect details or trigger demo calls
          </div>
        </div>

        {/* Right Panel: Selected Table Quick Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl">
          {selectedTable ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">
                    Table {selectedTable.id} Inspector
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedTable.shape.toUpperCase()} Table • Capacity: {selectedTable.capacity} guests
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    pendingCalls.some((c) => c.tableId === selectedTable.id)
                      ? 'bg-amber-400 text-black animate-pulse'
                      : selectedTable.status === 'order_active'
                      ? 'bg-orange-500/20 text-orange-400'
                      : selectedTable.status === 'occupied'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {pendingCalls.some((c) => c.tableId === selectedTable.id) ? 'Waiter Calling' : selectedTable.status}
                </span>
              </div>

              {/* Active Waiter Call status */}
              {pendingCalls.some((c) => c.tableId === selectedTable.id) && (
                <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 animate-bounce" />
                    Guest Request: {pendingCalls.find((c) => c.tableId === selectedTable.id)?.reason}
                  </div>
                  <button
                    onClick={() => {
                      const call = pendingCalls.find((c) => c.tableId === selectedTable.id);
                      if (call) onAcknowledgeCall(call.id, selectedTable.id);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                  >
                    Acknowledge Call
                  </button>
                </div>
              )}

              {/* Order details for this table */}
              {getTableOrder(selectedTable.id) ? (
                (() => {
                  const ord = getTableOrder(selectedTable.id)!;
                  return (
                    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-orange-400">Order #{ord.orderNumber}</span>
                        <span className="font-mono text-slate-400">Total: Rs {ord.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{i.quantity}x {i.name} ({i.portion})</span>
                            <span className="font-mono text-slate-400">Rs {(i.price * i.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-500 text-center">
                  No active orders for Table {selectedTable.id}
                </div>
              )}

              {/* Quick Table Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectTableForGuestView(selectedTable.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open as Guest (Table {selectedTable.id})</span>
                </button>

                <button
                  onClick={() => onTriggerTestCall(selectedTable.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Trigger Test Waiter Call</span>
                </button>

                <button
                  onClick={() => onClearTable(selectedTable.id)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Clear Table (Mark Available)
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-300 text-base">Select a Table</h4>
              <p className="text-xs text-slate-500">
                Click on any table in the floor map to see live order details, waiter alerts, and manage occupancy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
