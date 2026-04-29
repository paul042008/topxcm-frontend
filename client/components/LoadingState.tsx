import { motion, Variants } from "framer-motion";

const config = {
  fashion: {
    logo: null,
    letters: ["X", "C", "M"],
    bg: "bg-[#D9EAF0]",
    glowA: "bg-white/60",
    glowB: "bg-white/40",
    letterColor: "text-[#00AEEF]",
    textShadow: "0 10px 20px rgba(30,58,138,0.05)",
    progressTrack: "bg-[#1E3A8A]/10",
    progressBar: "bg-[#00AEEF]",
    shimmer: "via-white/60",
    tagline: "Tailoring Excellence",
    taglineColor: "text-[#00AEEF]/60",
  },
  photography: {
    // ✅ String path used correctly
    logo: "/images/logo.jpg", 
    letters: [], 
    bg: "bg-white", 
    glowA: "bg-[#D4AF37]/10",
    glowB: "bg-[#D4AF37]/5",
    letterColor: "text-[#D4AF37]",
    textShadow: "none",
    progressTrack: "bg-black/5",
    progressBar: "bg-[#D4AF37]",
    shimmer: "via-[#D4AF37]/10",
    tagline: "Capturing Excellence",
    taglineColor: "text-black/40", 
  },
}; // ✅ Added the missing closing brace here

export default function LoadingState() {
  const isPhoto = window.location.pathname.toLowerCase().includes("photo");
  // Cast as any to allow flexible config access for logo/letters
  const c = (config as any)[isPhoto ? "photography" : "fashion"];

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
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
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${c.bg} z-[100] overflow-hidden`}>

      {/* Radiant glows */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute w-[500px] h-[500px] ${c.glowA} blur-[120px] rounded-full -left-20 -top-20 pointer-events-none`}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute w-[500px] h-[500px] ${c.glowB} blur-[120px] rounded-full -right-20 -bottom-20 pointer-events-none`}
      />

      {/* Animated content (Logo or Letters) */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative flex items-center justify-center"
      >
        {c.logo ? (
          /* LOGO MODE (Photography) */
          <motion.img
            variants={letterVariants}
            src={c.logo}
            alt="Logo"
            className="h-24 md:h-32 object-contain relative z-10"
          />
        ) : (
          /* LETTER MODE (Fashion) */
          <div className="flex items-center gap-1 md:gap-3">
            {c.letters?.map((char: string, index: number) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={`text-6xl md:text-9xl font-black tracking-tighter uppercase select-none ${c.letterColor}`}
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  textShadow: c.textShadow,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        )}

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ["-100%", "250%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r from-transparent ${c.shimmer} to-transparent skew-x-[-25deg] pointer-events-none z-20`}
        />
      </motion.div>

      {/* Progress line */}
      <div className={`absolute bottom-24 w-64 h-[1.5px] ${c.progressTrack} overflow-hidden`}>
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-full h-full ${c.progressBar}`}
        />
      </div>

      {/* Tagline */}
      <motion.p
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`absolute bottom-16 text-[10px] uppercase tracking-[0.6em] ${c.taglineColor} font-bold`}
      >
        {c.tagline}
      </motion.p>
    </div>
  );
}