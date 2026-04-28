import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PhotoPortraits() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  // Filter for portrait works
  const portraits = data.filter((item) => item.category === "portraits");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-[100] flex items-center justify-between p-6 md:p-10 mix-blend-difference">
        <BackButton />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-white/40 font-serif text-sm tracking-[0.4em] uppercase whitespace-nowrap">
          Portraits & Studios
        </h1>
        <PhotoMenu  
       isOpen={menuOpen} 
      onClose={() => setMenuOpen(false)} 
      onCloseAction={() => setMenuOpen(false)} 
      />
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative h-[60vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,black)] z-10" />
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-20 space-y-4"
         >
           <p className="text-[#D4AF37] text-xs uppercase tracking-[0.6em]">Premium Collection</p>
           <h2 className="text-5xl md:text-7xl font-serif italic">The Art of Portraiture</h2>
         </motion.div>
      </section>

      {/* ── CINEMATIC HORIZONTAL ROW ── */}
      <section className="pb-32">
        <div className="flex overflow-x-auto gap-8 px-6 md:px-12 no-scrollbar snap-x snap-mandatory">
          {portraits.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative shrink-0 w-[85vw] md:w-[450px] aspect-[3/4] rounded-2xl overflow-hidden snap-center group shadow-2xl border border-white/5"
            >
              {/* The Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Bottom Info Box */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                   {item.category || "Studio Work"}
                </p>
                <h3 className="text-2xl font-serif text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-[280px] line-clamp-2">
                  {item.description}
                </p>
              </div>
              
              {/* Cinematic Frame Border */}
              <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none group-hover:border-white/20 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="mt-12 flex justify-center items-center gap-4">
           <div className="h-[1px] w-20 bg-white/10" />
           <span className="text-[10px] uppercase tracking-[0.5em] text-white/30">Scroll to explore</span>
           <div className="h-[1px] w-20 bg-white/10" />
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <footer className="py-20 flex justify-center gap-6">
        <Link to="/photography/videos" className="text-xs uppercase tracking-widest text-white/40 hover:text-[#D4AF37] transition-colors">Next: Motion</Link>
        <span className="text-white/10">|</span>
        <Link to="/photography/canvas" className="text-xs uppercase tracking-widest text-white/40 hover:text-[#D4AF37] transition-colors">Next: Canvas</Link>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}