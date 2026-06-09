import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => setHover(!!e.target.closest('a, button, [role="button"], input, textarea, select'));
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[99999] mix-blend-difference flex items-center justify-center"
      animate={{ x: pos.x - 12, y: pos.y - 12, scale: hover ? 2.5 : 1, backgroundColor: '#ffffff' }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      {hover && <div className="w-1 h-1 bg-black rounded-full" />}
    </motion.div>
  );
}
