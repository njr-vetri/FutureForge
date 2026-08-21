import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoginMascot, MascotMood } from './LoginMascot';
import { CareerOSLogo } from '../common/CareerOSLogo';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Chrome,
  Github,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMascotMood('excited');

    setTimeout(() => {
      login(email || 'aditya.sharma@nit.ac.in', name || 'Aditya Sharma');
      setIsLoading(false);
    }, 1100);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setMascotMood('excited');
    setTimeout(() => {
      login('google_student@university.ac.in', 'Google Student');
      setIsLoading(false);
    }, 800);
  };

  const handleGithubAuth = () => {
    setIsLoading(true);
    setMascotMood('excited');
    setTimeout(() => {
      login('github_dev@university.ac.in', 'OpenSource Candidate');
      setIsLoading(false);
    }, 800);
  };

  const handleMascotPoke = () => {
    setToastMessage("Ready to help you prepare for placements!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative min-h-screen w-full moving-gradient-bg text-[#14231E] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Animated Floating Ambient Soft Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft mint/emerald fluid orbs matching website parchment & green colors */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#95D5B2]/35 blur-[90px] animate-orb-1" />
        <div className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#D8F3E2]/60 blur-[100px] animate-orb-2" />
        <div className="absolute -bottom-24 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#74C69D]/25 blur-[90px] animate-orb-3" />

        {/* Subtle grid pattern overlay matching website aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#1F5E4D 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-30 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#DDE4DE] hover:border-[#1F5E4D] text-[#14231E] hover:text-[#1F5E4D] text-xs font-mono font-semibold transition-all shadow-xs backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 border border-[#DDE4DE] text-[#14231E] text-xs font-mono shadow-xs backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
          <span>NIT Placement Season 2026 Active</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-[430px] pt-14 pb-8 flex flex-col items-center">
        {/* Toast Message Bubble */}
        {toastMessage && (
          <div className="absolute -top-1 px-4 py-2 rounded-2xl bg-white text-[#14231E] border border-[#74C69D] shadow-md text-xs font-mono font-semibold animate-bounce z-40">
            {toastMessage}
          </div>
        )}

        {/* ================= MASCOT PERCH ================= */}
        <div className="w-full flex justify-center -mb-10 z-20 pointer-events-auto">
          <LoginMascot
            mood={mascotMood}
            isPasswordActive={isPasswordFocused || password.length > 0}
            isPasswordVisible={showPassword}
            onMascotClick={handleMascotPoke}
          />
        </div>

        {/* ================= MAIN AUTH CARD (WHITE & GREEN WEBSITE THEME) ================= */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(20,35,30,0.08),0_1px_0_rgba(255,255,255,1)_inset] border border-[#DDE4DE] relative">
          {/* Card Header & Brand */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <CareerOSLogo variant="vertical" size="md" showTagline={true} />
          </div>

          {/* Mode Switcher Tabs (Sign In / Register) */}
          <div className="relative flex p-1 bg-[#F6FAF8] rounded-2xl border border-[#DDE4DE] mb-5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setMascotMood('idle');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all font-sans ${
                isLogin
                  ? 'bg-[#1F5E4D] text-white shadow-xs'
                  : 'text-[#66736D] hover:text-[#14231E]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setMascotMood('idle');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all font-sans ${
                !isLogin
                  ? 'bg-[#1F5E4D] text-white shadow-xs'
                  : 'text-[#66736D] hover:text-[#14231E]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Auth Providers */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#DDE4DE] bg-white hover:bg-[#F6FAF8] text-[#14231E] text-xs font-semibold transition-all disabled:opacity-50 shadow-2xs"
            >
              <Chrome className="w-4 h-4 text-[#EA4335]" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubAuth}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#DDE4DE] bg-white hover:bg-[#F6FAF8] text-[#14231E] text-xs font-semibold transition-all disabled:opacity-50 shadow-2xs"
            >
              <Github className="w-4 h-4 text-[#14231E]" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DDE4DE]" />
            </div>
            <div className="relative px-3 bg-white text-[10px] text-[#66736D] uppercase tracking-wider font-mono font-semibold">
              Or continue with email
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-mono font-semibold text-[#14231E] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-[#66736D]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE4DE] bg-[#F6FAF8] text-[#14231E] text-xs font-medium placeholder:text-[#94A3B8] focus:bg-white focus:border-[#1F5E4D] focus:ring-2 focus:ring-[#1F5E4D]/20 outline-none transition-all"
                    placeholder="Aditya Sharma"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono font-semibold text-[#14231E] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#66736D]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE4DE] bg-[#F6FAF8] text-[#14231E] text-xs font-medium placeholder:text-[#94A3B8] focus:bg-white focus:border-[#1F5E4D] focus:ring-2 focus:ring-[#1F5E4D]/20 outline-none transition-all"
                  placeholder="student@university.ac.in"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-semibold text-[#14231E] uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage("Reset instructions sent to registered email!");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-[11px] font-mono font-semibold text-[#1F5E4D] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#66736D]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DDE4DE] bg-[#F6FAF8] text-[#14231E] text-xs font-medium placeholder:text-[#94A3B8] focus:bg-white focus:border-[#1F5E4D] focus:ring-2 focus:ring-[#1F5E4D]/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#66736D] hover:text-[#14231E] transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#1F5E4D] hover:bg-[#14231E] text-white font-sans font-bold text-xs tracking-wide shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#95D5B2]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#95D5B2]" />
              )}
              <span>{isLogin ? 'Sign In to CareerOS' : 'Create Free Student Account'}</span>
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-5 pt-4 border-t border-[#DDE4DE] flex items-center justify-center gap-2 text-center text-xs text-[#66736D]">
            <span>{isLogin ? "Don't have an account?" : 'Already registered?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMascotMood('idle');
              }}
              className="font-bold text-[#1F5E4D] hover:underline font-mono text-xs"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </div>
        </div>

        {/* Trust Badges Strip Below Card */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-mono text-[#66736D]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E4D]" />
            <span>Trailhead Included</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9962C]" />
            <span>Crucible Ready</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F5E4D]" />
            <span>Verified NIT Matrix</span>
          </div>
        </div>
      </div>
    </div>
  );
};
