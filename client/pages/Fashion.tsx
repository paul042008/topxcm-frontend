import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FashionMenu from "../components/FashionMenu";
import { Link, useNavigate } from "react-router-dom";

const API = "https://topxcm-backend-1.onrender.com";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Album {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  cover?: string;
  images: any[];
}

type CollectionCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  count: string;
};

// ─── STATIC DATA ────────────────────────────────────────────────────────────

const heroSlides = [
  "/images/hero1.png",
  "/images/hero2.png",
  "/images/hero3.jpeg",
  "/images/hero4.jpeg",
  "/images/hero5.png",
  "/images/hero6.png",
];

const fallbackCollections: CollectionCard[] = [
  {
    id: "heritage-drop",
    title: "Heritage Drop",
    description: "Tradition. Reimagined.",
    image: "/images/hero1.png",
    count: "12 Items",
  },
  {
    id: "minimal-luxe",
    title: "Minimal Luxe",
    description: "Clean. Classy. Timeless.",
    image: "/images/hero2.png",
    count: "18 Items",
  },
  {
    id: "street-royalty",
    title: "Street Royalty",
    description: "Bold. Urban. Fearless.",
    image: "/images/hero3.jpeg",
    count: "10 Items",
  },
  {
    id: "xcm-signature",
    title: "XCM Signature",
    description: "Iconic pieces, defining style.",
    image: "/images/hero4.jpeg",
    count: "14 Items",
  },
];

// ─── ROUTE MAPPING ──────────────────────────────────────────────────────────

const collectionRouteMap: Record<string, string> = {
  "heritage-drop": "/fashion/suits",
  "minimal-luxe": "/fashion/agbada",
  "street-royalty": "/fashion/natives",
  "xcm-signature": "/fashion/casuals",
};

const DEFAULT_ROUTE = "/fashion/latest";

function getRouteForCard(card: CollectionCard): string {
  return collectionRouteMap[card.id] || DEFAULT_ROUTE;
}

// ─── FEATURE TILES ──────────────────────────────────────────────────────────

const featureTiles = [
  {
    title: "Premium Quality",
    description: "Top-notch fabrics and clean finishing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 2l2.9 5.9L21 9l-4.5 4.4L17.6 21 12 18l-5.6 3 1.1-7.6L3 9l6.1-1.1L12 2z" />
      </svg>
    ),
  },
  {
    title: "Modern Designs",
    description: "Clean cuts with a fresh edge.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M4 20h16" />
        <path d="M6 20V8l6-4 6 4v12" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    title: "Exclusive Pieces",
    description: "Limited drops for bold style.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M6 20h12l-1.5-7H7.5L6 20z" />
        <path d="M8 13V8a4 4 0 0 1 8 0v5" />
      </svg>
    ),
  },
  {
    title: "Fast Delivery",
    description: "Fast, reliable worldwide shipping.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M3 7h13v10H3z" />
        <path d="M16 10h3l2 2v5h-5" />
        <circle cx="7" cy="19" r="1.75" />
        <circle cx="18" cy="19" r="1.75" />
      </svg>
    ),
  },
];

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────

function SectionLabel({
  eyebrow,
  title,
  centered = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : "text-left"}>
      <p
        className={`text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-bold ${
          light ? "text-[#00AEEF]/80" : "text-[#00AEEF]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl md:text-5xl leading-[0.95] ${
          light ? "text-white" : "text-black"
        } font-serif italic`}
      >
        {title}
      </h2>
    </div>
  );
}

function ImageOnlyCard({
  item,
  onClick,
}: {
  item: CollectionCard;
  onClick: (card: CollectionCard) => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      onClick={() => onClick(item)}
      className="group relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/5]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </motion.button>
  );
}

// ─── SLIDING RAIL (FIXED - direction-aware touch handling) ────────────────
// Instead of hijacking every touch immediately, we wait until the gesture is
// clearly horizontal or vertical before deciding whether to drag the rail or
// let the page scroll natively. This is what makes autoplay reliably resume
// on mobile after the user scrolls the page past this section.

function SlidingRail({
  items,
  onClick,
  reverse = false,
}: {
  items: CollectionCard[];
  onClick: (card: CollectionCard) => void;
  reverse?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startTranslate, setStartTranslate] = useState(0);
  const speed = reverse ? -0.45 : 0.45;
  const setWidthRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  // Touch-specific tracking for direction detection
  const touchStartYRef = useRef(0);
  const touchDirectionRef = useRef<"undecided" | "horizontal" | "vertical">("undecided");

  useEffect(() => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.scrollWidth;
      setWidthRef.current = totalWidth / 2;
    }
  }, [items]);

  useEffect(() => {
    const step = () => {
      if (!isPausedRef.current && !isDragging && setWidthRef.current > 0) {
        setTranslateX((prev) => {
          let newX = prev + speed;
          if (newX <= -setWidthRef.current) {
            newX += setWidthRef.current;
          } else if (newX > 0) {
            newX -= setWidthRef.current;
          }
          return newX;
        });
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [speed, isDragging]);

  const pauseAutoScroll = () => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 50);
  };

  const resumeAutoScroll = () => {
    isPausedRef.current = false;
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  // ─── MOUSE DRAG ──────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartTranslate(translateX);
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const delta = e.clientX - startX;
    setTranslateX(startTranslate + delta);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pauseAutoScroll();
    }
  };

  // ─── TOUCH DRAG ──────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't preventDefault here — we don't yet know if this is a horizontal
    // drag or a vertical page scroll. Just record the starting point.
    touchDirectionRef.current = "undecided";
    setStartX(e.touches[0].clientX);
    touchStartYRef.current = e.touches[0].clientY;
    setStartTranslate(translateX);
    // Pause autoplay optimistically; it resumes on touchend/touchcancel,
    // or immediately below if this turns out to be a vertical scroll.
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (touchDirectionRef.current === "undecided") {
      // Wait for the gesture to become unambiguous (small threshold avoids
      // false positives from tiny finger jitter)
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        touchDirectionRef.current = "horizontal";
        setIsDragging(true);
      } else {
        touchDirectionRef.current = "vertical";
        // This is a page scroll, not a rail drag — let the browser handle
        // it natively and resume autoplay right away.
        resumeAutoScroll();
        return;
      }
    }

    if (touchDirectionRef.current === "vertical") return; // let native scroll happen

    // Confirmed horizontal drag — take over the gesture.
    e.preventDefault();
    setTranslateX(startTranslate + deltaX);
  };

  const handleTouchEnd = () => {
    if (touchDirectionRef.current === "horizontal") {
      setIsDragging(false);
      pauseAutoScroll();
    }
    touchDirectionRef.current = "undecided";
  };

  // FIX: Mobile browsers fire touchcancel (not touchend) when the gesture
  // is taken over by native page scrolling, or interrupted by the OS.
  // Without this handler, isDragging/isPausedRef could get stuck and the
  // rail would never resume auto-scrolling after the user scrolled the page.
  const handleTouchCancel = () => {
    if (isDragging) {
      setIsDragging(false);
    }
    touchDirectionRef.current = "undecided";
    // Resume auto-scroll immediately because the gesture was cancelled
    resumeAutoScroll();
  };

  const loopedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ touchAction: "pan-y" }} // allow native vertical scroll; we handle horizontal ourselves
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={() => {
        if (!isDragging) {
          resumeAutoScroll();
        }
      }}
      // Touch events on the container
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div
        className="flex gap-4 py-2 px-1 no-scrollbar select-none"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: 'none',
          width: 'max-content',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loopedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="w-[220px] shrink-0 sm:w-[250px]">
            <ImageOnlyCard item={item} onClick={onClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function FashionPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CollectionCard | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestAlbums, setLatestAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const WA = "https://wa.me/2348061587993";

  // ─── FETCH ALBUMS ─────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`${API}/api/fashion-albums`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: Album[]) => {
        if (!isMounted) return;
        const latest = Array.isArray(data)
          ? data.filter((album) => album.category === "latest" && album.cover)
          : [];
        setLatestAlbums(latest);
      })
      .catch(() => {
        if (!isMounted) return;
        setLatestAlbums([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── HERO SLIDESHOW ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  // ─── BUILD CARDS ──────────────────────────────────────────────────────────
  const heroCollections = useMemo<CollectionCard[]>(() => {
    if (!latestAlbums.length) return fallbackCollections;
    return latestAlbums.slice(0, 4).map((album, index) => ({
      id: album.id,
      title: album.name || `Collection ${index + 1}`,
      description: album.description || "Exclusive pieces",
      image: album.cover || fallbackCollections[index % fallbackCollections.length].image,
      count: `${album.images?.length || 0} Items`,
    }));
  }, [latestAlbums]);

  // Only the first item for the carousel
  const latestPanelItems = useMemo<CollectionCard[]>(() => {
    return heroCollections.slice(0, 1);
  }, [heroCollections]);

  const railItems = useMemo<CollectionCard[]>(() => fallbackCollections, []);
  const heroCopy = "Premium, confident and classic outfit tailored for you.";

  // ─── HANDLERS ──────────────────────────────────────────────────────────────
  const handleImageClick = (card: CollectionCard) => {
    setSelectedItem(card);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handleViewMore = (card: CollectionCard) => {
    const route = getRouteForCard(card);
    navigate(route);
    setSelectedItem(null);
  };

  const scrollToCollections = () => {
    collectionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`relative w-full overflow-x-hidden bg-black text-white ${
        selectedItem ? "h-screen overflow-hidden" : ""
      }`}
    >
      <FashionMenu
        isFashionLanding={true}
        initialOpen={isMenuOpen}
        onOpenAction={() => setIsMenuOpen(true)}
        onCloseAction={() => setIsMenuOpen(false)}
        hideHamburger={true}
      />

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
            style={{
              backdropFilter: "blur(18px)",
              backgroundColor: "rgba(0,0,0,0.58)",
            }}
            onClick={handleCloseLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 24 }}
              className="relative max-h-[88vh] max-w-5xl overflow-hidden rounded-3xl border border-[#00AEEF]/20 bg-black/45 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLightbox}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#00AEEF]/90 text-lg font-bold text-white transition-colors hover:bg-[#00AEEF]"
              >
                ✕
              </button>
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-h-[70vh] w-full rounded-[20px] object-contain"
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleViewMore(selectedItem)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#00AEEF] px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#00AEEF]/20"
                >
                  View More →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: isMenuOpen ? 0.18 : 1,
          filter: isMenuOpen ? "blur(2px)" : "none",
          pointerEvents: isMenuOpen ? "none" : "auto",
        }}
      >
        {/* HEADER */}
        <header className="relative z-50 flex items-center justify-between border-b border-white/5 bg-black/80 px-5 py-5 backdrop-blur-md md:px-10">
          <div className="flex flex-col gap-1">
            <img
              src="/images/your-logo.png"
              alt="XCM Logo"
              className="max-h-8 w-auto md:max-h-10 object-contain -ml-5 -mt-3"
            />
            <span className="text-[9px] uppercase tracking-[0.55em] text-[#00AEEF]/85 md:text-[11px]">
              Fashion Corner
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col gap-[5px] group"
            aria-label="Open menu"
          >
            <span className="block h-[1.5px] w-7 bg-[#00AEEF] transition-all group-hover:w-8" />
            <span className="ml-auto block h-[1.5px] w-5 bg-[#00AEEF] transition-all group-hover:w-8" />
            <span className="block h-[1.5px] w-7 bg-[#00AEEF] transition-all group-hover:w-8" />
          </button>
        </header>

        {/* HERO */}
        <section className="relative min-h-screen overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(0,174,239,0.2),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(0,174,239,0.12),transparent_22%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-10 pt-8 md:px-10">
            <div className="grid flex-1 items-stretch gap-4 grid-cols-[1.08fr_0.92fr] sm:gap-6 md:gap-8 overflow-visible">
              <div className="relative z-10 flex flex-col justify-center max-w-[18rem] sm:max-w-xl md:max-w-[540px]">
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="text-[10px] font-bold uppercase tracking-[0.48em] text-white/85 md:text-sm"
                >
                  New Season • New Energy
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
                  className="mt-4 max-w-[11ch] text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  <span className="block">Wear</span>
                  <span className="block text-[#00AEEF]">Assured.</span>
                  <span className="block">Live XCM.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
                  className="mt-4 max-w-md text-[12px] leading-relaxed text-white/72 sm:text-sm md:text-lg"
                >
                  {heroCopy}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
                  className="mt-6"
                >
                  <button
                    onClick={scrollToCollections}
                    className="inline-flex items-center gap-3 rounded-2xl border border-[#00AEEF]/40 bg-[#00AEEF] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-white shadow-[0_0_28px_rgba(0,174,239,0.32)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,174,239,0.42)] sm:px-5 sm:py-3 md:px-6 md:py-4 md:text-xs"
                  >
                    View Collection
                    <span className="text-lg">→</span>
                  </button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 36, y: 18 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1.15, delay: 0.2, ease: "easeOut" }}
                className="relative w-full h-full overflow-visible flex items-center justify-center bg-black"
              >
                <div className="relative w-full h-full overflow-visible flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={heroSlides[currentSlide]}
                      alt="XCM fashion showcase"
                      initial={{ opacity: 0, scale: 1.8 }}
                      animate={{ opacity: 0.3, scale: 2.5 }}
                      exit={{ opacity: 0, scale: 2.2 }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
              className="relative z-20 -mt-6 sm:-mt-10 lg:-mt-14"
            >
              <div className="rounded-[30px] border border-white/12 bg-black/60 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5">
                <div className="mb-4 flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[#00AEEF] text-lg">✦</span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#00AEEF]">
                      Latest Collections
                    </p>
                  </div>
                  <Link
                    to="/fashion/latest"
                    className="text-sm font-medium text-[#00AEEF] transition-colors hover:text-white"
                  >
                    View All →
                  </Link>
                </div>

                {/* ─── RECTANGULAR CARD WITH EXTRA SPACE ──────────────────── */}
                <div className="flex justify-center pb-1 mt-6">
                  {loading ? (
                    <div className="flex items-center justify-center w-full py-8">
                      <div className="w-6 h-6 border-2 border-[#00AEEF]/20 border-t-[#00AEEF] rounded-full animate-spin" />
                    </div>
                  ) : (
                    latestPanelItems.length > 0 && (
                      <motion.button
                        key={latestPanelItems[0].id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleImageClick(latestPanelItems[0])}
                        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/8 bg-white/5 text-left shadow-lg"
                      >
                        <div className="relative h-[260px] sm:h-[320px] md:h-[360px]">
                          <img
                            src={latestPanelItems[0].image}
                            alt={latestPanelItems[0].title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                            <div className="space-y-1.5">
                              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                                {latestPanelItems[0].title}
                              </h3>
                              <p className="text-sm text-white/75 sm:text-base max-w-xl line-clamp-2">
                                {latestPanelItems[0].description}
                              </p>
                              <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#00AEEF] sm:text-sm">
                                {latestPanelItems[0].count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/45">
              <span>01</span>
              <div className="mx-4 h-[1px] flex-1 bg-white/10" />
              <span>06</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-y border-black/5 bg-white px-3 py-6 md:px-10 md:py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-1 md:gap-4">
            {featureTiles.map((feature) => (
              <FeatureBlock key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* EXPLORE COLLECTIONS */}
        <section ref={collectionsRef} className="bg-black px-5 py-18 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-6 pt-12">
              <SectionLabel eyebrow="Featured Collections" title="Find Your Style" light />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex border-b border-[#00AEEF]/45 pb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[#00AEEF] transition-colors hover:border-[#00AEEF]"
              >
                View all →
              </button>
            </div>

            <div className="mt-8 space-y-5">
              <SlidingRail items={railItems} onClick={handleImageClick} />
              <SlidingRail items={[...railItems].reverse()} onClick={handleImageClick} reverse />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="relative overflow-hidden border-t border-[#00AEEF]/10 bg-[#0a0a0a] px-5 py-20 md:px-10 md:py-28">
          <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#00AEEF]/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#00AEEF]/10 blur-3xl" />

          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-[34px] border border-[#00AEEF]/14 bg-white p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <a
                    href="tel:+2348061587993"
                    className="group flex items-center gap-4 rounded-2xl border border-[#00AEEF]/12 bg-black/5 px-6 py-4 transition-all hover:border-[#00AEEF]/35 hover:bg-[#00AEEF]/5 flex-1 min-w-[180px] justify-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00AEEF]/25 bg-[#00AEEF]/10 text-[#00AEEF]">☎</div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#00AEEF]">Call Us</p>
                      <p className="mt-1 text-sm text-black/70">Speak with our team</p>
                    </div>
                  </a>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-[#00AEEF]/12 bg-black/5 px-6 py-4 transition-all hover:border-[#00AEEF]/35 hover:bg-[#00AEEF]/5 flex-1 min-w-[180px] justify-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00AEEF]/25 bg-[#00AEEF]/10 text-[#00AEEF]">⌁</div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#00AEEF]">WhatsApp</p>
                      <p className="mt-1 text-sm text-black/70">Chat for quick orders</p>
                    </div>
                  </a>
                </div>
                <a
                  href="mailto:xcmwardrobes@gmail.com"
                  className="inline-flex items-center gap-3 rounded-2xl border border-black/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#00AEEF]/30 hover:text-[#00AEEF]"
                >
                  Email Us
                </a>
                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                <div className="flex flex-wrap justify-center gap-3">
                  <p className="w-full text-[10px] uppercase tracking-[0.45em] text-[#00AEEF]">Connect With Us</p>
                  <a
                    href="https://www.facebook.com/share/1KToiX8cS4/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/xcmwardrobes?igsh=NHJscDd1dTdodmFo"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://x.com/XCMwardrobes"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
                  >
                    Twitter / X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#00AEEF]/8 bg-black py-14 text-center">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5">
            <div className="h-8 w-px bg-gradient-to-b from-[#00AEEF]/35 to-transparent" />
            <p className="text-[8px] uppercase tracking-[1em] text-white/20">© 2026 XCM • All Rights Reserved</p>
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

// ─── FEATURE BLOCK ──────────────────────────────────────────────────────────

function FeatureBlock({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-start gap-2 px-1 py-2 text-center md:gap-3 md:px-3 md:py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[#00AEEF] shadow-[0_0_0_1px_rgba(0,174,239,0.18)] md:h-12 md:w-12">
        {icon}
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black leading-tight md:text-sm md:tracking-[0.14em]">
          {title}
        </h3>
        <p className="mx-auto hidden max-w-[14rem] text-[9px] leading-relaxed text-black/60 md:block md:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}