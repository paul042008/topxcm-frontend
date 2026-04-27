import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Facebook, Instagram, Twitter } from "lucide-react";

export default function PhotoMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(isOpen);

  // Stay in sync if parent controls isOpen
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      {/* Hamburger trigger — same pattern as FashionMenu */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="text-3xl text-[#D4AF37] p-2 relative z-50"
        >
          ☰
        </button>
      )}

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-[10000] flex flex-col bg-black w-screen h-screen overflow-hidden animate-in fade-in duration-300">

          {/* Gold gradient wash — same as FashionMenu's bg tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

          {/* Top bar — logo + close */}
          <div className="w-full px-8 pt-12 flex justify-between items-center relative z-10">
            {/* Logo box — mirrors FashionMenu's logo box style */}
            <div
              className="backdrop-blur-sm p-2 rounded-xl border shadow-sm"
              style={{
                backgroundColor: "rgba(212,175,55,0.08)",
                borderColor: "rgba(212,175,55,0.2)",
              }}
            >
              <img
                src="/images/photologo.png"
                alt="TOP Photography"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  // Fallback text if logo image missing
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.nextSibling as HTMLElement).style.display = "block";
                }}
              />
              <span
                className="hidden text-[#D4AF37] text-xs font-black tracking-[0.4em] uppercase"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                TOP
              </span>
            </div>

            <button
              onClick={handleClose}
              className="text-[#D4AF37] p-2 hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav links — same structure as FashionMenu */}
          <nav className="flex-grow flex flex-col items-center justify-center gap-8 relative z-10">
            {[
              { name: "Portfolio",  path: "/photography" },
              { name: "Weddings",   path: "/photography/weddings" },
              { name: "Portraits",  path: "/photography/portraits" },
              { name: "Aerials",    path: "/photography/aerials" },
              { name: "Cinema",     path: "/photography/videos" },
              { name: "Canvas",     path: "/photography/canvas" },
              { name: "Contact",    path: "/photography/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className="text-sm font-sans font-black uppercase tracking-[0.4em] text-[#D4AF37] hover:text-white transition-all"
              >
                {link.name}
              </Link>
            ))}

            {/* Back to main — mirrors FashionMenu's "Back to Empire" */}
            <Link
              to="/"
              onClick={handleClose}
              className="text-sm font-sans font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#D4AF37] transition-all mt-4"
            >
              Back to Empire
            </Link>
          </nav>

          {/* Socials — same layout as FashionMenu */}
          <div className="w-full flex justify-center gap-10 pb-20 relative z-10">
            <a href="#" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}