import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, Circle, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Resolved';
  createdAt: string;
}

export const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchMessages = async () => {
    try {
      const data = await api.getContactMessages();
      setMessages(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateContactStatus(id, newStatus);
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, status: newStatus as any } : msg));
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading messages...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Contact Messages</h1>
          <p className="text-sm font-medium text-slate-500">Manage customer inquiries and support requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No contact messages found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject & Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((msg) => (
                <tr key={msg._id} className={msg.status === 'New' ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      msg.status === 'New' ? 'bg-rose-100 text-rose-700' :
                      msg.status === 'Read' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {msg.status === 'New' && <AlertCircle className="w-3 h-3" />}
                      {msg.status === 'Read' && <Clock className="w-3 h-3" />}
                      {msg.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{msg.name}</div>
                    <div className="text-xs text-slate-500">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="font-bold text-slate-900 mb-1">{msg.subject}</div>
                    <div className="text-slate-600 text-xs line-clamp-2">{msg.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <select
                      value={msg.status}
                      onChange={(e) => updateStatus(msg._id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
