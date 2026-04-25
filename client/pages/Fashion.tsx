import { Link } from "react-router-dom";
import FashionMenu from "../components/FashionMenu";

export default function Fashion() {
  const categories = [
    {
      name: "Suits",
      link: "/fashion/suits",
      image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
    },
    {
      name: "Agbada",
      link: "/fashion/agbada",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
    },
    {
      name: "Natives",
      link: "/fashion/natives",
      image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
    },
    {
      name: "Casuals",
      link: "/fashion/casuals",
      image: "https://images.unsplash.com/photo-1520975922284-9e0ce8277f4d",
    },
  ];

  return (
    <div className="min-h-screen text-white bg-black relative overflow-hidden">

      {/* BACKGROUND (same vibe as photography) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10"></div>

      {/* HEADER */}
      <header className="relative flex justify-between items-center p-5 border-b border-white/10">
        <h1 className="text-[#D4AF37] font-serif tracking-widest">
          TOPXCM FASHION
        </h1>
        <FashionMenu />
      </header>

      {/* HERO */}
      <section className="relative text-center py-20 px-5">
        <h2 className="text-4xl md:text-5xl font-serif leading-tight">
          Crafted Style, <span className="text-[#D4AF37]">Tailored Identity</span>
        </h2>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">
          Explore premium fashion pieces designed for elegance, culture, and modern lifestyle.
        </p>
      </section>

      {/* CATEGORY GRID */}
      <section className="relative grid md:grid-cols-2 gap-6 px-5 pb-20">

        {categories.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            className="relative h-[250px] rounded-2xl overflow-hidden group"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition"></div>

            {/* TEXT */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-serif tracking-wide">
                {item.name}
              </h3>

              <span className="mt-3 text-sm text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
                Explore Collection →
              </span>
            </div>
          </Link>
        ))}

      </section>
    </div>
  );
}

