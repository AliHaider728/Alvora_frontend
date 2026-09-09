"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldCheck, Leaf, ArrowLeft, Sparkles } from 'lucide-react';

import { api, setAuthToken, getLastApiError } from '../../../services/api';

export const AdminLoginPageClient: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      if (res && res.token) {
        setAuthToken(res.token);
        localStorage.setItem('alvora_admin_user', JSON.stringify(res.user));
        router.push('/admin');
      } else {
        const apiError = getLastApiError();
        if (apiError && apiError.toLowerCase().includes('failed to fetch')) {
          setError('Backend API is unreachable. Please verify the backend server is running on the configured port.');
        } else {
          setError(apiError || 'Invalid admin credentials. Please check your email and password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-body flex flex-col md:flex-row">
      {/* Left Panel - Image & Marketing Text */}
      <div className="hidden md:flex md:w-1/2 relative p-12 lg:p-20 overflow-hidden">
        <Image
          src="/images/admin/login-bg.png" 
          alt="Alvora Skincare Admin"
          fill
          className="object-cover"
          priority
        />
        
        <div className="relative z-10 w-full max-w-lg flex flex-col h-full justify-between pt-6">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-[#A86249]" />
              <span className="text-[10px] font-bold text-[#A86249] uppercase tracking-[0.15em]">
                Skincare for a brighter you
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-[3.5rem] lg:text-[4.5rem] leading-[1.05] mb-6 text-[#1A1A1A]">
              Pure Ingredients.<br/>
              <span className="text-[#A86249]">Visible Results.</span>
            </h1>

            {/* Paragraph */}
            <p className="text-[#4A403A] text-[15px] font-medium leading-relaxed max-w-[340px] mb-12">
              Manage your Alvora storefront, orders, and products through our secure admin dashboard.
            </p>

            {/* Features Row */}
            <div className="flex items-start gap-6 lg:gap-10">
              <div className="flex flex-col items-center text-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A86249] mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider leading-snug">Premium<br/>Skincare</span>
              </div>
              <div className="w-px h-12 bg-[#8C7B74]/30 mt-1" />
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#A86249] mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider leading-snug">Trusted<br/>Quality</span>
              </div>
              <div className="w-px h-12 bg-[#8C7B74]/30 mt-1" />
              <div className="flex flex-col items-center text-center gap-2">
                <Leaf className="w-5 h-5 text-[#A86249] mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider leading-snug">Natural<br/>Ingredients</span>
              </div>
            </div>
          </div>

          {/* Bottom Script text */}
          <div className="mt-auto pt-16 pb-4">
            <span className="font-display italic text-[28px] lg:text-[32px] text-[#A85A3B]">
              Care for your natural beauty
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form Container */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-16 relative overflow-hidden bg-[#FAF6F2]">
        
        {/* Decorative Elements - Z-index 0 */}
        {/* Top Right Leaf Decoration (Fallback SVG if image missing) */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 text-[#8C7B74] opacity-10 pointer-events-none z-0 transform rotate-45">
          <Leaf className="w-64 h-64" strokeWidth={0.5} />
        </div>
        
        {/* Bottom Right Soft Terracotta Shape */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A86249] opacity-10 rounded-tl-[120px] pointer-events-none z-0 translate-x-12 translate-y-12" />

        {/* Floating White Form Card - Z-index 10 */}
        <div className="w-full max-w-[460px] mx-auto z-10 relative bg-white p-8 sm:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(168,98,73,0.15)]">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A85A3B] text-white font-display font-medium text-xl flex items-center justify-center">
              A
            </div>
            <span className="font-display text-xl text-[#1A1A1A]">Alvora</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-4xl lg:text-[42px] text-[#1A1A1A] mb-3">Admin Login</h2>
            <p className="text-[13px] lg:text-[14px] text-[#8C7B74] font-medium">
              Welcome back. Please enter your details.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-sm text-rose-700 font-medium mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em] block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#A1A7AA]" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@alvora.pk"
                  className="w-full pl-11 pr-4 py-3.5 text-[13px] rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#A1A7AA]/70 focus:outline-none focus:border-[#A86249] focus:ring-1 focus:ring-[#A86249] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em] block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#A1A7AA]" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 text-[13px] rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#A1A7AA]/70 focus:outline-none focus:border-[#A86249] focus:ring-1 focus:ring-[#A86249] transition-colors tracking-widest font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1A7AA] hover:text-[#A86249] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#A85A3B] hover:bg-[#8E4D31] text-white font-bold text-[11px] uppercase tracking-widest flex items-center justify-center relative transition-all duration-200 mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="absolute right-5 w-4 h-4" strokeWidth={2} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
            <span className="flex-shrink-0 mx-4 text-[9px] uppercase tracking-widest font-bold text-[#A1A7AA]">
              OR
            </span>
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
          </div>

          {/* Footer Link */}
          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-[12px] text-[#A1A7AA] hover:text-[#A86249] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Storefront
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};