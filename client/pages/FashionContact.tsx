import { useState } from "react";
import FashionMenu from "../components/FashionMenu";

// Only one WhatsApp number now
const WA = "https://wa.me/2348061587993";

export default function FashionContact() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#00AEEF]/10 bg-white/90 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#00AEEF] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">Contact Us</p>
          <span className="text-slate-400 text-[8px] tracking-[0.3em] uppercase">XCM Wardrobes</span>
        </div>
        <FashionMenu
          isFashionLanding={false}
          onOpenAction={() => setMenuOpen(true)}
          onCloseAction={() => setMenuOpen(false)}
        />
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-[#00AEEF]/10 px-6 md:px-16 py-10">
          <p className="text-[#00AEEF] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: "#00AEEF", fontFamily: "Impact, 'Arial Black', sans-serif" }}>
            Contact
          </h1>
        </div>
      </div>

      <main className="px-6 md:px-16 py-16 max-w-3xl mx-auto space-y-16">

        {/* About Us */}
        <div>
          <p className="text-[#00AEEF] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">About Us</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            XCM Wardrobes isn't just a fashion house — it's a statement of identity.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            We believe every stitch tells a story of confidence, culture, and character. From bespoke suits to traditional Agbada and modern casuals, we spice up your style with precision and passion.
          </p>

          {/* Two images */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#00AEEF]/15 bg-[#00AEEF]/5">
              <img
                src="/images/1777805031168~2.png"
                alt="XCM Wardrobes"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#00AEEF]/15 bg-[#00AEEF]/5">
              <img
                src="/images/fashion-about2.jpg"
                alt="XCM Wardrobes studio"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div
          className="flex items-start gap-4 px-6 py-5 rounded-2xl"
          style={{ border: "1px solid rgba(0,174,239,0.15)", backgroundColor: "rgba(0,174,239,0.03)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ border: "1px solid rgba(0,174,239,0.3)", backgroundColor: "rgba(0,174,239,0.07)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-1" style={{ color: "#00AEEF" }}>Location</p>
            <p className="text-slate-600 text-sm leading-relaxed">Behind Block 68, 34 Road, Gowon Estate, Lagos</p>
          </div>
        </div>

        {/* ─── UNIFIED CONTACT BOX ─── (updated with new handles) */}
        <div
          className="mt-8 rounded-2xl p-6 space-y-6"
          style={{ border: "1px solid rgba(0,174,239,0.15)", backgroundColor: "rgba(0,174,239,0.03)" }}
        >
          {/* Inquiries — only one phone now */}
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ border: "1px solid rgba(0,174,239,0.3)", backgroundColor: "rgba(0,174,239,0.07)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#00AEEF" }}>Inquiries</p>
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="font-serif italic text-base tracking-wide transition-colors hover:opacity-70"
                style={{ color: "#00AEEF" }}
              >
                +234 806 158 7993
              </a>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "rgba(0,174,239,0.1)" }} />

          {/* Connect With Us — updated with new handles */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#00AEEF" }}>Connect With Us</p>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Facebook — unchanged */}
              <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Facebook</span>
              </a>

              {/* Instagram — updated */}
              <a href="https://www.instagram.com/xcmwardrobes?igsh=NHJscDd1dTdodmFo" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#00AEEF" stroke="none"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Instagram</span>
              </a>

              {/* Twitter / X — updated */}
              <a href="https://x.com/XCMwardrobes" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Twitter / X</span>
              </a>

              {/* Email — updated */}
              <a href="mailto:xcmwardrobes@gmail.com"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(0,174,239,0.25)", backgroundColor: "rgba(0,174,239,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,174,239,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#00AEEF] transition-colors">Email</span>
              </a>
            </div>
          </div>
        </div>
        {/* ─── END UNIFIED BOX ─── */}

      </main>

      <footer className="py-20 text-center border-t mt-16" style={{ borderColor: "rgba(0,174,239,0.1)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px]" style={{ background: "linear-gradient(to bottom, #00AEEF, transparent)" }} />
          <p className="text-[8px] tracking-[1em] uppercase" style={{ color: "rgba(0,174,239,0.3)" }}>© 2026 XCM • All Right Reserve</p>
        </div>
      </footer>
    </div>
  );
}