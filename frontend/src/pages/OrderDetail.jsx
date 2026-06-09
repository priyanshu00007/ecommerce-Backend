import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI, paymentAPI } from '../api/client';
import Loading from '../components/ui/Loading';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

const badgeClass = (status) => {
  const map = { delivered: 'bg-green-100 text-green-800', confirmed: 'bg-blue-100 text-blue-800', shipped: 'bg-yellow-100 text-yellow-800', pending: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-green-100 text-green-800', failed: 'bg-red-100 text-red-800', refunded: 'bg-purple-100 text-purple-800' };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.get(id).then(({ data }) => setOrder(data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!order) return <div className="h-screen flex items-center justify-center text-sm tracking-widest uppercase">Order not found</div>;

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    try { await orderAPI.cancel(id); const { data } = await orderAPI.get(id); setOrder(data); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link to="/orders" className="text-xs uppercase tracking-widest text-aura-sage hover:text-aura-primary mb-8 block font-bold">&larr; Back to Orders</Link>
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="display-font text-5xl md:text-6xl text-aura-primary">Order #{order.id}</h1>
            <p className="text-sm text-aura-sage mt-2">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-xs font-bold ${badgeClass(order.status)}`}>{order.status}</span>
            {order.status === 'pending' && (
              <button onClick={handleCancel} className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 font-bold">Cancel</button>
            )}
          </div>
        </div>

        <div className="bg-white/50 border border-aura-clay rounded-2xl p-8 mb-8">
          <h3 className="text-sm uppercase tracking-widest font-bold mb-6">Items</h3>
          <div className="space-y-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-aura-clay/50 pb-4">
                <div><p className="font-bold">{item.name}</p><p className="text-xs text-aura-sage">Qty: {item.quantity}</p></div>
                <p>${formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t border-aura-clay">
            <span className="display-font text-2xl">Total</span>
            <span className="display-font text-2xl">${formatPrice(order.total_amount)}</span>
          </div>
        </div>

        <div className="bg-white/50 border border-aura-clay rounded-2xl p-8">
          <h3 className="text-sm uppercase tracking-widest font-bold mb-6">Payment</h3>
          {(order.payments || []).length === 0 ? (
            <p className="text-aura-sage">No payment recorded</p>
          ) : order.payments.map((p) => (
            <div key={p.id} className="flex justify-between items-center">
              <div><p className="font-bold">{p.method?.toUpperCase()}</p><p className="text-xs text-aura-sage">{new Date(p.created_at).toLocaleString()}</p></div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass(p.status)}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
