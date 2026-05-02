import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutTopxcm() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Sub-header — sits under the global Header fixed navbar */}
      <div className="pt-[60px] border-b border-white/5 px-6 md:px-16 py-5 flex items-center justify-between bg-black/80 backdrop-blur-xl">
        <button
          onClick={() => navigate("/", { state: { openMenu: true } })}
          className="text-[#D4AF37] text-lg hover:scale-110 transition-transform"
        >←</button>
        <div className="flex flex-col items-center">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">About</p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">TOPXCM</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Hero strip */}
      <div className={`border-b border-white/5 px-6 md:px-16 py-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Our Story</p>
        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none"
          style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
        >
          TOPXCM
        </h1>
      </div>

      <main className="px-6 md:px-16 py-14 max-w-3xl mx-auto space-y-14">

        {/* Two images */}
        <div
          className={`grid grid-cols-2 gap-3 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src="/images/about1.jpg"
              alt="TOPXCM"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(212,175,55,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.3em;">Image</div>`;
                }
              }}
            />
          </div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src="/images/file_00000000b78c71f4ad52e4c096e12283.png"
              alt="TOPXCM team"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(212,175,55,0.2);font-size:11px;text-transform:uppercase;letter-spacing:0.3em;">Image</div>`;
                }
              }}
            />
          </div>
        </div>

        {/* About text */}
        <div className={`space-y-6 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">Who We Are</p>
          <p className="text-white/80 text-sm leading-relaxed">
            Dolapo & Asuqwo are a dynamic couple driven by creativity, vision, and a shared passion for building meaningful experiences through art and enterprise. Together, they have established a brand that blends storytelling, style, and structure—turning ideas into timeless expressions.
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
            TOPXCM, a Lagos-based brand blending professional photography and videography, bespoke and casual fashion, and trusted real estate solutions.
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
           Dolapo leads photography—capturing timeless moments with creativity and precision—while Asuqwo oversees fashion and real estate, delivering style and smart property opportunities.
           </p>
            <p className="text-white/90 text-sm leading-relaxed">
            TOPXCM is where creativity meets lifestyle.
          </p>
           <p className="text-white/90 text-sm leading-relaxed">
           Welcome to our world! 
        Let's serve you.
           </p>
        </div>

        {/* Divider line */}
        <div className={`flex items-center gap-4 transition-all duration-700 delay-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[#D4AF37]/30 text-[9px] uppercase tracking-[0.5em]">TOPXCM</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* Pillars */}
        <div className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-[400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {[
            { label: "Fashion", sub: "Bespoke tailoring for the modern gentleman" },
            { label: "Photography", sub: "Cinematic imagery for life's defining moments" },
            { label: "Real Estate", sub: "Premium properties, expertly showcased" },
          ].map((pillar) => (
            <div key={pillar.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 flex flex-col gap-2">
              <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.4em] font-bold">{pillar.label}</p>
              <p className="text-white/35 text-[11px] leading-relaxed">{pillar.sub}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 mt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOPXCM • Lagos, Nigeria</p>
        </div>
      </footer>
    </div>
  );
}