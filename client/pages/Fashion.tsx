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
    <div className="min-h-screen text-slate-800 bg-[#F8FBFF] relative overflow-hidden">

      {/* BACKGROUND - Powder Blue & White Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#E0F2F7] to-[#B0E0E6]/20"></div>

      {/* HEADER */}
      <header className="relative flex justify-between items-center p-5 border-b border-blue-100 backdrop-blur-sm">
        <h1 className="text-[#1E3A8A] font-serif tracking-widest font-bold">
          TOPXCM FASHION
        </h1>
        {/* Pass custom colors to FashionMenu if it accepts props, otherwise it stays functional */}
        <FashionMenu />
      </header>

      {/* HERO */}
      <section className="relative text-center py-20 px-5">
        <h2 className="text-4xl md:text-5xl font-serif leading-tight text-slate-900">
          Crafted Style, <span className="text-[#3B82F6]">Tailored Identity</span>
        </h2>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto">
          Explore premium fashion pieces designed for elegance, culture, and modern lifestyle.
        </p>
      </section>

      {/* CATEGORY GRID */}
      <section className="relative grid md:grid-cols-2 gap-6 px-5 pb-20">

        {categories.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            className="relative h-[250px] rounded-2xl overflow-hidden group shadow-lg shadow-blue-900/5 border border-white"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* BLUE TINTED OVERLAY */}
            <div className="absolute inset-0 bg-[#1E3A8A]/40 group-hover:bg-[#1E3A8A]/50 transition duration-500"></div>

            {/* TEXT */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h3 className="text-2xl font-serif tracking-wide text-white drop-shadow-md">
                {item.name}
              </h3>

              {/* Accent line that appears on hover */}
              <div className="w-0 h-[1px] bg-white group-hover:w-20 transition-all duration-500 mt-2"></div>

              <span className="mt-4 text-sm font-medium text-sky-100 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                Explore Collection →
              </span>
            </div>
          </Link>
        ))}

      </section>
    </div>
  );
}