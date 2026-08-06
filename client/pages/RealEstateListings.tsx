import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealEstateMenu from "../components/RealEstateMenu";
import { useNavigate } from "react-router-dom";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  title: string;
  category: string;
  location?: string;
  price?: string;
  image?: string;
  description?: string;
  albumId?: string; // added to filter out album images
}

const API = "https://topxcm-backend.onrender.com";

// ─── PROPERTY MODAL ───────────────────────────────────────────────────────────

function PropertyModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const imgUrl = property.image?.startsWith("http")
    ? property.image
    : `${API}${property.image}`;

  const handleEnquire = () => {
    const msg = `Hello, I'm interested in this property: *${property.title}*${property.location ? ` (${property.location})` : ""}${property.price ? ` — ${property.price}` : ""}. Please let me know more details.`;
    window.open(`https://wa.me/2348061587993?text=${encodeURIComponent(msg)}`, "_blank");
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

          <div className="w-full aspect-[4/3] overflow-hidden bg-[#f0f4f8]">
            <img
              src={imgUrl}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-serif text-[#B0D4E8] mb-1">{property.title}</h3>
            {property.location && (
              <p className="text-slate-500 text-sm flex items-center gap-1 mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {property.location}
              </p>
            )}
            {property.price && (
              <p className="text-[#B0D4E8] font-bold text-lg mb-4">{property.price}</p>
            )}
            <button
              onClick={handleEnquire}
              className="w-full bg-[#B0D4E8] text-black rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#8bbdd4] active:scale-[0.98] transition"
            >
              Enquire via WhatsApp
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────

function PropertyCard({ property, onView }: { property: Property; onView: () => void }) {
  const imgUrl = property.image?.startsWith("http")
    ? property.image
    : `${API}${property.image}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#B0D4E8]/10 flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#EEF4F8] relative">
        <img
          src={imgUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#B0D4E8] font-bold mb-1">Property</p>
          <h3 className="text-lg font-serif text-slate-800 leading-tight">{property.title}</h3>
        </div>

        {property.location && (
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {property.location}
          </p>
        )}

        {property.price && (
          <p className="text-[#B0D4E8] font-bold text-sm">{property.price}</p>
        )}

        <button
          onClick={onView}
          className="mt-auto w-full bg-[#B0D4E8] text-black rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#8bbdd4] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>View Property</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function RealEstateListings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProperty, setOpenProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ─── FETCH + EXCLUDE ALBUM IMAGES ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/items`)
      .then((res) => res.json())
      .then((data: any[]) => {
        // Keep only realestate items that are NOT part of a fashion album
        const filtered = data.filter(
          (item) => item.category === "realestate" && !item.albumId
        );
        setProperties(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF6FA] text-slate-800 overflow-x-hidden">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-5 py-4 bg-white/50 backdrop-blur-xl border-b border-[#B0D4E8]/10">
        <button
          onClick={() => navigate("/real-estate")}
          className="text-[#B0D4E8] text-lg hover:scale-110 transition-transform"
        >
          ←
        </button>
        <div className="flex flex-col items-start ml-4 flex-1">
          <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold">Available Properties</p>
          <span className="text-slate-400 text-[8px] tracking-[0.3em] uppercase">TOPXCM Real Estate</span>
        </div>
        <RealEstateMenu onOpenAction={() => setMenuOpen(true)} onCloseAction={() => setMenuOpen(false)} />
      </header>

      {/* Hero strip */}
      <div className="pt-24 px-5 py-10 border-b border-[#B0D4E8]/10 bg-white/20">
        <h1 className="text-3xl md:text-5xl font-serif italic text-slate-800 mb-2">Properties</h1>
        <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
          Premium homes and investment properties across Lagos, curated for your lifestyle.
        </p>
      </div>

      {/* Properties grid */}
      <main className="px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#B0D4E8]/20 border-t-[#B0D4E8] rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-slate-400 text-sm uppercase tracking-widest">No properties listed yet.</p>
            <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest">Check back soon or contact us directly.</p>
            <button
              onClick={() => navigate("/real-estate/contact")}
              className="mt-8 px-10 py-4 rounded-full border uppercase text-xs font-bold tracking-[0.3em] transition-all"
              style={{ borderColor: "#B0D4E8", color: "#B0D4E8" }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = "#B0D4E8"; (e.target as HTMLButtonElement).style.color = "#000"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = "transparent"; (e.target as HTMLButtonElement).style.color = "#B0D4E8"; }}
            >
              Contact Us
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={() => setOpenProperty(property)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-16 text-center bg-white/40">
        <div className="h-10 w-[1px] bg-[#B0D4E8] mx-auto mb-5" />
        <p className="text-[8px] tracking-[1em] text-[#B0D4E8]/30 uppercase">
          © 2026 TOPXCM Real Estate • Lagos
        </p>
      </footer>

      {/* Property modal overlay */}
      <AnimatePresence>
        {openProperty && (
          <PropertyModal property={openProperty} onClose={() => setOpenProperty(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}