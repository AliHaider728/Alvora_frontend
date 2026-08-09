import React, { useState } from 'react';
import { Eye, Search, Truck, X, CheckCircle2, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Order } from '../../types';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';
import { useDialog } from '../../context/DialogContext';
import { getLastApiError } from '../../services/api';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, settings } = useStore();
  const { showToast } = useToast();
  const { confirm } = useDialog();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredOrders = orders.filter(o =>
    [o.id, o.customerName, o.email, o.status].some(value =>
      (value || '').toLowerCase().includes(normalizedSearchQuery)
    )
  );

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    if (newStatus === order.status) { if (newStatus === 'Delivered') showToast('This order is already marked as delivered.', 'info'); return; }
    const isDelivered = newStatus === 'Delivered'; const isCancelled = newStatus === 'Cancelled';
    const accepted = await confirm({
      title: isDelivered ? 'Mark this order as delivered?' : isCancelled ? 'Cancel this order?' : `Mark this order as ${newStatus.toLowerCase()}?`,
      description: isDelivered
        ? `Order ${order.id} for ${order.customerName} (${order.email}) is currently ${order.status}. The customer’s delivery email will be sent if it has not already been sent.`
        : isCancelled ? 'The order status will change to Cancelled. Tracked product and variant stock will be restored where applicable.'
        : `Order ${order.id} will move from ${order.status} to ${newStatus}.`,
      cancelLabel: isDelivered ? 'Not Yet' : isCancelled ? 'Keep Order' : 'Keep Current Status',
      confirmLabel: isDelivered ? 'Mark Delivered' : isCancelled ? 'Cancel Order' : `Mark ${newStatus}`,
      destructive: isCancelled
    });
    if (!accepted) return;
    setUpdatingOrderId(order.id);
    const result = await updateOrderStatus(order.id, newStatus);
    setUpdatingOrderId('');
    if (!result) { showToast(getLastApiError() || 'Order update failed.', 'error'); return; }
    const notification = result.notification || {};
    if (isDelivered) {
      if (notification.alreadyDelivered || notification.emailStatus === 'already_sent') showToast('This order is already marked as delivered. The delivery email was not resent.', 'info');
      else if (notification.emailStatus === 'sent') showToast('Order marked as delivered. Delivery email sent.', 'success');
      else if (notification.emailStatus === 'failed') showToast('Order marked as delivered, but the email could not be sent.', 'warning');
      else showToast('Order marked as delivered.', 'success');
    } else if (isCancelled) showToast(notification.inventoryRestored ? 'Order cancelled and tracked stock restored.' : 'Order cancelled. No tracked stock required restoration.', 'success');
    else showToast(`Order marked as ${newStatus}.`, 'success');
    if (selectedOrder?.id === order.id) setSelectedOrder(result.order);
  };

  const handleSaveTracking = async (orderId: string) => {
    if (!trackingInput.trim()) return;
    const updated = await updateOrderTracking(orderId, trackingInput.trim());
    if (!updated) { showToast(getLastApiError() || 'Could not save the tracking code.', 'error'); return; }
    showToast(`Tracking code saved for ${orderId}.`, 'success');
    if (selectedOrder) setSelectedOrder(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Manage Customer Orders" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500 font-medium">Fulfill customer orders, update delivery statuses, and issue tracking numbers.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs max-w-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.id || `${order.email}-${order.date}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-heading font-bold text-slate-900">{order.id}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 block">{order.customerName}</span>
                    <span className="text-[10px] text-slate-400">{order.email}</span>
                  </td>
                  <td className="p-4 text-slate-500">{order.date}</td>
                  <td className="p-4 font-medium">{order.paymentMethod}</td>
                  <td className="p-4 font-bold text-slate-900">{formatPrice(order.total, settings.currency)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={e => { void handleStatusChange(order, e.target.value as Order['status']); }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border border-transparent cursor-pointer ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setTrackingInput(order.trackingNumber || '');
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4 text-slate-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Order Receipt</span>
                <h3 className="font-heading font-black text-lg text-slate-900">{selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Shipping Address:</span>
                <p className="text-slate-600">{selectedOrder.shippingAddress.fullName} ({selectedOrder.shippingAddress.phone})</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
              </div>

              {/* Courier Tracking */}
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                <span className="font-bold text-sky-900 block">Courier Tracking Code</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter TCS / Leopard tracking code..."
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-sky-200 bg-white"
                  />
                  <button
                    onClick={() => { void handleSaveTracking(selectedOrder.id); }}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Items Purchased:</span>
                {selectedOrder.items.map((it, idx) => (
                  <div key={`${it.productId || it.name}-${it.selectedVariant || 'default'}-${idx}`} className="flex items-center justify-between text-slate-700">
                    <div className="flex flex-col">
                      <span>
                        {it.quantity}x {it.name}
                      </span>
                      {it.selectedAttributes && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {Object.entries(it.selectedAttributes).map(([k, v]) => (
                            <span key={k} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                      {!it.selectedAttributes && it.selectedVariant && (
                        <span className="text-[10px] text-slate-500">{it.selectedVariant}</span>
                      )}
                      {it.sku && <span className="text-[9px] text-slate-400 mt-0.5 font-mono">SKU: {it.sku}</span>}
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(it.price * it.quantity, settings.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between font-heading font-black text-slate-900 text-sm">
                <span>Total Amount (COD):</span>
                <span className="text-rose-600">{formatPrice(selectedOrder.total, settings.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
