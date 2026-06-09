import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { productAPI, categoryAPI } from '../api/client';
import RevealText from '../components/ui/RevealText';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

const HERO_IMG = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80';
const EDITORIAL_IMG = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80';
const FABRIC_IMG = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80';

const categoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
  'Clothing': 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  'Books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPos({ x: (clientX - (left + width / 2)) * 0.2, y: (clientY - (top + height / 2)) * 0.2 });
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}>
      {children}
    </motion.div>
  );
};

export default function Home({ openQuickView }) {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    productAPI.list({ limit: 8, sort: 'newest' }).then(({ data }) => {
      if (data.products) {
        setFeatured(data.products.slice(0, 4));
        setLatestProducts(data.products.slice(4, 8));
      }
    }).catch(() => {});
    categoryAPI.list().then(({ data }) => setCategories(Array.isArray(data) ? data.slice(0, 4) : [])).catch(() => {});
  }, []);

  const hotspots = featured.slice(0, 2).map((p, i) => ({
    id: i + 1, top: i === 0 ? '45%' : '75%', left: i === 0 ? '55%' : '40%', product: p,
  }));

  const atelierSteps = [
    { title: 'Material Sourcing', desc: 'We travel the globe to find the finest fabrics from ethical, generational mills in Italy, Scotland, and Japan.' },
    { title: 'Pattern Architecture', desc: 'Every silhouette is engineered from scratch. Precision cutting reduces waste by 40% compared to conventional methods.' },
    { title: 'Hand Tailoring', desc: 'Master artisans spend over 40 hours on each piece. Stitching, pressing, and finishing by hand ensures perfection.' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-white/20 z-50 mix-blend-difference hidden md:block">
        <motion.div className="w-full bg-white origin-top" style={{ scaleY: scrollYProgress }} />
      </motion.div>

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-aura-dark">
        <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
          <img src={HERO_IMG} alt="AURA Fashion" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-aura-bg" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#F9F8F4] px-4 text-center mt-12">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] mb-6 font-light">Haute Couture Since 2026</motion.p>
          <h1 className="display-font text-[14vw] md:text-[11vw] leading-[0.85] tracking-tighter uppercase">
            <RevealText text="Defining" />
            <RevealText text="Modern" delay={0.2} />
            <RevealText text="Luxury" delay={0.4} />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-8 text-sm font-light tracking-widest text-white/60 uppercase">
            Clothing that transcends seasons
          </motion.p>
        </div>
      </section>

      {/* Collections */}
      {categories.length > 0 && (
        <section className="py-40 px-6 md:px-24 bg-aura-bg relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20">
              <div>
                <p className="text-xs uppercase tracking-widest text-aura-sage mb-4 font-bold">Browse</p>
                <h2 className="display-font text-5xl md:text-7xl text-aura-primary">Collections</h2>
              </div>
              <button onClick={() => navigate('/shop')}
                className="text-xs uppercase tracking-widest border-b border-aura-primary pb-1 font-bold hover:text-aura-terra transition-colors hidden md:block">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => navigate('/shop')}
                  className="group relative aspect-square overflow-hidden rounded-3xl cursor-pointer">
                  <img src={categoryImages[cat.name] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'}
                    alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="display-font text-2xl md:text-3xl text-white group-hover:italic transition-all">{cat.name}</h3>
                    <p className="text-xs text-white/60 mt-1 uppercase tracking-widest font-bold">Shop Now</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Editorial */}
      <section className="h-[120vh] bg-aura-dark py-32 px-6 md:px-24 relative z-20">
        <div className="flex justify-between items-end mb-16 text-white">
          <h2 className="display-font text-5xl md:text-7xl">Featured Editorial</h2>
          <span className="text-xs uppercase tracking-widest text-white/50 font-bold">Discover</span>
        </div>
        <div className="relative w-full h-[80vh] bg-stone-900 overflow-hidden">
          <img src={EDITORIAL_IMG} alt="Editorial" className="w-full h-full object-cover opacity-80" />
          {hotspots.map((spot) => spot.product && (
            <div key={spot.id}
              className="absolute hotspot w-8 h-8 -ml-4 -mt-4 cursor-pointer"
              style={{ top: spot.top, left: spot.left }}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => openQuickView(spot.product)}
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <AnimatePresence>
                {activeHotspot === spot.id && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-white p-4 shadow-2xl z-50 pointer-events-none">
                    <p className="display-font text-lg text-black">{spot.product.name}</p>
                    <p className="text-xs font-bold mt-1 text-black">${formatPrice(spot.product.price)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* The Fabric */}
      <section className="min-h-screen bg-aura-bg flex flex-col md:flex-row relative z-20 border-b border-aura-clay">
        <div className="flex-1 p-12 md:p-24 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold">The Elements</p>
          <h2 className="display-font text-5xl md:text-8xl text-aura-primary leading-none mb-8">
            Raw<br /><span className="italic text-aura-terra">Fabric.</span>
          </h2>
          <p className="text-aura-primary/80 max-w-sm mb-12 leading-relaxed">
            We source directly from generational purveyors. Hover over the textile to inspect the meticulous weave of our signature Egyptian cotton and Mongolian cashmere.
          </p>
          <div className="space-y-4 text-sm font-bold text-aura-primary">
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Origin</span><span className="font-light">Lake Como, Italy</span></div>
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Grade</span><span className="font-light">Superfine 200-thread</span></div>
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Dye</span><span className="font-light">Organic Botanical</span></div>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden group">
          <motion.img src={FABRIC_IMG} alt="Textile"
            className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-[2s] ease-out" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <span className="display-font text-4xl text-white mix-blend-difference tracking-widest uppercase">Inspect</span>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-40 px-6 md:px-24 bg-aura-bg relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <p className="text-xs uppercase tracking-widest text-aura-sage mb-4 font-bold flex items-center gap-2">
                <Sparkles size={14} /> Fresh Drops
              </p>
              <h2 className="display-font text-5xl md:text-7xl text-aura-primary">New Arrivals</h2>
            </div>
            <button onClick={() => navigate('/shop')}
              className="text-xs uppercase tracking-widest border-b border-aura-primary pb-1 font-bold hover:text-aura-terra transition-colors hidden md:block">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.slice(0, 4).map((p, i) => (
              <motion.div key={p.id} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group cursor-pointer" onClick={() => openQuickView(p)}>
                <div className="aspect-[3/4] bg-aura-clay overflow-hidden mb-6 relative rounded-t-full">
                  <img src={p.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-aura-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-aura-bg text-aura-primary px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl">Quick View</span>
                  </div>
                </div>
                <h3 className="display-font text-xl text-aura-primary group-hover:italic transition-all">{p.name}</h3>
                <p className="text-xs uppercase tracking-widest text-aura-sage mt-1 font-bold">{p.category_name || 'Collection'}</p>
                <p className="text-lg text-aura-primary font-light mt-1">${formatPrice(p.price)}</p>
              </motion.div>
            ))}
          </div>
          {latestProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {latestProducts.slice(0, 4).map((p, i) => (
                <motion.div key={p.id} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer" onClick={() => openQuickView(p)}>
                  <div className="aspect-[3/4] bg-aura-clay overflow-hidden mb-6 relative rounded-t-full">
                    <img src={p.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-aura-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-aura-bg text-aura-primary px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl">Quick View</span>
                    </div>
                  </div>
                  <h3 className="display-font text-xl text-aura-primary group-hover:italic transition-all">{p.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-aura-sage mt-1 font-bold">{p.category_name || 'Collection'}</p>
                  <p className="text-lg text-aura-primary font-light mt-1">${formatPrice(p.price)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Manifesto */}
      <section className="py-40 bg-aura-bg flex items-center justify-center relative z-20 overflow-hidden">
        <div className="text-center max-w-5xl px-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] text-aura-sage mb-12 font-bold">Brand Manifesto</p>
          <h2 className="display-font text-4xl md:text-7xl leading-snug text-aura-primary">
            &ldquo;Fashion is architecture of the body. AURA builds garments the way architects build skylines&mdash;with intention, structure, and enduring beauty.&rdquo;
          </h2>
          <p className="mt-12 text-sm uppercase tracking-widest text-aura-primary font-bold">&mdash; Vogue Paris</p>
        </div>
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-[30vw] display-font text-aura-clay opacity-30 select-none pointer-events-none">&ldquo;</div>
      </section>

      {/* Atelier Process */}
      <section className="py-40 px-6 md:px-24 bg-aura-primary text-aura-bg">
        <div className="max-w-4xl mx-auto">
          <p className="text-aura-sage tracking-widest uppercase text-xs font-bold mb-8 text-center">The Atelier</p>
          <h2 className="display-font text-5xl md:text-7xl leading-tight mb-24 text-center">
            The Architecture of<br /><span className="italic text-aura-gold">Fashion.</span>
          </h2>

          <div className="space-y-32 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {atelierSteps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-aura-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs display-font">0{i + 1}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <h3 className="display-font text-3xl mb-4">{step.title}</h3>
                  <p className="text-sm font-light text-white/70 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <Magnetic>
              <button onClick={() => navigate('/craft')}
                className="inline-flex items-center gap-3 bg-aura-gold text-aura-dark px-10 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-aura-bg transition-colors">
                Discover Our Craft <ArrowUpRight size={18} />
              </button>
            </Magnetic>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
