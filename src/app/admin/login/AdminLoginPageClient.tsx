"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

import { api, setAuthToken, getLastApiError } from '../../../services/api';

export const AdminLoginPageClient: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {/* Left Panel - Image */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-[#E9E1D9] items-center justify-center overflow-hidden">
        <Image
          src="/images/shop-banner.png" 
          alt="Alvora Skincare"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white font-display font-medium text-2xl flex items-center justify-center mb-6">
            A
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium mb-4 leading-tight">
            Pure Ingredients.<br/>Visible Results.
          </h2>
          <p className="text-white/80 max-w-md text-sm font-medium leading-relaxed">
            Manage your Alvora storefront, orders, and products through our secure admin dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#FAF6F2] md:bg-white relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
           <div className="w-10 h-10 rounded-full bg-[#9C4122] text-white font-display font-medium text-xl flex items-center justify-center shadow-sm">
            A
          </div>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3">
            <h1 className="font-display font-medium text-3xl text-[#1A1A1A]">Admin Login</h1>
            <p className="text-sm text-[#1A1A1A]/60 font-medium">
              Welcome back. Please enter your details.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-sm text-rose-700 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1A1A]/80 uppercase tracking-wider block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@alvora.pk"
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#9C4122] focus:ring-1 focus:ring-[#9C4122] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1A1A]/80 uppercase tracking-wider block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#E7D9D0] bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#9C4122] focus:ring-1 focus:ring-[#9C4122] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9C4122] to-[#B34E28] hover:from-[#7A321A] hover:to-[#9C4122] text-white font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-md"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/70" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-[#1A1A1A]/50 hover:text-[#9C4122] font-bold tracking-wide transition-colors"
            >
              &larr; Back to Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

