import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  UtensilsCrossed, 
  Clock, 
  Star, 
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { OrderTicket, TableState, ReviewSubmission } from '../../types/restaurant';

interface ManagerDashboardProps {
  orders: OrderTicket[];
  tables: TableState[];
  reviews: ReviewSubmission[];
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  orders,
  tables,
  reviews,
}) => {
  const activeOrdersCount = orders.filter((o) => o.status !== 'served').length;
  const occupiedTablesCount = tables.filter((t) => t.status !== 'available').length;
  const totalTables = tables.length;
  const occupancyPercent = Math.round((occupiedTablesCount / totalTables) * 100);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 48500; // baseline demo revenue as in reel
  const avgPrepTime = 11.4; // minutes

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  // Hourly Guest Flow Data for peak hours (Reel Step 6b)
  const hourlyFlow = [
    { hour: '12 PM', guests: 28, height: '45%' },
    { hour: '1 PM', guests: 54, height: '85%' },
    { hour: '2 PM', guests: 42, height: '65%' },
    { hour: '3 PM', guests: 18, height: '28%' },
    { hour: '4 PM', guests: 12, height: '20%' },
    { hour: '5 PM', guests: 22, height: '35%' },
    { hour: '6 PM', guests: 38, height: '60%' },
    { hour: '7 PM', guests: 62, height: '95%' },
    { hour: '8 PM', guests: 70, height: '100%' }, // dinner peak
    { hour: '9 PM', guests: 58, height: '88%' },
    { hour: '10 PM', guests: 32, height: '50%' },
  ];

  const topDishes = [
    { name: 'Desi Chicken Karahi', sales: 46, revenue: 'Rs 85,100', trend: '+18%' },
    { name: 'Shinwari Mutton Karahi', sales: 29, revenue: 'Rs 76,850', trend: '+24%' },
    { name: 'Royal Dum Mutton Biryani', sales: 38, revenue: 'Rs 43,700', trend: '+12%' },
    { name: 'Warm Gulab Jamun & Ice Cream', sales: 62, revenue: 'Rs 27,900', trend: '+35%' },
    { name: 'Garlic Butter Roghani Naan', sales: 114, revenue: 'Rs 18,240', trend: '+9%' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              ONE DASHBOARD <span className="text-orange-500">• ALL IN ONE VIEW</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics connecting Menu, Kitchen Display, Floor Map, Guests, and Payments
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>Real-time Sync Active • 100% Client-Side Reactive</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* 4 KPI Cards (Reel Step 6b) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Live Orders */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>In active preparation</span>
            </div>
          </div>

          {/* Card 2: Tables Active */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tables Active
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2">
              {occupiedTablesCount}/{totalTables}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {occupancyPercent}% Dine-in Occupancy
            </div>
          </div>

          {/* Card 3: Today Sales (Reel: Rs 48,500) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today Sales
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-2">
              Rs {totalSales.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+24.6% vs last week</span>
            </div>
          </div>

          {/* Card 4: Guest Rating */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Satisfaction
              </span>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
                <Star className="w-4 h-4 fill-yellow-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-baseline gap-1">
              <span>{avgRating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Based on QR 1-tap feedback
            </div>
          </div>
        </div>

        {/* Guest Flow Hourly Chart (Reel Step 6b: "GUEST FLOW") */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                GUEST FLOW • HOURLY ARRIVALS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly dining room covers highlighting lunch & dinner peak rushes
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded bg-gradient-to-t from-orange-600 to-amber-500 inline-block" />
              <span className="text-slate-300">Guests / Hour</span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800">
            {hourlyFlow.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.guests}
                </div>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 group-hover:brightness-125 transition-all cursor-pointer relative shadow-lg shadow-orange-500/10"
                  style={{ height: bar.height }}
                >
                  {bar.hour === '8 PM' && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-black">
                      Peak Rush
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold group-hover:text-white transition-colors">
                  {bar.hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Dishes Leaderboard */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white">
                TOP SELLING MENU ITEMS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dishes driving the highest customer demand & gross margins
              </p>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Live Ranking
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {topDishes.map((dish, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white text-sm block">{dish.name}</span>
                    <span className="text-slate-400 text-[11px]">{dish.sales} orders placed</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-white text-sm block">{dish.revenue}</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">{dish.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
