import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Magnetic({ children, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const b = ref.current?.getBoundingClientRect();
    if (b) setPos({ x: (e.clientX - (b.left + b.width / 2)) * 0.2, y: (e.clientY - (b.top + b.height / 2)) * 0.2 });
  };

  return (
    <motion.div
      ref={ref} onMouseMove={handleMouse} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
