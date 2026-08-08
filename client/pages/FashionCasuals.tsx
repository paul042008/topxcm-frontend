import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FashionMenu from "../components/FashionMenu";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const WA_NUMBER = "2348061587993";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AlbumImage {
  url: string;
  title: string;
  description: string;
  price: string;
  extra_text?: string;
}

interface Album {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  cover?: string;
  images: AlbumImage[];
  isSingle?: boolean;
}

const API = "https://topxcm-backend-1.onrender.com";

// ─── HERO LIGHTBOX (with zoom + pan, no order buttons) ─────────────────────

function HeroLightbox({
  image,
  onClose,
}: {
  image: { url: string; extra_text?: string };
  onClose: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(!isZoomed);
    if (!isZoomed) setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomed) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isZoomed) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#111] rounded-2xl border border-[#00AEEF]/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
            <h3 className="text-white font-semibold text-sm truncate">Featured</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="text-white/60 hover:text-white transition p-1"
                aria-label="Toggle zoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition p-1 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative w-full overflow-hidden bg-black/40"
            style={{ aspectRatio: "16/9" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: isZoomed ? `scale(1.8) translate(${position.x}px, ${position.y}px)` : "scale(1)",
                cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
            />
            {!isZoomed && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white/80 text-[10px] px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                Double‑tap to zoom
              </div>
            )}
          </div>

          {image.extra_text && (
            <div className="px-6 py-4 bg-black/80 text-center">
              <p className="text-white text-lg font-bold">{image.extra_text}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── ITEM MODAL (with zoom + pan, full order flow) ─────────────────────────

function ItemModal({
  image,
  onClose,
}: {
  image: AlbumImage;
  onClose: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOrder = () => {
    const msg = `Hi! I'm interested in ordering: *${image.title}*${image.price ? ` (${image.price})` : ""}. Please let me know the details.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(!isZoomed);
    if (!isZoomed) setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomed) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isZoomed) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-[#00AEEF]/20 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
            <h3 className="text-white font-semibold text-sm truncate">{image.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="text-white/60 hover:text-white transition p-1"
                aria-label="Toggle zoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition p-1 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative w-full overflow-hidden bg-black/40"
            style={{ aspectRatio: "4/5" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: isZoomed ? `scale(1.8) translate(${position.x}px, ${position.y}px)` : "scale(1)",
                cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
            />
            {!isZoomed && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white/80 text-[10px] px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                Double‑tap to zoom
              </div>
            )}
          </div>

          <div className="p-6 bg-black/80 backdrop-blur-sm">
            <h3 className="text-xl font-serif text-white mb-1">{image.title}</h3>
            {image.price && (
              <p className="text-[#00AEEF] font-bold text-lg mb-3">{image.price}</p>
            )}
            <p className="text-white/60 text-sm leading-relaxed mb-5 whitespace-pre-wrap break-words">
              {image.description}
            </p>
            <button
              onClick={handleOrder}
              className="w-full bg-[#00AEEF] text-black rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#00AEEF]/80 active:scale-[0.98] transition"
            >
              Order Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── GALLERY VIEW ──────────────────────────────────────────────────────────

function GalleryView({
  album,
  onClose,
}: {
  album: Album;
  onClose: () => void;
}) {
  const [heroLightbox, setHeroLightbox] = useState<{ url: string; extra_text?: string } | null>(null);
  const [modalImage, setModalImage] = useState<AlbumImage | null>(null);

  const heroImage = album.images.length > 0 ? album.images[0] : null;
  const productImages = album.images.slice(1);

  const handleHeroClick = () => {
    if (heroImage) {
      setHeroLightbox({ url: heroImage.url, extra_text: heroImage.extra_text });
    }
  };

  const handleProductClick = (img: AlbumImage) => {
    setModalImage(img);
  };

  const handleOrder = (img: AlbumImage) => {
    const msg = `Hi! I'm interested in ordering: *${img.title}*${img.price ? ` (${img.price})` : ""}. Please let me know the details.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[150] bg-black overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-xl border-b border-[#00AEEF]/10 px-5 py-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] hover:bg-[#00AEEF]/10 transition text-lg"
        >
          ←
        </button>
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#00AEEF] font-bold">Gallery</p>
          <h2 className="text-base font-serif text-white leading-tight">{album.name}</h2>
        </div>
        <span className="ml-auto text-xs text-white/40">{album.images.length} items</span>
      </div>

      {heroImage && (
        <div className="px-4 pt-4 pb-2">
          <div
            className="relative overflow-hidden rounded-2xl border border-[#00AEEF]/10 cursor-pointer group aspect-[16/9]"
            onClick={handleHeroClick}
          >
            <img
              src={heroImage.url}
              alt={heroImage.title || "Featured"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div>
                <p className="text-[#00AEEF] text-[10px] uppercase tracking-[0.4em] font-bold">Featured</p>
                {heroImage.extra_text ? (
                  <p className="text-white text-lg font-bold">{heroImage.extra_text}</p>
                ) : (
                  <p className="text-white text-lg font-bold">{heroImage.title}</p>
                )}
              </div>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition bg-[#00AEEF] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                View
              </span>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/80 p-1.5 rounded-full opacity-60 group-hover:opacity-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white/70 text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
              Tap to zoom
            </div>
          </div>
        </div>
      )}

      {productImages.length > 0 && (
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <p className="text-white/40 text-xs uppercase tracking-[0.5em] mb-4">More from this collection</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-[#111] rounded-2xl overflow-hidden border border-[#00AEEF]/10 flex flex-col group relative"
              >
                <div
                  className="aspect-[4/3] overflow-hidden cursor-pointer relative"
                  onClick={() => handleProductClick(img)}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-[#00AEEF] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      View
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/80 p-1.5 rounded-full opacity-60 group-hover:opacity-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white/70 text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                    Tap to zoom
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2">
                    {img.title || "Untitled"}
                  </h4>
                  {img.price && (
                    <p className="text-[#00AEEF] font-bold text-base">{img.price}</p>
                  )}
                  {img.description && (
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{img.description}</p>
                  )}
                  <div className="mt-auto pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleProductClick(img)}
                      className="w-full border border-[#00AEEF]/30 text-[#00AEEF] rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#00AEEF]/10 transition"
                    >
                      View Item
                    </button>
                    <button
                      onClick={() => handleOrder(img)}
                      className="w-full bg-[#00AEEF] text-black rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#00AEEF]/80 active:scale-[0.98] transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {heroLightbox && (
        <HeroLightbox image={heroLightbox} onClose={() => setHeroLightbox(null)} />
      )}
      {modalImage && (
        <ItemModal image={modalImage} onClose={() => setModalImage(null)} />
      )}
    </motion.div>
  );
}

// ─── ALBUM CARD ─────────────────────────────────────────────────────────────

function AlbumCard({ album, onViewGallery }: { album: Album; onViewGallery: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const displayImage = album.cover || (album.images.length > 0 ? album.images[0].url : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#111] rounded-2xl overflow-hidden border border-[#00AEEF]/10 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-black/40 relative">
        {displayImage ? (
          <img
            src={displayImage}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">👕</span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#00AEEF]/20">
          {album.images.length} items
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#00AEEF] font-bold mb-1">
            {album.category}
          </p>
          <h3 className="text-lg font-serif text-white leading-tight">{album.name}</h3>
        </div>

        {album.description && (
          <>
            <p
              className={`text-white/50 text-xs leading-relaxed ${
                !expanded ? "line-clamp-3" : ""
              }`}
            >
              {album.description}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#00AEEF] text-[10px] font-bold uppercase tracking-wider hover:underline self-start"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </>
        )}

        {album.price && (
          <p className="text-[#00AEEF] font-bold text-sm">From {album.price}</p>
        )}

        <button
          onClick={onViewGallery}
          className="mt-auto w-full bg-[#00AEEF] text-black rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF]/80 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>View Gallery</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── SINGLE CARD ────────────────────────────────────────────────────────────

function SingleCard({ album, onViewSingle }: { album: Album; onViewSingle: () => void }) {
  const image = album.images[0];
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#111] rounded-2xl overflow-hidden border border-[#00AEEF]/10 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-black/40 relative">
        <img
          src={image?.url}
          alt={album.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#00AEEF]/20">
          1 item
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#00AEEF] font-bold mb-1">
            {album.category}
          </p>
          <h3 className="text-lg font-serif text-white leading-tight">{album.name}</h3>
        </div>

        {album.description && (
          <>
            <p
              className={`text-white/50 text-xs leading-relaxed ${
                !expanded ? "line-clamp-3" : ""
              }`}
            >
              {album.description}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#00AEEF] text-[10px] font-bold uppercase tracking-wider hover:underline self-start"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </>
        )}

        {album.price && (
          <p className="text-[#00AEEF] font-bold text-sm">{album.price}</p>
        )}

        <button
          onClick={onViewSingle}
          className="mt-auto w-full bg-[#00AEEF] text-black rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF]/80 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>View Item</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FashionCasuals() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [singleItem, setSingleItem] = useState<AlbumImage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const albumsRes = await fetch(`${API}/api/fashion-albums`);
        const albumsData: Album[] = await albumsRes.json();

        const itemsRes = await fetch(`${API}/api/items`);
        const itemsData = await itemsRes.json();

        const filteredAlbums = albumsData.filter((a) => a.category === "casuals");

        // ✅ Correct filter: exclude items that belong to an album (album_id) or are album covers (album_name)
        const standaloneItems = itemsData.filter(
          (item: any) => !item.album_id && !item.album_name && item.category === "casuals"
        );

        const singleItemsAsAlbums: Album[] = standaloneItems.map((item: any) => ({
          id: `single-${item.id}`,
          name: item.title || "Single Item",
          category: item.category,
          description: item.description || "",
          price: item.price || "",
          cover: item.image,
          isSingle: true,
          images: [
            {
              url: item.image,
              title: item.title || "Untitled",
              description: item.description || "",
              price: item.price || "",
            },
          ],
        }));

        setAlbums([...filteredAlbums, ...singleItemsAsAlbums]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewSingle = (album: Album) => {
    if (album.images && album.images.length > 0) {
      setSingleItem(album.images[0]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* ─── FASHION MENU (overlay) ─────────────────────────────── */}
      <FashionMenu
        isFashionLanding={true}
        initialOpen={menuOpen}
        onOpenAction={() => setMenuOpen(true)}
        onCloseAction={() => setMenuOpen(false)}
        hideHamburger={true} // ✅ prevents duplicate hamburger
      />

      {/* ─── MAIN CONTENT (blurred when menu is open) ──────────── */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: menuOpen ? 0.18 : 1,
          filter: menuOpen ? "blur(2px)" : "none",
          pointerEvents: menuOpen ? "none" : "auto",
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(0,174,239,0.12),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(0,174,239,0.08),transparent_22%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95" />
        </div>

        <header className="relative z-10 flex items-center justify-between border-b border-[#00AEEF]/10 bg-black/80 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-[#00AEEF] text-xl hover:scale-110 transition-transform"
            >
              ←
            </button>
            <div className="flex flex-col">
              <p className="text-[#00AEEF] text-[10px] tracking-[0.7em] uppercase font-bold">Casuals Collection</p>
              <span className="text-[#00AEEF]/40 text-[8px] tracking-[0.3em] uppercase">XCM Wardrobes</span>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] group"
            aria-label="Open menu"
          >
            <span className="block h-[1.5px] w-7 bg-[#00AEEF] transition-all group-hover:w-8" />
            <span className="ml-auto block h-[1.5px] w-5 bg-[#00AEEF] transition-all group-hover:w-8" />
            <span className="block h-[1.5px] w-7 bg-[#00AEEF] transition-all group-hover:w-8" />
          </button>
        </header>

        <div className="relative z-10 pt-24 px-5 pb-12 border-b border-[#00AEEF]/10 bg-black/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-3 leading-[0.95]">Casuals</h1>
          <p className="text-white/60 text-sm font-light max-w-sm leading-relaxed">
            Elevating the everyday. Sophisticated comfort tailored for the modern lifestyle.
          </p>
        </div>

        <main className="relative z-10 px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#00AEEF]/20 border-t-[#00AEEF] rounded-full animate-spin" />
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-white/40 text-lg font-serif italic">New essentials arriving soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {albums.map((album) =>
                album.isSingle ? (
                  <SingleCard
                    key={album.id}
                    album={album}
                    onViewSingle={() => handleViewSingle(album)}
                  />
                ) : (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onViewGallery={() => setOpenAlbum(album)}
                  />
                )
              )}
            </div>
          )}
        </main>

        <footer className="relative z-10 border-t border-[#00AEEF]/8 bg-black py-14 text-center">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5">
            <div className="h-8 w-px bg-gradient-to-b from-[#00AEEF]/35 to-transparent" />
            <p className="text-[8px] uppercase tracking-[1em] text-white/20">
              © 2026 XCM • All Rights Reserved
            </p>
          </div>
        </footer>

        <AnimatePresence>
          {openAlbum && (
            <GalleryView album={openAlbum} onClose={() => setOpenAlbum(null)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {singleItem && (
            <ItemModal image={singleItem} onClose={() => setSingleItem(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}