import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealEstateMenu from "../components/RealEstateMenu";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";
import { useNavigate } from "react-router-dom";

// ─── Auto-scrolling Image Row ─────────────────────────────────────────────────
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
  const speed = reverse ? -0.6 : 0.6;

  const shapes = [
    "w-52 h-72 rounded-2xl",
    "w-80 h-56 rounded-3xl",
    "w-60 h-80 rounded-tl-[60px] rounded-br-[60px]",
    "w-72 h-64 rounded-xl",
    "w-48 h-80 rounded-[40px]",
    "w-96 h-60 rounded-lg",
    "w-64 h-64 rounded-tl-3xl rounded-br-3xl",
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = () => {
      if (!isUserScrolling.current && track) {
        track.scrollLeft += speed;
        const half = track.scrollWidth / 2;
        if (speed > 0 && track.scrollLeft >= half) track.scrollLeft -= half;
        else if (speed < 0 && track.scrollLeft <= 0) track.scrollLeft += half;
      }
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [speed]);

  const pauseAutoScroll = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => { isUserScrolling.current = false; }, 2000);
  };

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
            className={`${shapes[i % shapes.length]} shrink-0 overflow-hidden shadow-2xl border border-[#B0D4E8]/10 cursor-pointer flex-none relative group`}
          >
            <img
              src={img}
              alt="Property Showcase"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-[#B0D4E8]/0 group-hover:bg-[#B0D4E8]/10 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RealEstate() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { data, loading } = useData();
  const navigate = useNavigate();

  const heroSlides = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000",
  ];

  const properties = loading ? [] : data.filter((item: any) => item.category === "realestate");

  const rowImages = properties.length > 0
    ? properties.map((p: any) =>
        p.image?.startsWith("http") ? p.image : `https://topxcm-backend-1.onrender.com${p.image}`
      )
    : [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800",
      ];

  const sloganText = "...your home, our mission";

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (loading) return <LoadingState />;

  return (
    /* OUTER WRAPPER: Has bg-white so it doesn't "go clear" when content fades */
    <div className={`relative w-full bg-white select-none overflow-x-hidden ${selectedImg ? "h-screen overflow-hidden" : ""}`}>
      
      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 z-10 bg-[#B0D4E8]/80 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#B0D4E8] transition-colors text-lg font-bold shadow-lg"
              >✕</button>
              <img src={selectedImg} alt="Property" className="w-full h-full object-contain rounded-xl max-h-[84vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENU TRIGGER (Fixed independently on top) ── */}
      <div className="fixed top-8 right-6 md:right-10 z-[100]">
        <RealEstateMenu
          onOpenAction={() => setIsMenuOpen(true)}
          onCloseAction={() => setIsMenuOpen(false)}
        />
      </div>

      {/* ── LOGO (Fades out completely to avoid overlap) ── */}
      <header 
        className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-6 md:px-10 py-8 bg-transparent transition-all duration-500"
        style={{ 
          opacity: isMenuOpen ? 0 : 1, 
          visibility: isMenuOpen ? "hidden" : "visible",
          pointerEvents: "none"
        }}
      >
        <div className="flex flex-col items-start gap-0.5">
          <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">
            TOPXCM
          </p>
          <span className="text-slate-400 text-[8px] tracking-[0.3em] uppercase">
            Real Estate
          </span>
        </div>
      </header>

      {/* ── PAGE CONTENT FADE WRAPPER ── */}
      <div
        className="transition-all duration-500"
        style={{ 
          opacity: isMenuOpen ? 0.1 : 1, 
          filter: isMenuOpen ? "blur(4px)" : "none", 
          pointerEvents: isMenuOpen ? "none" : "auto" 
        }}
      >
        {/* HERO SECTION */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-white/95" />
          </div>

          <main className="relative z-10 flex flex-col items-center justify-center h-[72vh] text-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold text-white"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.7)" }}
            >
              Welcome to
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 backdrop-blur-md p-3 px-8 rounded-2xl border border-white/20 shadow-2xl mb-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#B0D4E8]"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  TOPXCM
                </h1>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.8 }}
                className="text-white text-4xl md:text-6xl font-serif italic"
                style={{ textShadow: "0 6px 28px rgba(0,0,0,0.75), 0 2px 10px rgba(0,0,0,0.7)" }}
              >
                Real Estate
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1.5 }}
              className="mt-10"
            >
              <p className="font-serif italic text-base md:text-2xl tracking-widest min-h-[1.5em]"
                 style={{ color: "#B0D4E8", textShadow: "0 4px 18px rgba(176,212,232,0.5), 0 2px 8px rgba(176,212,232,0.45)" }}>
                {sloganText.split("").map((char, index) => (
                  <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 + index * 0.05, duration: 0.3 }}>
                    {char}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </main>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 text-[#B0D4E8]">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#B0D4E8] to-transparent relative overflow-hidden">
              <motion.div animate={{ y: [0, 48] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-0 w-full h-1/2 bg-[#B0D4E8]" />
            </div>
          </motion.div>
        </section>

        {/* IMAGE ROWS */}
        <section className="py-24 bg-white">
          <div className="flex flex-col gap-16">
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={true} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-32 px-6 md:px-20" style={{ backgroundColor: "rgba(176,212,232,0.08)" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="font-serif italic text-3xl text-black">Our Story</h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[#B0D4E8]">
                Finding <br /> Excellence
              </h2>
              <p className="leading-relaxed text-lg font-light text-[#B0D4E8]" style={{ opacity: 0.8 }}>
                TOPXCM Real Estate is more than property — it's about placing you in spaces that inspire.
              </p>
              <div className="pt-6 flex gap-4 flex-wrap">
                <button onClick={() => navigate("/real-estate/listings")} className="border px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] transition-all" style={{ borderColor: "#B0D4E8", color: "#B0D4E8" }}>View Listings</button>
                <button onClick={() => navigate("/real-estate/contact")} className="border px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] transition-all" style={{ borderColor: "#000", color: "#000" }}>Contact Us</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-16 text-center border-t border-[#B0D4E8]/8 bg-white">
          <p className="text-[8px] tracking-[1em] uppercase" style={{ color: "rgba(176,212,232,0.3)" }}>
            © 2026 TOPXCM Real Estate • Lagos
          </p>
        </footer>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}