import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

export default function PhotoPortraits() {
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const portraits = data.filter((item) => item.category === "portraits");

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
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.7)),url('/images/portrait-hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            Portraits & Studios
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl font-serif">
            Clean portrait visuals with a refined studio feel.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Premium portrait sessions presented in a simple, elegant gallery layout designed to keep the focus on the subject.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/photography/weddings"
              className="rounded-full border border-[#D4AF37] px-6 py-3 font-medium text-[#D4AF37] transition hover:scale-105"
            >
              Next: Weddings
            </Link>
            <Link
              to="/photography/videos"
              className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black transition hover:scale-105"
            >
              Next: Videos
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Gallery
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">
              Portraits displayed cleanly and beautifully
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {portraits.map((item, index) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
              style={{
                animation: `fadeUp 0.6s ease-out ${index * 0.08}s both`,
              }}
            >
              <div
                className="relative h-[320px] w-full overflow-hidden bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: item.image ? `url('${item.image}')` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-serif text-white">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}