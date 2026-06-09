import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { wishlistAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    wishlistAPI.get().then(({ data }) => setItems(data)).catch(() => {});
  }, [user]);

  const handleRemove = async (id) => {
    try { await wishlistAPI.remove(id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleAddToCart = async (productId) => {
    try { await addItem(productId); handleRemove(items.find(i => i.product_id === productId)?.id); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="display-font text-6xl md:text-8xl text-aura-primary mb-16">Wishlist</h1>
        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="mx-auto mb-4 text-aura-clay" />
            <p className="text-aura-sage mb-8">Your wishlist is empty</p>
            <Link to="/shop" className="text-sm uppercase tracking-widest border-b border-aura-primary pb-1 font-bold">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {items.map((item) => (
              <div key={item.id} className="group">
                <div className="aspect-[3/4] bg-aura-clay rounded-t-full overflow-hidden mb-4 relative">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <button onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white transition-colors">
                    <Heart size={16} className="fill-red-500 text-red-500" />
                  </button>
                </div>
                <Link to={`/product/${item.product_id}`}>
                  <h3 className="display-font text-2xl text-aura-primary group-hover:italic">{item.name}</h3>
                  <p className="text-lg text-aura-primary font-light">${formatPrice(item.price)}</p>
                </Link>
                <button onClick={() => handleAddToCart(item.product_id)}
                  className="mt-4 text-xs uppercase tracking-widest border-b border-aura-primary pb-1 font-bold hover:text-aura-terra transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
