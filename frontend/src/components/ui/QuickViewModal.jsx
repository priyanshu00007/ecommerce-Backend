import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Magnetic from './Magnetic';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function QuickViewModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    await addItem(product.id, qty);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="bg-aura-bg w-full max-w-5xl h-[85vh] md:h-auto rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 z-20 text-aura-primary hover:rotate-90 transition-transform bg-aura-bg/80 rounded-full p-2 backdrop-blur-md">
            <X size={24} />
          </button>
          <div className="w-full md:w-1/2 h-[40vh] md:h-[70vh] bg-aura-clay">
            <img src={product.image_url || '/images/product.svg'} alt={product.name}
              className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto">
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold mb-4">{product.category_name || 'Signature Collection'}</p>
            <h2 className="display-font text-4xl md:text-6xl text-aura-primary mb-4">{product.name}</h2>
            <p className="text-2xl text-aura-primary font-light mb-4">${formatPrice(product.price)}</p>
            {product.avg_rating > 0 && (
              <p className="text-sm text-aura-sage mb-2">⭐ {Number(product.avg_rating).toFixed(1)} ({product.review_count} reviews)</p>
            )}
            <p className="text-aura-primary/80 font-light leading-relaxed mb-4">{product.description || 'A meticulously crafted artifact.'}</p>
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-aura-terra text-xs uppercase tracking-widest font-bold mb-6">Only {product.stock} left in stock</p>
            )}
            {product.stock === 0 && (
              <p className="text-red-500 text-xs uppercase tracking-widest font-bold mb-6">Out of Stock</p>
            )}
            {product.stock > 0 && (
              <div className="flex items-center gap-6 mt-auto">
                <div className="flex items-center gap-6 border border-aura-clay rounded-full px-6 py-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-aura-primary hover:text-aura-terra"><Minus size={16} /></button>
                  <span className="text-lg font-semibold w-4 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-aura-primary hover:text-aura-terra"><Plus size={16} /></button>
                </div>
                <Magnetic>
                  <button onClick={handleAdd}
                    className="flex-1 bg-aura-primary text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-bold hover:bg-aura-gold transition-colors whitespace-nowrap">
                    Add to Cart
                  </button>
                </Magnetic>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
