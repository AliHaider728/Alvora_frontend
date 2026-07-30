import React from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SeoHead } from '../../components/common/SeoHead';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useStore();

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Customers Roster" />

      <div>
        <h1 className="font-heading font-black text-2xl text-slate-900">Registered Customers</h1>
        <p className="text-xs text-slate-500 font-medium">Customer contact information and total order metrics.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Orders</th>
                <th className="p-4 pr-6 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={cust.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <span className="font-heading font-bold text-slate-900 block">{cust.name}</span>
                        <span className="text-[10px] text-slate-400">ID: {cust.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      <Mail className="w-3 h-3 text-slate-400" /> {cust.email}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Phone className="w-3 h-3 text-slate-400" /> {cust.phone}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{cust.joinedDate}</td>
                  <td className="p-4 font-bold text-sky-600">{cust.ordersCount} order(s)</td>
                  <td className="p-4 pr-6 text-right font-heading font-black text-slate-900">${cust.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
