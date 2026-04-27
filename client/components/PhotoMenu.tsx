import { Link } from "react-router-dom";
import { X, Instagram, Facebook, Twitter } from "lucide-react";

export default function PhotoMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-[9999] bg-black flex flex-col items-center justify-between text-white py-16">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-black -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none -z-10" />
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-[100] text-[#D4AF37] p-2 hover:scale-110 transition-transform"
      >
        <X size={28} />
      </button>

      {/* Header Label in Menu */}
      <div className="text-center">
        <p className="text-[10px] tracking-[0.8em] text-[#D4AF37] uppercase opacity-60">
          Studio Navigation
        </p>
      </div>

      {/* Primary Links - Size Reduced for Elegance */}
      <nav className="relative z-10 flex flex-col items-center gap-5 md:gap-6 text-center max-h-[60vh] overflow-y-auto px-4 custom-scrollbar">
        <Link to="/" onClick={onClose} className="text-xl md:text-2xl font-serif italic hover:text-[#D4AF37] transition-all">Home</Link>
        <Link to="/photography" onClick={onClose} className="text-xl md:text-2xl font-serif italic hover:text-[#D4AF37] transition-all border-b border-[#D4AF37]/20 pb-1 w-full">Portfolio</Link>
        
        {/* Sub-Routes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-2">
          <Link to="/photography/weddings" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Weddings</Link>
          <Link to="/photography/portraits" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Portraits</Link>
          <Link to="/photography/aerials" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Aerials</Link>
          <Link to="/photography/videos" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Cinema</Link>
          <Link to="/photography/canvas" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Canvas</Link>
          <Link to="/photography/contact" onClick={onClose} className="text-sm md:text-base tracking-[0.3em] uppercase font-light hover:text-[#D4AF37] transition-all">Contact</Link>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 border border-[#D4AF37]/40 px-10 py-3 text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
        >
          Enter Studio
        </button>
      </nav>

      {/* Social Handles at Bottom */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-8">
          <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
            <Facebook size={20} strokeWidth={1.5} />
          </a>
          <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
            <Twitter size={20} strokeWidth={1.5} />
          </a>
        </div>
        <p className="text-[8px] tracking-[0.6em] text-white/20 uppercase">
          Lagos • London • Worldwide
        </p>
      </div>
    </div>
  );
}