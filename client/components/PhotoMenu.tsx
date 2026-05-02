import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Facebook, Instagram, Twitter } from "lucide-react";

export default function PhotoMenu({
  isOpen,
  initialOpen = false,
  onClose,
  onCloseAction,
}: {
  isOpen: boolean;
  initialOpen?: boolean;
  onClose: () => void;
  onCloseAction?: () => void;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const location = useLocation();
  const isPhotoHome = location.pathname === "/photography";
  const isSubPage =
    location.pathname.startsWith("/photography/") &&
    location.pathname !== "/photography";

  const handleClose = () => {
    setOpen(false);
    onClose();
    if (onCloseAction) onCloseAction();
  };

  return (
    <>
      {/* Hamburger trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-[5px] group p-2"
      >
        <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
        <span className="block w-4 h-[1px] bg-[#D4AF37] ml-auto transition-all group-hover:w-8" />
        <span className="block w-6 h-[1px] bg-[#D4AF37] transition-all group-hover:w-8" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex flex-col bg-black w-screen h-screen overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

          <div className="w-full px-8 pt-12 flex justify-between items-center relative z-10">
            <div className="flex flex-col gap-0.5 opacity-40">
              <span className="font-serif italic text-white text-lg md:text-xl leading-none" style={{ letterSpacing: "0.02em" }}>
                The Official
              </span>
              <span className="text-[#D4AF37] text-[9px] tracking-[0.55em] uppercase font-light">
                Photography
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-[#D4AF37] p-2 hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-grow flex flex-col items-center justify-center gap-8 relative z-10">
            <p className="text-white/25 text-[9px] uppercase tracking-[0.5em] font-medium mb-2">
              Which page would you like to explore?
            </p>
            {[
              { name: "Weddings", path: "/photography/weddings" },
              { name: "Studio & Outdoors", path: "/photography/studio-outdoors" },
              { name: "Aerials & Videos", path: "/photography/aerials-videos" },
              { name: "Frames & Canvas", path: "/photography/canvas" },
              { name: "Contact Us", path: "/photography/contact" },
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

            {isPhotoHome && (
              <Link
                to="/"
                onClick={handleClose}
                className="text-sm font-sans font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#D4AF37] transition-all mt-4"
              >
                Back to Empire
              </Link>
            )}

            {isSubPage && (
              <Link
                to="/photography"
                onClick={handleClose}
                className="text-sm font-sans font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#D4AF37] transition-all mt-4"
              >
                Back to Photography
              </Link>
            )}
          </nav>

          <div className="w-full flex justify-center gap-10 pb-20 relative z-10">
            <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==" target="_blank" rel="noreferrer" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}