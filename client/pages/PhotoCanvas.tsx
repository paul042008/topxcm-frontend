import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData"; // ✅ added

export default function PhotoCanvas() {

  const { data, loading } = useData(); // ✅ added

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  // ✅ filter canvas products from backend
  const canvasProducts = data.filter(
    (item) => item.category === "canvas"
  );

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
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96),rgba(0,0,0,0.72)),url('/images/canvas-hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            Frames & Wall Canvas
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl font-serif">
            Premium prints and canvas displays designed to stand out.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Elegant wall art, framed portraits, and custom canvas pieces with clear size and cost details.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/photography/portraits"
              className="rounded-full border border-[#D4AF37] px-6 py-3 font-medium text-[#D4AF37] transition hover:scale-105"
            >
              Next: Portraits
            </Link>
            <Link
              to="/photography"
              className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black transition hover:scale-105"
            >
              Back to Photography
            </Link>
          </div>
        </div>
      </section>

      {/* Product cards */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Products
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">
              Sizes and pricing for display options
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {canvasProducts.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('https://topxcm-backend.onrender.com${item.image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur">
                  Print
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold font-serif">{item.title}</h3>

                {/* optional fields if you add them in admin */}
                {item.size && (
                  <p className="mt-2 text-sm text-white/65">
                    Size: {item.size}
                  </p>
                )}

                {item.price && (
                  <p className="mt-1 text-sm text-[#D4AF37]">
                    {item.price}
                  </p>
                )}

                <div className="mt-4">
                  <a
                    href="https://wa.me/2348061587993"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:scale-105"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

     
    </div>
  );
}

