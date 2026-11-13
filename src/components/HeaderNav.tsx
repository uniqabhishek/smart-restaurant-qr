import React from 'react';
import { 
  Smartphone, 
  UtensilsCrossed, 
  MapPin, 
  BarChart3, 
  QrCode, 
  RotateCcw,
  Bell,
  Volume2,
  VolumeX,
  User as UserIcon,
  LogOut,
  LogIn,
  Crown,
  ChefHat,
  Award
} from 'lucide-react';
import { TableId } from '../types/restaurant';
import { User, UserRole } from '../types/auth';

export type AppViewMode = 'customer' | 'chef' | 'owner';

interface HeaderNavProps {
  currentUser: User | null;
  onOpenAuth: (role?: UserRole) => void;
  onLogout: () => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  selectedTable: TableId;
  onSelectTable: (table: TableId) => void;
  activeOrdersCount: number;
  pendingCallsCount: number;
  onResetDemo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenCustomerHistory: () => void;
  onOpenDemoApk: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  activeRole,
  onSelectRole,
  selectedTable,
  onSelectTable,
  activeOrdersCount,
  pendingCallsCount,
  onResetDemo,
  soundEnabled,
  onToggleSound,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenCustomerHistory,
  onOpenDemoApk,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  RestoFlow <span className="text-orange-500 font-black">ONE</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full">
                  Multi-Role Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Customer QR • Kitchen Chef KDS • Owner Command Center
              </p>
            </div>
          </div>

          {/* Mobile Right Quick Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenDemoApk}
              className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold"
              title="Download Demo APK & Pitch Deck"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            {pendingCallsCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Bell className="w-3.5 h-3.5" /> {pendingCallsCount}
              </span>
            )}
            {currentUser ? (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth()}
                className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* 3 Dedicated Role Interfaces Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto scrollbar-none justify-start md:justify-center">
          {/* 1. Customer Role */}
          <button
            onClick={() => onSelectRole('customer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeRole === 'customer'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer QR</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-black/30 rounded font-mono">T{selectedTable}</span>
          </button>

          {/* 2. Kitchen Chef Role */}
          <button
            onClick={() => onSelectRole('chef')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeRole === 'chef'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen Chef</span>
            {activeOrdersCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                activeRole === 'chef' ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* 3. Owner Role */}
          <button
            onClick={() => onSelectRole('owner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all relative ${
              activeRole === 'owner'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Owner Portal</span>
            {pendingCallsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full font-bold bg-amber-400 text-black">
                {pendingCallsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Controls: Auth, Table Selector, Audio & Reset */}
        <div className="hidden md:flex items-center gap-2">
          {/* Table Selector Dropdown (when viewing customer mode) */}
          {activeRole === 'customer' && (
            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Table:</span>
              <select
                value={selectedTable}
                onChange={(e) => onSelectTable(Number(e.target.value) as TableId)}
                aria-label="Select Restaurant Table"
                className="bg-transparent text-xs font-bold text-orange-400 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    Table {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle Phone Frame button in Customer Mode */}
          {activeRole === 'customer' && (
            <button
              onClick={onTogglePhoneFrame}
              className={`p-1.5 rounded-lg text-xs border transition-colors ${
                isPhoneFrame
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Phone Frame View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}

          {/* Customer History & Rewards trigger */}
          {activeRole === 'customer' && currentUser && (
            <button
              onClick={onOpenCustomerHistory}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{currentUser.loyaltyPoints || 120} pts</span>
            </button>
          )}

          {/* Audio Chime toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/60 transition-colors"
            title={soundEnabled ? 'Mute Audio Alerts' : 'Unmute Audio Alerts'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Demo APK & Pitch Deck Button */}
          <button
            onClick={onOpenDemoApk}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 hover:text-orange-300 border border-orange-500/30 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Download Demo APK & Pitch Guide"
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xl:inline">Demo APK</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1">
              <span className="text-sm">{currentUser.avatar || '👤'}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold uppercase leading-none">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 p-1 text-slate-400 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In / Sign Up</span>
            </button>
          )}

          {/* Reset Demo State button */}
          <button
            onClick={onResetDemo}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title="Reset system demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
