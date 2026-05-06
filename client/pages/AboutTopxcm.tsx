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
        background: "linear-gradient(160deg, #B0D4E8 0%, #D6EAF4 30%, #EAF4FB 60%, #B8D8E8 100%)",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Fainted Overlay Text Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 flex select-none items-center justify-between px-10">
        <h1 className="text-[20vw] font-black text-[#1a5276]/8 leading-none transform -rotate-12 uppercase">TOP</h1>
        <h1 className="text-[20vw] font-black text-[#1a5276]/10 leading-none transform -rotate-12 uppercase">XCM</h1>
      </div>

      <div className="relative z-10">
        {/* Header / Sub-nav */}
        <div className="pt-[60px] border-b border-[#1a5276]/10 px-6 md:px-16 py-5 flex items-center justify-between bg-white/30 backdrop-blur-md">
          <button
            onClick={() => navigate("/", { state: { openMenu: true } })}
            className="text-[#1a5276] text-lg hover:scale-110 transition-transform"
          >←</button>
          <div className="flex flex-col items-center">
            <p className="text-[#1a5276] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">About</p>
            <span className="text-[#1a5276]/50 text-[8px] tracking-[0.3em] uppercase">TOPXCM</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Hero strip */}
        <div className={`border-b border-[#1a5276]/10 px-6 md:px-16 py-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-[#1a5276] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Our Story</p>
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#1a3a4a] drop-shadow-md"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
          >
            TOPXCM
          </h1>
        </div>

        <main className="px-6 md:px-16 py-14 max-w-3xl mx-auto space-y-14">

          {/* FIRST PHOTO */}
          <div className={`flex justify-start transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="w-full max-w-md rounded-3xl overflow-hidden border border-[#1a5276]/15 bg-white/20 backdrop-blur-sm relative group shadow-xl">
  <img 
    src="/images/Paul.jpg" 
    alt="TOPXCM" 
    className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
  />
</div>
          </div>

          {/* WHO WE ARE BOX */}
          <div className={`space-y-6 p-8 rounded-3xl bg-white/35 backdrop-blur-md border border-[#1a5276]/15 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="text-[#D4AF37] text-[12px] uppercase tracking-[0.6em] font-bold">Who We Are</p>
            <p className="text-[#1a3a4a] text-sm font-medium leading-relaxed">
              <span className="text-base font-bold">Dolapo & Asuqwo</span> are a dynamic couple driven by creativity, vision, and a shared passion for building meaningful experiences through art and enterprise. Together, they have established a brand that blends storytelling, style, and structure turning ideas into timeless expressions.
            </p>
            <p className="text-[#1a3a4a]/85 text-sm leading-relaxed">
              <span className="text-base font-bold">TOPXCM</span> is a Lagos-based creative empire that seamlessly blends professional photography and videography, bespoke and casual fashion, and trusted real estate solutions, tailored to individuals, brands, and businesses.
            </p>
            <p className="text-[#1a3a4a]/85 text-sm leading-relaxed">
              Dolapo leads photography—capturing timeless moments with creativity and precision, while Asuqwo oversees fashion and real estate, delivering style and smart property opportunities.
            </p>
            <p className="text-[#1a3a4a]/85 text-sm leading-relaxed">
              TOPXCM is where creativity meets lifestyle.
            </p>
            <p className="text-[#1a3a4a]/85 text-sm leading-relaxed">
              Welcome to our world. Let's serve you!
            </p>
          </div>

          {/* SECOND PHOTO */}
          <div className={`flex justify-center transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-[#1a5276]/15 bg-white/20 backdrop-blur-sm relative group shadow-xl">
              <img src="/images/IMG-20260503-WA0009.jpg" alt="TOPXCM team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Pillars */}
<div className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-[400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
  {[
    { label: "Fashion", sub: "Bespoke tailoring", color: "#00AEEF" },
    { label: "Photography", sub: "Cinematic imagery", color: "#D4AF37" },
    { label: "Real Estate", sub: "Premium properties", color: "#00AEEF" },
  ].map((pillar) => (
    <div 
      key={pillar.label} 
      className="rounded-2xl border bg-white/30 backdrop-blur-xl p-4 flex flex-col gap-2"
      style={{ borderColor: `${pillar.color}26` }} // "26" at the end adds 15% opacity to the hex color
    >
      <p 
        className="text-[9.5px] uppercase tracking-[0.4em] font-bold" 
        style={{ color: pillar.color }}
      >
        {pillar.label}
      </p>
      <p className="text-[#1a3a4a]/70 text-[10px] leading-tight">
        {pillar.sub}
      </p>
    </div>
  ))}
</div>
        </main>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-[#1a5276]/10 mt-8 bg-white/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-[1px] bg-gradient-to-b from-[#1a5276] to-transparent" />
            <p className="text-[8px] tracking-[1em] text-[#1a5276]/50 uppercase">© 2026 TOPXCM • All Right Reserve</p>
          </div>
        </footer>
      </div>
    </div>
  );
}