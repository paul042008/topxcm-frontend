import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

const aerialClips = [
  {
    title: "Cinematic Drone View",
    caption: "Wide, elegant aerial visuals with a premium motion feel.",
    image: "/images/aerial-1.jpg",
  },
  {
    title: "Property Flyover",
    caption: "Smooth drone coverage for real estate and architectural presentation.",
    image: "/images/aerial-2.jpg",
  },
  {
    title: "Event Aerial Shot",
    caption: "Clean overhead storytelling for weddings and special gatherings.",
    image: "/images/aerial-3.jpg",
  },
  {
    title: "Luxury Landscape Motion",
    caption: "Wide scenic visuals framed with precision and balance.",
    image: "/images/aerial-4.jpg",
  },
  {
    title: "Urban Drone Sequence",
    caption: "Modern city motion content with a refined cinematic look.",
    image: "/images/aerial-5.jpg",
  },
  {
    title: "Creative Motion Angle",
    caption: "Stylized aerial composition for branding and premium visual impact.",
    image: "/images/aerial-6.jpg",
  },
];

export default function PhotoAerials() {

  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const aerials = data.filter(
    (item) => item.category === "aerials"
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
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96),rgba(0,0,0,0.72)),url('/images/aerial-hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            Aerials & Motion
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl font-serif">
            Elevated visuals captured with cinematic drone precision.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Clean aerial coverage for events, properties, landscapes, and premium brand storytelling.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/photography/videos"
              className="rounded-full border border-[#D4AF37] px-6 py-3 font-medium text-[#D4AF37] transition hover:scale-105"
            >
              Next: Videos
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
              Featured Aerial Work
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">
              Premium drone visuals, presented clearly
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {aerials.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={`https://topxcm-backend.onrender.com${item.image}`}
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/45 backdrop-blur transition group-hover:scale-110">
                    <div className="ml-1 text-white text-2xl">▶</div>
                  </div>
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur">
                  Drone
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold font-serif">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {item.description}
                </p>
              </div>
            </article>
          ))}

        </div>
      </section>

       
    </div>
  );
}

