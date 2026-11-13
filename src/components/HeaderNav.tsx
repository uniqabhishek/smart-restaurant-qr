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
  ExternalLink
} from 'lucide-react';
import { TableId } from '../types/restaurant';

export type AppViewMode = 'guest' | 'kitchen' | 'floor' | 'manager' | 'qr_station';

interface HeaderNavProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  selectedTable: TableId;
  onSelectTable: (table: TableId) => void;
  activeOrdersCount: number;
  pendingCallsCount: number;
  onResetDemo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onSelectView,
  selectedTable,
  onSelectTable,
  activeOrdersCount,
  pendingCallsCount,
  onResetDemo,
  soundEnabled,
  onToggleSound,
  isPhoneFrame,
  onTogglePhoneFrame,
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
                  Smart QR Ecosystem
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                One system for guests, kitchen & staff
              </p>
            </div>
          </div>

          {/* Mobile quick badges */}
          <div className="flex items-center gap-2 md:hidden">
            {pendingCallsCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Bell className="w-3.5 h-3.5" /> {pendingCallsCount}
              </span>
            )}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto w-full md:w-auto scrollbar-none justify-start md:justify-center">
          <button
            onClick={() => onSelectView('guest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'guest'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Guest Table</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-black/30 rounded font-mono">T{selectedTable}</span>
          </button>

          <button
            onClick={() => onSelectView('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'kitchen'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Kitchen KDS</span>
            {activeOrdersCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                currentView === 'kitchen' ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('floor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
              currentView === 'floor'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Floor Map</span>
            {pendingCallsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
            {pendingCallsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full font-bold bg-amber-400 text-black">
                {pendingCallsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('manager')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'manager'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => onSelectView('qr_station')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === 'qr_station'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Table QRs</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Table Selector Dropdown (when in guest view) */}
          {currentView === 'guest' && (
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

          {/* Toggle Phone Frame button in Guest Mode */}
          {currentView === 'guest' && (
            <button
              onClick={onTogglePhoneFrame}
              className={`p-1.5 rounded-lg text-xs border transition-colors ${
                isPhoneFrame
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Phone Frame Simulation"
            >
              <Smartphone className="w-4 h-4" />
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

          {/* Reset Demo State button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs border border-slate-700/60 transition-colors"
            title="Reset system to fresh demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
