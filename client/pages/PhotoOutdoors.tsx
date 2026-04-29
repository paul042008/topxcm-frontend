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

function ItemModal({ item, onClose }: { item: PhotoItem; onClose: () => void }) {
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition"
        >
          ✕
        </button>

        <div className="w-full aspect-[4/5] overflow-hidden bg-zinc-800">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>

        <div className="p-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">Aerials</p>
          <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
          {item.description && (
            <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoAerials() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | null>(null);

  useEffect(() => {
    fetch(`${API}/api/photo-items`)
      .then((res) => res.json())
      .then((data: PhotoItem[]) => {
        setItems(data.filter((i) => i.category === "aerials"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-start px-5 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <BackButton />
        <div className="flex flex-col items-start ml-4">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold">Aerials</p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">THE OFFICIAL PHOTOGRAPHY</span>
        </div>
        <div className="ml-auto">
          <PhotoMenu 
  isOpen={menuOpen} 
  onClose={() => setMenuOpen(false)} 
  onCloseAction={() => setMenuOpen(false)} 
/>
        </div>
      </header>

      <div className="pt-24 px-5 py-10 border-b border-white/10 bg-zinc-950">
        <h1 className="text-3xl md:text-5xl font-serif italic text-white mb-2">Aerials</h1>
        <p className="text-white/40 text-sm font-light max-w-sm leading-relaxed">
          Elevated visuals captured with cinematic drone precision.
        </p>
      </div>

      <main className="px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/20 text-lg font-serif italic">No aerials uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className="aspect-[3/4] overflow-hidden rounded-xl cursor-pointer relative group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-xs font-serif line-clamp-1">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-16 text-center bg-zinc-950 border-t border-white/5">
        <div className="h-10 w-[1px] bg-[#D4AF37] mx-auto mb-5" />
        <p className="text-[8px] tracking-[1em] text-white/20 uppercase">
          THE OFFICIAL PHOTOGRAPHY • Aerials & Motion
        </p>
      </footer>

      <AnimatePresence>
        {selectedItem && (
          <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}