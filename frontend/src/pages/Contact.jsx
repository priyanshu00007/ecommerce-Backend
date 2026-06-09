import { motion } from 'framer-motion';
import Magnetic from '../components/ui/Magnetic';

export default function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <p className="text-xs uppercase tracking-[0.4em] text-aura-sage mb-6 font-bold">Client Services</p>
          <h1 className="display-font text-6xl md:text-8xl text-aura-primary">Inquiries</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <h3 className="display-font text-3xl text-aura-primary mb-8">Get in Touch</h3>
            <p className="text-aura-primary/80 font-light leading-relaxed mb-12">
              Our concierge team is available to assist you with styling advice, bespoke requests, and private appointments.
            </p>
            <div className="space-y-8 text-sm uppercase tracking-widest font-bold text-aura-primary">
              <div><p className="text-aura-sage text-[10px] mb-2">Email</p><a href="#" className="hover:text-aura-terra transition-colors border-b border-aura-clay pb-1">concierge@aura.com</a></div>
              <div><p className="text-aura-sage text-[10px] mb-2">Phone</p><a href="#" className="hover:text-aura-terra transition-colors border-b border-aura-clay pb-1">+1 (800) 555-AURA</a></div>
            </div>
          </div>
          <form className="space-y-12">
            {['Name', 'Email Address', 'Subject'].map((field) => (
              <div key={field} className="relative border-b border-aura-primary/30 pb-2">
                <input type={field === 'Email Address' ? 'email' : 'text'} placeholder={field}
                  className="w-full bg-transparent outline-none placeholder-aura-primary/50 text-aura-primary focus:placeholder-transparent" required />
              </div>
            ))}
            <div className="relative border-b border-aura-primary/30 pb-2">
              <textarea placeholder="Message" rows={3}
                className="w-full bg-transparent outline-none placeholder-aura-primary/50 text-aura-primary resize-none focus:placeholder-transparent" required />
            </div>
            <Magnetic><button type="submit"
              className="bg-aura-primary text-aura-bg px-12 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-aura-gold transition-colors w-full md:w-auto">
              Send Message</button></Magnetic>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
