import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

const API = "https://topxcm-backend-1.onrender.com";
const WA = "https://wa.me/2348061587993?text=Hi!%20I'd%20like%20to%20book%20a%20session.";

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
}

// ─── GALLERY VIEW ──────────────────────────────────────────────────────────

function GalleryView({ album, onClose }: { album: Album; onClose: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = album.images || [];
  const coverImage = album.cover || (images.length > 0 ? images[0].url : "");
  const isVideoCategory = album.category === "videos";

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

      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-zinc-800">
        <img src={coverImage} alt={album.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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

      {/* ─── GALLERY THUMBNAILS – NO FRAME ─── */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <motion.div
              key={img.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedIndex(idx)}
              className="aspect-square cursor-pointer group relative"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
              {isVideoCategory && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur">
                    <span className="ml-1 text-[#D4AF37] text-lg">▶</span>
                  </div>
                </div>
              )}
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
              />
              {images[selectedIndex].title && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {images[selectedIndex].title}
                </div>
              )}
              {isVideoCategory && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-[#D4AF37]/30">
                  🎬 Video content
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── ALBUM CARD ─────────────────────────────────────────────────────────────

function AlbumCard({ album, onClick }: { album: Album; onClick: () => void }) {
  const displayImage = album.cover || (album.images.length > 0 ? album.images[0].url : null);
  const isVideoCategory = album.category === "videos";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-64 md:h-72 overflow-hidden bg-zinc-800">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={album.name}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {isVideoCategory && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur">
                  <span className="ml-1 text-[#D4AF37] text-2xl">▶</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            {isVideoCategory ? "🎬" : "📷"}
          </div>
        )}
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
          {album.images.length} items
        </span>
      </div>
      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">
          {album.category === "aerials" ? "Aerials" : "Hand Held Videos"}
        </p>
        <h3 className="text-lg font-serif text-white leading-tight">{album.name}</h3>
        {album.description && (
          <div
            className="text-white/40 text-xs leading-relaxed mt-2 line-clamp-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: album.description }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PhotoAerialsVideos() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "aerials" | "videos">("all");

  useEffect(() => {
    fetch(`${API}/api/fashion-albums`)
      .then((res) => res.json())
      .then((data: Album[]) => {
        const photoCategories = ["aerials", "videos"];
        const filtered = data.filter((album) => photoCategories.includes(album.category));
        setAlbums(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAlbums =
    activeTab === "all" ? albums : albums.filter((a) => a.category === activeTab);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <BackButton />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">
            Drone Aerials & Videos
          </p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">
            The Official Photography
          </span>
        </div>
        <PhotoMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onCloseAction={() => setMenuOpen(false)} />
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
              Drone Aerials &<br />Videos
            </h1>
          </div>
          <p className="text-white/30 text-sm font-light max-w-sm leading-relaxed">
            Cinematic drone perspectives and premium motion content — storytelling from every angle.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 py-6 flex gap-6 border-b border-white/5 overflow-x-auto">
        {(["all", "aerials", "videos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "text-[#D4AF37] border-[#D4AF37]"
                : "text-white/30 border-transparent hover:text-white/60"
            }`}
          >
            {tab === "all" ? "All" : tab === "aerials" ? "Aerials" : "Hand Held Videos"}
          </button>
        ))}
      </div>

      <main className="px-4 py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/20 text-lg font-serif italic">No collections uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
            ))}
          </div>
        )}
      </main>

{/* ─── UPDATED FOOTER with Instagram & Facebook icons ─── */}
<footer className="py-16 text-center border-t border-white/5">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">

      {/* Instagram 1 – topfilmz1 */}
      <a
        href="https://www.instagram.com/topfilmz1?igsh=MTM5MG02YnNudzJqZw=="
        target="_blank"
        rel="noreferrer"
        className="text-white/40 hover:text-white transition-colors"
        aria-label="Instagram Film"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>

      {/* Instagram 2 – topdronez1 */}
      <a
        href="https://www.instagram.com/topdronez1?igsh=MWo0OWh3N2xrcWdzdg=="
        target="_blank"
        rel="noreferrer"
        className="text-white/40 hover:text-white transition-colors"
        aria-label="Instagram Drone"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>

      {/* Facebook – keep as is */}
      <a
        href="https://www.facebook.com/Topweddings1"
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
        Book Us
      </a>

      <AnimatePresence>
        {selectedAlbum && <GalleryView album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
      </AnimatePresence>
    </div>
  );
}