import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Crown, 
  ChefHat, 
  User, 
  ExternalLink, 
  X, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { UserRole } from '../types/auth';

interface DemoApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickLogin: (role: UserRole) => void;
}

export const DemoApkModal: React.FC<DemoApkModalProps> = ({
  isOpen,
  onClose,
  onQuickLogin,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install on your mobile device:\n\n• On Chrome/Android: Tap menu (⋮) -> 'Install App' or 'Add to Home Screen'\n• On Safari/iPhone: Tap Share -> 'Add to Home Screen'");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner border border-white/20">
              🍽️
            </div>
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <span>RestoFlow ONE • Demo &amp; Sales Package</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Pitch Deck
                </span>
              </h3>
              <p className="text-xs text-orange-100 font-medium">
                Deliverables &amp; live demonstration tools for restaurant owners
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm">
          
          {/* Main Action Banner: Two Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option 1: Native Android APK */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-800/60 border border-slate-700 flex flex-col justify-between hover:border-orange-500/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-orange-400 font-bold mb-1">
                  <Download className="w-4 h-4" />
                  <span>Option 1: Android .APK File</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Standalone Android APK package ready to side-load and install on any Android phone or tablet.
                </p>
              </div>
              <a
                href="https://github.com/uniqabhishek/smart-restaurant-qr/releases/download/v1.0.0-demo/RestoFlow-Demo.apk"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-center"
              >
                <Download className="w-4 h-4" />
                <span>Download Demo APK (.apk)</span>
              </a>
            </div>

            {/* Option 2: 1-Tap Home Screen WebAPK (Instant) */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-800/60 border border-slate-700 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span>Option 2: 1-Tap Home Screen (PWA)</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Installs immediately via Chrome or Safari. Zero unknown-sources warnings, native app icon &amp; offline support.
                </p>
              </div>
              <button
                onClick={handleInstallPWA}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isInstalled ? 'App Already Installed ✓' : 'Install to Home Screen'}</span>
              </button>
            </div>

          </div>

          {/* Key Selling Points for Restaurant Owners (Pitch Sheet) */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Key Selling Points to Pitch to Owners</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18% Average Ticket</span>
                </div>
                <p className="text-slate-400">
                  Visual dish photos, portion upgrades, and automated dessert prompts lift per-head check size.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>15 Min Faster Turns</span>
                </div>
                <p className="text-slate-400">
                  Zero waiting for checks or card terminals. Guests split bills and settle directly from their phone.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Zero Kitchen Errors</span>
                </div>
                <p className="text-slate-400">
                  Orders transmit straight to the kitchen display (KDS) with audio bell chimes and allergen tags.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Accounts to Show the Owner */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant 1-Click Role Demonstrations:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => { onQuickLogin('owner'); onClose(); }}
                className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300 text-xs mb-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Owner View</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Live revenue ticker, occupancy radar, and menu price editor.
                </p>
              </button>

              <button
                onClick={() => { onQuickLogin('chef'); onClose(); }}
                className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-orange-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-orange-300 text-xs mb-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Kitchen KDS</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Live chef order tickets, countdown timers, and chime alerts.
                </p>
              </button>

              <button
                onClick={() => { onQuickLogin('customer'); onClose(); }}
                className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs mb-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Table 4 Guest</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  QR scan view, dish modifiers, split bill, and waiter call.
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Engineered by <b>Abhishek</b> (@uniqabhishek)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
