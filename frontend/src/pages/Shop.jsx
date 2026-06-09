import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI, categoryAPI } from '../api/client';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function Shop({ openQuickView }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    categoryAPI.list().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    productAPI.list({ category: activeCat, search, page, limit: 12 })
      .then(({ data }) => { setProducts(data.products); setPagination(data.pagination); })
      .catch(() => {});
  }, [activeCat, search, page]);

  const handleQuickView = (product) => {
    if (openQuickView) openQuickView(product);
    else navigate(`/product/${product.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h1 className="display-font text-6xl md:text-8xl text-aura-primary">Collections</h1>
            <p className="mt-6 text-sm font-light text-aura-primary/80 max-w-md">Discover our curated assortments.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent border-b border-aura-clay pb-3 text-aura-primary placeholder-aura-primary/50 focus:border-aura-primary outline-none transition-colors" />
        </div>

        <div className="flex flex-wrap gap-8 text-xs uppercase tracking-widest font-bold mb-12 border-b border-aura-clay pb-6">
          <button onClick={() => { setActiveCat(null); setPage(1); }}
            className={`${!activeCat ? 'text-aura-terra border-b border-aura-terra' : 'text-aura-sage hover:text-aura-primary'} pb-2 transition-colors`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setPage(1); }}
              className={`${activeCat === c.id ? 'text-aura-terra border-b border-aura-terra' : 'text-aura-sage hover:text-aura-primary'} pb-2 transition-colors`}>
              {c.name}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div key={p.id} layout initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }} className="group cursor-pointer" onClick={() => handleQuickView(p)}>
                <div className="aspect-[3/4] bg-aura-clay overflow-hidden mb-6 relative rounded-t-full">
                  <img src={p.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-aura-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-aura-bg text-aura-primary px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl">Quick View</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="display-font text-2xl text-aura-primary group-hover:italic">{p.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-aura-sage mt-1 font-bold">{p.category_name || 'Collection'}</p>
                  </div>
                  <p className="text-lg text-aura-primary font-light">${formatPrice(p.price)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-4 mt-20">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-colors ${page === i + 1 ? 'bg-aura-primary text-white' : 'border border-aura-clay text-aura-primary hover:bg-aura-clay'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
