"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldCheck, Leaf, Sparkles, ArrowLeft } from 'lucide-react';

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
      <div className="hidden md:flex md:w-[55%] lg:w-[60%] relative bg-[#FAF6F2] items-center p-12 lg:p-20 overflow-hidden">
        <Image
          src="/images/admin/login-bg.png" 
          alt="Alvora Skincare Admin"
          fill
          className="object-cover opacity-90"
          priority
        />
        
        {/* Subtle gradient overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-[#9C4122]" />
              <span className="text-[10px] font-bold text-[#9C4122] uppercase tracking-[0.2em]">
                Skincare for a brighter you
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl leading-[1.1] mb-6 text-[#1A1A1A]">
              Pure Ingredients.<br/>
              <span className="text-[#9C4122]">Visible Results.</span>
            </h1>

            <p className="text-[#1A1A1A]/70 text-[15px] font-medium leading-relaxed max-w-sm mb-12">
              Manage your Alvora storefront, orders, and products through our secure admin dashboard.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <Sparkles className="w-5 h-5 text-[#9C4122]" strokeWidth={1.5} />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Premium<br/>Skincare</span>
              </div>
              <div className="w-px h-10 bg-[#1A1A1A]/10" />
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-5 h-5 text-[#9C4122]" strokeWidth={1.5} />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Trusted<br/>Quality</span>
              </div>
              <div className="w-px h-10 bg-[#1A1A1A]/10" />
              <div className="flex flex-col gap-2">
                <Leaf className="w-5 h-5 text-[#9C4122]" strokeWidth={1.5} />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Natural<br/>Ingredients</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-16">
            <span className="font-display italic text-2xl lg:text-3xl text-[#9C4122]">
              Care for your natural beauty
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white relative">
        <div className="w-full max-w-[400px] mx-auto">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#9C4122] text-white font-display font-medium text-xl flex items-center justify-center shadow-sm">
              A
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A1A]">Alvora</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-3xl text-[#1A1A1A] mb-2">Admin Login</h2>
            <p className="text-[14px] text-[#1A1A1A]/60 font-medium">
              Welcome back. Please enter your details.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-sm text-rose-700 font-medium mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#1A1A1A]/40" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@alvora.pk"
                  className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#9C4122] focus:ring-1 focus:ring-[#9C4122] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#1A1A1A]/40" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 text-sm rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#9C4122] focus:ring-1 focus:ring-[#9C4122] transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1A1A1A]/40 hover:text-[#9C4122] transition-colors"
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
              className="btn-interactive w-full py-3.5 rounded-xl bg-gradient-to-br from-[#D4784F] to-[#9C4122] hover:from-[#9C4122] hover:to-[#7A321A] text-white font-bold text-[11px] uppercase tracking-widest shadow-md flex items-center justify-between px-6 transition-all duration-200 mt-2 disabled:opacity-50"
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

          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40">
              OR
            </span>
            <div className="flex-grow border-t border-[#E7D9D0]"></div>
          </div>

          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-xs text-[#1A1A1A]/50 hover:text-[#9C4122] font-bold tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Storefront
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};