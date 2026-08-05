import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";

// ─── AUTO-SCROLLING IMAGE ROW ───────────────────────────────────────────────
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
    }, 2000);
  };

  const loopedImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        // items-center (was items-end) so varying tile heights don't create uneven gaps
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
            className={`${shapes[i % shapes.length]} shrink-0 relative flex-none p-1.5 rounded-[inherit] gold-mat`}
          >
            {/* champagne-gold "mat" behind each tile so varying sizes read as intentional gallery framing */}
            <div className="w-full h-full overflow-hidden cursor-pointer flex-none relative group photo-card rounded-[inherit]">
              <img
                src={img}
                alt="Photography Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
              {/* Gold hover overlay */}
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  View
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Photography() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroSlides = [
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000",
    "/images/slide3.jpg",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide4.jpg",
    "/images/slide5.jpg",
    "/images/slide6.jpg",
    "/images/slide7.jpg",
  ];

  const rowImages = [
    "/images/photo-1.jfif",
    "/images/photo-2.jfif",
    "/images/photo-3.jfif",
    "/images/photo-4.jfif",
    "/images/photo-5.jfif",
  ];

  const sloganText = "...your official photographer";

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <div
      className={`relative w-full bg-black select-none overflow-x-hidden ${
        selectedImg ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* Page content fades when menu is open — exactly like the sample */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: isMenuOpen ? 0.15 : 1,
          filter: isMenuOpen ? "blur(2px)" : "none",
          pointerEvents: isMenuOpen ? "none" : "auto",
        }}
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
              style={{
                backdropFilter: "blur(18px)",
                backgroundColor: "rgba(0,0,0,0.75)",
              }}
              onClick={() => setSelectedImg(null)}
            >
              <motion.div
                initial={{ scale: 0.88, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.88, y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="relative max-w-4xl max-h-[88vh] bg-black/30 border border-[#D4AF37]/20 p-2 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImg(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-black text-lg font-bold shadow-lg transition-colors"
                  style={{ backgroundColor: "#D4AF37" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#b8972e")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#D4AF37")
                  }
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
        <section className="relative h-screen w-full overflow-hidden flex flex-col">
          {/* Background slides */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
              />
            </AnimatePresence>
            {/* Dark gradient overlay — black base, subtle gold mid */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#D4AF37]/5 to-black/95" />
          </div>

          {/* ── HEADER ── */}
          <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
            <div className="flex flex-col gap-0.5">
              <span
                className="font-serif italic text-white text-lg md:text-xl leading-none"
                style={{ letterSpacing: "0.02em" }}
              >
                The Official
              </span>
              <span className="text-[#D4AF37] text-[9px] tracking-[0.55em] uppercase font-light">
                Photography
              </span>
            </div>
            <PhotoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </header>

          {/* ── HERO CONTENT ── */}
          <main className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
            <div className="flex flex-col items-center justify-center">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-base md:text-xl uppercase tracking-[0.5em] mb-6 font-bold"
                style={{
                  color: "#ffffff",
                  textShadow: "0 4px 10px rgba(212,175,55,0.4)",
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
                <motion.h1
                  className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 4px 15px rgba(212,175,55,0.3)",
                  }}
                >
                  TOP
                </motion.h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 1.5 }}
                className="mt-10"
              >
                <p
                  className="font-serif italic text-base md:text-2xl tracking-widest min-h-[1.5em] text-center"
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 2px 8px rgba(212,175,55,0.3)",
                  }}
                >
                  {sloganText.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 4 + index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            </div>
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
              style={{ color: "#D4AF37" }}
            >
              Scroll
            </span>
            <div
              className="w-[1px] h-12 relative overflow-hidden"
              style={{ background: "linear-gradient(to bottom, #D4AF37, transparent)" }}
            >
              <motion.div
                animate={{ y: [0, 48] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-1/2"
                style={{ backgroundColor: "#D4AF37" }}
              />
            </div>
          </motion.div>
        </section>

        {/* ── IMAGE ROWS ── */}
        <section className="relative py-24 bg-black overflow-hidden">
          {/* subtle gold dot texture so the black section doesn't read as flat/empty */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(212,175,55,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              opacity: 0.4,
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            }}
          />
          {/* soft gold glow blobs to fill dead space at the edges */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* section heading so the rows aren't just floating images */}
          <div className="relative text-center mb-14 px-6">
            <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-[white]">
              The Gallery
            </p>
            <h3 className="font-serif italic text-2xl md:text-4xl text-white/85">
              Every frame, a story
            </h3>
            <div className="w-16 h-[2px] bg-[#D4AF37]/50 mx-auto mt-5 rounded-full" />
          </div>

          <div className="relative flex flex-col gap-16">
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={true} />
            <ImageRow images={rowImages} onImageClick={setSelectedImg} reverse={false} />
          </div>
        </section>

        {/* ── ABOUT / PHILOSOPHY SECTION ── */}
        <section
          className="py-32 px-6 md:px-20"
          style={{
            backgroundColor: "rgba(212,175,55,0.04)",
            borderTop: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-16">
            <div className="space-y-6">
              {/* About Us section – we keep the existing structure, but the contact box is updated */}

              <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: "2rem" }}>
                <h3 className="font-serif italic text-3xl" style={{ color: "#D4AF37" }}>
                  The Philosophy
                </h3>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
                  Every Frame <br />
                  <span style={{ color: "#D4AF37" }}>is Art</span>
                </h2>
                <p className="leading-relaxed text-lg font-light text-white/60">
                  Based in the heart of Lagos, TOP is a creative photography brand dedicated to crafting
                  timeless visual stories through cinematic weddings, expressive portraits, and striking
                  aerial imagery—transforming fleeting moments into elegant, timeless memories.
                </p>
                <div className="pt-6 flex gap-4 flex-wrap">
                  <a
                    href="https://wa.me/2348132799299"
                    target="_blank"
                    rel="noreferrer"
                    className="border px-10 py-4 uppercase text-xs font-bold tracking-[0.3em] transition-all inline-block"
                    style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#D4AF37";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                    }}
                  >
                    Book a Session
                  </a>
                </div>

                {/* ─── UPDATED CONTACT & SOCIAL BOX ─── */}
                <div
                  className="mt-8 rounded-2xl p-6 space-y-6"
                  style={{ border: "1px solid rgba(212,175,55,0.15)", backgroundColor: "rgba(212,175,55,0.03)" }}
                >
                  {/* Inquiries – now with Call Us and WhatsApp buttons */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#D4AF37" }}>
                      Inquiries
                    </p>

                    {/* Call Us button */}
                    <a
                      href="tel:+2348132799299"
                      className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ border: "1px solid rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.07)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-white/70 group-hover:text-[#D4AF37] transition-colors">
                        Call Us
                      </span>
                    </a>

                    {/* WhatsApp button */}
                    <a
                      href="https://wa.me/2348132799299"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ border: "1px solid rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.07)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-white/70 group-hover:text-[#D4AF37] transition-colors">
                        WhatsApp
                      </span>
                    </a>
                  </div>

                  <div style={{ height: "1px", backgroundColor: "rgba(212,175,55,0.1)" }} />

                  {/* Connect With Us – unchanged (keeps existing social links) */}
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#D4AF37" }}>Connect With Us</p>
                    <div className="flex items-center gap-3 flex-wrap">

                      {/* Facebook */}
                      <a
                        href="https://www.facebook.com/share/1KToiX8cS4/"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.25)", backgroundColor: "rgba(212,175,55,0.04)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.04)"; }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-[#D4AF37] transition-colors">Facebook</span>
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA=="
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.25)", backgroundColor: "rgba(212,175,55,0.04)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.04)"; }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.5" cy="6.5" r="1" fill="#D4AF37" stroke="none"/>
                        </svg>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-[#D4AF37] transition-colors">Instagram</span>
                      </a>

                      {/* Twitter / X */}
                      <a
                        href="https://twitter.com/topstudios1"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.25)", backgroundColor: "rgba(212,175,55,0.04)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.04)"; }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
                        </svg>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-[#D4AF37] transition-colors">Twitter</span>
                      </a>

                      {/* Email */}
                      <a
                        href="mailto:topstudios@email.com"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                        style={{ border: "1px solid rgba(212,175,55,0.25)", backgroundColor: "rgba(212,175,55,0.04)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.04)"; }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-[#D4AF37] transition-colors">Email</span>
                      </a>

                    </div>
                  </div>
                </div>
                {/* ─── END CONTACT & SOCIAL BOX ─── */}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="py-24 text-center"
          style={{
            borderTop: "1px solid rgba(212,175,55,0.08)",
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <div
              className="h-10 w-[1px]"
              style={{ background: "linear-gradient(to bottom, #D4AF37, transparent)" }}
            />
            <p
              className="text-[9px] tracking-[1.2em] uppercase font-medium"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              © 2026 TOP • All Right Reserve
            </p>
          </div>
        </footer>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&display=swap');

          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          /* Champagne-gold mat behind each tile */
          .gold-mat {
            background: linear-gradient(145deg, rgba(212,175,55,0.14), rgba(212,175,55,0.02));
            box-shadow: 0 20px 40px -12px rgba(0,0,0,0.6);
          }

          /* Resting glow — subtle gold edge on every card */
          .photo-card {
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow:
              0 0 12px rgba(212, 175, 55, 0.15),
              0 0 30px rgba(212, 175, 55, 0.06),
              0 8px 32px rgba(0, 0, 0, 0.6);
            transition: box-shadow 0.4s ease, border-color 0.4s ease;
          }

          /* Hover glow — lights up bright on interaction */
          .photo-card:hover {
            border-color: rgba(212, 175, 55, 0.7);
            box-shadow:
              0 0 20px rgba(212, 175, 55, 0.5),
              0 0 60px rgba(212, 175, 55, 0.25),
              0 0 100px rgba(212, 175, 55, 0.1),
              0 12px 40px rgba(0, 0, 0, 0.8);
          }
        `}</style>
      </div>
    </div>
  );
}