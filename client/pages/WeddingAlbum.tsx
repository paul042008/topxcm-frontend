import { useParams } from "react-router-dom";
import useData from "../hooks/useData";
import BackButton from "../components/BackButton";

export default function WeddingAlbum() {
  const { id } = useParams();
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-serif tracking-widest text-sm animate-pulse">
          LOADING ALBUM
        </p>
      </div>
    );
  }

  const wedding = data.find((item) => item.id.toString() === id);

  if (!wedding) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/60">
        Wedding not found
      </div>
    );
  }

  // fallback handling (important)
  const galleryImages = wedding.gallery || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-5 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-lg md:text-xl">
          {wedding.title}
        </h1>
        <div />
      </header>

      {/* HERO / COVER */}
      <section className="relative h-[300px] md:h-[450px] overflow-hidden">
        <img
          src={`https://topxcm-backend.onrender.com${wedding.image}`}
          alt={wedding.title}
          className="w-full h-full object-cover scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* text bottom */}
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl font-serif text-white">
            {wedding.title}
          </h2>

          {wedding.description && (
            <p className="mt-3 text-white/70 max-w-xl leading-relaxed">
              {wedding.description}
            </p>
          )}
        </div>
      </section>

      {/* GALLERY HEADER */}
      <section className="max-w-7xl mx-auto px-5 pt-10">
        <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
          Wedding Album
        </p>
        <h3 className="mt-2 text-2xl md:text-3xl font-serif">
          Captured Moments
        </h3>
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-5 py-10">
        {galleryImages.length === 0 ? (
          <div className="text-center text-white/60 py-20">
            No album images uploaded yet.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryImages.map((img: string, i: number) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 group"
              >
                <img
                  src={`https://topxcm-backend.onrender.com${img}`}
                  alt=""
                  className="w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

