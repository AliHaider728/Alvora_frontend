import React, { useState } from 'react';
import { User, Package, MapPin, LogOut, Clock, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';
import { useDialog } from '../../context/DialogContext';

export const AccountPage: React.FC = () => {
  const { orders, customers, updateOrderStatus, settings } = useStore();
  const { showToast } = useToast();
  const { confirm } = useDialog();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  const customer = customers[0] || {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    addresses: []
  };



  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans py-12 flex items-center justify-center">
        <SeoHead title="Customer Login" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-2xl text-slate-900">Welcome Back!</h2>
            <p className="text-xs text-slate-500">Sign in to view your orders, track shipments, and manage wishlist.</p>
          </div>

          <form onSubmit={e => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                defaultValue="ali.raza@example.com"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-rose-500 text-white font-heading font-extrabold text-sm shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-6">
      <SeoHead title="My Account & Order History" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'My Account' }]} />

        {/* Profile Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full ring-4 ring-rose-100 flex items-center justify-center bg-rose-500 text-white font-heading font-black text-2xl">
                {customer.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h1 className="font-heading font-black text-2xl text-slate-900">{customer.name}</h1>
              <span className="text-xs text-slate-500 font-medium">{customer.email} &bull; {customer.phone}</span>
            </div>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Tabs */}
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
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-heading font-bold text-xs transition-colors ${
                activeTab === 'addresses' ? 'bg-rose-500 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
          </aside>

          <main className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-heading font-black text-xl text-slate-900 mb-4">Your Recent Toy Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 p-6 bg-white rounded-3xl text-center">No past orders found.</p>
                ) : (
                  orders.map(order => {
                    return (
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
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="font-heading font-black text-xl text-slate-900 mb-4">Saved Addresses</h2>
                {customer.addresses.map(addr => (
                  <div key={addr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">{addr.name} (Default)</span>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
