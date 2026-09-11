"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { api, setAuthToken, getLastApiError } from '../../../services/api';

export const AdminLoginPageClient: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    let errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(email)) errors.email = "Please enter a valid email address";
    
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
          setError('Backend API is unreachable. Please verify the backend server is running.');
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
      {/* Left Panel - Image */}
      <div className="hidden md:flex md:w-1/2 relative p-12 lg:p-20 overflow-hidden">
        <Image
          src="/images/admin/login-bg.png" 
          alt="Alvora Skincare Admin"
          fill
          className="object-cover object-[15%_100%] lg:object-[20%_100%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-8 bg-[#C87355]"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C87355]">Skincare For A Brighter You</span>
          </div>
          <h1 className="text-5xl lg:text-6xl text-white font-display mb-4 leading-[1.1]">
            Pure Ingredients.<br />
            <span className="text-[#C87355]">Visible Results.</span>
          </h1>
          <p className="text-white/80 text-sm max-w-sm leading-relaxed mb-12">
            Manage your Alvora storefront, orders, and products through our secure admin dashboard.
          </p>
          <div className="mt-auto">
            <p className="text-white/60 text-xs italic">Care for your natural beauty</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF6F2] rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-display text-[#1A1A1A] mb-2">Admin Login</h2>
            <p className="text-[#A1A7AA] text-xs font-medium mb-8">Welcome back. Please enter your details.</p>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-rose-700 text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
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
                    onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({...p, email: ''})); }}
                    placeholder="admin@alvora.pk"
                    className={`w-full pl-11 pr-4 py-3.5 text-[13px] rounded-lg border ${fieldErrors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30' : 'border-[#E7D9D0] focus:border-[#A86249] focus:ring-[#A86249]'} bg-white text-[#1A1A1A] placeholder:text-[#A1A7AA]/70 focus:outline-none focus:ring-1 transition-colors`}
                  />
                  {fieldErrors.email && <p className="text-rose-500 text-[11px] mt-1.5 ml-1 font-medium">{fieldErrors.email}</p>}
                </div>
              </div>

              {/* Password Field */}
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
                    onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({...p, password: ''})); }}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className={`w-full pl-11 pr-11 py-3.5 text-[13px] rounded-lg border ${fieldErrors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30' : 'border-[#E7D9D0] focus:border-[#A86249] focus:ring-[#A86249]'} bg-white text-[#1A1A1A] placeholder:text-[#A1A7AA]/70 focus:outline-none focus:ring-1 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1A7AA] hover:text-[#1A1A1A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {fieldErrors.password && <p className="text-rose-500 text-[11px] mt-1.5 ml-1 font-medium">{fieldErrors.password}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#A85A3B] hover:bg-[#8E4D31] text-white font-bold text-[11px] uppercase tracking-widest flex items-center justify-center relative transition-all duration-200 mt-2 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="absolute right-5 w-4 h-4" strokeWidth={2} />}
              </button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-[#E7D9D0]"></div>
              <span className="relative bg-white px-4 text-[9px] font-bold tracking-[0.2em] text-[#A1A7AA] uppercase">Or</span>
            </div>

            <button
              onClick={() => router.push('/')}
              className="mt-8 w-full flex items-center justify-center gap-2 text-xs font-medium text-[#A1A7AA] hover:text-[#1A1A1A] transition-colors"
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
