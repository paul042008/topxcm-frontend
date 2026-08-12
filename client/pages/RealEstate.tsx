import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealEstateMenu from "../components/RealEstateMenu";
import { Link, useNavigate } from "react-router-dom";

const API = "https://topxcm-backend-1.onrender.com";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  location?: string;
  category: string;
}

type ListingCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  location?: string;
};

// ─── STATIC DATA ────────────────────────────────────────────────────────────

const heroSlides = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000",
];

const fallbackListings: ListingCard[] = [
  {
    id: "1",
    title: "Lekki Phase 1 Duplex",
    description: "4-bedroom luxury duplex with pool",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
    price: "₦250,000,000",
    location: "Lekki, Lagos",
  },
  {
    id: "2",
    title: "Banana Island Penthouse",
    description: "5-bedroom penthouse with ocean view",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
    price: "₦850,000,000",
    location: "Banana Island, Lagos",
  },
  {
    id: "3",
    title: "Ikeja GRA Mansion",
    description: "6-bedroom mansion with garden",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
    price: "₦150,000,000",
    location: "Ikeja, Lagos",
  },
  {
    id: "4",
    title: "Eko Atlantic Tower",
    description: "3-bedroom luxury apartment",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800",
    price: "₦320,000,000",
    location: "Eko Atlantic, Lagos",
  },
];

// ─── FEATURE TILES ──────────────────────────────────────────────────────────

const featureTiles = [
  {
    title: "Prime Locations",
    description: "Handpicked properties in Nigeria’s finest neighbourhoods.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Luxury Homes",
    description: "Curated listings of the most exclusive estates.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Expert Advisors",
    description: "Your trusted partners in finding the perfect property.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Fast Transactions",
    description: "Seamless process from viewing to handover.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
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
          light ? "text-[#B0D4E8]/80" : "text-[#B0D4E8]"
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
  item: ListingCard;
  onClick: (card: ListingCard) => void;
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

// ─── SLIDING RAIL (direction-aware touch handling) ────────────────────────

function SlidingRail({
  items,
  onClick,
  reverse = false,
}: {
  items: ListingCard[];
  onClick: (card: ListingCard) => void;
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchDirectionRef.current = "undecided";
    setStartX(e.touches[0].clientX);
    touchStartYRef.current = e.touches[0].clientY;
    setStartTranslate(translateX);
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (touchDirectionRef.current === "undecided") {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        touchDirectionRef.current = "horizontal";
        setIsDragging(true);
      } else {
        touchDirectionRef.current = "vertical";
        resumeAutoScroll();
        return;
      }
    }

    if (touchDirectionRef.current === "vertical") return;
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

  const handleTouchCancel = () => {
    if (isDragging) setIsDragging(false);
    touchDirectionRef.current = "undecided";
    resumeAutoScroll();
  };

  const loopedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ touchAction: "pan-y" }}
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={() => {
        if (!isDragging) resumeAutoScroll();
      }}
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

export default function RealEstate() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ListingCard | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const WA = "https://wa.me/2348061587993";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`${API}/api/items`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: Property[]) => {
        if (!isMounted) return;
        const realEstate = Array.isArray(data)
          ? data.filter((item) => item.category === "realestate")
          : [];
        setProperties(realEstate);
      })
      .catch(() => {
        if (!isMounted) return;
        setProperties([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
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

  const heroListings = useMemo<ListingCard[]>(() => {
    if (!properties.length) return fallbackListings;
    return properties.slice(0, 4).map((prop, index) => ({
      id: prop.id,
      title: prop.title || `Property ${index + 1}`,
      description: prop.description || "Exclusive listing",
      image: prop.image || fallbackListings[index % fallbackListings.length].image,
      price: prop.price || "Price on request",
      location: prop.location || "Lagos",
    }));
  }, [properties]);

  const railItems = useMemo<ListingCard[]>(() => {
    if (heroListings.length) return heroListings;
    return fallbackListings;
  }, [heroListings]);

  const heroCopy = "Discover exceptional properties tailored to your lifestyle.";

  const handleImageClick = (card: ListingCard) => {
    setSelectedItem(card);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handleViewMore = (card: ListingCard) => {
    navigate("/real-estate/listings");
    setSelectedItem(null);
  };

  const scrollToListings = () => {
    collectionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`relative w-full overflow-x-hidden bg-black text-white ${
        selectedItem ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* ─── MENU ── */}
      <RealEstateMenu
        onOpenAction={() => setIsMenuOpen(true)}
        onCloseAction={() => setIsMenuOpen(false)}
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
              className="relative max-h-[88vh] max-w-5xl overflow-hidden rounded-3xl border border-[#B0D4E8]/20 bg-black/45 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLightbox}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#B0D4E8]/90 text-lg font-bold text-black transition-colors hover:bg-[#B0D4E8]"
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
                  className="inline-flex items-center gap-2 rounded-full border border-[#B0D4E8] px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#B0D4E8]/20"
                >
                  See More →
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
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between border-b border-white/5 bg-black/80 px-5 py-5 backdrop-blur-md md:px-10">
          <div className="flex flex-col gap-1">
            <img
              src="/images/your-logo.png"
              alt="XCM Logo"
              className="max-h-8 w-auto md:max-h-10 object-contain -ml-1 -mt-3"
            />
            <span className="text-[9px] uppercase tracking-[0.55em] text-[#B0D4E8]/85 md:text-[11px]">
              Homes And Properties
            </span>
          </div>
          {/* ─── NO HAMBURGER HERE ─── */}
        </header>

        {/* ─── HERO ─── */}
        <section className="relative h-screen w-full overflow-hidden pt-[80px]">
          {/* Background slides – full screen */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
              />
            </AnimatePresence>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* Hero text */}
          <div className="relative z-10 flex h-full items-center px-5 md:px-10">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
                className="mt-4 max-w-[11ch] text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="block">Find</span>
                <span className="block text-[#B0D4E8]">Your Space.</span>
                <span className="block">Live</span>
                <span className="block text-[#B0D4E8]">Your Story.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
                className="mt-4 max-w-md text-[12px] leading-relaxed text-white/80 sm:text-sm md:text-lg"
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
                  onClick={scrollToListings}
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#B0D4E8]/40 bg-[#B0D4E8] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-black shadow-[0_0_28px_rgba(176,212,232,0.32)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(176,212,232,0.42)] sm:px-5 sm:py-3 md:px-6 md:py-4 md:text-xs"
                >
                  View Listings
                  <span className="text-lg">→</span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 text-[#B0D4E8]">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#B0D4E8] to-transparent relative overflow-hidden">
              <motion.div
                animate={{ y: [0, 48] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-[#B0D4E8]"
              />
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="border-y border-black/5 bg-white px-3 py-6 md:px-10 md:py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-1 md:gap-4">
            {featureTiles.map((feature) => (
              <FeatureBlock key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* EXPLORE PROPERTIES */}
        <section ref={collectionsRef} className="bg-black px-5 py-18 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-6 pt-12">
              <SectionLabel eyebrow="Featured Properties" title="Find Your Dream Home" light />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex border-b border-[#B0D4E8]/45 pb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[#B0D4E8] transition-colors hover:border-[#B0D4E8]"
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

        {/* ─── CONTACT SECTION ─── (UPDATED) */}
        <section className="relative overflow-hidden border-t border-[#B0D4E8]/10 bg-[#0a0a0a] px-5 py-20 md:px-10 md:py-28">
          <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#B0D4E8]/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#B0D4E8]/10 blur-3xl" />

          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-[34px] border border-[#B0D4E8]/14 bg-white p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <a
                    href="tel:+2348061587993"
                    className="group flex items-center gap-4 rounded-2xl border border-[#B0D4E8]/12 bg-black/5 px-6 py-4 transition-all hover:border-[#B0D4E8]/35 hover:bg-[#B0D4E8]/5 flex-1 min-w-[180px] justify-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B0D4E8]/25 bg-[#B0D4E8]/10 text-[#B0D4E8]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#B0D4E8]">Call Us</p>
                      <p className="mt-1 text-sm text-black/70">Speak with our team</p>
                    </div>
                  </a>

                  <a
                    href={WA}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-[#B0D4E8]/12 bg-black/5 px-6 py-4 transition-all hover:border-[#B0D4E8]/35 hover:bg-[#B0D4E8]/5 flex-1 min-w-[180px] justify-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B0D4E8]/25 bg-[#B0D4E8]/10 text-[#B0D4E8]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#B0D4E8]">WhatsApp</p>
                      <p className="mt-1 text-sm text-black/70">Chat for quick inquiries</p>
                    </div>
                  </a>
                </div>

                {/* ─── UPDATED EMAIL ─── */}
                <a
                  href="mailto:xcminternational@gmail.com"
                  className="inline-flex items-center gap-3 rounded-2xl border border-black/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#B0D4E8]/30 hover:text-[#B0D4E8]"
                >
                  Email Us
                </a>

                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                {/* ─── UPDATED SOCIAL LINKS (no Twitter) ─── */}
                <div className="flex flex-wrap justify-center gap-3">
                  <p className="w-full text-[10px] uppercase tracking-[0.45em] text-[#B0D4E8]">Connect With Us</p>
                  <a
                    href="https://www.facebook.com/share/18W5YWxTBN/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-[#B0D4E8]/10 hover:text-[#B0D4E8]"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/xcm_homesandproperties?igsh=MTkxaWsyc3p6ZGdiMA=="
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-[#B0D4E8]/10 hover:text-[#B0D4E8]"
                  >
                    Instagram
                  </a>
                  {/* Twitter removed */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#B0D4E8]/8 bg-black py-14 text-center">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5">
            <div className="h-8 w-px bg-gradient-to-b from-[#B0D4E8]/35 to-transparent" />
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[#B0D4E8] shadow-[0_0_0_1px_rgba(176,212,232,0.18)] md:h-12 md:w-12">
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