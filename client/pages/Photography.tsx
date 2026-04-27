import { useEffect, useState } from "react";
import PhotoMenu from "../components/PhotoMenu";
import { Menu } from "lucide-react";

export default function Photography() {
  const [isMenuOpen, setIsMenuOpen] = useState(true); 
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Capturing stories with precision, emotion, and detail.";

  useEffect(() => {
    if (isMenuOpen) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37]">
      
      {/* MENU LOGIC - UNTOUCHED */}
      <PhotoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* PAGE CONTENT */}
      <div className={`transition-opacity duration-1000 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        
        {/* HEADER - Polished Alignment */}
        <header className="fixed top-0 left-0 w-full z-[50] flex items-center justify-between border-b border-white/5 bg-black/90 px-8 py-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-1">
            <h1 className="text-[12px] tracking-[0.7em] text-[#D4AF37] font-bold uppercase leading-none">
              TOPXCM
            </h1>
            <span className="text-[9px] tracking-[0.4em] text-white/40 uppercase font-light">
              Official Photography
            </span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="flex items-center gap-3 group text-[#D4AF37]"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">Menu</span>
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </header>

        {/* HERO SECTION - Improved Scale & Spacing */}
        <section className="relative flex flex-col items-center justify-center min-h-screen px-10 text-center">
          <div className="space-y-4 mb-12">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[1.2em] text-[#D4AF37] font-semibold">
              Est. 2024 • Lagos Nigeria
            </p>
            <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto"></div>
          </div>

          {/* Headline Container */}
          <div className="w-full max-w-5xl min-h-[140px] md:min-h-[180px] flex items-center justify-center">
            <h2 className="text-3xl md:text-6xl font-serif font-light leading-[1.2] italic tracking-tight text-white">
              {displayedText}
              <span className="animate-pulse ml-3 text-[#D4AF37] inline-block w-[2px] h-[35px] md:h-[60px] align-middle bg-[#D4AF37]" />
            </h2>
          </div>

          <div className="mt-20 flex flex-col items-center gap-10">
            <p className="text-[11px] md:text-[13px] text-white/40 tracking-[0.9em] uppercase font-light max-w-2xl">
              The Art of Visual Storytelling
            </p>
            
            <a
              href="https://wa.me/2348061587993"
              target="_blank" rel="noreferrer"
              className="group relative overflow-hidden border border-[#D4AF37]/40 px-14 py-5 text-[11px] font-bold uppercase tracking-[0.6em] text-[#D4AF37] transition-all hover:text-black"
            >
              <span className="relative z-10">Book Session</span>
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </a>
          </div>
        </section>

        {/* ABOUT / PHILOSOPHY SECTION - Editorial Grid Arrangement */}
        <section className="mx-auto max-w-7xl px-10 py-40 border-t border-white/10">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Big Quote Style */}
            <div className="md:col-span-5 space-y-8">
              <p className="text-[11px] uppercase tracking-[0.6em] text-[#D4AF37] font-bold">The Philosophy</p>
              <h3 className="text-4xl md:text-5xl font-serif italic text-white leading-tight">
                Every frame is <br/>
                <span className="text-[#D4AF37]">a piece of art</span> <br/>
                perfectly finished.
              </h3>
            </div>

            {/* Right side: Clean Detailed Text */}
            <div className="md:col-span-6 md:col-start-8 space-y-12">
              <div className="text-white/50 text-[12px] md:text-[14px] tracking-[0.15em] leading-[2.2] uppercase font-light">
                <p>
                  Based in the heart of Lagos, TOPXCM is a luxury boutique house specializing in high-end visuals, cinematic weddings, and premium portraiture. 
                </p>
                <p className="mt-6">
                  We don't just take photos; we orchestrate light and emotion to preserve the fleeting moments of life with unparalleled elegance.
                </p>
              </div>

              {/* Contact Block Arrangement */}
              <div className="pt-12 border-t border-white/10 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase">Inquiries</p>
                  <p className="text-white font-serif italic text-xl tracking-wide">+234 806 158 7993</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase">Social</p>
                  <p className="text-white font-serif italic text-xl tracking-wide">@topstudios1</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-24 border-t border-white/5 text-center bg-zinc-950/50">
          <div className="flex flex-col items-center gap-6">
            <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
            <p className="text-[9px] tracking-[1.2em] text-white/20 uppercase font-medium">
              © 2024 TOPXCM Studio • Cinematic Excellence
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}