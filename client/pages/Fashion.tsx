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

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string;
  extra_text?: string; // stores the target route
}

type CollectionCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  count: string;
  targetRoute?: string;
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
    targetRoute: "/fashion/suits",
  },
  {
    id: "heritage-drop",
    title: "Heritage Drop",
    description: "Clean. Classy. Timeless.",
    image: "/images/hero2.png",
    count: "18 Items",
    targetRoute: "/fashion/suits",
  },
  {
    id: "heritage-drop",
    title: "Heritage Drop",
    description: "Clean. Classy. Timeless.",
    image: "/images/hero5.png",
    count: "18 Items",
    targetRoute: "/fashion/suits",
  },
  {
    id: "minimal-luxe",
    title: "Street Royalty",
    description: "Bold. Urban. Fearless.",
    image: "/images/hero3.jpeg",
    count: "10 Items",
    targetRoute: "/fashion/agbada",
  },
  {
    id: "minimal-luxe",
    title: "XCM Signature",
    description: "Iconic pieces, defining style.",
    image: "/images/hero4.jpeg",
    count: "14 Items",
    targetRoute: "/fashion/agbada",
  },
  {
    id: "xcm-signature",
    title: "XCM Signature",
    description: "Iconic pieces, defining style.",
    image: "/images/row1.jpg",
    count: "14 Items",
    targetRoute: "/fashion/casuals",
  },
  {
    id: "street-royalty",
    title: "XCM Signature",
    description: "Iconic pieces, defining style.",
    image: "/images/row3.jpg",
    count: "14 Items",
    targetRoute: "/fashion/natives",
  },
];

const DEFAULT_ROUTE = "/fashion/suits";

// ─── VALID ROUTES ──────────────────────────────────────────────────────────

const VALID_ROUTES = [
  "/fashion/suits",
  "/fashion/agbada",
  "/fashion/natives",
  "/fashion/casuals",
];

function getRouteForCard(card: CollectionCard): string {
  const route = card.targetRoute || DEFAULT_ROUTE;
  return VALID_ROUTES.includes(route) ? route : DEFAULT_ROUTE;
}

// ─── WAKE‑UP HELPERS ──────────────────────────────────────────────────────

async function pingServer(): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < 90_000) {
    try {
      const res = await fetch(`${API}/api/items`, {
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      if (res.ok || res.status < 500) return true;
    } catch {
      // still sleeping
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

async function fetchWithWakeup(url: string, options: RequestInit): Promise<Response> {
  let alive = false;
  try {
    const probe = await fetch(`${API}/api/items`, {
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    alive = probe.ok || probe.status < 500;
  } catch {
    alive = false;
  }

  if (!alive) {
    const woke = await pingServer();
    if (!woke) {
      throw new Error("Server did not wake up in time");
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  return fetch(url, { ...options, signal: AbortSignal.timeout(300_000) });
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

// ─── REVIEWS DATA (FASHION ONLY) ──────────────────────────────────────────

interface Review {
  id: string;
  name: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Doyin",
    text: "My sister love the cloth so also the kids, normally the eldest doesn't like to wear native but he fell in love with it that he requested to wear it to church today and it look so nice on them",
  },
  {
    id: "2",
    name: "Jonathan Moore",
    text: "Good morning trust you're well, So sorry about everything you went through behing the closed doors. We give all glory to God for his divine supply to overcome the setback.. You're truly string because despite everything happening to you, all outfits cme out really good and we got lots of compliments. May God keep blessing the works of your hands🙏",
  },
  {
    id: "3",
    name: "Jonathan Moore",
    text: "Thank you so much for everything. The outfits are very good. My wife is super pleased",
  },
  {
    id: "4",
    name: "Albert",
    text: "Suit is nice. Fits me properly",
  },
  {
    id: "5",
    name: "Olumide",
    text: "I got good reviews on the last outfit. Top stuff 👌🏽",
  },
  {
    id: "6",
    name: "Abraham",
    text: "I really love your work",
  },
];

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
  onClick: (item: CollectionCard, e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(item, e);
      }}
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

// ─── AUTO-SCROLLING RAIL ────────────────────────────────────────────────────

function AutoScrollRail({
  items,
  onClick,
  reverse = false,
  speed = 0.4,
}: {
  items: CollectionCard[];
  onClick: (item: CollectionCard, e: React.MouseEvent) => void;
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

  const loopedItems = [...items, ...items];

  if (items.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      onWheel={pauseAutoScroll}
      onTouchStart={pauseAutoScroll}
      onMouseDown={pauseAutoScroll}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-4 py-2 px-1 no-scrollbar select-none items-center"
        style={{ scrollBehavior: "auto" }}
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
  const [carouselItems, setCarouselItems] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const WA = "https://wa.me/2348061587993";

  // Fetch latest albums with wake-up
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchWithWakeup(`${API}/api/fashion-albums`, { method: "GET" })
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

  // Fetch fashion carousel items
  useEffect(() => {
    let isMounted = true;
    setLoadingCarousel(true);
    fetchWithWakeup(`${API}/api/items?category=fashion-carousel`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch carousel");
        return res.json();
      })
      .then((data: CarouselItem[]) => {
        if (!isMounted) return;
        const cards: CollectionCard[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          count: "1 Item",
          targetRoute: item.extra_text || DEFAULT_ROUTE,
        }));
        setCarouselItems(cards.length > 0 ? cards : fallbackCollections);
      })
      .catch(() => {
        if (!isMounted) return;
        setCarouselItems(fallbackCollections);
      })
      .finally(() => {
        if (isMounted) setLoadingCarousel(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const heroCollections = useMemo<CollectionCard[]>(() => {
    if (!latestAlbums.length) return fallbackCollections;
    return latestAlbums.slice(0, 4).map((album, index) => ({
      id: album.id,
      title: album.name || `Collection ${index + 1}`,
      description: album.description || "Exclusive pieces",
      image: album.cover || fallbackCollections[index % fallbackCollections.length].image,
      count: `${album.images?.length || 0} Items`,
      targetRoute: DEFAULT_ROUTE,
    }));
  }, [latestAlbums]);

  const latestPanelItems = useMemo<CollectionCard[]>(() => {
    return heroCollections.slice(0, 1);
  }, [heroCollections]);

  const railItems = useMemo<CollectionCard[]>(() => {
    return carouselItems.length > 0 ? carouselItems : fallbackCollections;
  }, [carouselItems]);

  const heroCopy = "Premium, confident and classic outfit tailored for you.";

  // ─── SCROLL POSITION FIX FOR LIGHTBOX ──────────────────────────────────
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (selectedItem) {
      const y = window.scrollY;
      scrollPositionRef.current = y;
      document.body.style.overflow = "hidden";
      window.scrollTo(0, y);
    } else {
      document.body.style.overflow = "";
      if (scrollPositionRef.current !== window.scrollY) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  // Lock scroll for review modal
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReviewModal]);

  const handleImageClick = (card: CollectionCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(card);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handleViewMore = (card: CollectionCard) => {
    let route = getRouteForCard(card);
    if (!VALID_ROUTES.includes(route)) {
      route = DEFAULT_ROUTE;
    }
    navigate(route);
    setSelectedItem(null);
  };

  const scrollToCollections = () => {
    collectionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Review modal handlers
  const openReviewModal = () => setShowReviewModal(true);
  const closeReviewModal = () => setShowReviewModal(false);

  // Show only 4 reviews, hide the rest behind a "View More" button at the bottom
  const visibleReviews = REVIEWS.slice(0, 4);
  const hiddenReviews = REVIEWS.slice(4);

  return (
    <div className="relative w-full overflow-x-hidden bg-black text-white">
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
                  See More →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10"
            style={{
              backdropFilter: "blur(14px)",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 24 }}
              className="relative max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl border border-[#00AEEF]/20 bg-black/80 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeReviewModal}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#00AEEF]/20 text-white hover:bg-[#00AEEF]/40"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-white mb-4">All Client Reviews</h3>
              <div className="space-y-4">
                {REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-white/10 pb-4 last:border-0"
                  >
                    <p className="text-sm font-semibold text-[#00AEEF]">{review.name}</p>
                    <p className="text-sm text-white/80 mt-1">{review.text}</p>
                  </div>
                ))}
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
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between border-b border-white/5 bg-black/80 px-5 py-5 backdrop-blur-md md:px-10">
          <div className="flex flex-col gap-1">
            <img
              src="/images/your-logo.png"
              alt="XCM Logo"
              className="max-h-8 w-auto md:max-h-10 object-contain -ml-1 -mt-3"
            />
            <span className="text-[9px] uppercase tracking-[0.55em] text-[#00AEEF]/85 md:text-[11px]">
              Wardrobes
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
        <section className="relative min-h-screen overflow-hidden bg-black pt-[72px] md:pt-[80px]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(0,174,239,0.2),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(0,174,239,0.12),transparent_22%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-10 pt-8 md:px-10">
            <div className="grid flex-1 items-stretch gap-4 grid-cols-[1.08fr_0.92fr] sm:gap-6 md:gap-8 overflow-visible">
              <div className="relative z-10 flex flex-col justify-start pt-8 max-w-[18rem] sm:max-w-xl md:max-w-[540px]">
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="text-[10px] font-bold uppercase tracking-[0.48em] text-white/85 md:text-sm"
                />
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
                  className="mt-4 max-w-[11ch] text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  <span className="block">Wear</span>
                  <span className="block text-[#00AEEF]">Assured.</span>
                  <span className="block">Wear</span>
                  <span className="block text-[#00AEEF]">XCM.</span>
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
                    View our works
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
              className="relative z-20 -mt-12 sm:-mt-16 lg:-mt-20"
            >
              <div className="rounded-[30px] border border-white/12 bg-black/60 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5">
                <div className="mb-4 flex items-center px-1">
                  <div className="flex items-center gap-3">
                    <svg className="text-[#00AEEF] w-2 h-2" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#00AEEF]">
                      Latest Collections
                    </p>
                  </div>
                </div>

                <div className="flex justify-center pb-1 mt-6">
                  {loading ? (
                    <div className="flex items-center justify-center w-full py-8">
                      <div className="w-6 h-6 border-2 border-[#00AEEF]/20 border-t-[#00AEEF] rounded-full animate-spin" />
                    </div>
                  ) : (
                    latestPanelItems.length > 0 && (
                      <div className="w-full max-w-3xl">
                        <motion.button
                          key={latestPanelItems[0].id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleImageClick(latestPanelItems[0], e);
                          }}
                          className="w-full overflow-hidden rounded-[28px] border border-white/8 bg-white/5 text-left shadow-lg"
                        >
                          <div className="relative h-[250px] sm:h-[240px] md:h-[280px]">
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
                                <div
                                  className="text-sm text-white/75 sm:text-base max-w-xl line-clamp-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
                                  dangerouslySetInnerHTML={{
                                    __html: latestPanelItems[0].description,
                                  }}
                                />
                                <Link
                                  to="/fashion/latest"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-block mt-2 text-xs uppercase tracking-[0.35em] text-[#00AEEF] border border-[#00AEEF]/40 px-4 py-1.5 rounded-full hover:bg-[#00AEEF]/10 transition-colors"
                                >
                                  See More →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
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
              {loadingCarousel ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[#00AEEF]/20 border-t-[#00AEEF] rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <AutoScrollRail items={railItems} onClick={handleImageClick} />
                  <AutoScrollRail items={[...railItems].reverse()} onClick={handleImageClick} reverse />
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── CLIENT REVIEWS SECTION ─── */}
        <section className="bg-black px-5 py-16 md:px-10 md:py-24 border-t border-[#00AEEF]/10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-6">
              <SectionLabel eyebrow="Client Reviews" title="What They Say" light />
              {/* No "View More" at the top; it's placed at the bottom */}
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-[#00AEEF]/15 bg-black/40 p-5 backdrop-blur-sm hover:border-[#00AEEF]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-[#00AEEF] font-bold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <div className="flex text-[#00AEEF] text-[10px]">★★★★★</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            {/* "View More" button placed at the bottom, centered */}
            {hiddenReviews.length > 0 && (
              <div className="mt-10 text-center">
                <button
                  onClick={openReviewModal}
                  className="inline-flex border-b border-[#00AEEF]/45 pb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[#00AEEF] transition-colors hover:border-[#00AEEF]"
                >
                  View More →
                </button>
              </div>
            )}
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00AEEF]/25 bg-[#00AEEF]/10 text-[#00AEEF]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00AEEF]/25 bg-[#00AEEF]/10 text-[#00AEEF]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    </div>
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