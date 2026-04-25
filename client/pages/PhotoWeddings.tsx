import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";

export default function PhotoWeddings() {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-serif tracking-widest text-sm animate-pulse">
          LOADING COLLECTIONS
        </p>
      </div>
    );
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

      {/* 💎 HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <img
            src="/images/wedding-hero.jpg"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* CONTENT */}
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
            <p className="text-white/60 text-lg">
              No weddings uploaded yet.
            </p>
          </div>
        )}

        {/* GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden group border border-white/5 hover:border-[#D4AF37]/40 transition duration-500"
            >
              {/* ✅ USE COVER IMAGE */}
              <img
                src={`https://topxcm-backend.onrender.com${item.cover || item.image}`}
                alt={item.title}
                className="w-full h-80 object-cover transition duration-700 group-hover:scale-105"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* TEXT */}
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-serif group-hover:text-[#D4AF37] transition">
                  {item.couple || item.title}
                </h3>

                {item.date && (
                  <p className="text-sm text-white/60">
                    {item.date}
                  </p>
                )}

                {/* BUTTON */}
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
    </div>
  );
}

