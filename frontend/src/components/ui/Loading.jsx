import { motion } from 'framer-motion';

export default function CinematicLoader({ onComplete, text = 'Aura' }) {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-[#0A0A0A] flex flex-col items-center justify-center text-[#F9F8F4]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ letterSpacing: '0.1em', opacity: 0 }}
        animate={{ letterSpacing: '0.5em', opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        onAnimationComplete={() => { if (onComplete) setTimeout(onComplete, 500); }}
        className="display-font text-5xl md:text-8xl tracking-widest uppercase font-light"
      >
        {text}
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="h-[1px] bg-white/30 mt-8"
      />
    </motion.div>
  );
}
