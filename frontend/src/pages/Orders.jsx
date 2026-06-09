import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

const badgeClass = (status) => {
  const map = { delivered: 'bg-green-100 text-green-800', confirmed: 'bg-blue-100 text-blue-800', shipped: 'bg-yellow-100 text-yellow-800', pending: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800' };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.mine().then(({ data }) => setOrders(data)).catch(() => {});
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="display-font text-6xl md:text-8xl text-aura-primary mb-16">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-aura-sage mb-8">No orders yet</p>
            <Link to="/shop" className="text-sm uppercase tracking-widest border-b border-aura-primary pb-1 font-bold">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <Link key={o.id} to={`/orders/${o.id}`}
                className="block bg-white/50 border border-aura-clay rounded-2xl p-8 hover:border-aura-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="display-font text-2xl text-aura-primary">Order #{o.id}</p>
                    <p className="text-xs text-aura-sage mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass(o.status)}`}>{o.status}</span>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-sm text-aura-primary/60">Payment: <span className={`font-bold ${badgeClass(o.payment_status || 'pending')} px-2 py-0.5 rounded text-[10px]`}>{o.payment_status || 'pending'}</span></p>
                  <p className="display-font text-2xl text-aura-primary">${formatPrice(o.total_amount)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
