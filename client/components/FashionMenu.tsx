import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export default function FashionMenu({
  isFashionLanding = false,
  initialOpen = false,
  onOpenAction,
  onCloseAction,
}: {
  isFashionLanding?: boolean;
  initialOpen?: boolean;
  onOpenAction?: () => void;
  onCloseAction?: () => void;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  const location = useLocation();
  const isFashionHome = location.pathname === "/fashion";
  const isSubPage =
    location.pathname.startsWith("/fashion/") &&
    location.pathname !== "/fashion";

  const handleOpen = () => {
    setOpen(true);
    if (onOpenAction) onOpenAction();
  };

  const handleClose = () => {
    setOpen(false);
    if (onCloseAction) onCloseAction();
  };

  return (
    <>
      {/* ── HAMBURGER (TOP RIGHT) ── (unchanged – already blue) */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed top-6 right-6 z-[9999] flex flex-col gap-[5px]"
        >
          <span className="block w-7 h-[1.5px] bg-[#00AEEF]" />
          <span className="block w-5 h-[1.5px] bg-[#00AEEF] ml-auto" />
          <span className="block w-7 h-[1.5px] bg-[#00AEEF]" />
        </button>
      )}

      {/* ── MENU ── */}
      {open && (
        <div className="fixed inset-0 z-[10000] flex flex-col bg-black w-screen h-screen overflow-hidden animate-in fade-in duration-300">

          {/* ── HEADER ── */}
          <div className="w-full px-8 pt-12 flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
              <span className="font-serif italic text-[#00AEEF] text-lg md:text-xl leading-none">
                The XCM
              </span>
              <span className="text-[#00AEEF] text-[9px] tracking-[0.55em] uppercase font-light opacity-60">
                Fashion Corner
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-white p-2 hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* ── NAV ── */}
          <nav className="flex-grow flex flex-col items-center justify-center gap-8">
            {[
              { name: "Latest Collection", path: "/fashion/latest" },
              { name: "Suits", path: "/fashion/suits" },
              { name: "Agbada", path: "/fashion/agbada" },
              { name: "Natives", path: "/fashion/natives" },
              { name: "Casuals", path: "/fashion/casuals" },
              { name: "Contact", path: "/fashion/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className="text-sm font-black uppercase tracking-[0.4em] text-white hover:text-[#00AEEF] transition-all"
              >
                {link.name}
              </Link>
            ))}

            {isFashionHome && (
              <Link
                to="/"
                onClick={handleClose}
                className="text-sm font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#00AEEF] transition-all mt-4"
              >
                Back to Empire
              </Link>
            )}

            {isSubPage && (
              <Link
                to="/fashion"
                onClick={handleClose}
                className="text-sm font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#00AEEF] transition-all mt-4"
              >
                Back to Fashion Corner
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}