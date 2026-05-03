import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

interface PhotoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

const API = "https://topxcm-backend.onrender.com";
const WA = "https://wa.me/2348061587993?text=Hi!%20I'd%20like%20to%20order%20a%20frame%20or%20canvas.";

function ItemModal({ item, onClose }: { item: PhotoItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition">✕</button>
        <div className="w-full aspect-[4/5] overflow-hidden bg-zinc-800">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} draggable={false} />
        </div>
        <div className="p-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">Frames & Canvas</p>
          <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
          {item.description && <p className="text-white/50 text-sm leading-relaxed mb-4">{item.description}</p>}
          <a
            href={WA} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-black text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
            style={{ backgroundColor: "#D4AF37" }}
          >
            Order This
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoCanvas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | null>(null);

  useEffect(() => {
    fetch(`${API}/api/photo-items`)
      .then((res) => res.json())
      .then((data: PhotoItem[]) => {
        setItems(data.filter((i) => i.category === "canvas"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

      <main className="px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/20 text-lg font-serif italic">New pieces coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className="aspect-[3/4] overflow-hidden rounded-xl cursor-pointer relative group"
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-xs font-serif line-clamp-1">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOP Brand • Lagos</p>
        </div>
      </footer>

      {/* Floating Book Us */}
      <a
        href={WA} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full text-black text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#D4AF37" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Order Now
      </a>

      <AnimatePresence>
        {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
