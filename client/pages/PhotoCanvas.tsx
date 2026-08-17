import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

const API = "https://topxcm-backend-1.onrender.com";
const WA = "https://wa.me/2348132799299?text=Hi!%20I'd%20like%20to%20order%20a%20frame%20or%20canvas.";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: string;
  albumId?: string;
  tag?: "BEST SELLER" | "PREMIUM";
}

// ─── PRODUCT MODAL WITH SWIPE SUPPORT ──────────────────────────────────────

function ItemModal({
  items,
  initialIndex,
  onClose,
}: {
  items: Product[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentItem = items[currentIndex];

  // ─── Touch swipe refs ─────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // ─── Keyboard support ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ─── Navigation helpers ──────────────────────────────────────────────────
  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // ─── Touch handlers ──────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      isSwiping.current = true;
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const threshold = 50;
    if (deltaX > threshold) {
      goPrev();
    } else if (deltaX < -threshold) {
      goNext();
    }
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
  };

  if (!currentItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition"
        >
          ✕
        </button>

        {/* Navigation arrows (desktop) */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl hidden md:flex"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl hidden md:flex"
            >
              ›
            </button>
          </>
        )}

        {/* Image */}
        <div className="w-full aspect-[4/5] overflow-hidden bg-zinc-800">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-cover select-none"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">
            {currentItem.category === "canvas" ? "Canvas Print" : "Luxury Frame"}
          </p>
          <h3 className="text-xl font-serif text-white mb-2">{currentItem.title}</h3>
          {currentItem.description && (
            <div
              className="text-white/50 text-sm leading-relaxed mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: currentItem.description }}
            />
          )}
          {currentItem.price && (
            <p className="text-[#D4AF37] text-2xl font-bold mb-4">
              ₦{parseInt(currentItem.price).toLocaleString()}
            </p>
          )}

          <div className="flex items-center justify-between">
            <a
              href={`https://wa.me/2348132799299?text=Hi!%20I'd%20like%20to%20order%20*${currentItem.title}*%20(₦${currentItem.price})`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-black text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
              style={{ backgroundColor: "#D4AF37" }}
            >
              Order Now
            </a>

            {/* Counter */}
            {items.length > 1 && (
              <span className="text-white/40 text-xs">
                {currentIndex + 1} / {items.length}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── SIZE CHART MODAL ──────────────────────────────────────────────────────

function SizeChartModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative max-w-3xl w-full bg-zinc-900 rounded-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition"
        >
          ✕
        </button>
        <div className="p-4">
          <img
            src="/images/sizechart.jpg"
            alt="Size Chart"
            className="w-full h-auto object-contain"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PhotoCanvas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "canvas" | "frames">("all");

  useEffect(() => {
    fetch(`${API}/api/items`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const transformed = data.map((item) => ({
          ...item,
          image: item.secureImage || item.image,
        }));
        const filtered = transformed.filter(
          (i) => (i.category === "canvas" || i.category === "frames") && !i.albumId
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getTag = (product: Product): string | null => {
    const desc = (product.description || "").toLowerCase();
    if (desc.includes("best seller") || desc.includes("bestseller")) return "BEST SELLER";
    if (parseInt(product.price) > 20000) return "PREMIUM";
    return null;
  };

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <BackButton />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">Frames & Canvas</p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">The Official Photography</span>
        </div>
        <PhotoMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onCloseAction={() => setMenuOpen(false)} />
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-white/5 px-6 md:px-16 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">The Collection</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Frames &<br />Canvas
            </h1>
          </div>
          <p className="text-white/30 text-sm font-light max-w-sm leading-relaxed">
            Premium prints, framed portraits, and custom canvas pieces. Your moments, elevated for display.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 py-6 flex gap-6 border-b border-white/5 overflow-x-auto">
        {(["all", "canvas", "frames"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeCategory === tab
                ? "text-[#D4AF37] border-[#D4AF37]"
                : "text-white/30 border-transparent hover:text-white/60"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <main className="px-4 py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/20 text-lg font-serif italic">No items uploaded yet.</p>
            <p className="text-white/10 text-xs uppercase tracking-widest mt-3">
              Upload canvases or frames from the admin panel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => {
              const tag = getTag(product);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedProductIndex(idx)}
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-800">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                    {tag && (
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                          tag === "BEST SELLER"
                            ? "bg-[#D4AF37] text-black"
                            : "bg-white/20 text-white border border-white/30"
                        }`}
                      >
                        {tag}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-white font-serif text-lg leading-tight">
                      {product.title}
                    </h3>
                    {product.price && (
                      <p className="text-[#D4AF37] font-bold text-xl">
                        ₦{parseInt(product.price).toLocaleString()}
                      </p>
                    )}
                    {product.description && (
                      <div
                        className="text-white/40 text-sm line-clamp-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/2348132799299?text=Hi!%20I'd%20like%20to%20order%20*${product.title}*%20(₦${product.price})`,
                          "_blank"
                        );
                      }}
                      className="mt-3 w-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl hover:bg-[#D4AF37]/80 active:scale-[0.98] transition"
                    >
                      Order Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── SIZE CHART BUTTON ────────────────────────────────────────────── */}
      <div className="flex justify-center px-6 pb-8">
        <button
          onClick={() => setShowSizeChart(true)}
          className="border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          📐 Size Chart
        </button>
      </div>

      <footer className="py-16 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {/* Only one Instagram */}
            <a
              href="https://www.instagram.com/topstudios1?igsh=YmxrMGN0dGdnbWgy"
              target="_blank"
              rel="noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/19BAP9fi8Q/"
              target="_blank"
              rel="noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
            <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOP • All Right Reserve</p>
          </div>
        </div>
      </footer>

      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full text-black text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#D4AF37" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Order Now
      </a>

      <AnimatePresence>
        {selectedProductIndex !== null && (
          <ItemModal
            items={filteredProducts}
            initialIndex={selectedProductIndex}
            onClose={() => setSelectedProductIndex(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSizeChart && <SizeChartModal onClose={() => setShowSizeChart(false)} />}
      </AnimatePresence>
    </div>
  );
}