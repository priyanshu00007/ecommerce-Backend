import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Navbar({ onMenu, onCart, onSearch, cartCount }) {
  return (
    <nav className="fixed top-0 w-full z-[90] flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference text-white">
      <div className="flex-1">
        <Magnetic>
          <button onClick={onMenu} className="group flex items-center gap-3">
            <Menu size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs tracking-widest uppercase hidden md:block mt-1 font-bold">Menu</span>
          </button>
        </Magnetic>
      </div>
      <Magnetic>
        <Link to="/" className="display-font text-3xl tracking-tighter text-center">AURA</Link>
      </Magnetic>
      <div className="flex-1 flex justify-end gap-6 items-center">
        <Magnetic>
          <button onClick={onSearch} className="hidden md:block"><Search size={20} className="hover:opacity-60 transition-opacity" /></button>
        </Magnetic>
        <Magnetic>
          <button onClick={onCart} className="flex items-center gap-2 hover:opacity-60 transition-opacity">
            <span className="text-xs tracking-widest uppercase hidden md:block mt-1 font-bold">Cart</span>
            <div className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-aura-gold rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
          </button>
        </Magnetic>
      </div>
    </nav>
  );
}
