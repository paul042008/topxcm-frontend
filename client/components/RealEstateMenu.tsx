import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";

interface RealEstateMenuProps {
  isRealEstateLanding?: boolean;
  onOpenAction?: () => void;
  onCloseAction?: () => void;
  isOpen?: boolean;      // controlled by parent
  onClose?: () => void;   // called when menu should close
}

export default function RealEstateMenu({
  isRealEstateLanding = false,
  onOpenAction,
  onCloseAction,
  isOpen = false,
  onClose,
}: RealEstateMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRealEstateHome = location.pathname === "/real-estate";
  const isSubPage = location.pathname.startsWith("/real-estate/") && location.pathname !== "/real-estate";

  const links = [
    {
      label: "Gallery",
      sub: "Available Listings",
      path: "/real-estate/listings",
    },
    {
      label: "Construction Projects",
      sub: "Ongoing & Completed",
      path: "/real-estate/construction",
    },
    {
      label: "2D & 3D Plans",
      sub: "Architectural Designs",
      path: "/real-estate/plans",
    },
    {
      label: "Contact Us",
      sub: "Get in touch",
      path: "/real-estate/contact",
    },
  ];

  const handleOpen = () => {
    if (onOpenAction) onOpenAction();
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (onCloseAction) onCloseAction();
  };

  return (
    <>
      {/* ── HAMBURGER (Fixed to Right) ── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed top-8 right-6 md:right-10 z-[9999] flex flex-col gap-[5px] group"
        >
          <span className="block w-7 h-[1.5px] bg-[#B0D4E8] group-hover:w-5 transition-all" />
          <span className="block w-5 h-[1.5px] bg-[#B0D4E8] ml-auto group-hover:w-7 transition-all" />
          <span className="block w-7 h-[1.5px] bg-[#B0D4E8]" />
        </button>
      )}

      {/* ── FULL SCREEN MENU OVERLAY (Dark Theme) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black w-screen h-screen overflow-hidden flex flex-col"
          >
            {/* Header Area with Logo */}
            <div className="w-full px-8 pt-12 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="/images/your-logo12.png"
                  alt="XCM Homes"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <button
                onClick={handleClose}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={32} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-grow flex flex-col items-center justify-center gap-10">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { handleClose(); navigate(link.path); }}
                  className="group text-center"
                >
                  <p className="text-2xl font-black uppercase tracking-[0.3em] text-white group-hover:text-[#B0D4E8] transition-colors">
                    {link.label}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.5em] text-white/40 mt-1">{link.sub}</p>
                </motion.button>
              ))}

              {/* Conditional Back Links */}
              <div className="mt-8 flex flex-col gap-4 items-center">
                {isRealEstateHome && (
                  <button
                    onClick={() => { handleClose(); navigate("/"); }}
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#B0D4E8] transition-all"
                  >
                    ← Back to Empire
                  </button>
                )}
                {isSubPage && (
                  <button
                    onClick={() => { handleClose(); navigate("/real-estate"); }}
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#B0D4E8] transition-all"
                  >
                    ← Back to Homes
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}