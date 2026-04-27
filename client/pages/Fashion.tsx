import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FashionMenu from "../components/FashionMenu";

// --- MARQUEE COMPONENT WITH RESUMING AUTO-ANIMATION ---
const ImageRow = ({ images, speed, reverse = false, onImageClick }: { images: string[], speed: number, reverse?: boolean, onImageClick: (url: string) => void }) => {
  return (
    <div className="flex overflow-hidden gap-6 py-4 select-none cursor-grab active:cursor-grabbing">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear",
          repeatType: "loop" 
        }}
        drag="x" 
        dragConstraints={{ left: -1200, right: 1200 }} 
        dragElastic={0.05}
        className="flex flex-nowrap gap-6 shrink-0"
      >
        {[...images, ...images, ...images].map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 0.98 }}
            onClick={() => onImageClick(img)}
            className="w-64 h-80 md:w-80 md:h-[450px] shrink-0 rounded-md overflow-hidden shadow-lg"
          >
            <img
              src={img}
              alt="Fashion Showcase"
              className="w-full h-full object-cover pointer-events-none" 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function FashionPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const heroSlides = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000",
  ];

  const rowImages = [
    "/images/work-1.jfif",
    "/images/work-2.jfif",
    "/images/work-3.jfif",
    "/images/work-4.jfif",
    "/images/work-5.jfif",
  ];

  const sloganText = "...a spice for your wardrobe";

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // FIX: Optimized the conditional overflow class so it doesn't break scrolling
    <div className={`relative w-full bg-white select-none overflow-x-hidden ${selectedImg ? 'max-h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      {/* 1. LIGHTBOX / MODAL BOX */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 backdrop-blur-md bg-black/40"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl max-h-[85vh] bg-white p-2 rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition-colors"
              >
                ✕
              </button>
              <img src={selectedImg} alt="Enlarged view" className="w-full h-full object-contain rounded-sm" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-[#D9EAF0]/20 to-white/95" />
        </div>

        <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
          <div className="text-[#1E3A8A] text-xs tracking-[0.4em] font-bold uppercase opacity-60">Fashion Edition</div>
          <FashionMenu isFashionLanding={true} />
        </header>

        <main className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-white text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold drop-shadow-[0_4px_10px_rgba(30,58,138,0.8)]"
          >
            Welcome to
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
            className="flex flex-col items-center"
          >
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-2xl mb-4">
               <img 
                 src="/images/fashionlogo.png" 
                 alt="XCM WARDROBES" 
                 className="h-14 md:h-26 w-auto object-contain"
                 onError={(e) => { e.currentTarget.style.display='none'; }} 
               />
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-white text-4xl md:text-6xl font-serif italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
            >
              Wardrobes
            </motion.h2>
          </motion.div>

          <motion.p 
            className="mt-14 text-[#1E3A8A]/70 italic font-serif text-base md:text-2xl tracking-widest min-h-[1.5em]"
          >
            {sloganText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 2 + index * 0.05, 
                  duration: 0.1
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </main>

        {/* --- SCROLL INDICATOR ADDED HERE --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#1E3A8A]/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Scroll Down
          </span>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#1E3A8A]/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* 3. THREE SLIDING ROWS */}
      <section className="py-24 bg-white">
        <div className="flex flex-col gap-8">
          <ImageRow images={rowImages} speed={45} onImageClick={setSelectedImg} />
          <ImageRow images={rowImages} speed={55} reverse={true} onImageClick={setSelectedImg} />
          <ImageRow images={rowImages} speed={50} onImageClick={setSelectedImg} />
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section className="py-32 px-6 md:px-20 bg-[#D9EAF0]/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-[#D4AF37] font-serif italic text-3xl">Our Story</h3>
            <h2 className="text-[#1E3A8A] text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Crafting <br /> Excellence
            </h2>
            <p className="text-[#1E3A8A]/70 leading-relaxed text-lg font-light">
              XCM Wardrobes isn't just a fashion house; it's a statement of identity. We believe that every stitch tells a story of confidence, culture, and character. 
              From bespoke suits to traditional Agbada and modern casuals, we spice up your style with precision and passion.
            </p>
            <div className="pt-6">
                <button className="border border-[#1E3A8A] text-[#1E3A8A] px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] hover:bg-[#1E3A8A] hover:text-white transition-all">
                    Learn More
                </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500&display=swap');
      `}</style>
    </div>
  );
}