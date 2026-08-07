import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';
import { api, setAuthToken, removeAuthToken, getAdminSessionUser, isAdmin } from '../../services/api';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, settings } = useStore();
  const { showToast } = useToast();

  const [view, setView] = useState<'login' | 'signup' | 'forgot-password' | 'account'>('login');
  const [user, setUser] = useState<any>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'orders'>('orders');

  // Check initial auth state
  useEffect(() => {
    const checkAuth = () => {
      const sessionUser = getAdminSessionUser();
      if (sessionUser) {
        if (isAdmin()) {
          navigate('/admin');
          return;
        }
        setUser(sessionUser);
        setView('account');
      } else {
        setUser(null);
        if (view === 'account') {
          setView('login');
        }
      }
    };
    
    checkAuth();
    window.addEventListener('pb-auth-changed', checkAuth);
    return () => window.removeEventListener('pb-auth-changed', checkAuth);
  }, [navigate, view]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return showToast('Please fill all fields', 'error');
    
    setIsSubmitting(true);
    try {
      const res = await api.login(email, password);
      if (res && res.token) {
        if (['admin', 'super_admin'].includes(res.user?.role)) {
           setAuthToken(res.token);
           localStorage.setItem('pb_admin_user', JSON.stringify(res.user));
           navigate('/admin');
           return;
        }
        
        setAuthToken(res.token);
        localStorage.setItem('pb_admin_user', JSON.stringify(res.user));
        setUser(res.user);
        setView('account');
        showToast('Login successful', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return showToast('Please fill all fields', 'error');
    }
    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    if (password.length < 8) {
      return showToast('Password must be at least 8 characters', 'error');
    }
    
    setIsSubmitting(true);
    try {
      await api.register(name, email, password);
      showToast('Account created successfully. Please sign in.', 'success');
      setView('login');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return showToast('Please enter your email', 'error');
    
    setIsSubmitting(true);
    try {
      await api.forgotPassword(email);
      showToast('If an account exists, a verification code has been sent.', 'success');
      navigate('/reset-password');
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      removeAuthToken();
      localStorage.removeItem('pb_admin_user');
      setUser(null);
      setView('login');
      setEmail('');
      setPassword('');
    }
  };

  if (view === 'account' && user) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans py-6">
        <SeoHead title="My Account & Order History" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'My Account' }]} />
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full ring-4 ring-rose-100 flex items-center justify-center bg-rose-500 text-white font-heading font-black text-2xl">
                {user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-heading font-black text-2xl text-slate-900">{user.name}</h1>
                <span className="text-xs text-slate-500 font-medium">{user.email}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="space-y-2 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm h-fit">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-heading font-bold text-xs transition-colors ${
                  activeTab === 'orders' ? 'bg-rose-500 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Order History ({orders.length})</span>
              </button>
            </aside>

            <main className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="font-heading font-black text-xl text-slate-900 mb-4">Your Recent Toy Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-xs text-slate-500 p-6 bg-white rounded-3xl text-center">No past orders found.</p>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="font-heading font-bold text-sm text-slate-900">{order.id}</span>
                            <span className="text-xs text-slate-400 block">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                              order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                              <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                              <span className="flex-1 font-medium text-slate-800">
                                {it.name} (Qty: {it.quantity}) {it.selectedVariant ? `[${it.selectedVariant}]` : ''}
                              </span>
                              <span className="font-bold text-slate-900">{formatPrice(it.price * it.quantity, settings.currency)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Tracking Code: {order.trackingNumber || 'Pending'}</span>
                          <span className="font-heading font-extrabold text-base text-rose-600">Total: {formatPrice(order.total, settings.currency)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans py-12 flex items-center justify-center">
        <SeoHead title="Forgot Password" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6 relative">
          <button
            onClick={() => setView('login')}
            className="absolute left-6 top-6 text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Back to login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center space-y-2 pt-4">
            <h2 className="font-heading font-black text-2xl text-slate-900">Reset Password</h2>
            <p className="text-xs text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 transition-colors text-white font-heading font-extrabold text-sm shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 flex items-center justify-center px-4">
      <SeoHead title="Customer Login / Sign Up" />
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-heading font-black text-2xl text-slate-900">
            {view === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {view === 'login' 
              ? 'Sign in to view your orders, track shipments, and manage wishlist.' 
              : 'Sign up to shop, manage orders, and create a wishlist.'}
          </p>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setView('signup'); setEmail(''); setPassword(''); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Don't have an account? <span className="text-rose-500">Sign Up</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 flex justify-center items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setView('login'); setPassword(''); setConfirmPassword(''); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Already have an account? <span className="text-rose-500">Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
