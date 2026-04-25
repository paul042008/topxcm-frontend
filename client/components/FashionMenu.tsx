import { useState } from "react";
import { Link } from "react-router-dom";

export default function FashionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="text-3xl text-white"
      >
        ☰
      </button>

      {/* FULL SCREEN MENU */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-black animate-fadeIn">

          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10"></div>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-3xl text-white hover:text-[#D4AF37] transition"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="absolute top-10 left-6 text-lg font-serif text-[#D4AF37] opacity-80">
            TOPXCM Fashion
          </h2>

          {/* LINKS */}
          <nav className="relative flex flex-col items-center gap-8 text-lg tracking-wide">

            <Link to="/" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Home
            </Link>

            <Link to="/fashion" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Fashion
            </Link>

            <Link to="/fashion/suits" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Suits
            </Link>

            <Link to="/fashion/agbada" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Agbada
            </Link>

            <Link to="/fashion/natives" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Natives
            </Link>

            <Link to="/fashion/casuals" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Casuals
            </Link>

            <Link to="/fashion/contact" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition">
              Contact
            </Link>

          </nav>

          {/* SOCIALS */}
          <div className="absolute bottom-8 flex gap-6 text-xl opacity-70">
            <span className="hover:text-[#D4AF37] transition">f</span>
            <span className="hover:text-[#D4AF37] transition">ig</span>
            <span className="hover:text-[#D4AF37] transition">tw</span>
          </div>
        </div>
      )}
    </>
  );
}

