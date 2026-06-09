import { motion } from 'framer-motion';

export default function RevealText({ text, delay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <div className={`overflow-hidden flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i} className="mr-[0.25em] inline-block"
          initial={{ y: '100%', opacity: 0, rotateZ: 5 }}
          whileInView={{ y: 0, opacity: 1, rotateZ: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: delay + i * 0.05, ease: [0.33, 1, 0.68, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
