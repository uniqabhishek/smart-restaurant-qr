import React, { useState } from 'react';
import { 
  Crown, 
  BarChart3, 
  MapPin, 
  UtensilsCrossed, 
  QrCode, 
  Settings, 
  LogOut, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types/auth';
import { TableState, TableId, OrderTicket, WaiterCall, ReviewSubmission, MenuItem } from '../../types/restaurant';
import { INITIAL_MENU_ITEMS } from '../../data/menuData';
import { ManagerDashboard } from '../manager/ManagerDashboard';
import { FloorMap } from '../floor/FloorMap';
import { KitchenDisplay } from '../kds/KitchenDisplay';
import { QRCodeStation } from '../qr/QRCodeStation';

interface OwnerInterfaceProps {
  user: User;
  orders: OrderTicket[];
  tables: TableState[];
  waiterCalls: WaiterCall[];
  reviews: ReviewSubmission[];
  onAcknowledgeCall: (callId: string, tableId: TableId) => void;
  onClearTable: (tableId: TableId) => void;
  onTriggerTestCall: (tableId: TableId) => void;
  onOpenTableAsGuest: (tableId: TableId) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: any) => void;
  onAddNewTestOrder: () => void;
  onLogout: () => void;
}

type OwnerTab = 'analytics' | 'floor' | 'kitchen' | 'menu' | 'qr_station';

export const OwnerInterface: React.FC<OwnerInterfaceProps> = ({
  user,
  orders,
  tables,
  waiterCalls,
  reviews,
  onAcknowledgeCall,
  onClearTable,
  onTriggerTestCall,
  onOpenTableAsGuest,
  onUpdateOrderStatus,
  onAddNewTestOrder,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('analytics');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const activeOrdersCount = orders.filter((o) => o.status !== 'served').length;
  const pendingCallsCount = waiterCalls.filter((c) => c.status === 'pending').length;
  const occupiedTables = tables.filter((t) => t.status !== 'available').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 48500;

  const handleToggleDishAvailability = (dishId: string) => {
    setMenuItems((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isSpecial: !d.isSpecial } : d))
    );
  };

  const handleSavePrice = (dishId: string) => {
    if (tempPrice > 0) {
      setMenuItems((prev) =>
        prev.map((d) => (d.id === dishId ? { ...d, price: tempPrice } : d))
      );
    }
    setEditingPriceId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Executive Owner Header */}
      <header className="bg-slate-900 border-b border-amber-500/30 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Owner Profile Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-sm">
                  Executive Owner
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-medium">
                {user.restaurantName || 'The Royal Grand Feast'} • HQ Command Portal
              </p>
            </div>
          </div>

          {/* Owner Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>KPI Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('floor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all relative ${
                activeTab === 'floor'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Live Floor</span>
              {pendingCallsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 animate-pulse">
                  {pendingCallsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'kitchen'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Kitchen Monitor</span>
              {activeOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Menu & Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab('qr_station')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'qr_station'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Table QRs</span>
            </button>
          </div>

          {/* Right Logout Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-slate-700 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Body */}
      <main className="flex-1">
        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <ManagerDashboard
            orders={orders}
            tables={tables}
            reviews={reviews}
          />
        )}

        {/* Tab 2: Live Floor Map with Radar Alerts */}
        {activeTab === 'floor' && (
          <FloorMap
            tables={tables}
            waiterCalls={waiterCalls}
            orders={orders}
            onAcknowledgeCall={onAcknowledgeCall}
            onSelectTableForGuestView={onOpenTableAsGuest}
            onTriggerTestCall={onTriggerTestCall}
            onClearTable={onClearTable}
          />
        )}

        {/* Tab 3: Kitchen KDS Monitor */}
        {activeTab === 'kitchen' && (
          <KitchenDisplay
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onAddNewTestOrder={onAddNewTestOrder}
          />
        )}

        {/* Tab 4: Menu & Pricing Manager */}
        {activeTab === 'menu' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  Menu & Pricing Control Center
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live updates to dish pricing, specials, and kitchen availability
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {menuItems.length} Dishes Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 shadow-lg hover:border-slate-700 transition-all"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {dish.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize">{dish.category.replace('_', ' ')}</span>
                        <span>•</span>
                        {dish.spiceLevel > 0 && <span>{'🌶️'.repeat(dish.spiceLevel)}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      {editingPriceId === dish.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-20 bg-slate-950 border border-amber-500 rounded px-2 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSavePrice(dish.id)}
                            className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-orange-400">
                            Rs {dish.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(dish.id);
                              setTempPrice(dish.price);
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Edit Price"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleDishAvailability(dish.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          dish.isSpecial
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {dish.isSpecial ? 'Chef Special ★' : 'Standard Item'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Table QR Station */}
        {activeTab === 'qr_station' && (
          <QRCodeStation onOpenTable={onOpenTableAsGuest} />
        )}
      </main>
    </div>
  );
};
