import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Magnetic from './Magnetic';

const guestItems = [
  { id: 'Home', to: '/', name: 'Home', img: '/images/hero.svg' },
  { id: 'collections', to: '/shop', name: 'Collections', img: '/images/editorial.svg' },
  { id: 'craft', to: '/craft', name: 'Craft', img: '/images/fabric.svg' },
  { id: 'journal', to: '/journal', name: 'Journal', img: '/images/editorial.svg' },
  { id: 'contact', to: '/contact', name: 'Contact', img: '/images/hero.svg' },
  { id: 'login', to: '/login', name: 'Sign In', img: '' },
];

const adminExtra = [
  { id: 'admin', to: '/admin', name: 'Admin', img: '/images/product.svg' },
  { id: 'profile', to: '/profile', name: 'Profile', img: '' },
];

export default function FullscreenMenu({ isOpen, onClose, isAdmin }) {
  const [hovered, setHovered] = useState(null);
  const items = isAdmin ? [...guestItems, ...adminExtra] : guestItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] text-[#F8F8F6] flex flex-col justify-between p-6 md:p-12 overflow-y-auto"
        >
          <AnimatePresence>
            {hovered && (
              <motion.img key={hovered} src={items.find(l => l.id === hovered)?.img}
                initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.3, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }} className="absolute inset-0 w-full h-full object-cover z-0 grayscale contrast-125 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 flex justify-between items-center shrink-0 mix-blend-difference">
            <span className="text-sm font-bold tracking-widest uppercase">LA MAISON AURA®</span>
            <Magnetic>
              <button onClick={onClose} className="flex items-center gap-2 uppercase text-xs tracking-widest bg-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors font-bold">
                Close <X size={16} className="hover:rotate-90 transition-transform duration-500" />
              </button>
            </Magnetic>
          </div>

          <div className="relative z-10 flex flex-col gap-2 md:gap-4 mt-16 pb-16 max-w-5xl w-full mx-auto my-auto">
            {items.map((item, i) => (
              <div key={item.id} className="overflow-hidden flex items-center gap-8">
                <span className="text-xs tracking-widest uppercase text-white/40 hidden md:block w-8 font-bold">0{i + 1}</span>
                <Link to={item.to} onClick={onClose}
                  onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}
                  className={`display-font text-5xl md:text-[8vw] leading-[1.1] text-left hover:italic transition-all ${item.id === 'admin' ? 'text-aura-gold hover:text-aura-terra' : 'hover:text-[#5B1D1D]'}`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end pb-8 text-xs tracking-widest uppercase border-t border-white/20 pt-8 gap-8 font-bold shrink-0">
            <div className="flex gap-8">
              {['Instagram', 'Pinterest', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="hover:text-[#5B1D1D] transition-colors">{s}</a>
              ))}
            </div>
            <p className="text-white/80">Paris — New York — Tokyo</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
