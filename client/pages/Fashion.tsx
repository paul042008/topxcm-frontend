import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FashionMenu from "../components/FashionMenu";

// --- Auto-scrolling Image Row ---
const ImageRow = ({
  images,
  onImageClick,
  reverse = false,
}: {
  images: string[];
  onImageClick: (url: string) => void;
  reverse?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speed = reverse ? -0.6 : 0.6; // px per frame

  // Different shape classes for visual variety
  const shapes = [
    "w-52 h-72 rounded-2xl",           // portrait tall
    "w-80 h-56 rounded-3xl",           // landscape wide
    "w-60 h-80 rounded-tl-[60px] rounded-br-[60px]", // diagonal round
    "w-56 h-56 rounded-full",          // circle
    "w-72 h-64 rounded-xl",            // square-ish
    "w-48 h-80 rounded-[40px]",        // tall pill
    "w-96 h-60 rounded-lg",            // ultra wide
    "w-64 h-64 rounded-tl-3xl rounded-br-3xl", // corner accent
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Auto-scroll loop
    const step = () => {
      if (!isUserScrolling.current && track) {
        track.scrollLeft += speed;

        // Infinite loop: when near end, jump back to start (duplicated images)
        const half = track.scrollWidth / 2;
        if (speed > 0 && track.scrollLeft >= half) {
          track.scrollLeft -= half;
        } else if (speed < 0 && track.scrollLeft <= 0) {
          track.scrollLeft += half;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [speed]);

  const pauseAutoScroll = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000); // Resume 2s after user stops touching/wheeling
  };

  // Duplicate images for seamless infinite loop
  const loopedImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-6 py-4 px-8 no-scrollbar select-none items-end"
        style={{ scrollBehavior: "auto" }}
        onWheel={pauseAutoScroll}
        onTouchStart={pauseAutoScroll}
        onMouseDown={pauseAutoScroll}
      >
        {loopedImages.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 0.97, y: -6 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => onImageClick(img)}
            className={`${shapes[i % shapes.length]} shrink-0 overflow-hidden shadow-2xl border border-[#00AEEF]/10 cursor-pointer flex-none relative group`}
          >
            <img
              src={img}
              alt="Fashion Showcase"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-[#00AEEF]/0 group-hover:bg-[#00AEEF]/10 transition-colors duration-300 flex items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="text-white text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                View
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page ---
export default function FashionPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const heroSlides = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000",
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
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      8000 // Slower slide change — 8s
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full bg-white select-none overflow-x-hidden ${
        selectedImg ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
            style={{ backdropFilter: "blur(18px)", backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative max-w-4xl max-h-[88vh] bg-white/10 border border-white/20 p-2 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 z-10 bg-[#00AEEF]/80 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#00AEEF] transition-colors text-lg font-bold shadow-lg"
              >
                ✕
              </button>
              <img
                src={selectedImg}
                alt="Enlarged view"
                className="w-full h-full object-contain rounded-xl max-h-[84vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background slides */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 3.5, ease: "easeInOut" }} // Very slow cross-fade
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#00AEEF]/10 to-white/95" />
        </div>

        {/* Header */}
        <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
          <div className="text-[#00AEEF] text-xs tracking-[0.4em] font-bold uppercase opacity-60">
            Fashion Corner
          </div>
          <FashionMenu isFashionLanding={true} />
        </header>

        {/* Hero Content */}
        <main className="relative z-10 flex flex-col items-center justify-center h-[72vh] text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }} // Slower entrance
            className="text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold drop-shadow-[0_4px_10px_rgba(0,174,239,0.5)]"
            style={{ color: "#ffffff" }}
          >
            Welcome to
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="bg-white/15 backdrop-blur-md p-3 px-8 rounded-2xl border border-white/25 shadow-2xl mb-4">
              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-tighter"
                style={{ color: "#00AEEF" }}
              >
                XCM
              </motion.h1>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1.8 }}
              className="text-white text-4xl md:text-6xl font-serif italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
              Wardrobes
            </motion.h2>
          </motion.div>

          {/* Typewriter slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1.5 }}
            className="mt-10 bg-white/8 backdrop-blur-md p-4 px-10 rounded-2xl border border-white/10 shadow-xl"
          >
            <p
              className="font-serif italic text-base md:text-2xl tracking-widest min-h-[1.5em] drop-shadow-[0_2px_8px_rgba(0,174,239,0.4)]"
              style={{ color: "#00AEEF" }}
            >
              {sloganText.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 4 + index * 0.05, // Slow typewriter pace
                    duration: 0.3,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </main>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50"
            style={{ color: "#00AEEF" }}
          >
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#00AEEF] to-transparent relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 48] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#00AEEF]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── IMAGE ROWS ── */}
      <section className="py-24 bg-white">
        <div className="flex flex-col gap-16">
          <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
          <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={true} />
          <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="py-32 px-6 md:px-20 bg-[#00AEEF]/8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="font-serif italic text-3xl" style={{ color: "#00AEEF" }}>
              Our Story
            </h3>
            <h2
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
              style={{ color: "#00AEEF" }}
            >
              Crafting <br /> Excellence
            </h2>
            <p className="leading-relaxed text-lg font-light" style={{ color: "#00AEEF", opacity: 0.7 }}>
              XCM Wardrobes isn't just a fashion house; it's a statement of identity. We believe that
              every stitch tells a story of confidence, culture, and character. From bespoke suits to
              traditional Agbada and modern casuals, we spice up your style with precision and passion.
            </p>
            <div className="pt-6">
              <button
                className="border px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] transition-all"
                style={{
                  borderColor: "#00AEEF",
                  color: "#00AEEF",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#00AEEF";
                  (e.target as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.target as HTMLButtonElement).style.color = "#00AEEF";
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&display=swap');

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}