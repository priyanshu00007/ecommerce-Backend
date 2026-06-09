import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Magnetic from './Magnetic';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateItem, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-md z-[110]" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-aura-bg z-[111] shadow-2xl flex flex-col"
          >
            <div className="p-8 md:p-10 flex justify-between items-center border-b border-aura-clay/50 shrink-0">
              <h2 className="display-font text-3xl md:text-4xl text-aura-primary">Your Cart</h2>
              <Magnetic><button onClick={onClose} className="p-3 rounded-full hover:bg-aura-clay/50 transition-colors"><X size={24} /></button></Magnetic>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-aura-primary/50">
                  <ShoppingBag size={48} className="mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest font-bold">Your cart is empty</p>
                </div>
              ) : items.map((item) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-24 h-32 md:w-28 md:h-36 bg-aura-clay rounded-t-full overflow-hidden shrink-0">
                    <img src={item.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200'} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 md:py-2">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="display-font text-xl md:text-2xl text-aura-primary">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-aura-sage hover:text-aura-terra transition-colors"><X size={16} /></button>
                      </div>
                      <p className="text-[10px] md:text-xs text-aura-sage uppercase tracking-widest mt-1 font-bold">{item.category_name || 'Artifact'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 border border-aura-clay rounded-full px-3 py-1 md:px-4 md:py-2">
                        <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="text-aura-primary hover:text-aura-terra"><Minus size={12} /></button>
                        <span className="text-xs md:text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} className="text-aura-primary hover:text-aura-terra"><Plus size={12} /></button>
                      </div>
                      <p className="text-lg md:text-xl text-aura-primary">${formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 md:p-10 bg-aura-primary text-aura-bg shrink-0">
              <div className="flex justify-between mb-4 text-xs uppercase tracking-widest text-aura-sage font-bold">
                <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-8 text-xs uppercase tracking-widest text-aura-sage font-bold">
                <span>Shipping</span><span>Complimentary</span>
              </div>
              <div className="flex justify-between mb-8 border-t border-white/10 pt-6">
                <span className="display-font text-2xl md:text-3xl">Total</span>
                <span className="display-font text-2xl md:text-3xl">${formatPrice(subtotal)}</span>
              </div>
              <Magnetic>
                <button onClick={handleCheckout} disabled={items.length === 0}
                  className="w-full py-5 md:py-6 bg-aura-gold text-[#1A1A1A] uppercase tracking-widest text-sm font-bold hover:bg-aura-bg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Checkout <ArrowUpRight size={18} />
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
