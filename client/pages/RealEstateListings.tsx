import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealEstateMenu from "../components/RealEstateMenu";
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

// ─── PROPERTY MODAL (with image/video carousel, dark theme) ──────────────

function PropertyModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = property.images || [];
  const coverImage = property.cover || (images.length > 0 ? images[0].url : "");
  const isVideo = (url: string) => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleEnquire = () => {
    const msg = `Hello, I'm interested in this property: *${property.name}*${property.location ? ` (${property.location})` : ""}${property.price ? ` — ${property.price}` : ""}. Please let me know more details.`;
    window.open(`https://wa.me/2348061587993?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const allImages = [coverImage, ...images.map((img) => img.url)].filter(Boolean);
  const currentUrl = allImages[currentIndex] || coverImage;

  const renderMedia = (url: string) => {
    if (isVideo(url)) {
      return (
        <video
          src={url}
          className="w-full h-full object-contain max-h-[80vh]"
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }
    return (
      <img
        src={url}
        alt={property.name}
        className="w-full h-full object-contain max-h-[80vh]"
        onContextMenu={(e) => e.preventDefault()}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    );
  };

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
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition"
          >
            ✕
          </button>

          {/* Media Carousel */}
          <div className="relative w-full bg-black/40 flex items-center justify-center" style={{ minHeight: "50vh" }}>
            {renderMedia(currentUrl)}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition flex items-center justify-center text-2xl"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition flex items-center justify-center text-2xl"
                >
                  ›
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-serif text-[#B0D4E8] mb-1">{property.name}</h3>
            {property.location && (
              <p className="text-white/50 text-sm flex items-center gap-1 mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {property.location}
              </p>
            )}
            {property.price && (
              <p className="text-[#B0D4E8] font-bold text-lg mb-4">{property.price}</p>
            )}
            {property.description && (
              <div
                className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
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

// ─── PROPERTY CARD (dark theme, no frame) ─────────────────────────────────

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
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏠</div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#B0D4E8] font-bold mb-1">
            {property.isSingle ? "Listing" : "Property"}
          </p>
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
          <span>View {property.isSingle ? "Listing" : "Property"}</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function RealEstateListings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProperty, setOpenProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch albums
        const albumsRes = await fetch(`${API}/api/fashion-albums`);
        const albumsData: Property[] = await albumsRes.json();

        // Fetch single items
        const itemsRes = await fetch(`${API}/api/items`);
        const itemsData = await itemsRes.json();

        const category = "properties";

        // Filter albums
        const albumProperties = albumsData.filter(
          (album) => album.category === category && album.cover
        );

        // ─── COLLECT ALBUM COVER URLs TO EXCLUDE DUPLICATES ──────────────
        const albumCoverUrls = albumsData
          .filter((a) => a.category === category && a.cover)
          .map((a) => a.cover)
          .filter(Boolean);

        // Filter standalone items (no album_id) with category properties
        // AND exclude any item whose image is an album cover (to avoid duplicates)
        const standaloneItems = itemsData.filter(
          (item: any) =>
            !item.album_id &&
            item.category === category &&
            item.image &&
            !albumCoverUrls.includes(item.image) // ← FIX: skip cover images
        );

        // Convert standalone items to virtual properties
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

      {/* Header (fixed, consistent with landing) */}
      <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => navigate("/real-estate")}
          className="text-[#B0D4E8] text-xl hover:scale-110 transition-transform"
        >
          ←
        </button>
        <div className="flex flex-col items-start ml-4 flex-1">
          <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold">Available Properties</p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">TOPXCM Real Estate</span>
        </div>
      </header>

      {/* Hero strip */}
      <div className="pt-24 px-5 py-10 border-b border-white/5 bg-black/30">
        <h1 className="text-3xl md:text-5xl font-serif italic text-white mb-2">Properties</h1>
        <p className="text-white/40 text-sm font-light max-w-sm leading-relaxed">
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
            <p className="text-white/40 text-sm uppercase tracking-widest">No properties listed yet.</p>
            <p className="text-white/20 text-xs mt-2 uppercase tracking-widest">Check back soon or contact us directly.</p>
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
                onView={() => setOpenProperty(property)}
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

      {/* Property modal overlay */}
      <AnimatePresence>
        {openProperty && (
          <PropertyModal property={openProperty} onClose={() => setOpenProperty(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}