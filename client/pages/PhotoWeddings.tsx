import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

export default function PhotoWeddings() {
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  // ✅ Filter weddings
  const weddings = data.filter((item) => item.category === "weddings");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-5 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-xl tracking-wide">
          WEDDING COLLECTIONS
        </h1>
        <PhotoMenu />
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/wedding-hero.jpg"
            alt="Wedding hero"
            className="w-full h-full object-cover scale-105"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-3xl px-5">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xl font-medium mb-4">
            Weddings & Events
          </p>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight">
            Timeless Stories <br /> Captured With Elegance
          </h2>
          <p className="mt-5 text-white/70 text-sm md:text-base">
            Every wedding is a story. Explore beautifully curated albums
            capturing love, emotion, and unforgettable moments.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">

        {/* EMPTY STATE */}
        {weddings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center">
            <p className="text-white/60 text-lg">No weddings uploaded yet.</p>
            <p className="text-white/30 text-sm mt-2">Upload wedding albums from your admin panel.</p>
          </div>
        )}

        {/* GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((item, index) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden group border border-white/5 hover:border-[#D4AF37]/40 transition duration-500"
              style={{
                animation: `fadeUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* ✅ FIX: Use item.cover or item.image directly — Cloudinary returns full URL */}
              <img
                src={item.cover || item.image}
                alt={item.couple || item.title}
                className="w-full h-80 object-cover transition duration-700 group-hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* TEXT */}
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-serif group-hover:text-[#D4AF37] transition">
                  {item.couple || item.title}
                </h3>

                {item.date && (
                  <p className="text-sm text-white/60 mt-1">{item.date}</p>
                )}

                <Link
                  to={`/wedding/${item.id}`}
                  className="inline-flex items-center gap-2 mt-3 bg-[#D4AF37] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-white transition"
                >
                  View Album →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
