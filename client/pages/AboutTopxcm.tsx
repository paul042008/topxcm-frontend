import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutTopxcm() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div 
      className="min-h-screen relative text-white overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #D4AF37 0%, #000000 50%, #B0E0E6 50%, #FFFFFF 100%)",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Fainted Overlay Text Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 flex select-none items-center justify-between px-10">
        <h1 className="text-[20vw] font-black text-black/5 leading-none transform -rotate-12 uppercase">TOP</h1>
        <h1 className="text-[20vw] font-black text-white/10 leading-none transform -rotate-12 uppercase">XCM</h1>
      </div>

      <div className="relative z-10">
        {/* Header / Sub-nav */}
        <div className="pt-[60px] border-b border-white/5 px-6 md:px-16 py-5 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <button
            onClick={() => navigate("/", { state: { openMenu: true } })}
            className="text-[#D4AF37] text-lg hover:scale-110 transition-transform"
          >←</button>
          <div className="flex flex-col items-center">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">About</p>
            <span className="text-white/40 text-[8px] tracking-[0.3em] uppercase">TOPXCM</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Hero strip */}
        <div className={`border-b border-white/5 px-6 md:px-16 py-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Our Story</p>
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
          >
            TOPXCM
          </h1>
        </div>

        <main className="px-6 md:px-16 py-14 max-w-3xl mx-auto space-y-14">

          {/* FIRST PHOTO: Moved to the left (justify-start) */}
          <div className={`flex justify-start transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm relative group shadow-2xl">
              <img src="/images/file_00000000b78c71f4ad52e4c096e12283.png" alt="TOPXCM" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* WHO WE ARE BOX */}
          <div className={`space-y-6 p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/5 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">Who We Are</p>
            <p className="text-white text-sm font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              Dolapo & Asuqwo are a dynamic couple driven by creativity, vision, and a shared passion for building meaningful experiences through art and enterprise. Together, they have established a brand that blends storytelling, style, and structure—turning ideas into timeless expressions.
            </p>
            <p className="text-white/95 text-sm leading-relaxed drop-shadow-[0_2px_8_rgba(0,0,0,1)]">
              TOPXCM, a Lagos-based brand blending professional photography and videography, bespoke and casual fashion, and trusted real estate solutions.
            </p>
            <p className="text-white/95 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              Dolapo leads photography—capturing timeless moments with creativity and precision—while Asuqwo oversees fashion and real estate, delivering style and smart property opportunities.
            </p>
          </div>

          {/* SECOND PHOTO: Matching portrait style, kept in center for balance */}
          <div className={`flex justify-center transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm relative group shadow-2xl">
              <img src="/images/IMG-20260503-WA0009.jpg" alt="TOPXCM team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Pillars */}
          <div className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-[400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {[
              { label: "Fashion", sub: "Bespoke tailoring" },
              { label: "Photography", sub: "Cinematic imagery" },
              { label: "Real Estate", sub: "Premium properties" },
            ].map((pillar) => (
              <div key={pillar.label} className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 flex flex-col gap-2">
                <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.4em] font-bold">{pillar.label}</p>
                <p className="text-white/70 text-[10px] leading-tight drop-shadow-md">{pillar.sub}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-white/10 mt-8 bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
            <p className="text-[8px] tracking-[1em] text-white/30 uppercase">© 2026 TOPXCM • Lagos, Nigeria</p>
          </div>
        </footer>
      </div>
    </div>
  );
}