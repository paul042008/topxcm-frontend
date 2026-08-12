import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";

const API = "https://topxcm-backend-1.onrender.com";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface ShowcaseItem {
  image: string;
  targetRoute?: string;
  id: string;
  title?: string;
}

// ─── ROUTE MAP ──────────────────────────────────────────────────────────────

const categoryRouteMap: Record<string, string> = {
  weddings: "/photography/weddings",
  "studio-outdoors": "/photography/studio-outdoors",
  "aerials-videos": "/photography/aerials-videos",
  canvas: "/photography/canvas",
  portraits: "/photography/portraits",
};

// ─── GLOBAL PROTECTION HOOK ─────────────────────────────────────────────────
// Blocks the common browser-level ways to save/copy images or view source.
// NOTE: this cannot and does not stop OS-level screenshots (Snipping Tool,
// ⌘+Shift+4, phone screenshot buttons, or photographing the screen) — no
// website can see or intercept those, since they never touch the browser.

function useAntiCaptureProtection() {
  const [isObscured, setIsObscured] = useState(false);

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // Block Save (Ctrl/Cmd+S), Print (Ctrl/Cmd+P), View Source (Ctrl/Cmd+U)
      if (ctrlOrCmd && ["s", "S", "p", "P", "u", "U"].includes(key)) {
        e.preventDefault();
        return false;
      }
      // Block DevTools shortcuts
      if (key === "F12") {
        e.preventDefault();
        return false;
      }
      if (ctrlOrCmd && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(key)) {
        e.preventDefault();
        return false;
      }
    };

    // Best-effort: clear clipboard shortly after a PrintScreen keypress.
    // Only works in browsers that grant clipboard-write without a prompt,
    // and does nothing on mobile (screenshots don't fire this event there).
    const handlePrintScreen = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard?.writeText("").catch(() => {});
      }
    };

    // Briefly hide content when the tab/window loses focus — catches some
    // (not all) screen-recording tools that trigger a blur/visibility event.
    const handleBlur = () => setIsObscured(true);
    const handleFocus = () => setIsObscured(false);
    const handleVisibility = () => setIsObscured(document.hidden);

    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("keyup", handlePrintScreen);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", blockContextMenu);

    return () => {
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("keyup", handlePrintScreen);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, []);

  return isObscured;
}

// ─── PROTECTED IMAGE COMPONENT ─────────────────────────────────────────────
// Renders as a CSS background-image instead of an <img> tag — there's no
// image element for "Save Image As", browser image context menus, or
// drag-to-desktop to target. Combined with pointer/selection blocking below.

function ProtectedImage({
  src,
  alt,
  className = "",
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        WebkitTouchCallout: "none",
        userSelect: "none",
        touchAction: "manipulation",
      }}
    >
      {/* Transparent layer that intercepts long-press / right-click / drag
          so the underlying background-image can't be targeted directly */}
      <div
        className="absolute inset-0"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: "none" }}
      />

      {/* Watermark that appears only on long-press attempts (mobile) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 flex items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
        }}
        onTouchStart={(e) => {
          const el = e.currentTarget;
          el.style.opacity = "0.8";
          setTimeout(() => { el.style.opacity = "0"; }, 2000);
        }}
      >
        <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">
          TOP ©
        </span>
      </div>
    </div>
  );
}

// ─── AUTO-SCROLLING IMAGE ROW ──────────────────────────────────────────────

function AutoScrollRow({
  items,
  onItemClick,
  reverse = false,
  speed = 0.4,
}: {
  items: ShowcaseItem[];
  onItemClick: (item: ShowcaseItem) => void;
  reverse?: boolean;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const direction = reverse ? -speed : speed;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!isUserScrolling.current && track) {
        track.scrollLeft += direction;
        const half = track.scrollWidth / 2;
        if (direction > 0 && track.scrollLeft >= half) {
          track.scrollLeft -= half;
        } else if (direction < 0 && track.scrollLeft <= 0) {
          track.scrollLeft += half;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [direction]);

  const pauseAutoScroll = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 3000);
  };

  const loopedItems = [...items];

  if (items.length === 0) return null;

  const getAspectClass = (index: number) => {
    const mod = index % 3;
    if (mod === 0) return "aspect-square";
    if (mod === 1) return "aspect-[3/4]";
    return "aspect-[4/3]";
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onWheel={pauseAutoScroll}
      onTouchStart={pauseAutoScroll}
      onMouseDown={pauseAutoScroll}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-1 py-4 px-2 no-scrollbar select-none items-center"
        style={{ scrollBehavior: "auto" }}
      >
        {loopedItems.map((item, i) => (
          <motion.div
            key={`${item.id}-${i}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => onItemClick(item)}
            className="w-[240px] sm:w-[280px] md:w-[320px] shrink-0 cursor-pointer overflow-hidden rounded-lg"
          >
            <div className={`relative w-full ${getAspectClass(i)} overflow-hidden`}>
              <ProtectedImage
                src={item.image}
                alt={item.title || "Showcase"}
                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <span className="text-white text-xs uppercase tracking-widest font-bold opacity-0 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  View
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function Photography() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isObscured = useAntiCaptureProtection();

  const heroSlides = [
    "/images/slide5.jpg",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000",
    "/images/slide7.jpg",
    "/images/slide3.jpg",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
    "/images/slide1.jpg",
    "/images/slide4.jpg",
    "/images/slide6.jpg",
  ];

  const sloganText = "...your official photographer";

  useEffect(() => {
    fetch(`${API}/api/items`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const showcase = data
          .filter((item) => item.category === "showcase")
          .map((item) => ({
            image: item.image,
            targetRoute: item.extra_text || "",
            id: item.id,
            title: item.title,
          }))
          .filter((item) => item.image);
        setShowcaseItems(showcase);
        setLoading(false);
      })
      .catch(() => {
        setShowcaseItems([]);
        setLoading(false);
      });
  }, []);

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

  const handleImageClick = (item: ShowcaseItem) => {
    setSelectedItem(item);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handleViewMore = (item: ShowcaseItem) => {
    if (item.targetRoute && categoryRouteMap[item.targetRoute]) {
      navigate(categoryRouteMap[item.targetRoute]);
    } else {
      navigate("/photography");
    }
    setSelectedItem(null);
  };

  const handleVideoClick = () => {
    navigate("/photography/aerials-videos");
  };

  const chunkSize = 10;
  const itemRows: ShowcaseItem[][] = [];
  for (let i = 0; i < showcaseItems.length; i += chunkSize) {
    itemRows.push(showcaseItems.slice(i, i + chunkSize));
  }

  const fallbackItems: ShowcaseItem[] = [
    { image: "/images/photo-1.jfif", targetRoute: "", id: "fallback1" },
    { image: "/images/photo-2.jfif", targetRoute: "", id: "fallback2" },
    { image: "/images/photo-3.jfif", targetRoute: "", id: "fallback3" },
    { image: "/images/photo-4.jfif", targetRoute: "", id: "fallback4" },
    { image: "/images/photo-5.jfif", targetRoute: "", id: "fallback5" },
  ];
  const rowsToRender = itemRows.length > 0 ? itemRows : [fallbackItems];

  return (
    <div
      className={`relative w-full bg-black select-none overflow-x-hidden ${
        selectedItem ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* ─── OBSCURE OVERLAY on tab/window blur (best-effort only) ─── */}
      <AnimatePresence>
        {isObscured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
          >
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em]">TOP ©</span>
          </motion.div>
        )}
      </AnimatePresence>

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
          {selectedItem && (
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
              onClick={handleCloseLightbox}
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
                  onClick={handleCloseLightbox}
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
                <ProtectedImage
                  src={selectedItem.image}
                  alt={selectedItem.title || "Showcase"}
                  className="w-full rounded-xl h-[70vh]"
                />
                <div className="mt-4 flex justify-center gap-4">
                  {selectedItem.targetRoute && categoryRouteMap[selectedItem.targetRoute] ? (
                    <button
                      onClick={() => handleViewMore(selectedItem)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#D4AF37]/20"
                    >
                      View More →
                    </button>
                  ) : null}
                  <button
                    onClick={handleCloseLightbox}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white/60 transition-colors hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HERO SECTION ── */}
        <section className="relative h-screen w-full overflow-hidden flex flex-col">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.25 }}
                animate={{ opacity: 0.6, scale: 1.15 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#D4AF37]/5 to-black/95" />
          </div>

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
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center mb-14 px-6">
            <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-white">
              The Gallery
            </p>
            <h3 className="font-serif italic text-2xl md:text-4xl text-white/85">
              Every frame, a story
            </h3>
            <div className="w-16 h-[2px] bg-[#D4AF37]/50 mx-auto mt-5 rounded-full" />
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <div className="flex flex-col gap-2">
              {rowsToRender.map((row, idx) => (
                <AutoScrollRow
                  key={idx}
                  items={row}
                  onItemClick={handleImageClick}
                  reverse={idx % 2 === 1}
                  speed={0.4 + idx * 0.05}
                />
              ))}
            </div>
          )}

          {/* ─── VIDEO SECTION (CLICKABLE) ── */}
          <div className="relative mt-8 px-4 max-w-4xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl cursor-pointer group transition-all duration-300 hover:border-[#D4AF37]/50"
              onClick={handleVideoClick}
            >
              <div className="relative">
                <video
                  src="/videos/showcase.mp4"
                  poster="/images/video-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto aspect-video object-cover pointer-events-none"
                  controls={false}
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload noremoteplayback"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37]/80 flex items-center justify-center backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="black">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <span className="text-white text-xs uppercase tracking-widest font-bold drop-shadow-lg">
                      Watch Reel
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-white/40 text-xs uppercase tracking-[0.3em] mt-4">
              Cinematic Showreel — Click to view more
            </p>
          </div>
        </section>

        {/* ─── PHILOSOPHY SECTION ── */}
        <section
          className="py-16 px-6 md:px-20"
          style={{
            backgroundColor: "rgba(212,175,55,0.04)",
            borderTop: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-16">
            <div className="space-y-6">
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

                <div
                  className="mt-8 rounded-2xl p-6 space-y-6"
                  style={{ border: "1px solid rgba(212,175,55,0.15)", backgroundColor: "rgba(212,175,55,0.03)" }}
                >
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#D4AF37" }}>
                      Inquiries
                    </p>
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

                  <div>
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#D4AF37" }}>Connect With Us</p>
                    <div className="flex items-center gap-3 flex-wrap">
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
                      <a
                        href="mailto:theofficialphotography1@email.com"
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
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ── */}
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
          img {
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            touch-action: manipulation;
          }
        `}</style>
      </div>
    </div>
  );
}