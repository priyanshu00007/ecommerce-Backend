export default function Marquee() {
  return (
    <div className="bg-[#1A1A1A] text-white py-6 overflow-hidden border-y border-white/10 relative z-20">
      <div className="animate-marquee display-font text-3xl md:text-5xl tracking-wide flex gap-12 whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex gap-12">
            <span>HANDCRAFTED</span>
            <span className="text-white/30 italic">SUSTAINABLE</span>
            <span>LIMITED EDITION</span>
            <span className="text-white/30 italic">ARTISAN MADE</span>
          </span>
        ))}
      </div>
    </div>
  );
}
