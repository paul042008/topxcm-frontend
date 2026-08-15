import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import LoadingState from "../components/LoadingState";

const API = "https://topxcm-backend-1.onrender.com";
const WA = "https://wa.me/2348132799299?text=Hi!%20I'd%20like%20to%20book%20a%20session.";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AlbumImage {
  id?: string;
  url: string;
  title: string;
  description: string;
  price: string;
  extra_text?: string;
  order?: number;
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

// ─── SIMPLE LIGHTBOX (for single images) ──────────────────────────────────

function SingleImageLightbox({
  image,
  onClose,
}: {
  image: AlbumImage;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-6xl w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/60 hover:text-white text-2xl"
        >
          ✕
        </button>
        <img
          src={image.url}
          alt={image.title}
          className="max-h-[90vh] max-w-[90vw] object-contain"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        {image.title && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            {image.title}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── GALLERY VIEW (modal) ──────────────────────────────────────────────────

function GalleryView({ album, onClose }: { album: Album; onClose: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = album.images || [];
  const coverImage = album.cover || (images.length > 0 ? images[0].url : "");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.name,
        text: `Check out ${album.name}'s gallery`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href)
        .then(() => alert("Link copied!"))
        .catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button onClick={onClose} className="text-[#D4AF37] text-xl hover:scale-110 transition">
          ←
        </button>
        <span className="text-white/40 text-xs">{images.length} photos</span>
      </div>

      <div className="relative w-full bg-zinc-800">
        <img
          src={coverImage}
          alt={album.name}
          className="w-full h-auto max-h-[85vh] object-contain mx-auto"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">{album.name}</h1>
          {album.description && (
            <div
              className="text-white/70 text-sm md:text-base mt-2 max-w-2xl [&_strong]:font-bold [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: album.description }}
            />
          )}
          <button
            onClick={handleShare}
            className="mt-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:balance]">
          {images.map((img, idx) => (
            <motion.div
              key={img.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedIndex(idx)}
              className="mb-3 break-inside-avoid cursor-pointer group relative"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <div
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) =>
                        prev !== null ? (prev - 1 + images.length) % images.length : 0
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) =>
                        prev !== null ? (prev + 1) % images.length : 0
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  >
                    ›
                  </button>
                </>
              )}
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
              {images[selectedIndex].title && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {images[selectedIndex].title}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── COMPONENTS FOR LISTING ────────────────────────────────────────────────

// Featured Album – full‑width cinematic hero
function FeaturedAlbum({ item, onClick }: { item: Album; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full overflow-hidden group cursor-pointer bg-zinc-900"
      onClick={onClick}
    >
      <img
        src={item.cover || (item.images.length > 0 ? item.images[0].url : "")}
        alt={item.name}
        className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-[2s] ease-out group-hover:scale-105"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

      <div className="absolute top-8 left-8 md:left-16">
        <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-bold border border-[#D4AF37]/30 px-4 py-1.5">
          Featured Story
        </span>
      </div>

      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
        <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight mb-4">
          {item.name}
        </h2>
        {item.description && (
          <div
            className="text-white/60 text-sm mb-6 line-clamp-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}
        <span className="inline-flex items-center gap-3 group/btn">
          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold border-b border-[#D4AF37]/40 pb-0.5 group-hover/btn:border-[#D4AF37] transition-colors">
            Open Album
          </span>
          <span className="text-[#D4AF37] transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
        </span>
      </div>
    </motion.div>
  );
}

// Editorial Card – alternating left/right layout
function EditorialCard({ item, index, onClick }: { item: Album; index: number; onClick: () => void }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-0 group border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-700 cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative md:w-[60%] overflow-hidden bg-zinc-900 flex items-center justify-center">
        <img
          src={item.cover || (item.images.length > 0 ? item.images[0].url : "")}
          alt={item.name}
          className="w-full h-auto max-h-[520px] object-contain transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none" />
        <span
          className="absolute top-5 left-5 text-[#D4AF37]/20 font-black"
          style={{ fontSize: "clamp(60px, 10vw, 100px)", fontFamily: "Impact, sans-serif", lineHeight: 1 }}
        >
          {String(index + 2).padStart(2, "0")}
        </span>
      </div>

      <div
        className={`md:w-[40%] flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-[#0a0a0a] ${
          isEven ? "border-l border-white/5" : "border-r border-white/5"
        }`}
      >
        <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">
          {item.category === "weddings" ? "Wedding Story" : "Event Story"}
        </p>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-white leading-snug mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
          {item.name}
        </h3>
        {item.description && (
          <div
            className="text-white/50 text-sm leading-relaxed mb-8 font-light line-clamp-3 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}
        <div className="w-12 h-[1px] bg-[#D4AF37]/30 mb-8" />
        <span className="self-start group/btn flex items-center gap-3 border border-[#D4AF37]/30 px-7 py-3 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
          View Album
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
        </span>
      </div>
    </motion.div>
  );
}

// Compact Card – small grid item
function CompactCard({ item, index, onClick }: { item: Album; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-colors duration-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-zinc-800">
        <img
          src={item.cover || (item.images.length > 0 ? item.images[0].url : "")}
          alt={item.name}
          className="w-full h-auto object-contain transition-transform duration-[1.2s] group-hover:scale-110"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="p-6 bg-[#0d0d0d]">
        <h4 className="text-lg font-serif italic text-white group-hover:text-[#D4AF37] transition-colors duration-300 mb-4 leading-snug">
          {item.name}
        </h4>
        {item.description && (
          <div
            className="text-white/40 text-sm line-clamp-2 mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors font-bold">
          Open Album →
        </span>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PhotoWeddings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [singleImage, setSingleImage] = useState<AlbumImage | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "weddings" | "events">("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch albums
        const albumsRes = await fetch(`${API}/api/fashion-albums`);
        const albumsData: Album[] = await albumsRes.json();

        // Fetch single items
        const itemsRes = await fetch(`${API}/api/items`);
        const itemsData = await itemsRes.json();

        const categories = ["weddings", "events"];

        // Filter albums by category
        const filteredAlbums = albumsData.filter((album) =>
          categories.includes(album.category)
        );

        // Fetch standalone items (no album_id) with category weddings or events
        const standaloneItems = itemsData.filter(
          (item: any) =>
            !item.album_id &&
            categories.includes(item.category) &&
            item.image
        );

        // Convert standalone items to virtual albums
        const singleItemsAsAlbums: Album[] = standaloneItems.map((item: any) => ({
          id: `single-${item.id}`,
          name: item.title || "Untitled",
          category: item.category,
          description: item.description || "",
          price: item.price || "",
          cover: item.secureImage || item.image,
          isSingle: true,
          images: [
            {
              url: item.secureImage || item.image,
              title: item.title || "Untitled",
              description: item.description || "",
              price: item.price || "",
              extra_text: item.extra_text || "",
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

  // Filter albums based on active tab
  const filteredAlbums =
    activeTab === "all"
      ? albums
      : albums.filter((a) => a.category === activeTab);

  // Separate into featured, editorial, compact (only for non-single albums)
  const nonSingleAlbums = filteredAlbums.filter((a) => !a.isSingle);
  const featured = nonSingleAlbums[0] || null;
  const editorial = nonSingleAlbums.slice(1, 5);
  const compact = nonSingleAlbums.slice(5);

  // Single items (to be displayed separately, perhaps in a grid)
  const singleItems = filteredAlbums.filter((a) => a.isSingle);

  const handleCardClick = (album: Album) => {
    if (album.isSingle) {
      if (album.images.length > 0) {
        setSingleImage(album.images[0]);
      }
    } else {
      setSelectedAlbum(album);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <PhotoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <BackButton />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">
            Weddings & Other Events
          </p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">
            The Official Photography
          </span>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-[5px] group">
          <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
          <span className="block w-4 h-[1px] bg-[#D4AF37] ml-auto transition-all group-hover:w-8" />
          <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
        </button>
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-white/5 px-6 md:px-16 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">
              The Collection
            </p>
            <h1
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              Weddings & Other Events
            </h1>
          </div>
          <p className="text-white/30 text-sm font-light max-w-sm leading-relaxed">
            Every couple. Every moment. Preserved with intention and artistry — one album at a time.
          </p>
        </div>
      </div>

      {/* ─── FILTER TABS ─── */}
      <div className="px-6 md:px-16 py-6 flex gap-6 border-b border-white/5 overflow-x-auto">
        {(["all", "weddings", "events"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "text-[#D4AF37] border-[#D4AF37]"
                : "text-white/30 border-transparent hover:text-white/60"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
          <div className="w-12 h-[1px] bg-[#D4AF37]/30 mb-8 mx-auto" />
          <p className="text-white/40 text-lg font-serif italic">No collections in this category.</p>
          <p className="text-white/20 text-xs uppercase tracking-widest mt-3">
            Albums will appear here once uploaded
          </p>
        </div>
      )}

      {/* ─── FEATURED (only if there is at least one non-single album) ─── */}
      {featured && <FeaturedAlbum item={featured} onClick={() => handleCardClick(featured)} />}

      {/* ─── EDITORIAL CARDS ─── */}
      {editorial.length > 0 && (
        <section className="flex flex-col">
          {editorial.map((item, i) => (
            <EditorialCard
              key={item.id}
              item={item}
              index={i}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </section>
      )}

      {/* ─── SINGLE ITEMS (displayed in a grid) ─── */}
      {singleItems.length > 0 && (
        <section className="px-6 md:px-16 py-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">
              Featured Singles
            </p>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {singleItems.map((item, i) => (
              <div
                key={item.id}
                className="group relative overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-colors duration-500 cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="relative overflow-hidden bg-zinc-800">
                  <img
                    src={item.cover || (item.images.length > 0 ? item.images[0].url : "")}
                    alt={item.name}
                    className="w-full h-auto object-contain transition-transform duration-[1.2s] group-hover:scale-110"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-6 bg-[#0d0d0d]">
                  <h4 className="text-lg font-serif italic text-white group-hover:text-[#D4AF37] transition-colors duration-300 mb-4 leading-snug">
                    {item.name}
                  </h4>
                  {item.description && (
                    <div
                      className="text-white/40 text-sm line-clamp-2 mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors font-bold">
                    View Image →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── COMPACT CARDS (more albums) ─── */}
      {compact.length > 0 && (
        <section className="px-6 md:px-16 py-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">
              More Stories
            </p>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {compact.map((item, i) => (
              <CompactCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="py-16 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            <a
              href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA=="
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
              href="https://www.facebook.com/share/19fqFjS3Bw/"
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
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full text-black text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#D4AF37" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Book Us
      </a>

      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {selectedAlbum && <GalleryView album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {singleImage && <SingleImageLightbox image={singleImage} onClose={() => setSingleImage(null)} />}
      </AnimatePresence>
    </div>
  );
}