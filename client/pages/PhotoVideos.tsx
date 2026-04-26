import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

export default function PhotoVideos() {
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const videos = data.filter((item) => item.category === "videos");

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between p-5 border-b border-white/10">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-lg">
          THE OFFICIAL PHOTOGRAPHY
        </h1>
        <PhotoMenu />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96),rgba(0,0,0,0.72)),url('/images/video-hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            Videos & Motion
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl font-serif">
            Cinematic motion work with premium storytelling.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Carefully edited clips, reels, and motion content designed to feel polished, elegant, and engaging.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/photography/aerials"
              className="rounded-full border border-[#D4AF37] px-6 py-3 font-medium text-[#D4AF37] transition hover:scale-105"
            >
              Next: Aerials & Motion
            </Link>
            <Link
              to="/photography/canvas"
              className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black transition hover:scale-105"
            >
              Next: Frames & Canvas
            </Link>
          </div>
        </div>
      </section>

      {/* Clips grid */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Featured Clips
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">
              Premium motion content, presented clearly
            </h2>
          </div>
        </div>

        {/* Empty state */}
        {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center">
            <p className="text-white/60 text-lg">No videos uploaded yet.</p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((clip, index) => (
            <article
              key={clip.id}
              className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
              style={{
                animation: `fadeUp 0.6s ease-out ${index * 0.08}s both`,
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* ✅ FIX: Use clip.image directly — Cloudinary already returns full URL */}
                <img
                  src={clip.image}
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/45 backdrop-blur transition group-hover:scale-110">
                    <div className="ml-1 text-white text-2xl">▶</div>
                  </div>
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur">
                  Motion
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold font-serif">{clip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{clip.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
