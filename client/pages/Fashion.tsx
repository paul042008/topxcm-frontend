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
  const speed = reverse ? -0.6 : 0.6;

  const shapes = [
    "w-52 h-72 rounded-2xl",
    "w-80 h-56 rounded-3xl",
    "w-60 h-80 rounded-tl-[60px] rounded-br-[60px]",
    "w-56 h-56 rounded-full",
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
            className={`${shapes[i % shapes.length]} shrink-0 overflow-hidden shadow-2xl border border-[#00AEEF]/10 cursor-pointer flex-none relative group`}
          >
            <img
              src={img}
              alt="Fashion Showcase"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            />
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      8000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full bg-white select-none overflow-x-hidden ${
        selectedImg ? "h-screen overflow-hidden" : ""
      }`}
    >
      <FashionMenu
        isFashionLanding={true}
        onOpenAction={() => setIsMenuOpen(true)}
        onCloseAction={() => setIsMenuOpen(false)}
      />

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

      {/* ── PAGE CONTENT ── */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: isMenuOpen ? 0.15 : 1,
          filter: isMenuOpen ? "blur(2px)" : "none",
          pointerEvents: isMenuOpen ? "none" : "auto",
        }}
      >
        {/* ── HERO SECTION ── */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Background slides — UNCHANGED */}
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
            {/* Original gradient — unchanged */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#00AEEF]/10 to-white/95" />
          </div>

          {/* ── HEADER ── */}
          <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
            <div className="flex flex-col gap-0.5">
              <span className="font-serif italic text-gray-800 text-lg md:text-xl leading-none">
                The XCM
              </span>
              <span className="text-[#00AEEF] text-[9px] tracking-[0.55em] uppercase font-light">
                Fashion Corner
              </span>
            </div>
          </header>

          {/* Hero Content */}
          <main className="relative z-10 flex flex-col items-center justify-center h-[72vh] text-center px-6">

            {/* Welcome to — dark shadow ~70% */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold"
              style={{
                color: "#ffffff",
                textShadow: "0 4px 20px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.7), 0 8px 40px rgba(0,0,0,0.65)"
              }}
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

              {/* Wardrobes — dark shadow ~70% */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.8 }}
                className="text-white text-4xl md:text-6xl font-serif italic"
                style={{
                  textShadow: "0 6px 28px rgba(0,0,0,0.75), 0 2px 10px rgba(0,0,0,0.72), 0 12px 50px rgba(0,0,0,0.65)"
                }}
              >
                Wardrobes
              </motion.h2>
            </motion.div>

            {/* Slogan — no box, blue glow shadow ~50% */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1.5 }}
              className="mt-10"
            >
              <p
                className="font-serif italic text-base md:text-2xl tracking-widest min-h-[1.5em]"
                style={{
                  color: "#00AEEF",
                  textShadow: "0 4px 18px rgba(0,174,239,0.5), 0 2px 8px rgba(0,174,239,0.45), 0 0 36px rgba(0,174,239,0.35)"
                }}
              >
                {sloganText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 + index * 0.05, duration: 0.3 }}
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
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50" style={{ color: "#00AEEF" }}>
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

        {/* ── ABOUT SECTION — bg UNCHANGED ── */}
        <section className="py-32 px-6 md:px-20 bg-[#00AEEF]/8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">

              {/* Our Story — black */}
              <h3 className="font-serif italic text-3xl text-black">
                Our Story
              </h3>

              <h2
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
                style={{ color: "#00AEEF" }}
              >
                Crafting <br /> Excellence
              </h2>

              {/* Writeup — black */}
              <p className="leading-relaxed text-lg font-light text-[#00AEEF]" style={{ opacity: 0.8 }}>
                XCM Wardrobes isn't just a fashion house; it's a statement of identity. We believe that
                every stitch tells a story of confidence, culture, and character. From bespoke suits to
                traditional Agbada and modern casuals, we spice up your style with precision and passion.
              </p>

              <div className="pt-6">
                <button
                  className="border px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] transition-all"
                  style={{ borderColor: "#00AEEF", color: "#00AEEF" }}
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

              {/* Contact & Social box */}
              <div
                className="mt-8 rounded-2xl p-6 space-y-6"
                style={{ border: "1px solid rgba(0,174,239,0.15)", backgroundColor: "rgba(0,174,239,0.03)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ border: "1px solid rgba(0,174,239,0.3)", backgroundColor: "rgba(0,174,239,0.07)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#00AEEF" }}>Inquiries</p>
                    <a href="tel:+2348061587993" className="font-serif italic text-base tracking-wide transition-colors" style={{ color: "#00AEEF" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                    >
                      +234 806 158 7993
                    </a>
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(0,174,239,0.1)" }} />

                <div>
                  <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#00AEEF" }}>Connect With Us</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Facebook</span>
                    </a>
                    <a href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==" target="_blank" rel="noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#00AEEF" stroke="none"/>
                      </svg>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Instagram</span>
                    </a>
                    <a href="YOUR_TWITTER_LINK_HERE" target="_blank" rel="noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Twitter</span>
                    </a>
                    <a href="mailto:YOUR_EMAIL_HERE"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER — subtle, barely visible ── */}
        <footer className="py-16 text-center border-t border-[#00AEEF]/8 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-[1px] bg-gradient-to-b from-[#00AEEF]/25 to-transparent" />
            <p className="text-[8px] tracking-[1em] uppercase" style={{ color: "rgba(0,174,239,0.22)" }}>
              © 2026 XCM Wardrobes • Lagos
            </p>
          </div>
        </footer>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&display=swap');
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}