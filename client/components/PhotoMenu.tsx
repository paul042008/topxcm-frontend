import { useState } from "react";
import { Link } from "react-router-dom";

export default function PhotoMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="text-3xl text-white hover:text-[#D4AF37] transition-colors"
      >
        ☰
      </button>

      {/* FULL SCREEN MENU */}
      {open && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center text-white bg-black">
          
          {/* Background gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/20 pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-8 right-8 z-[100] text-3xl text-white hover:text-[#D4AF37] transition-all"
          >
            ✕
          </button>

          {/* Logo / Title - Positioned top left */}
          <h2 className="absolute top-10 left-8 z-[100] text-sm md:text-lg font-serif text-[#D4AF37] opacity-80 tracking-widest uppercase">
            Official Photography
          </h2>

          {/* MENU LINKS - Centered vertically and horizontally */}
          <nav className="relative z-[100] flex flex-col items-center gap-6 md:gap-8 text-xl md:text-2xl tracking-[0.2em] uppercase font-light">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Home
            </Link>
            <Link to="/photography" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Portfolio
            </Link>
            <Link to="/photography/weddings" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Weddings
            </Link>
            <Link to="/photography/portraits" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Portraits
            </Link>
            <Link to="/photography/videos" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Films
            </Link>
            <Link to="/photography/aerials" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Aerials
            </Link>
            <Link to="/photography/canvas" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Canvas
            </Link>
            <Link to="/photography/contact" onClick={() => setOpen(false)} className="hover:text-[#D4AF37] transition duration-300">
              Contact
            </Link>
          </nav>

          {/* SOCIALS - Positioned at bottom */}
          <div className="absolute bottom-12 z-[100] flex gap-10 text-sm tracking-widest opacity-60">
            <a href="#" className="hover:text-[#D4AF37] transition">FB</a>
            <a href="#" className="hover:text-[#D4AF37] transition">IG</a>
            <a href="#" className="hover:text-[#D4AF37] transition">TW</a>
          </div>
        </div>
      )}
    </>
  );
}

