import { motion, Variants } from "framer-motion";

export default function LoadingState() {
  const letters = "XCM".split("");

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.05, // Fast, rhythmic ripple
      },
    },
  };

  const letterVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, y: 15, filter: "blur(10px)" },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  return (
    // Background changed to Powder Blue
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#D9EAF0] z-[100] overflow-hidden">
      
      {/* 1. SOFT WHITE RADIANT GLOWS (Instead of Blue/Gold) */}
      <motion.div 
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-white/60 blur-[120px] rounded-full -left-20 -top-20 pointer-events-none" 
      />
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-white/40 blur-[120px] rounded-full -right-20 -bottom-20 pointer-events-none" 
      />

      {/* 2. FASHION-THEMED ANIMATED LOGO */}
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative flex items-center gap-1 md:gap-3"
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className={`text-6xl md:text-9xl font-black tracking-tighter uppercase select-none
              ${char === "-" ? "text-[#D4AF37]" : "text-[#1E3A8A]"} 
            `}
            style={{ 
                fontFamily: "Impact, 'Arial Black', sans-serif",
                // Subtle shadow for depth on light background
                textShadow: "0 10px 20px rgba(30,58,138,0.05)"
            }}
          >
            {char}
          </motion.span>
        ))}

        {/* High-Speed Clean Shimmer */}
        <motion.div 
          animate={{ x: ["-100%", "250%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] pointer-events-none"
        />
      </motion.div>

      {/* 3. MINIMALIST DARK BLUE PROGRESS LINE */}
      <div className="absolute bottom-24 w-64 h-[1.5px] bg-[#1E3A8A]/10 overflow-hidden">
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-[#1E3A8A]"
        />
      </div>

      <motion.p 
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-16 text-[10px] uppercase tracking-[0.6em] text-[#1E3A8A]/60 font-bold"
      >
        Tailoring Excellence
      </motion.p>
    </div>
  );
}