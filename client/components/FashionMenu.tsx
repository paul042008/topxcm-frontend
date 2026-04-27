import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Facebook, Instagram, Twitter } from "lucide-react";

// Added prop to determine which 'Home' to show
export default function FashionMenu({ isFashionLanding = false, initialOpen = false, onCloseAction }: { isFashionLanding?: boolean, initialOpen?: boolean, onCloseAction?: () => void }) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => { setOpen(initialOpen); }, [initialOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onCloseAction) onCloseAction();
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="text-3xl text-[#00AEEF] p-2 relative z-50">
          ☰
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[10000] flex flex-col bg-[#D9EAF0] w-screen h-screen overflow-hidden animate-in fade-in duration-300">
          <div className="w-full px-8 pt-12 flex justify-between items-center">
            {/* LOGO BOX: Curve edged box with fashionlogo.png */}
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-xl border border-[#00AEEF]/20 shadow-sm">
               <img 
                 src="/images/fashionlogo.png" 
                 alt="Logo" 
                 className="h-8 w-auto object-contain"
               />
            </div>

            <button onClick={handleClose} className="text-[#00AEEF] p-2 hover:rotate-90 transition-transform">
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-grow flex flex-col items-center justify-center gap-8">
            {[
              { name: "Suits", path: "/fashion/suits" },
              { name: "Agbada", path: "/fashion/agbada" },
              { name: "Natives", path: "/fashion/natives" },
              { name: "Casuals", path: "/fashion/casuals" },
              { name: "Contact", path: "/fashion/contact" },
            ].map((link) => (
              <Link key={link.name} to={link.path} onClick={handleClose} className="text-sm font-sans font-black uppercase tracking-[0.4em] text-[#00AEEF] hover:text-[#D4AF37] transition-all">
                {link.name}
              </Link>
            ))}

            {/* LOGIC FOR HOME LINK */}
            <Link 
              to={isFashionLanding ? "/" : "/fashion"} 
              onClick={handleClose}
              className="text-sm font-sans font-black uppercase tracking-[0.4em] text-[#D4AF37] mt-4"
            >
              {isFashionLanding ? "Back to Empire" : "Fashion Home"}
            </Link>
          </nav>

          <div className="w-full flex justify-center gap-10 pb-20">
            <Facebook size={18} className="text-[#00AEEF] hover:text-[#D4AF37]" />
            <Instagram size={18} className="text-[#00AEEF] hover:text-[#D4AF37]" />
            <Twitter size={18} className="text-[#00AEEF] hover:text-[#D4AF37]" />
          </div>
        </div>
      )}
    </>
  );
}