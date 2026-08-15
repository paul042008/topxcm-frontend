import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealEstateMenu from "../components/RealEstateMenu";
import RealEstateGalleryView from "../components/RealEstateGalleryView";
import { useNavigate } from "react-router-dom";

const API = "https://topxcm-backend-1.onrender.com";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface PropertyImage {
  id?: string;
  url: string;
  title: string;
  description: string;
  price: string;
  extra_text?: string;
  order?: number;
}

interface Property {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  cover?: string;
  images: PropertyImage[];
  location?: string;
  isSingle?: boolean;
}

// ─── PROPERTY CARD ──────────────────────────────────────────────────────────

function PropertyCard({ property, onView }: { property: Property; onView: () => void }) {
  const coverImage = property.cover || (property.images.length > 0 ? property.images[0].url : "");
  const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(coverImage);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#B0D4E8]/30 transition-colors flex flex-col cursor-pointer"
      onClick={onView}
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-800 relative">
        {coverImage ? (
          <>
            {isVideo ? (
              <video
                ref={videoRef}
                src={coverImage}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                muted
                loop
                playsInline
                onMouseEnter={() => videoRef.current?.play()}
                onMouseLeave={() => videoRef.current?.pause()}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <img
                src={coverImage}
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {property.images.length > 0 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white/80 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <span>📷</span> {property.images.length + 1}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏗️</div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#B0D4E8] font-bold mb-1">Construction</p>
          <h3 className="text-lg font-serif text-white leading-tight">{property.name}</h3>
        </div>

        {property.location && (
          <p className="text-white/40 text-xs flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {property.location}
          </p>
        )}

        {property.price && (
          <p className="text-[#B0D4E8] font-bold text-sm">{property.price}</p>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onView(); }}
          className="mt-auto w-full bg-[#B0D4E8] text-black rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#8bbdd4] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>View Project</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function RealEstateConstruction() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const albumsRes = await fetch(`${API}/api/fashion-albums`);
        const albumsData: Property[] = await albumsRes.json();

        const itemsRes = await fetch(`${API}/api/items`);
        const itemsData = await itemsRes.json();

        const category = "construction";

        const albumProperties = albumsData.filter(
          (album) => album.category === category && album.cover
        );

        const albumCoverUrls = albumsData
          .filter((a) => a.category === category && a.cover)
          .map((a) => a.cover)
          .filter(Boolean);

        const standaloneItems = itemsData.filter(
          (item: any) =>
            !item.album_id &&
            item.category === category &&
            item.image &&
            !albumCoverUrls.includes(item.image)
        );

        const singleProperties: Property[] = standaloneItems.map((item: any) => ({
          id: `single-${item.id}`,
          name: item.title || "Untitled",
          category: item.category,
          description: item.description || "",
          price: item.price || "",
          location: item.location || "",
          cover: item.image,
          isSingle: true,
          images: [
            {
              url: item.image,
              title: item.title || "Untitled",
              description: item.description || "",
              price: item.price || "",
              extra_text: item.extra_text || "",
            },
          ],
        }));

        setProperties([...albumProperties, ...singleProperties]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ─── HAMBURGER MENU ── */}
      <RealEstateMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenAction={() => setMenuOpen(true)}
      />

      {/* ─── MAIN CONTENT (blurred when menu open) ── */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: menuOpen ? 0.18 : 1,
          filter: menuOpen ? "blur(2px)" : "none",
          pointerEvents: menuOpen ? "none" : "auto",
        }}
      >
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => navigate("/real-estate")}
            className="text-[#B0D4E8] text-xl hover:scale-110 transition-transform"
          >
            ←
          </button>
          <div className="flex flex-col items-start ml-4 flex-1">
            <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold">Construction Projects</p>
            <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">TOPXCM Real Estate</span>
          </div>
        </header>

        {/* Hero strip */}
        <div className="pt-24 px-5 py-10 border-b border-white/5 bg-black/30">
          <h1 className="text-3xl md:text-5xl font-serif italic text-white mb-2">Construction</h1>
          <p className="text-white/40 text-sm font-light max-w-sm leading-relaxed">
            Discover ongoing and completed construction projects, from residential to commercial.
          </p>
        </div>

        {/* Projects grid */}
        <main className="px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#B0D4E8]/20 border-t-[#B0D4E8] rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-white/40 text-sm uppercase tracking-widest">No construction projects yet.</p>
              <p className="text-white/20 text-xs mt-2 uppercase tracking-widest">Check back soon or contact us.</p>
              <button
                onClick={() => navigate("/real-estate/contact")}
                className="mt-8 px-10 py-4 rounded-full border border-[#B0D4E8] uppercase text-xs font-bold tracking-[0.3em] text-[#B0D4E8] hover:bg-[#B0D4E8] hover:text-black transition-all"
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
                  onView={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-16 text-center border-t border-white/5">
          <div className="h-10 w-[1px] bg-gradient-to-b from-[#B0D4E8] to-transparent mx-auto mb-5" />
          <p className="text-[8px] tracking-[1em] text-white/15 uppercase">
            © 2026 TOPXCM Real Estate • Lagos
          </p>
        </footer>

        {/* Gallery View */}
        <AnimatePresence>
          {selectedProperty && (
            <RealEstateGalleryView
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}