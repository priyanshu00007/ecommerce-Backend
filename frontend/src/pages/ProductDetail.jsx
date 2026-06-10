import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, Star } from 'lucide-react';
import { productAPI, reviewAPI } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';
import Magnetic from '../components/ui/Magnetic';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.get(id).then(({ data }) => setProduct(data)),
      reviewAPI.byProduct(id).then(({ data }) => setReviews(data)),
    ]).catch(() => navigate('/shop')).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    await addItem(product.id, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.add(id, reviewForm);
      const { data } = await reviewAPI.byProduct(id);
      setReviews(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { alert(err.response?.data?.message || 'Error submitting review'); }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-32 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-xs uppercase tracking-widest text-aura-sage hover:text-aura-primary mb-12 block font-bold">&larr; Back</button>
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 mb-32">
          <div className="w-full md:w-1/2">
            <div className="aspect-[3/4] bg-aura-clay rounded-t-[4rem] overflow-hidden">
              <img src={product.image_url || '/images/product.svg'} alt={product.name}
                className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold mb-4">{product.category_name || 'Collection'}</p>
            <h1 className="display-font text-5xl md:text-7xl text-aura-primary mb-6">{product.name}</h1>
            <p className="text-3xl text-aura-primary font-light mb-8">${formatPrice(product.price)}</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={16}
                className={i < Math.round(product.avg_rating || 0) ? 'text-aura-gold fill-aura-gold' : 'text-aura-clay'} />)}</div>
              <span className="text-sm text-aura-sage">({product.review_count} reviews)</span>
            </div>
            <p className="text-aura-primary/80 font-light leading-relaxed mb-8">{product.description || 'No description available.'}</p>
            <p className="text-sm text-aura-sage mb-2"><strong>Stock:</strong> {product.stock} units</p>
            {product.stock > 0 && (
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-6 border border-aura-clay rounded-full px-6 py-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-aura-primary hover:text-aura-terra"><Minus size={16} /></button>
                  <span className="text-lg font-semibold w-4 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-aura-primary hover:text-aura-terra"><Plus size={16} /></button>
                </div>
                <Magnetic><button onClick={handleAdd}
                  className="flex-1 bg-aura-primary text-white px-10 py-4 rounded-full uppercase tracking-widest text-sm font-bold hover:bg-aura-gold transition-colors flex items-center gap-2">
                  <ShoppingBag size={16} /> Add to Cart</button></Magnetic>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl">
          <h2 className="display-font text-4xl text-aura-primary mb-12">Reviews</h2>
          {user && (
            <form onSubmit={handleReview} className="mb-16 bg-white/50 border border-aura-clay p-8 rounded-2xl">
              <h3 className="text-sm uppercase tracking-widest font-bold mb-6">Write a Review</h3>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewForm(f => ({...f, rating: s}))}>
                    <Star size={20} className={s <= reviewForm.rating ? 'text-aura-gold fill-aura-gold' : 'text-aura-clay'} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(f => ({...f, comment: e.target.value}))}
                placeholder="Share your thoughts..." rows={3}
                className="w-full bg-transparent border-b border-aura-clay pb-3 text-aura-primary placeholder-aura-primary/50 focus:outline-none mb-6" />
              <Magnetic><button type="submit" className="bg-aura-primary text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-aura-gold transition-colors">Submit</button></Magnetic>
            </form>
          )}
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-aura-clay pb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-aura-clay flex items-center justify-center text-xs font-bold">{r.user_name?.[0] || 'A'}</div>
                  <div>
                    <p className="text-sm font-bold">{r.user_name || 'Anonymous'}</p>
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12}
                      className={i < r.rating ? 'text-aura-gold fill-aura-gold' : 'text-aura-clay'} />)}</div>
                  </div>
                  <span className="text-xs text-aura-sage ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-aura-primary/80 font-light">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-aura-sage font-light italic">No reviews yet. Be the first!</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
