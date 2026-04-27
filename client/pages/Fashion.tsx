import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Make sure this import path matches where you saved the FashionMenu component
import FashionMenu from "../components/FashionMenu"; 

export default function FashionPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Faint background slides of work
  const backgroundImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden select-none">
      
      {/* 1. FAINT BACKGROUND SLIDESHOW (Adapted for White Background) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }} // Very low opacity so it remains "faint" against white
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[currentSlide]})` }}
          />
        </AnimatePresence>
        {/* Powder blue / White gradient overlay to soften the images */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-[#D9EAF0]/20 to-white/95" />
      </div>

      {/* 2. TOP HEADER (Fashion Edition on Left, Menu on Right) */}
      <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
        <div className="text-[#1E3A8A] text-xs tracking-[0.4em] font-bold uppercase opacity-60">
          Fashion Edition
        </div>
        
        {/* Your custom hamburger menu component */}
        <FashionMenu />
      </header>

      {/* 3. CENTERED WELCOME CONTENT */}
      <main className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[#1E3A8A]/60 text-sm md:text-lg uppercase tracking-[0.5em] mb-4 font-semibold"
        >
          Welcome to
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="flex flex-col items-center"
        >
          {/* Changed to dark blue to contrast with the white background */}
          <h1 className="text-[#1E3A8A] text-5xl md:text-8xl font-black tracking-[0.2em] leading-tight drop-shadow-sm">
            X C M
          </h1>
          <h2 className="text-[#D4AF37] text-3xl md:text-5xl font-serif italic -mt-2 md:-mt-4 drop-shadow-sm">
            Wardrobes
          </h2>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-8 text-[#1E3A8A]/50 italic font-serif text-sm md:text-xl tracking-widest"
        >
          "...a spice for your wardrobe"
        </motion.p>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500&display=swap');
      `}</style>
    </div>
  );
}