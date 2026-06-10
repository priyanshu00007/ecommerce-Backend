import { motion } from 'framer-motion';

export default function Journal() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="display-font text-6xl md:text-8xl text-aura-primary mb-24 border-b border-aura-clay pb-12">The Journal</h1>
        <div className="mb-32 group cursor-pointer">
          <div className="w-full h-[60vh] bg-aura-clay overflow-hidden mb-8 rounded-t-[4rem]">
            <img src="/images/editorial.svg"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold mb-4">Editorial &mdash; Winter 2026</p>
            <h2 className="display-font text-5xl md:text-6xl text-aura-primary hover:italic transition-all">The Architecture of Silence in Modern Design.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { img: '/images/fabric.svg', label: 'Culture &mdash; Oct 24', title: 'Generational Hands.' },
            { img: '/images/product.svg', label: 'Craft &mdash; Sep 12', title: 'Extracting the Botanical Essence.' },
          ].map((post, i) => (
            <div key={i} className={`space-y-6 group cursor-pointer ${i === 1 ? 'md:mt-32' : ''}`}>
              <div className="aspect-[3/4] bg-aura-clay overflow-hidden rounded-t-[3rem]">
                <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <p className="text-xs uppercase tracking-widest text-aura-sage font-bold" dangerouslySetInnerHTML={{ __html: post.label }} />
              <h3 className="display-font text-4xl text-aura-primary group-hover:italic transition-all">{post.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
