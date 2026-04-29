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
            className={`${shapes[i % shapes.length]} shrink-0 overflow-hidden cursor-pointer flex-none relative group photo-card`}
          >
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
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
  ];

  const rowImages = [
    "/images/photo-1.jfif",
    "/images/photo-2.jfif",
    "/images/photo-3.jfif",
    "/images/photo-4.jfif",
    "/images/photo-5.jfif",
  ];

  const sloganText = "...your official photographers";

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      8000
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
      {/* ── PHOTO MENU ── */}
      <PhotoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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
                transition={{ duration: 3.5, ease: "easeInOut" }}
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
            {/* Menu trigger — same pattern as FashionMenu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-3 group"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                Menu
              </span>
              <div className="flex flex-col gap-[5px]">
                <span className="block w-7 h-[1.5px] bg-[#D4AF37]" />
                <span className="block w-5 h-[1.5px] bg-[#D4AF37] ml-auto" />
                <span className="block w-7 h-[1.5px] bg-[#D4AF37]" />
              </div>
            </button>
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
        <section className="py-24 bg-black">
          <div className="flex flex-col gap-16">
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
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="font-serif italic text-3xl" style={{ color: "#D4AF37" }}>
                The Philosophy
              </h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
                Every Frame <br />
                <span style={{ color: "#D4AF37" }}>is Art</span>
              </h2>
              <p className="leading-relaxed text-lg font-light text-white/60">
                Based in the heart of Lagos, TOP is a luxury boutique studio specialising in cinematic
                weddings, premium portraiture, and aerial visuals. We don't just take photos — we
                orchestrate light and emotion to preserve life's most fleeting moments with unparalleled
                elegance.
              </p>
              <div className="pt-6 flex gap-4 flex-wrap">
                <a
                  href="https://wa.me/2348061587993"
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

              {/* Contact strip */}
              <div
                className="pt-10 mt-4 grid grid-cols-2 gap-8"
                style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
              >
                <div className="space-y-1">
                  <p
                    className="text-[10px] font-bold tracking-[0.5em] uppercase"
                    style={{ color: "#D4AF37" }}
                  >
                    Inquiries
                  </p>
                  <p className="text-white font-serif italic text-lg tracking-wide">
                    +234 806 158 7993
                  </p>
                </div>
                <div className="space-y-1">
                  <p
                    className="text-[10px] font-bold tracking-[0.5em] uppercase"
                    style={{ color: "#D4AF37" }}
                  >
                    Social
                  </p>
                  <p className="text-white font-serif italic text-lg tracking-wide">
                    @topstudios1
                  </p>
                </div>
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
              © 2026 TOP • Cinematic Excellence
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
