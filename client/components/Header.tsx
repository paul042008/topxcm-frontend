import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* The Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-md border-b border-white/5">
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          {/* Faint Gold Branding */}
          <Link
            to="/"
            className="text-lg font-sans font-black text-white/60 tracking-[0.3em] hover:text-white transition-all"
          >
            TOPXCM
          </Link>

          {/* Faint Gold Hamburger Icon */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white/60 hover:text-white transition-all duration-300"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* FULL SCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] w-full h-screen bg-black flex flex-col items-center overflow-hidden">
          
          {/* Champagne Gold Gradient Glow - Purely Decorative */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-[#D4AF37]/10 pointer-events-none" />

          {/* Close Button & Brand (Top Bar inside menu) */}
          <div className="relative w-full px-6 py-5 flex justify-between items-center z-20">
            <span className="font-sans font-black tracking-[0.2em] text-sm text-white/10 uppercase">
              TOPXCM
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white/60 hover:text-white transition-all duration-300"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Links - Reduced size and centered */}
          <nav className="relative flex-grow flex flex-col items-center justify-center gap-8 z-20">
            {[
              { name: "Home", path: "/" },
              { name: "Photography", path: "/photography" },
              { name: "Fashion", path: "/fashion" },
              { name: "Real Estate", path: "/real-estate" },
              { name: "Contact", path: "/contact" }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-sans font-bold uppercase tracking-[0.4em] text-white/90 hover:text-[#D4AF37] transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social Icons - Forced to the very bottom */}
          <div className="relative w-full flex justify-center gap-10 pb-16 md:pb-24 z-20">
            <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white/30 hover:text-[#D4AF37] transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}