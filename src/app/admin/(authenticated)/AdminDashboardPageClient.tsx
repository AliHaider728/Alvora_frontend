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
        if (pRes) setProducts(pRes);
        if (oRes) setOrders(oRes);
        if (cRes) setCustomers(cRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-[#1A1A1A]/50 font-bold">Loading dashboard data...</div>;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.trackInventory && (p.stockQuantity ?? 0) < 20);

  return (
    <div className="space-y-6">
      

      {/* Top Welcome Banner */}
      <div className="bg-linear-to-r from-[#4D3D2D] to-[#1A1A1A] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C48B80] uppercase tracking-wider">Store Analytics</span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-0.5">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Real-time summary of sales revenue, inventory health, and recent customer orders.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-2xl bg-[#C48B80] hover:bg-[#A86249] text-white font-heading font-bold text-xs shrink-0 shadow-md transition-all"
        >
          + Add New Product
        </Link>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#F5EDE4] border border-[#E7D9D0] rounded-2xl p-4 flex items-center justify-between text-xs text-[#4D3D2D]">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-[#C48B80] shrink-0" />
            <span>Low Stock Alert: {lowStockProducts.length} product(s) have fewer than 20 units remaining.</span>
          </div>
          <Link href="/admin/products" className="font-bold underline text-amber-800 hover:text-amber-950">
            Manage Inventory &rarr;
          </Link>
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="font-heading font-black text-2xl text-[#1A1A1A] mt-1 block">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="font-heading font-black text-2xl text-[#1A1A1A] mt-1 block">
              {orders.length}
            </span>
            <span className="text-[11px] font-bold text-[#C48B80] flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% fulfilled
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#C48B80] text-[#C48B80]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider block">
              Active Products
            </span>
            <span className="font-heading font-black text-2xl text-[#1A1A1A] mt-1 block">
              {products.length}
            </span>
            <span className="text-[11px] text-[#1A1A1A]/50 mt-1 block font-medium">
              In 6 categories
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF6F2] text-[#C48B80]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider block">
              Registered Customers
            </span>
            <span className="font-heading font-black text-2xl text-[#1A1A1A] mt-1 block">
              {customers.length}
            </span>
            <span className="text-[11px] font-bold text-[#C48B80] flex items-center gap-0.5 mt-1">
              Active accounts
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F5EDE4] text-[#C48B80]">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Revenue Trend Visual Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-base text-[#1A1A1A]">Weekly Revenue Breakdown</h3>
          <span className="text-xs text-[#1A1A1A]/40 font-medium">Last 7 Days</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-[#E7D9D0]">
          {[
            { day: 'Mon', val: 340 },
            { day: 'Tue', val: 520 },
            { day: 'Wed', val: 680 },
            { day: 'Thu', val: 450 },
            { day: 'Fri', val: 890 },
            { day: 'Sat', val: 1200 },
            { day: 'Sun', val: 950 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold text-[#1A1A1A]/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatPrice(bar.val)}
              </span>
              <div
                className="w-full bg-linear-to-t from-[#C48B80] to-[#F1C9BD] rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                style={{ height: `${(bar.val / 1200) * 100}%` }}
              />
              <span className="text-xs font-bold text-[#1A1A1A]/70">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E7D9D0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E7D9D0] flex items-center justify-between">
          <h3 className="font-heading font-black text-base text-[#1A1A1A]">Recent Customer Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-[#C48B80] hover:text-[#A86249]">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1A1A1A]/80">
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
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map(order => (
                <tr key={order._id} className="hover:bg-[#FAF6F2] transition-colors">
                  <td className="p-4 pl-6 font-heading font-bold text-[#1A1A1A]">{order.orderId}</td>
                  <td className="p-4 font-medium">{order.customerName}</td>
                  <td className="p-4 text-[#1A1A1A]/40">{order.date}</td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Shipped' ? 'bg-[#C48B80] text-[#C48B80]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-xs font-bold text-[#C48B80] hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


