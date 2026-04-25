import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gold/20">
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          {/* Logo/Wordmark */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-serif font-bold text-gold tracking-wider hover:text-gold/80 transition-colors"
          >
            TOPXCM
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gold hover:text-gold/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              to="/#photography"
              className="text-white hover:text-gold transition-colors text-sm tracking-wide"
            >
              Photography
            </Link>
            <Link
              to="/#fashion"
              className="text-white hover:text-gold transition-colors text-sm tracking-wide"
            >
              Fashion
            </Link>
            <Link
              to="/#realestate"
              className="text-white hover:text-gold transition-colors text-sm tracking-wide"
            >
              Real Estate
            </Link>
            <Link
              to="/#contact"
              className="text-gold border border-gold px-6 py-2 hover:bg-gold hover:text-black transition-colors text-sm tracking-wide"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-gold/20">
            <div className="flex flex-col px-6 py-4 gap-4">
              <Link
                to="/#photography"
                className="text-white hover:text-gold transition-colors text-sm tracking-wide py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Photography
              </Link>
              <Link
                to="/#fashion"
                className="text-white hover:text-gold transition-colors text-sm tracking-wide py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link
                to="/#realestate"
                className="text-white hover:text-gold transition-colors text-sm tracking-wide py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Real Estate
              </Link>
              <Link
                to="/#contact"
                className="text-gold border border-gold px-6 py-2 hover:bg-gold hover:text-black transition-colors text-sm tracking-wide text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

