import { Link } from "react-router-dom";
import PhotoMenu from "../components/PhotoMenu";
import { useEffect, useRef } from "react";

export default function Photography() {
  const categories = [
    {
      title: "Weddings & Other Events",
      desc: "Elegant wedding storytelling, events, and memorable moments.",
      href: "/photography/weddings",
      image: "/images/wedding-hero.jpg",
    },
    {
      title: "Portraits & Studios",
      desc: "Clean portraits, studio sessions, and premium personal visuals.",
      href: "/photography/portraits",
      image: "/images/portrait-hero.jpg",
    },
    {
      title: "Aerials & Motion",
      desc: "Drone work, motion clips, and cinematic visual coverage.",
      href: "/photography/aerials",
      image: "/images/aerial-hero.jpg",
    },
    {
      title: "Videos & Reels",
      desc: "Short clips, cinematic reels, and branded video stories.",
      href: "/photography/videos",
      video: "/videos/reel-preview.mp4", // Replaced image/audio with video property
    },
    {
      title: "Frames & Wall Canvas",
      desc: "Print-ready displays, wall art, and premium canvas work.",
      href: "/photography/canvas",
      image: "/images/canvas-hero.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur">
        <div>
          <h1 className="text-sm tracking-[0.3em] text-[#D4AF37] font-serif">
            THE OFFICIAL PHOTOGRAPHY
          </h1>
        </div>

        <PhotoMenu />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
            TOPXCM Photography
          </p>

          <h2 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl font-serif">
            Capturing stories with precision, emotion, and detail.
          </h2>

          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            A refined visual experience for weddings, portraits, events, aerials,
            and cinematic video stories.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/photography/weddings"
              className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black transition hover:scale-105"
            >
              Weddings & Other Events
            </Link>
            <Link
              to="/photography/portraits"
              className="rounded-full border border-[#D4AF37] px-6 py-3 font-medium text-[#D4AF37] transition hover:scale-105"
            >
              Portraits & Studios
            </Link>
            <Link
              to="/photography/videos"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:scale-105"
            >
              Videos & Reels
            </Link>
          </div>
        </div>
      </section>

      {/* Menu sections */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Explore Categories
            </p>
            <h3 className="mt-2 text-2xl md:text-3xl font-serif">
              Choose a photography section
            </h3>
          </div>
          <p className="hidden md:block text-sm text-white/50">
            Minimal, premium, and easy to browse
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((item) => (
            <CategoryCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/10 px-5 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl bg-white/5 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              About
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-serif">
              Premium visual storytelling
            </h3>
            <p className="mt-4 leading-7 text-white/70">
              TOPXCM Photography delivers elegant visuals for weddings, portraits,
              events, motion work, and print-ready displays. The focus is clean
              presentation, detail, and a polished client experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 aspect-[4/5]">
              <img
                src="/images/portrait-hero.jpg"
                alt="Portrait photography"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Portraits
                </p>
                <h4 className="mt-1 text-lg font-serif text-white">
                  Studio elegance
                </h4>
              </div>
            </div>

            <div className="group relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 aspect-[4/5]">
              <img
                src="/images/wedding-hero.jpg"
                alt="Wedding photography"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Weddings
                </p>
                <h4 className="mt-1 text-lg font-serif text-white">
                  Timeless moments
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact / Footer */}
      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em]">Contact</p>
            <p>Instagram: @topstudios1</p>
            <p>Facebook: @topweddings1</p>
            <p>TOP Studios, Behind Block 68, 34 Road, Gowon Estate, Lagos</p>
            <p>+2348061587993 / +2348132799299</p>
          </div>
        </div>
      </section>

      {/* Floating Book Now */}
      <a
        href="https://wa.me/2348061587993"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-50 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black shadow-lg transition hover:scale-105"
      >
        Book Now
      </a>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */

function CategoryCard({ item }) {
  const ref = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!item.video || !ref.current || !videoRef.current) return;

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: [0.6] }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [item.video]);

  return (
    <Link
      to={item.href}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/10"
    >
      <div ref={ref} className="relative h-64 overflow-hidden">
        {/* IMAGE */}
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        {/* VIDEO */}
        {item.video && (
          <video
            ref={videoRef}
            src={item.video}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* TEXT */}
        <div className="absolute bottom-0 left-0 p-5">
          <h4 className="text-xl font-semibold font-serif text-white">
            {item.title}
          </h4>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {item.desc}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#D4AF37]">
            Open page <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

