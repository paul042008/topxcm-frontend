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
        // items-center instead of items-end fixes the uneven white gaps above shorter tiles
        className="flex overflow-x-auto gap-6 py-4 px-8 no-scrollbar select-none items-center"
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
            className={`${shapes[i % shapes.length]} shrink-0 relative flex-none p-1.5 rounded-[inherit]`}
            style={{
              background: "linear-gradient(145deg, rgba(0,174,239,0.10), rgba(0,174,239,0.02))",
              boxShadow: "0 20px 40px -12px rgba(0,74,112,0.18)",
            }}
          >
            {/* pale-blue "mat" behind each tile so varying sizes feel intentional, not random */}
            <div className={`w-full h-full overflow-hidden border border-[#00AEEF]/15 cursor-pointer group rounded-[inherit]`}>
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

  const WA = "https://wa.me/2348061587993";

  const heroSlides = [
    "/images/hero1.jpg",
    "/images/hero2.png",
    "/images/hero3.jpg",
    "/images/hero4.png",
    "/images/hero5.png",
    "/images/hero6.png",
  ];

  const rowImages = [
    "/images/hero1.jpg",
    "/images/hero2.png",
    "/images/hero3.jpg",
    "/images/hero4.png",
    "/images/hero5.png",
    "/images/hero6.png",
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
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#00AEEF]/10 to-white/95" />
          </div>

          {/* ── HEADER ── */}
          <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
            <div className="flex flex-col gap-0.5">
              <span className="font-serif italic text-[#00AEEF] text-lg md:text-xl leading-none">
                The XCM
              </span>
              <span className="text-[#00AEEF] text-[9px] tracking-[0.55em] uppercase font-light">
                Fashion Corner
              </span>
            </div>
          </header>

          {/* Hero Content */}
          <main className="relative z-10 flex flex-col items-center justify-center h-[72vh] text-center px-6">
            {/* "WELCOME TO" – solid blue stroke + paint-order */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold"
              style={{
                color: "#ffffff",
                WebkitTextStroke: "1.5px #004a70",
                paintOrder: "stroke fill",
                textShadow: "none",
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
                {/* XCM – solid blue stroke + paint-order */}
                <motion.h1
                  className="text-5xl md:text-7xl font-black tracking-tighter"
                  style={{
                    color: "#00AEEF",
                    WebkitTextStroke: "1px #004a70",
                    paintOrder: "stroke fill",
                    textShadow: "none",
                  }}
                >
                  XCM
                </motion.h1>
              </div>

              {/* "Wardrobes" – solid blue stroke + paint-order */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.8 }}
                className="text-white text-4xl md:text-6xl font-serif italic"
                style={{
                  WebkitTextStroke: "1.5px #004a70",
                  paintOrder: "stroke fill",
                  textShadow: "none",
                }}
              >
                Wardrobes
              </motion.h2>
            </motion.div>

            {/* Slogan – solid blue stroke + paint-order + blue glow shadow */}
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
                  textShadow: "0 4px 18px rgba(0,174,239,0.5), 0 2px 8px rgba(0,174,239,0.45), 0 0 36px rgba(0,174,239,0.35)",
                  WebkitTextStroke: "1.2px #004a70",
                  paintOrder: "stroke fill",
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
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-[#f0f8ff] to-[#dceaf5]">
          {/* subtle dot texture so the section doesn't read as flat/empty */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(0,174,239,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              opacity: 0.5,
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            }}
          />
          {/* soft glow blobs to fill dead space at the edges */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* section heading so the rows aren't just floating images */}
          <div className="relative text-center mb-14 px-6">
            <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#00AEEF]/60 mb-3">
              The Collection
            </p>
            <h3 className="font-serif italic text-2xl md:text-4xl text-black/80">
              Every piece, a statement
            </h3>
            <div className="w-16 h-[2px] bg-[#00AEEF]/40 mx-auto mt-5 rounded-full" />
          </div>

          <div className="relative flex flex-col gap-16">
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={true} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
          </div>
        </section>

        {/* ── ABOUT SECTION ── */}
        <section className="py-32 px-6 md:px-20 bg-[#00AEEF]/8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="font-serif italic text-3xl text-black">Our Story</h3>
              <h2
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
                style={{ color: "#00AEEF" }}
              >
                Crafting <br /> Excellence
              </h2>
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
                <div className="space-y-3">
                  <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#00AEEF" }}>
                    Inquiries
                  </p>
                  <a
                    href="tel:+2348061587993"
                    className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                    style={{ border: "1px solid rgba(0,174,239,0.1)", backgroundColor: "rgba(0,174,239,0.03)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.4)";
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.1)";
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.03)";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.07)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#00AEEF] transition-colors">
                      Call Us
                    </span>
                  </a>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                    style={{ border: "1px solid rgba(0,174,239,0.1)", backgroundColor: "rgba(0,174,239,0.03)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.4)";
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.1)";
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.03)";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.07)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#00AEEF">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#00AEEF] transition-colors">
                      WhatsApp
                    </span>
                  </a>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(0,174,239,0.1)" }} />

                <div>
                  <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#00AEEF" }}>
                    Connect With Us
                  </p>
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
                    <a href="https://www.instagram.com/xcmwardrobes?igsh=NHJscDd1dTdodmFo" target="_blank" rel="noreferrer"
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
                    <a href="https://x.com/XCMwardrobes" target="_blank" rel="noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Twitter / X</span>
                    </a>
                    <a href="mailto:xcmwardrobes@gmail.com"
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

        {/* ── FOOTER ── */}
        <footer className="py-16 text-center border-t border-[#00AEEF]/8 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-[1px] bg-gradient-to-b from-[#00AEEF]/25 to-transparent" />
            <p className="text-[8px] tracking-[1em] uppercase" style={{ color: "rgba(0,174,239,0.22)" }}>
              © 2026 XCM • All Right Reserve
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