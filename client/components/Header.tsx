import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openMenu) {
      setIsMenuOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
              
              {/* Label — pushed down with extra top margin */}
              <motion.p 
                variants={itemVariants}
                className="text-2xl md:text-4xl italic font-serif tracking-[0.2em] text-white mt-12 mb-8 text-center px-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Where would you like to begin?
              </motion.p>

              {[
                { name: "Photography", path: "/photography", color: "text-[#D4AF37]", borderColor: "border-[#D4AF37]/30", delay: "0s" },
                { name: "Fashion", path: "/fashion", color: "text-[#00AEEF]", borderColor: "border-[#00AEEF]/30", delay: "0.6s" },
                { name: "Real Estate", path: "/real-estate", color: "text-[#00AEEF]", borderColor: "border-[#00AEEF]/30", delay: "1.2s" },
              ].map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group relative overflow-hidden flex items-center justify-center rounded-full border ${item.borderColor} px-10 py-3 min-w-[220px] transition-colors duration-300 hover:border-white/40`}
                  >
                    {/* Sweep flash */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full pointer-events-none"
                      style={{ animation: `sweepFlash 3.5s infinite ${item.delay}` }}
                    />
                    <span className={`relative z-10 text-[11px] font-black uppercase tracking-[0.45em] ${item.color} group-hover:text-white transition-colors duration-300`}>
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* About Us — white box, animated, below the rest */}
              <motion.div variants={itemVariants} className="mt-2">
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative overflow-hidden flex items-center justify-center rounded-full border border-white/30 px-10 py-3 min-w-[220px] hover:border-white/60 transition-colors duration-300"
                >
                  {/* Sweep flash — offset timing */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none"
                    style={{ animation: "sweepFlash 3.5s infinite 1.8s" }}
                  />
                  <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.45em] text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    About Us
                  </span>
                </Link>
              </motion.div>

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

      <style>{`
        @keyframes sweepFlash {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          18%  { transform: translateX(150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </>
  );
}