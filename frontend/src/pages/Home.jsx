import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { productAPI, categoryAPI } from '../api/client';
import RevealText from '../components/ui/RevealText';

const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

const heroSlides = [
  { img: 'https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',  tagline: 'Clothing that transcends seasons' },
  { img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',  tagline: 'Shaped by heritage, defined by innovation' },
  { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNsb3RoaW5nfGVufDB8fDB8fHww',  tagline: 'Where minimalism meets opulence' },
];

const marqueeItems = [
  'HANDCRAFTED', 'SUSTAINABLE', 'LIMITED EDITION', 'ARTISAN MADE',
  'HANDCRAFTED', 'SUSTAINABLE', 'LIMITED EDITION', 'ARTISAN MADE',
];

const statsData = [
  { label: 'Products', value: 16, suffix: '' },
  { label: 'Collections', value: 6, suffix: '' },
  { label: 'Happy Clients', value: 1250, suffix: '+' },
  { label: 'Avg Rating', value: 4.7, suffix: '' },
];

const testimonialsData = [
  { id: 1, name: 'Victor H.', role: 'Fashion Director', text: 'The craftsmanship is unparalleled. Every stitch tells a story of dedication and precision.', rating: 5 },
  { id: 2, name: 'Elena M.', role: 'Interior Designer', text: 'AURA redefines what luxury means. It is not about excess; it is about intention.', rating: 5 },
  { id: 3, name: 'James K.', role: 'Creative Producer', text: 'The fabric quality alone sets AURA apart. I have never felt anything quite like it.', rating: 4 },
  { id: 4, name: 'Sophie L.', role: 'Brand Strategist', text: 'From packaging to delivery, every touchpoint exudes sophistication and care.', rating: 5 },
];

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

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home({ openQuickView }) {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const nextSlide = useCallback(() => setSlideIndex((p) => (p + 1) % heroSlides.length), []);
  const prevSlide = useCallback(() => setSlideIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    productAPI.list({ limit: 12, sort: 'newest' }).then(({ data }) => {
      if (data.products) {
        setFeatured(data.products.slice(0, 4));
        setProducts(data.products);
      }
    }).catch(() => {});
  }, []);

  const horizontalRef = useRef(null);
  const { scrollYProgress: hScroll } = useScroll({ target: horizontalRef });
  const hX = useTransform(hScroll, [0, 1], ['0%', '-45%']);

  const collectionRef = useRef(null);
  const { scrollYProgress: cScroll } = useScroll({ target: collectionRef, offset: ['start end', 'end start'] });
  const cScale = useTransform(cScroll, [0, 0.5, 1], [0.8, 1, 1.2]);
  const cY = useTransform(cScroll, [0, 1], ['20%', '-20%']);

  const hotspots = products.slice(0, 2).map((p, i) => ({
    id: i + 1, top: i === 0 ? '45%' : '75%', left: i === 0 ? '55%' : '40%', product: p,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Scroll progress indicator */}
      <motion.div className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-white/20 z-50 mix-blend-difference hidden md:block">
        <motion.div className="w-full bg-white origin-top" style={{ scaleY: scrollYProgress }} />
      </motion.div>

      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-screen w-full overflow-hidden bg-[#1A1A1A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img src={heroSlides[slideIndex].img} alt={`AURA ${slideIndex + 1}`}
              className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F9F8F4]" />
          </motion.div>
        </AnimatePresence>

        <button onClick={prevSlide}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide}
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white transition-colors">
          <ChevronRight size={32} />
        </button>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlideIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${i === slideIndex ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#F9F8F4] px-4 text-center mt-12 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p key={`sub-${slideIndex}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.4em] mb-6 font-light absolute top-[38%]">
              {heroSlides[slideIndex].subtitle}
            </motion.p>
          </AnimatePresence>
          <h1 className="display-font text-[14vw] md:text-[11vw] leading-[0.85] tracking-tighter uppercase">
            <RevealText text="Crafted" />
            <RevealText text="For Modern" delay={0.2} />
            <RevealText text="Living" delay={0.4} />
          </h1>
          <AnimatePresence mode="wait">
            <motion.p key={`tag-${slideIndex}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 text-sm font-light tracking-widest text-white/60 uppercase">
              {heroSlides[slideIndex].tagline}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* ===== MANIFESTO ===== */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-20 bg-[#F9F8F4]">
        <h2 className="display-font text-4xl md:text-6xl leading-snug text-[#2D3A31] mb-12">
          Born from a desire to strip away the superfluous, we focus on extreme craftsmanship and architectural silhouettes.
        </h2>
        <p className="text-sm uppercase tracking-widest text-[#8C9A84] font-bold">&mdash; The Manifesto</p>
      </section>

      {/* ===== STATS COUNTERS ===== */}
      <section className="py-20 px-6 md:px-12 bg-[#F9F8F4] relative z-20 border-t border-[#DCCFC2]/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {statsData.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
              <div className="display-font text-5xl md:text-7xl text-[#2D3A31] font-light tracking-tight">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#8C9A84] mt-3 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CRAFT OVERVIEW ===== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-20 bg-[#F9F8F4]">
        <div className="flex-1 order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8C9A84] mb-6 font-bold">The Artisans</p>
          <h2 className="display-font text-5xl md:text-7xl text-[#2D3A31] mb-8">Generational Hands.</h2>
          <p className="text-[#2D3A31]/80 font-light leading-relaxed mb-10 max-w-md">
            Every piece is an investigation into structure, material, and human movement. We build objects that act as second skins, created slowly in our global ateliers.
          </p>
          <button onClick={() => navigate('/craft')}
            className="text-xs uppercase tracking-widest border-b border-[#2D3A31] pb-1 font-bold hover:text-[#C27B66] transition-colors">
            Discover Craft
          </button>
        </div>
        <div className="flex-1 order-1 md:order-2 w-full">
          <div className="aspect-[4/5] bg-[#DCCFC2] overflow-hidden rounded-t-full">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D" alt="Artisans" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ===== COLLECTION REVEAL ===== */}
      <section ref={collectionRef} className="h-screen w-full relative overflow-hidden bg-[#1A1A1A] flex items-center justify-center z-20">
        <motion style={{ scale: cScale, y: cY }}
          // src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNsb3RoaW5nfGVufDB8fDB8fHww"
          className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center mix-blend-difference text-white px-4">
          <p className="text-xs uppercase tracking-[0.4em] mb-8 font-light">Introducing</p>
          <motion.h2
            initial={{ letterSpacing: '0em' }} whileInView={{ letterSpacing: '0.2em' }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="display-font text-6xl md:text-9xl uppercase tracking-widest leading-none">
            Spring<br />2026
          </motion.h2>
        </div>
      </section>

      {/* ===== HORIZONTAL SHOWCASE ===== */}
      <section ref={horizontalRef} className="relative h-[200vh] bg-[#F9F8F4] z-20">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden py-16 m-bx-auto">
          <div className="absolute top-24 left-6 md:left-12 z-10 pointer-events-none ">
            <h2 className="display-font text-4xl md:text-6xl text-[#2D3A31]">Exhibition</h2>
            <p className="text-[#8C9A84] tracking-widest uppercase text-xs mt-2 font-bold">Curated Artifacts // {Math.min(products.length, 4)}</p>
          </div>
          <motion.div style={{ x: hX }} className="flex gap-8 md:gap-12 pl-[20vw] md:pl-[25vw] pr-[10vw]">
            {products.slice(0, 4).map((product) => (
              <motion.div key={product.id}
                className="relative w-[70vw] md:w-[22vw] flex-shrink-0 group cursor-pointer"
                onClick={() => openQuickView(product)}>
                <div className="relative overflow-hidden aspect-[4/5] rounded-t-2xl bg-[#DCCFC2]">
                  <img src={product.image_url || '/images/product.svg'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-[#2D3A31]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#F9F8F4] text-[#2D3A31] px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl">Quick View</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-start">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#8C9A84] mb-1 font-bold truncate">{product.category_name || 'Collection'}</p>
                    <h3 className="display-font text-base md:text-lg text-[#2D3A31] group-hover:italic transition-all duration-500 truncate">{product.name}</h3>
                  </div>
                  <p className="text-sm md:text-base text-[#2D3A31] font-light shrink-0">${formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCT STORY ===== */}
      {products.length > 0 && (
        <section className="bg-[#2D3A31] text-[#F9F8F4] py-32 px-6 md:px-12 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="aspect-square bg-black overflow-hidden rounded-3xl">
                <img src={products[4]?.image_url || '/images/product.svg'}
                  className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            <div className="flex-1 lg:pl-16">
              <p className="text-xs uppercase tracking-widest text-[#C8A46B] font-bold mb-6">Iconic Design</p>
              <h2 className="display-font text-5xl md:text-7xl mb-8">{products[4]?.name}</h2>
              <p className="text-white/70 font-light leading-relaxed mb-12 text-lg max-w-lg">
                {products[4]?.description}
              </p>
              <div className="flex items-center gap-8">
                <span className="text-2xl display-font">${formatPrice(products[4]?.price)}</span>
                <Magnetic>
                  <button onClick={() => openQuickView(products[4])}
                    className="bg-white text-black px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#C8A46B] hover:text-white transition-colors">
                    Quick View
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== MATERIAL EXPLORER ===== */}
      <section className="min-h-screen bg-[#F9F8F4] flex flex-col md:flex-row relative z-20 border-b border-[#DCCFC2]">
        <div className="flex-1 p-12 md:p-24 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-[#8C9A84] mb-8 font-bold">The Elements</p>
          <h2 className="display-font text-5xl md:text-8xl text-[#2D3A31] leading-none mb-8">
            Raw<br /><span className="italic text-[#C27B66]">Fabric.</span>
          </h2>
          <p className="text-[#2D3A31]/80 max-w-sm mb-12 leading-relaxed">
            We source directly from generational purveyors. Hover over the textile to inspect the meticulous weave of our signature Egyptian cotton and Mongolian cashmere.
          </p>
          <div className="space-y-4 text-sm font-bold text-[#2D3A31]">
            <div className="flex justify-between border-b border-[#DCCFC2] pb-2"><span>Origin</span><span className="font-light">Lake Como, Italy</span></div>
            <div className="flex justify-between border-b border-[#DCCFC2] pb-2"><span>Grade</span><span className="font-light">Superfine 200-thread</span></div>
            <div className="flex justify-between border-b border-[#DCCFC2] pb-2"><span>Dye</span><span className="font-light">Organic Botanical</span></div>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden group">
          <motion.img src="/images/fabric.svg" alt="Textile"
            className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-[2s] ease-out" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <span className="display-font text-4xl text-white mix-blend-difference tracking-widest uppercase">Inspect</span>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE LOOKBOOK ===== */}
      <section className="h-[120vh] bg-[#1A1A1A] py-32 px-6 md:px-24 relative z-20">
        <div className="flex justify-between items-end mb-16 text-white">
          <h2 className="display-font text-5xl md:text-7xl">Editorial Lookbook</h2>
          <span className="text-xs uppercase tracking-widest text-white/50 font-bold hidden md:block">Hover to explore</span>
        </div>
        <div className="relative w-full h-[80vh] bg-stone-900 overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80" alt="Editorial" className="w-full h-full object-cover opacity-80" />
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
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-white p-4 shadow-2xl z-50 pointer-events-none rounded-xl">
                    <p className="display-font text-lg text-black">{spot.product.name}</p>
                    <p className="text-xs font-bold mt-1 text-black">${formatPrice(spot.product.price)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCT GRID ===== */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20 bg-[#F9F8F4]">
        <div className="flex justify-between items-end mb-16">
          <h2 className="display-font text-4xl md:text-6xl text-[#2D3A31]">The Essentials</h2>
          <button onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-widest border-b border-[#2D3A31] pb-1 font-bold hidden md:block hover:text-[#C27B66] transition-colors">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.slice(3, 6).map((p) => (
            <motion.div key={p.id} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }} className="group cursor-pointer" onClick={() => openQuickView(p)}>
              <div className="aspect-[3/4] bg-[#DCCFC2] overflow-hidden mb-6 relative rounded-t-[3rem]">
                <img src={p.image_url || '/images/product.svg'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#8C9A84] mb-1 font-bold">{p.category_name || 'Collection'}</p>
              <div className="flex justify-between items-center">
                <h3 className="display-font text-xl text-[#2D3A31] group-hover:italic transition-all">{p.name}</h3>
                <p className="text-sm text-[#2D3A31]">${formatPrice(p.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-40 px-6 md:px-24 bg-[#F9F8F4] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest text-[#8C9A84] mb-4 font-bold">Testimonials</p>
            <h2 className="display-font text-5xl md:text-7xl text-[#2D3A31]">Voices of AURA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonialsData.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#2D3A31]/5 border border-[#DCCFC2] rounded-3xl p-8 md:p-10 hover:bg-[#2D3A31]/10 transition-colors">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14}
                      className={si < t.rating ? 'text-[#C8A46B] fill-[#C8A46B]' : 'text-[#DCCFC2]'} />
                  ))}
                </div>
                <p className="text-[#2D3A31]/80 leading-relaxed mb-8 text-sm md:text-base italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="display-font text-lg text-[#2D3A31]">{t.name}</p>
                  <p className="text-xs uppercase tracking-widest text-[#8C9A84] mt-1 font-bold">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="py-32 px-6 md:px-12 bg-[#DCCFC2]/30 relative z-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display-font text-5xl md:text-7xl text-[#2D3A31] mb-10 leading-tight">
            We do not create seasonal trends; we architect permanent additions to your lifestyle.
          </h2>
          <button onClick={() => navigate('/maison')}
            className="bg-[#2D3A31] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#C8A46B] transition-colors">
            Explore La Maison
          </button>
        </div>
      </section>

      {/* ===== JOURNAL PREVIEW ===== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-20 bg-[#F9F8F4]">
        <div className="flex justify-between items-end mb-16">
          <h2 className="display-font text-4xl md:text-6xl text-[#2D3A31]">The Journal</h2>
          <button onClick={() => navigate('/journal')}
            className="text-xs uppercase tracking-widest border-b border-[#2D3A31] pb-1 font-bold hidden md:block hover:text-[#C27B66] transition-colors">
            Read More
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6 group cursor-pointer" onClick={() => navigate('/journal')}>
            <div className="aspect-[16/9] bg-[#DCCFC2] overflow-hidden rounded-2xl">
              <img src="/images/editorial.svg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8C9A84] font-bold">Culture</p>
            <h3 className="display-font text-3xl text-[#2D3A31] group-hover:italic transition-all">Generational Hands.</h3>
          </div>
          <div className="space-y-6 group cursor-pointer" onClick={() => navigate('/journal')}>
            <div className="aspect-[16/9] bg-[#DCCFC2] overflow-hidden rounded-2xl">
              <img src="/images/fabric.svg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8C9A84] font-bold">Craft</p>
            <h3 className="display-font text-3xl text-[#2D3A31] group-hover:italic transition-all">Extracting the Botanical Essence.</h3>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="bg-[#1A1A1A] text-white py-6 overflow-hidden border-y border-white/10 relative z-20">
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap display-font text-3xl md:text-5xl tracking-wide gap-12"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>HANDCRAFTED</span>
              <span className="text-white/30 italic">SUSTAINABLE</span>
              <span>LIMITED EDITION</span>
              <span className="text-white/30 italic">ARTISAN MADE</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="h-[70vh] w-full bg-[#1A1A1A] text-white flex flex-col items-center justify-center relative z-20 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} transition={{ duration: 2 }}
          src="/images/hero3.svg"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
        <div className="relative z-10 text-center">
          <h2 className="display-font text-6xl md:text-9xl mb-12">Begin Your Journey</h2>
          <Magnetic>
            <button onClick={() => navigate('/shop')}
              className="bg-white text-black px-12 py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#C8A46B] hover:text-white transition-colors">
              Explore Collections
            </button>
          </Magnetic>
        </div>
      </section>
    </motion.div>
  );
}
