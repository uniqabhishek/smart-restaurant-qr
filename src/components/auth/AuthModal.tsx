import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Sparkles, 
  ChefHat, 
  Crown, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { User, UserRole } from '../../types/auth';
import { loginUser, signupUser, INITIAL_DEMO_USERS } from '../../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialRole = 'customer',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fast 1-click login helper
  const handleQuickDemoLogin = (demoRole: UserRole) => {
    const demo = INITIAL_DEMO_USERS.find((u) => u.role === demoRole);
    if (!demo) return;

    const result = loginUser(demo.email, demo.passwordHash);
    if (result.success && result.user) {
      setSuccessMsg(`Logged in as ${result.user.name} (${result.user.role.toUpperCase()})`);
      setTimeout(() => {
        onAuthSuccess(result.user!);
        onClose();
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = loginUser(email, password);
      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } else {
      const res = signupUser(name, email, password, selectedRole, extraField);
      if (res.success && res.user) {
        setSuccessMsg(`Account created! Welcome, ${res.user.name}!`);
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Signup failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {mode === 'login' ? 'Sign In to RestoFlow' : 'Create New Account'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Choose role: Customer, Kitchen Chef, or Owner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Authentication Modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            1-Click Quick Demo Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex flex-col items-center gap-1 transition-all group"
            >
              <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>👑 Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('chef')}
              className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold flex flex-col items-center gap-1 transition-all group"
            >
              <ChefHat className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>👨‍🍳 Chef</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex flex-col items-center gap-1 transition-all group"
            >
              <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>📱 Customer</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-orange-500 text-orange-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'signup'
                ? 'border-orange-500 text-orange-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error or Success Feedback */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Role selector (if signing up) */}
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'customer' as UserRole, label: 'Customer', icon: '📱' },
                  { id: 'chef' as UserRole, label: 'Chef', icon: '👨‍🍳' },
                  { id: 'owner' as UserRole, label: 'Owner', icon: '👑' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedRole === r.id
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name field (for signup) */}
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Optional Extra field for Chef or Owner */}
          {mode === 'signup' && selectedRole === 'chef' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Kitchen Station
              </label>
              <input
                type="text"
                placeholder="e.g. Wok & Karahi Line, Grill Station"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          )}

          {mode === 'signup' && selectedRole === 'owner' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Royal Bistro"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-extrabold text-xs text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all mt-2"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
