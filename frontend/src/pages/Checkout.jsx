import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../api/client';
import Magnetic from '../components/ui/Magnetic';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [payMethod, setPayMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({ email: '', phone: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '' });

  if (!user) { navigate('/login'); return null; }
  if (items.length === 0 && !orderId) {
    return (
      <div className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="display-font text-5xl mb-6 text-aura-primary">Your cart is empty.</h1>
        <button onClick={() => navigate('/shop')} className="text-sm uppercase tracking-widest border-b border-aura-primary pb-1 font-bold">Continue Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const { data: orderData } = await orderAPI.place();
      setOrderId(orderData.order_id);
      const { data: payData } = await paymentAPI.process({ order_id: orderData.order_id, method: payMethod });
      clearCart();
      alert(`Order #${orderData.order_id} placed! Payment queued.`);
      navigate(`/orders/${orderData.order_id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-32 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24">
        <div className="flex-1">
          <h1 className="display-font text-5xl md:text-6xl text-aura-primary mb-12">Secure Checkout</h1>
          <div className="space-y-16">
            <section>
              <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold border-b border-aura-clay pb-4">01. Contact</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                <input type="tel" placeholder="Phone *" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
              </div>
            </section>
            <section>
              <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold border-b border-aura-clay pb-4">02. Shipping</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <input type="text" placeholder="First Name *" value={form.firstName} onChange={(e) => setForm(f => ({...f, firstName: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                <input type="text" placeholder="Last Name *" value={form.lastName} onChange={(e) => setForm(f => ({...f, lastName: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
              </div>
              <input type="text" placeholder="Address *" value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))}
                className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <input type="text" placeholder="City *" value={form.city} onChange={(e) => setForm(f => ({...f, city: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                <input type="text" placeholder="State *" value={form.state} onChange={(e) => setForm(f => ({...f, state: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                <input type="text" placeholder="ZIP *" value={form.zip} onChange={(e) => setForm(f => ({...f, zip: e.target.value}))}
                  className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
              </div>
            </section>
            <section>
              <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold border-b border-aura-clay pb-4">03. Payment</p>
              <div className="flex gap-4 mb-10">
                <button type="button" onClick={() => setPayMethod('card')}
                  className={`flex-1 flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${payMethod === 'card' ? 'border-aura-primary bg-aura-clay/20' : 'border-aura-clay text-aura-sage hover:border-aura-primary/50'}`}>
                  <CreditCard className="mb-3" /><span className="text-xs uppercase tracking-widest font-bold">Card</span>
                </button>
                <button type="button" onClick={() => setPayMethod('upi')}
                  className={`flex-1 flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${payMethod === 'upi' ? 'border-aura-primary bg-aura-clay/20' : 'border-aura-clay text-aura-sage hover:border-aura-primary/50'}`}>
                  <Smartphone className="mb-3" /><span className="text-xs uppercase tracking-widest font-bold">UPI</span>
                </button>
              </div>
              {payMethod === 'card' ? (
                <div className="space-y-8">
                  <input type="text" placeholder="Card Number" className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                  <div className="grid grid-cols-2 gap-8">
                    <input type="text" placeholder="MM / YY" className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                    <input type="text" placeholder="CVC" className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-aura-clay">
                  <p className="text-sm font-bold text-aura-primary mb-2">Pay with UPI</p>
                  <input type="text" placeholder="username@upi"
                    className="w-full bg-transparent outline-none border-b border-aura-primary/30 pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-terra transition-colors" />
                </div>
              )}
            </section>
            <Magnetic>
              <button onClick={handlePlaceOrder} disabled={processing}
                className="w-full bg-aura-primary text-aura-bg px-12 py-6 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-aura-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {processing ? 'Processing...' : 'Place Secure Order'} <ArrowUpRight size={18} />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="w-full lg:w-[450px]">
          <div className="bg-white/50 border border-aura-clay p-8 md:p-10 rounded-3xl sticky top-32">
            <h3 className="display-font text-2xl text-aura-primary mb-8">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-aura-clay rounded-lg overflow-hidden shrink-0">
                    <img src={item.image_url || '/images/product.svg'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="display-font text-lg text-aura-primary">{item.name}</h4>
                    <p className="text-[10px] text-aura-sage uppercase tracking-widest font-bold mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm text-aura-primary mt-1">${formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-aura-clay pt-6 space-y-4">
              <div className="flex justify-between text-sm uppercase tracking-widest text-aura-sage font-bold"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm uppercase tracking-widest text-aura-sage font-bold"><span>Shipping</span><span>Free</span></div>
            </div>
            <div className="border-t border-aura-clay mt-6 pt-6 flex justify-between items-center">
              <span className="display-font text-3xl text-aura-primary">Total</span>
              <span className="display-font text-3xl text-aura-primary">${formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
