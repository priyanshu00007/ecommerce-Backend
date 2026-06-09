import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Collections' },
  { to: '/craft', label: 'Craft' },
  { to: '/journal', label: 'Journal' },
  // { to: '/maison', label: 'Maison' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['-50px', '0px']);

  return (
    <footer className="bg-[#0A0A0A] text-[#F9F8F4] pt-40 pb-16 px-6 md:px-12 rounded-t-[4rem] -mt-16 relative z-30 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200"><filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#nf)"/></svg>
      </motion.div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center mb-32 border-b border-white/10 pb-32">
          <Link to="/" className="display-font text-[18vw] leading-none tracking-tighter hover:italic transition-all duration-700">AURA.</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C9A84] mb-8 font-bold">The Maison</h4>
            <p className="text-sm font-light text-white/60 leading-relaxed max-w-sm">Designing the future of luxury living through botanical minimalism and extreme craftsmanship.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C9A84] mb-8 font-bold">Explore</h4>
            <ul className="space-y-4 text-sm font-light">
              {links.map(l => (
                <li key={l.to}><Link to={l.to} className="hover:text-aura-gold transition-all hover:pl-2 duration-300 block uppercase tracking-widest text-xs font-bold">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C9A84] mb-8 font-bold">Account</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/login" className="hover:text-aura-gold transition-all hover:pl-2 duration-300 block uppercase tracking-widest text-xs font-bold">Sign In</Link></li>
              <li><Link to="/orders" className="hover:text-aura-gold transition-all hover:pl-2 duration-300 block uppercase tracking-widest text-xs font-bold">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-aura-gold transition-all hover:pl-2 duration-300 block uppercase tracking-widest text-xs font-bold">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 tracking-widest uppercase font-bold">
          <p>&copy; {new Date().getFullYear()} AURA MAISON INC.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
