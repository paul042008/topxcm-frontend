import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Facebook, Instagram, Twitter } from "lucide-react";

export default function FashionMenu({ initialOpen = false, onCloseAction }: { initialOpen?: boolean, onCloseAction?: () => void }) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onCloseAction) onCloseAction();
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="text-3xl text-[#1E3A8A] p-2 relative z-50 transition-transform active:scale-90"
        >
          ☰
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[10000] flex flex-col bg-[#D9EAF0] w-screen h-screen overflow-hidden animate-in fade-in duration-300">
          
          {/* 1. TOP BAR */}
          <div className="w-full px-8 pt-12 flex justify-between items-center shrink-0">
            <span className="font-sans font-black tracking-[0.2em] text-[10px] text-[#1E3A8A]/50 uppercase">
              TOPXCM
            </span>
            <button
              onClick={handleClose}
              className="text-[#1E3A8A] p-2 hover:rotate-90 transition-transform"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* 2. NAVIGATION LINKS - Smaller & Refined */}
          <nav className="flex-grow flex flex-col items-center justify-center gap-8">
            {[
              { name: "Suits", path: "/fashion/suits" },
              { name: "Agbada", path: "/fashion/agbada" },
              { name: "Natives", path: "/fashion/natives" },
              { name: "Casuals", path: "/fashion/casuals" },
              { name: "Contact", path: "/fashion/contact" },
              { name: "Home", path: "/" }
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className="text-sm font-sans font-black uppercase tracking-[0.4em] text-[#1E3A8A] hover:text-[#D4AF37] transition-all hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. SOCIALS */}
          <div className="w-full flex justify-center gap-10 pb-20 shrink-0">
            <Facebook size={18} className="text-[#1E3A8A] hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <Instagram size={18} className="text-[#1E3A8A] hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <Twitter size={18} className="text-[#1E3A8A] hover:text-[#D4AF37] cursor-pointer transition-colors" />
          </div>
          
        </div>
      )}
    </>
  );
}