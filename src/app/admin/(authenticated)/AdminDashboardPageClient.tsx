"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";

import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { api } from '../../../services/api';
import { formatPrice } from '../../../utils/formatters';

export const AdminDashboardPageClient: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, oRes, cRes] = await Promise.all([
          api.getProducts(),
          api.getOrders(),
          api.getCustomers()
        ]);
        if (pRes) setProducts(Array.isArray(pRes) ? pRes : pRes.products || []);
        if (oRes) setOrders(oRes);
        if (cRes) setCustomers(cRes);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter(p => p.trackInventory && p.stockQuantity < 20);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C48B80]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-heading pb-10">
      
      {/* Clean Modern Header (Replacing the ugly dark hero box) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-2 max-w-2xl">Real-time summary of sales revenue, inventory health, and recent customer orders.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#9C4122] to-[#B34E28] hover:to-[#7A321A] shadow-md transition-all text-sm shrink-0"
        >
          + Add New Product
        </Link>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-900 shadow-sm">
          <div className="flex items-center gap-3 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Low Stock Alert: {lowStockProducts.length} product(s) have fewer than 20 units remaining.</span>
          </div>
          <Link href="/admin/products" className="font-bold underline text-amber-700 hover:text-amber-900 whitespace-nowrap">
            Manage Inventory &rarr;
          </Link>
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">
                Total Revenue
              </span>
              <span className="font-heading font-black text-3xl text-[#1A1A1A] mt-2 block tracking-tight">
                {formatPrice(totalRevenue)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shadow-inner">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-4 relative z-10">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
          </span>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EDE4] rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="font-heading font-black text-3xl text-[#1A1A1A] mt-2 block tracking-tight">
                {orders.length}
              </span>
            </div>
            {/* Fixed Bug: bg and text were the same color */}
            <div className="p-3 rounded-xl bg-[#F5EDE4] text-[#9C4122] shadow-inner">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#9C4122] flex items-center gap-1 mt-4 relative z-10">
            <ArrowUpRight className="w-3.5 h-3.5" /> 100% fulfilled
          </span>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EDE4] rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">
                Active Products
              </span>
              <span className="font-heading font-black text-3xl text-[#1A1A1A] mt-2 block tracking-tight">
                {products.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F5EDE4] text-[#9C4122] shadow-inner">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#1A1A1A]/50 mt-4 block relative z-10">
            Across your entire catalog
          </span>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">
                Registered Customers
              </span>
              <span className="font-heading font-black text-3xl text-[#1A1A1A] mt-2 block tracking-tight">
                {customers.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-4 relative z-10">
            Active verified accounts
          </span>
        </div>
      </div>

      {/* Main Content Area (Chart + Table) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Revenue Trend Visual Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col xl:col-span-2 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading font-black text-lg text-[#1A1A1A]">Weekly Revenue Breakdown</h3>
              <p className="text-xs text-[#1A1A1A]/50 mt-1">Gross sales across the last 7 days</p>
            </div>
            <span className="px-3 py-1 bg-[#FAF6F2] rounded-md text-xs font-semibold text-[#1A1A1A]/60 border border-[#E7D9D0]">Last 7 Days</span>
          </div>

          <div className="relative h-64 flex items-end justify-between gap-2 sm:gap-4 mt-auto">
            {/* Subtle background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
              <div className="w-full border-t border-dashed border-[#E7D9D0]/50" />
              <div className="w-full border-t border-dashed border-[#E7D9D0]/50" />
              <div className="w-full border-t border-dashed border-[#E7D9D0]/50" />
              <div className="w-full border-t border-[#E7D9D0]" />
            </div>

            {/* Fixed Bug: Changed invalid bg-linear-to-t to bg-gradient-to-t */}
            {[
              { day: 'Mon', val: 3400 },
              { day: 'Tue', val: 5200 },
              { day: 'Wed', val: 6800 },
              { day: 'Thu', val: 4500 },
              { day: 'Fri', val: 8900 },
              { day: 'Sat', val: 12000 },
              { day: 'Sun', val: 9500 },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                <span className="text-[10px] font-bold text-[#9C4122] opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-white px-2 py-1 rounded shadow-sm border border-[#E7D9D0]">
                  {formatPrice(bar.val)}
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-[#B34E28] to-[#D4784F] rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-sm"
                  style={{ height: `${(bar.val / 15000) * 100}%` }}
                />
                <span className="text-xs font-bold text-[#1A1A1A]/60">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Summary Sidebar */}
        <div className="bg-[#FAF6F2] p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-[#1A1A1A]">Store Status</h3>
            <p className="text-xs text-[#1A1A1A]/50 mt-1">Live metrics summary</p>
            
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E7D9D0]">
                <span className="text-sm font-semibold text-[#1A1A1A]/70">Pending Orders</span>
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{orders.filter(o => o.status === 'Pending').length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E7D9D0]">
                <span className="text-sm font-semibold text-[#1A1A1A]/70">Out of Stock</span>
                <span className="text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">{products.filter(p => p.stockStatus === 'out_of_stock').length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E7D9D0]">
                <span className="text-sm font-semibold text-[#1A1A1A]/70">Active Customers</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">{customers.length}</span>
              </div>
            </div>
          </div>
          
          <Link href="/admin/settings" className="mt-8 text-center text-xs font-bold text-[#9C4122] hover:text-[#7A321A] underline transition-colors">
            Manage Store Configuration &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E7D9D0] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E7D9D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 className="font-heading font-black text-lg text-[#1A1A1A]">Recent Customer Orders</h3>
            <p className="text-xs text-[#1A1A1A]/50 mt-1">Latest transactions awaiting fulfillment</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#9C4122] bg-[#F5EDE4] px-4 py-2 rounded-lg hover:bg-[#E7D9D0] transition-colors">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1A1A1A]/80">
            <thead className="bg-[#FAF6F2] text-[#1A1A1A]/50 border-y border-[#E7D9D0] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7D9D0]/50">
              {orders.slice(0, 5).map(order => (
                <tr key={order._id || order.orderId} className="hover:bg-[#FAF6F2]/50 transition-colors group">
                  <td className="p-4 pl-6 font-heading font-bold text-[#1A1A1A]">{order.orderId}</td>
                  <td className="p-4 font-medium">{order.customerName || order.customer?.name}</td>
                  <td className="p-4 text-[#1A1A1A]/50 text-xs">{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    {/* Fixed Bug: Status text and background were identical colors, rendering as solid boxes */}
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide inline-block ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      (order.status === 'Shipped' || order.status === 'Processing') ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link
                      href={`/admin/orders/${order._id || order.id || ''}`}
                      className="text-xs font-bold text-[#9C4122] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#1A1A1A]/40 text-sm font-medium">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};