import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants for the container (stagger effect)
  // ✅ Added "Variants" type and "as const" to satisfy TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  // Animation variants for individual items
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" // TypeScript now knows this is a valid easing name
      } 
    }
  };

  return (
    <>
      {/* The Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-sm border-b border-white/5">
        <nav className="flex items-center justify-between px-6 md:px-12 py-3">
          <Link
            to="/"
            className="text-[10px] md:text-[11px] font-sans font-light text-white/30 tracking-[0.6em] uppercase hover:text-white transition-all"
          >
            TOPXCM
          </Link>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white/60 hover:text-white transition-all duration-300"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* FULL SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] w-full h-screen bg-black flex flex-col items-center overflow-hidden"
          >
            
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-[#D4AF37]/10 pointer-events-none" />

            {/* Close Button & Brand */}
            <div className="relative w-full px-6 py-5 flex justify-between items-center z-20">
              <span className="font-sans font-black tracking-[0.2em] text-sm text-white/10 uppercase">
                TOPXCM
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white/60 hover:text-white transition-all duration-300"
              >
                <X size={28} />
              </button>
            </div>

            {/* Navigation Links */}
            <motion.nav 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative flex-grow flex flex-col items-center justify-center gap-8 z-20 text-center"
            >
              
              {/* ✅ Animated & Much Larger Explorer Text */}
             <motion.p 
  variants={itemVariants}
  className="text-2xl md:text-4xl italic font-serif tracking-[0.2em] text-white mb-8 text-center px-4"
  style={{ fontFamily: "'Playfair Display', serif" }}
>
  Where would you like to begin?
</motion.p>
              {[
                { name: "Photography", path: "/photography", color: "text-[#D4AF37]" },
                { name: "Fashion", path: "/fashion", color: "text-[#00AEEF]" },
                { name: "Real Estate", path: "/real-estate", color: "text-[#00AEEF]" }
              ].map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base md:text-xl font-sans font-bold uppercase tracking-[0.4em] ${item.color} hover:text-white transition-colors duration-300`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Social Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative w-full flex justify-center gap-10 pb-16 md:pb-24 z-20"
            >
              <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors"><Twitter size={20} /></a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}