import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FashionMenu from "../components/FashionMenu";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AlbumImage {
  url: string;
  title: string;
  description: string;
  price: string;
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

const API = "https://topxcm-backend.onrender.com";

// ─── ITEM MODAL ──────────────────────────────────────────────────────────────

function ItemModal({
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

  const handleOrder = () => {
    const msg = `Hi! I'm interested in ordering: *${image.title}*${image.price ? ` (${image.price})` : ""}. Please let me know the details.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

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
          className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white text-sm hover:bg-black/40 transition"
          >
            ✕
          </button>

          <div className="w-full aspect-[4/5] overflow-hidden bg-[#f0f4f8]">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-serif text-[#1E3A8A] mb-1">{image.title}</h3>
            {image.price && (
              <p className="text-[#D4AF37] font-bold text-lg mb-3">{image.price}</p>
            )}
            {image.description && (
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{image.description}</p>
            )}
            <button
              onClick={handleOrder}
              className="w-full bg-[#1E3A8A] text-white rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#162d6e] active:scale-[0.98] transition"
            >
              Order Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── GALLERY VIEW ─────────────────────────────────────────────────────────────

function GalleryView({
  album,
  onClose,
}: {
  album: Album;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<AlbumImage | null>(null);

  const handleOrder = (img: AlbumImage) => {
    const msg = `Hi! I'm interested in ordering: *${img.title}* from the *${album.name}* collection${img.price ? ` (${img.price})` : ""}. Please let me know the details.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[150] bg-[#D9EAF0] overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-[#1E3A8A]/10 px-5 py-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl border border-[#1E3A8A]/20 flex items-center justify-center text-[#1E3A8A] hover:bg-[#1E3A8A]/5 transition text-lg"
        >
          ←
        </button>
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#00AEEF] font-bold">Gallery</p>
          <h2 className="text-base font-serif text-[#1E3A8A] leading-tight">{album.name}</h2>
        </div>
        <span className="ml-auto text-xs text-slate-400">{album.images.length} items</span>
      </div>

      {/* Grid */}
      <div className="px-4 py-6">
        {album.images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3 opacity-30">🖼</span>
            <p className="text-slate-400 text-sm">No images in this album yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {album.images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1E3A8A]/5 flex flex-col"
              >
                <div
                  className="aspect-[3/4] overflow-hidden cursor-pointer relative group"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-[#1E3A8A] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      View
                    </span>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <h4 className="text-[#1E3A8A] font-bold text-xs uppercase tracking-wide leading-tight line-clamp-2">
                    {img.title || "Untitled"}
                  </h4>
                  {img.price && (
                    <p className="text-[#D4AF37] font-bold text-sm">{img.price}</p>
                  )}
                  {img.description && (
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{img.description}</p>
                  )}
                  <div className="mt-auto pt-2 flex flex-col gap-1.5">
                    <button
                      onClick={() => setSelectedImage(img)}
                      className="w-full border border-[#1E3A8A]/30 text-[#1E3A8A] rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#1E3A8A]/5 transition"
                    >
                      View Item
                    </button>
                    <button
                      onClick={() => handleOrder(img)}
                      className="w-full bg-[#1E3A8A] text-white rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#162d6e] active:scale-[0.98] transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <ItemModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </motion.div>
  );
}

// ─── ALBUM CARD ───────────────────────────────────────────────────────────────

function AlbumCard({ album, onViewGallery }: { album: Album; onViewGallery: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1E3A8A]/5 flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#EEF4F8] relative">
        {album.cover || album.images[0]?.url ? (
          <img
            src={album.cover || album.images[0].url}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">👘</span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {album.images.length} items
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#00AEEF] font-bold mb-1">
            {album.category}
          </p>
          <h3 className="text-lg font-serif text-[#1E3A8A] leading-tight">{album.name}</h3>
        </div>

        {album.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{album.description}</p>
        )}

        {album.price && (
          <p className="text-[#D4AF37] font-bold text-sm">From {album.price}</p>
        )}

        <button
          onClick={onViewGallery}
          className="mt-auto w-full bg-[#1E3A8A] text-white rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#162d6e] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>View Gallery</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FashionAgbada() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);

  useEffect(() => {
    fetch(`${API}/api/fashion-albums`)
      .then((res) => res.json())
      .then((data: Album[]) => {
        setAlbums(data.filter((a) => a.category === "agbadas"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#D9EAF0] text-slate-800 overflow-x-hidden">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-start px-5 py-4 bg-white/50 backdrop-blur-xl border-b border-[#1E3A8A]/5">
        <button
          onClick={() => window.history.back()}
          className="text-[#00AEEF] text-lg hover:scale-110 transition-transform"
        >
          ←
        </button>
        <div className="flex flex-col items-start ml-4">
          <p className="text-[#00AEEF] text-[10px] tracking-[0.7em] uppercase font-bold">Agbada Collection</p>
          <span className="text-[#1E3A8A]/30 text-[8px] tracking-[0.3em] uppercase">The XCM Signature</span>
        </div>
        <FashionMenu onOpenAction={() => setMenuOpen(true)} onCloseAction={() => setMenuOpen(false)} />
      </header>

      {/* Hero strip */}
      <div className="pt-24 px-5 py-10 border-b border-[#1E3A8A]/5 bg-white/20">
        <h1 className="text-3xl md:text-5xl font-serif italic text-[#1E3A8A] mb-2">Agbada</h1>
        <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
          The ultimate symbol of prestige. Reimagined for the modern gentleman with unmatched precision.
        </p>
      </div>

      {/* Albums grid */}
      <main className="px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#1E3A8A]/20 border-t-[#1E3A8A] rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[#1E3A8A]/40 text-lg font-serif italic">New masterpieces in progress.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onViewGallery={() => setOpenAlbum(album)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-16 text-center bg-white/40">
        <div className="h-10 w-[1px] bg-[#00AEEF] mx-auto mb-5" />
        <p className="text-[8px] tracking-[1em] text-[#1E3A8A]/30 uppercase">
          XCM Bespoke • Cultural Excellence
        </p>
      </footer>

      {/* Gallery overlay */}
      <AnimatePresence>
        {openAlbum && (
          <GalleryView album={openAlbum} onClose={() => setOpenAlbum(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}