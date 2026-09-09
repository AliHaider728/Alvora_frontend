"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldCheck, Leaf, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-white font-body flex flex-col md:flex-row">
      {/* Left Panel - Image & Marketing Text */}
      <div className="hidden md:flex md:w-[55%] lg:w-[60%] relative items-center p-12 lg:p-20 overflow-hidden">
        <Image
          src="/images/admin/login-bg.png" 
          alt="Alvora Skincare Admin"
          fill
          className="object-cover"
          priority
        />
        
        {/* We REMOVED the white gradient overlay to ensure the background image is fully visible and vibrant */}

        <div className="relative z-10 w-full max-w-lg flex flex-col h-full justify-between pt-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#A86249]" />
              <span className="text-[10px] font-bold text-[#A86249] uppercase tracking-[0.2em]">
                Skincare for a brighter you
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.1] mb-6 text-[#2A211E]">
              Pure Ingredients.<br/>
              <span className="text-[#A86249]">Visible Results.</span>
            </h1>

            <p className="text-[#3A2F2B] text-[15px] font-medium leading-relaxed max-w-[320px] mb-12">
              Manage your Alvora storefront, orders, and products through our secure admin dashboard.
            </p>

            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#8C7B74] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#8C7B74]" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold text-[#3A2F2B] uppercase tracking-wider leading-snug">Premium<br/>Skincare</span>
              </div>
              <div className="w-px h-12 bg-[#8C7B74]/30" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#8C7B74] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#8C7B74]" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold text-[#3A2F2B] uppercase tracking-wider leading-snug">Trusted<br/>Quality</span>
              </div>
              <div className="w-px h-12 bg-[#8C7B74]/30" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#8C7B74] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#8C7B74]" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold text-[#3A2F2B] uppercase tracking-wider leading-snug">Natural<br/>Ingredients</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-16 pb-4">
            <span className="font-display italic text-3xl lg:text-4xl text-[#A86249] inline-block -rotate-6 transform origin-left">
              Care for<br/>your natural beauty
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-[#FAF6F2] relative overflow-hidden">
        
        {/* Subtle decorative background shapes to mimic the reference image leaves (optional fallback if images aren't present) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E7D9D0]/30 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E7D9D0]/30 rounded-tr-full pointer-events-none" />

        <div className="w-full max-w-[480px] mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(36,25,22,0.05)] p-8 sm:p-12 z-10 relative">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#A86249] text-white font-display font-medium text-xl flex items-center justify-center shadow-sm">
              A
            </div>
            <span className="font-display font-bold text-xl text-[#2A211E]">Alvora</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-4xl text-[#2A211E] mb-3">Admin Login</h2>
            <p className="text-[14px] text-[#5C4F4A] font-medium">
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
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-[#2A211E] uppercase tracking-widest block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#8C7B74]" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@alvora.pk"
                  className="w-full pl-12 pr-4 py-3.5 text-[13px] rounded-xl border border-[#E7D9D0] bg-[#FAF6F2]/30 text-[#2A211E] placeholder:text-[#8C7B74]/60 focus:outline-none focus:border-[#A86249] focus:ring-1 focus:ring-[#A86249] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-[#2A211E] uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#8C7B74]" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 text-[13px] rounded-xl border border-[#E7D9D0] bg-[#FAF6F2]/30 text-[#2A211E] placeholder:text-[#8C7B74]/60 focus:outline-none focus:border-[#A86249] focus:ring-1 focus:ring-[#A86249] transition-colors font-sans tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8C7B74] hover:text-[#A86249] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-interactive w-full py-4 rounded-xl bg-[#A85A3B] hover:bg-[#8E4D31] text-white font-bold text-[11px] uppercase tracking-widest shadow-sm flex items-center justify-between px-6 transition-all duration-200 mt-4 disabled:opacity-50"
            >
              <span className="flex-1 text-center pl-4">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white/70 shrink-0" />
              ) : (
                <ArrowRight className="w-4 h-4 shrink-0" />
              )}
            </button>
          </form>

          <div className="relative flex items-center py-8 mt-2">
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest font-bold text-[#8C7B74]">
              OR
            </span>
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
          </div>

          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-[11px] text-[#8C7B74] hover:text-[#A86249] font-bold tracking-wider transition-colors"
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