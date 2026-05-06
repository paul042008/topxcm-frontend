import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

// ── FEATURED (first) album — full-width cinematic spread
function FeaturedAlbum({ item }: { item: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full h-[85vh] overflow-hidden group"
    >
      <img
        src={item.cover || item.image}
        alt={item.couple || item.title}
        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      {/* Cinematic dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* Gold top label */}
      <div className="absolute top-8 left-8 md:left-16">
        <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-bold border border-[#D4AF37]/30 px-4 py-1.5">
          Featured Story
        </span>
      </div>

      {/* Bottom text block */}
      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
        <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-3 font-medium">
          {item.date || "Wedding Collection"}
        </p>
        <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight mb-4">
          {item.couple || item.title}
        </h2>
        {item.location && (
          <p className="text-white/50 text-sm tracking-widest uppercase mb-6">
            ◈ {item.location}
          </p>
        )}
        <Link
          to={`/wedding/${item.id}`}
          className="inline-flex items-center gap-3 group/btn"
        >
          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold border-b border-[#D4AF37]/40 pb-0.5 group-hover/btn:border-[#D4AF37] transition-colors">
            Open Album
          </span>
          <span className="text-[#D4AF37] transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
        </Link>
      </div>
    </motion.div>
  );
}

// ── LARGE card — alternating left/right editorial layout
function EditorialCard({ item, index }: { item: any; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-0 group border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-700`}
    >
      {/* Image — takes 60% */}
      <div className="relative md:w-[60%] h-[55vw] md:h-[520px] overflow-hidden">
        <img
          src={item.cover || item.image}
          alt={item.couple || item.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />

        {/* Issue number watermark */}
        <span
          className="absolute top-5 left-5 text-[#D4AF37]/20 font-black"
          style={{ fontSize: "clamp(60px, 10vw, 100px)", fontFamily: "Impact, sans-serif", lineHeight: 1 }}
        >
          {String(index + 2).padStart(2, "0")}
        </span>
      </div>

      {/* Text — takes 40% */}
      <div
        className={`md:w-[40%] flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-[#0a0a0a] ${
          isEven ? "border-l border-white/5" : "border-r border-white/5"
        }`}
      >
        <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">
          Wedding Story
        </p>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-white leading-snug mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
          {item.couple || item.title}
        </h3>

        {item.date && (
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-3">
            {item.date}
          </p>
        )}

        {item.location && (
          <p className="text-white/40 text-sm mb-6 font-light">
            ◈ {item.location}
          </p>
        )}

        {item.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-8 font-light line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Divider */}
        <div className="w-12 h-[1px] bg-[#D4AF37]/30 mb-8" />

        <Link
          to={`/wedding/${item.id}`}
          className="self-start group/btn flex items-center gap-3 border border-[#D4AF37]/30 px-7 py-3 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
        >
          View Album
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
        </Link>
      </div>
    </motion.div>
  );
}

// ── SMALL compact cards — bottom grid for remaining albums
function CompactCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-colors duration-500"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={item.cover || item.image}
          alt={item.couple || item.title}
          className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      <div className="p-6 bg-[#0d0d0d]">
        <p className="text-[#D4AF37] text-[8px] uppercase tracking-[0.5em] mb-2 font-bold">
          {item.date || "Wedding"}
        </p>
        <h4 className="text-lg font-serif italic text-white group-hover:text-[#D4AF37] transition-colors duration-300 mb-4 leading-snug">
          {item.couple || item.title}
        </h4>
        <Link
          to={`/wedding/${item.id}`}
          className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors font-bold"
        >
          Open Album →
        </Link>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE
export default function PhotoWeddings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data, loading } = useData();

  if (loading) return <LoadingState />;

  const weddings = data.filter((item: any) => item.category === "weddings");

  const featured = weddings[0];
  const editorial = weddings.slice(1, 5);   // next 4 in alternating layout
  const compact = weddings.slice(5);         // rest in compact grid

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      <PhotoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* ── HEADER ── */}
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

        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col gap-[5px] group"
        >
          <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
          <span className="block w-4 h-[1px] bg-[#D4AF37] ml-auto transition-all group-hover:w-8" />
          <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
        </button>
      </header>

      {/* ── PAGE TITLE STRIP ── */}
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

      {/* ── EMPTY STATE ── */}
      {weddings.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
          <div className="w-12 h-[1px] bg-[#D4AF37]/30 mb-8 mx-auto" />
          <p className="text-white/40 text-lg font-serif italic">No wedding albums yet.</p>
          <p className="text-white/20 text-xs uppercase tracking-widest mt-3">
            Albums will appear here once uploaded
          </p>
        </div>
      )}

      {/* ── FEATURED ALBUM ── */}
      {featured && <FeaturedAlbum item={featured} />}

      {/* ── EDITORIAL ALTERNATING SECTION ── */}
      {editorial.length > 0 && (
        <section className="flex flex-col">
          {editorial.map((item: any, i: number) => (
            <EditorialCard key={item.id} item={item} index={i} />
          ))}
        </section>
      )}

      {/* ── COMPACT GRID (remaining) ── */}
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
            {compact.map((item: any, i: number) => (
              <CompactCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="py-20 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOP • All Right Reserve</p>
        </div>
      </footer>

      {/* Floating Book Us */}
      <a
        href="https://wa.me/2348061587993?text=Hi!%20I'd%20like%20to%20book%20a%20session."
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full text-black text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#D4AF37" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Book Us
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&display=swap');
      `}</style>
    </div>
  );
}