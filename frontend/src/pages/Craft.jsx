import { motion } from 'framer-motion';

export default function Craft() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-aura-bg">
      <section className="min-h-screen flex flex-col md:flex-row border-b border-aura-clay">
        <div className="flex-1 p-12 md:p-24 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-aura-sage mb-8 font-bold">The Elements</p>
          <h2 className="display-font text-5xl md:text-8xl text-aura-primary leading-none mb-8">Raw<br /><span className="italic text-aura-terra">Material.</span></h2>
          <p className="text-aura-primary/80 max-w-sm mb-12 leading-relaxed">We source directly from generational purveyors.</p>
          <div className="space-y-4 text-sm font-bold text-aura-primary">
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Origin</span><span className="font-light">Steppes of Mongolia</span></div>
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Grade</span><span className="font-light">Superfine 14-micron</span></div>
            <div className="flex justify-between border-b border-aura-clay pb-2"><span>Dye</span><span className="font-light">Organic Botanical</span></div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <img src="/images/fabric.svg" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="pt-40 pb-32 px-6 md:px-12 bg-aura-primary text-aura-bg min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-aura-sage tracking-widest uppercase text-xs font-bold mb-8 text-center">The Process</p>
          <h2 className="display-font text-5xl md:text-7xl leading-tight mb-24 text-center">The Architecture of<br /><span className="italic text-aura-gold">Perfection.</span></h2>
          <div className="space-y-32 relative before:absolute before:inset-0 before:ml-5 before:md:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {[
              { title: 'Material Selection', desc: 'We spend months sourcing the world\'s most ethical and durable raw materials.' },
              { title: 'Hand Assembly', desc: 'Generational artisans stitch, mold, and construct each piece by hand in our ateliers.' },
              { title: 'Quality Control', desc: 'Every detail is inspected. The process cannot be rushed. It is a meditation on form.' },
            ].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-aura-primary group-[.is-active]:border-aura-gold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs display-font">0{i+1}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <h3 className="display-font text-3xl mb-4">{step.title}</h3>
                  <p className="text-sm font-light text-white/70 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
