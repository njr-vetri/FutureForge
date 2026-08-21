import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Mail, Lock, Chrome, Loader2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      login(email || 'student@university.edu', name || 'Demo Student');
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('google_user@gmail.com', 'Google User');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#14231E] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-[#66736D] hover:text-[#1F5E4D] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#DDE4DE]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#14231E] text-[#B8872F] flex items-center justify-center font-display font-bold text-2xl shadow-sm border border-[#DDE4DE] mb-4">
              C
            </div>
            <h2 className="text-2xl font-display font-bold text-center">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-[#66736D] text-sm mt-1">
              {isLogin ? 'Sign in to continue your journey' : 'Start your placement preparation'}
            </p>
          </div>

          <button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-[#DDE4DE] text-[#14231E] font-semibold text-sm hover:bg-[#F7F8F5] transition-colors mb-6 disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-[#ea4335]" />
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DDE4DE]"></div>
            </div>
            <div className="relative px-4 bg-white text-xs text-[#66736D] uppercase tracking-wider font-semibold">
              Or continue with email
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#14231E] mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-[#66736D]" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE4DE] focus:border-[#1F5E4D] focus:ring-1 focus:ring-[#1F5E4D] outline-none transition-all text-sm bg-[#F7F8F5]"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#14231E] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#66736D]" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE4DE] focus:border-[#1F5E4D] focus:ring-1 focus:ring-[#1F5E4D] outline-none transition-all text-sm bg-[#F7F8F5]"
                  placeholder="student@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#14231E]">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-[#1F5E4D] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#66736D]" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE4DE] focus:border-[#1F5E4D] focus:ring-1 focus:ring-[#1F5E4D] outline-none transition-all text-sm bg-[#F7F8F5]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 rounded-xl bg-[#1F5E4D] text-white font-semibold text-sm hover:bg-[#14231E] transition-colors mt-2 shadow-sm disabled:opacity-50 gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#66736D] mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-[#1F5E4D] hover:underline"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
