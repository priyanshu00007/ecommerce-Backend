import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { productAPI } from '../../api/client';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function SearchOverlay({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) { setQuery(''); return; }
    productAPI.list({ limit: 4 }).then(({ data }) => setProducts(data.products)).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      productAPI.list({ limit: 4 }).then(({ data }) => setProducts(data.products)).catch(() => {});
      return;
    }
    const timer = setTimeout(() => {
      productAPI.list({ search: query, limit: 8 }).then(({ data }) => setProducts(data.products)).catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (product) => {
    setQuery('');
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[105] bg-aura-bg/95 flex flex-col p-6 md:p-24 overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-12 right-12 text-aura-primary hover:rotate-90 transition-transform duration-500 z-10"><X size={32} /></button>
          <div className="max-w-6xl mx-auto w-full mt-16 md:mt-24">
            <input
              type="text" placeholder="Search the archives..." autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-aura-primary display-font text-5xl md:text-7xl py-4 focus:outline-none placeholder-aura-primary/30 text-aura-primary"
            />
            <div className="mt-16">
              <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold">
                {query ? `Results for "${query}"` : 'Trending Artifacts'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(p => (
                  <div key={p.id} className="group cursor-pointer" onClick={() => handleSelect(p)}>
                    <div className="aspect-[3/4] overflow-hidden bg-aura-clay mb-4 rounded-2xl">
                      <img src={p.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400'} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-aura-sage mb-1">{p.category_name || 'Collection'}</p>
                    <h4 className="display-font text-xl text-aura-primary group-hover:italic">{p.name}</h4>
                    <p className="text-sm font-light">${formatPrice(p.price)}</p>
                  </div>
                ))}
                {products.length === 0 && <p className="text-lg text-aura-primary/60 font-light italic col-span-full">No artifacts found.</p>}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
