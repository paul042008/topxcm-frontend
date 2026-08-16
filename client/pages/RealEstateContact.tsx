import { useState } from "react";
import RealEstateMenu from "../components/RealEstateMenu";

const WA = "https://wa.me/2348061587993";

export default function RealEstateContact() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <RealEstateMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenAction={() => setMenuOpen(true)}
      />

      <div
        className="transition-all duration-500"
        style={{
          opacity: menuOpen ? 0.18 : 1,
          filter: menuOpen ? "blur(2px)" : "none",
          pointerEvents: menuOpen ? "none" : "auto",
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(176,212,232,0.12),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(176,212,232,0.08),transparent_22%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95" />
        </div>

        <header className="relative z-10 flex items-center justify-between border-b border-[#B0D4E8]/10 bg-black/80 px-6 md:px-10 py-5 backdrop-blur-md">
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">
              XCM Homes &amp; Properties
            </p>
            <span className="text-[#B0D4E8]/40 text-[8px] tracking-[0.3em] uppercase">
              Construction &amp; Real Estate
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] group"
            aria-label="Open menu"
          >
            <span className="block h-[1.5px] w-7 bg-[#B0D4E8] transition-all group-hover:w-8" />
            <span className="ml-auto block h-[1.5px] w-5 bg-[#B0D4E8] transition-all group-hover:w-8" />
            <span className="block h-[1.5px] w-7 bg-[#B0D4E8] transition-all group-hover:w-8" />
          </button>
        </header>

        <div className="relative z-10 pt-[72px]">
          <div className="border-b border-[#B0D4E8]/10 px-6 md:px-16 py-10">
            <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Get In Touch</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: "#B0D4E8", fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Contact
            </h1>
          </div>
        </div>

        <main className="relative z-10 px-6 md:px-16 py-16 max-w-3xl mx-auto space-y-16">
          {/* ─── ABOUT US (UPDATED – Construction & Real Estate focus) ─── */}
          <div>
            <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">About Us</p>
            
            <div className="space-y-6 text-white/70 text-sm leading-relaxed">
              <p>
                XCM Homes &amp; Properties is a full‑service construction, management, and real estate firm based in Lagos.
                We don’t just sell properties — we build them, manage them, and help you find the perfect space to live, work, and invest.
              </p>
              <p>
                Our expertise spans every stage of the property lifecycle. From groundbreaking to handover, we oversee 
                construction projects with precision, integrity, and a commitment to quality. We also offer comprehensive 
                property management services, ensuring your assets are well‑maintained and profitable.
              </p>
              <p>
                Whether you’re looking to buy land, build a home, invest in commercial real estate, or need a reliable 
                partner to manage your properties, we bring decades of experience and a network of trusted professionals 
                to every project.
              </p>
              <p>
                At XCM, we believe that real estate is more than transactions — it’s about building futures, creating 
                communities, and delivering lasting value. Our portfolio includes residential developments, commercial 
                spaces, and luxury homes across Lagos’s most desirable neighbourhoods.
              </p>
              <p>
                We take pride in our transparent approach, our deep understanding of the local market, and our ability 
                to turn ambitious visions into reality. From foundation to finish, we are with you every step of the way.
              </p>
              <div className="bg-[#B0D4E8]/5 border border-[#B0D4E8]/10 rounded-2xl p-6 my-6">
                <p className="text-[#B0D4E8] text-xs uppercase tracking-[0.5em] font-bold mb-2">Our Philosophy</p>
                <p className="text-white/90 text-sm font-light italic">“We build more than structures – we build trust.”</p>
              </div>
              <p>
                Whether you need a custom‑built home, a turnkey property management solution, or a prime piece of land 
                for development, XCM Homes &amp; Properties is your trusted partner. Let us help you build, own, and grow.
              </p>
              <p className="text-white/80 text-base font-serif italic">
                This is XCM — where quality meets commitment, and every project tells a story of excellence.
              </p>
              <p className="text-[#B0D4E8] text-sm font-light tracking-wider">
                Build with us. Grow with us. XCM.
              </p>
            </div>

            {/* ─── ONE CENTERED IMAGE ─────────── */}
            <div className="flex justify-center mt-8">
              <div className="aspect-[3/4] max-w-sm w-full rounded-2xl overflow-hidden border border-[#B0D4E8]/15 bg-[#B0D4E8]/5">
                <img
                  src="/images/realabout.jpg"
                  alt="XCM Real Estate"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* ─── LOCATION ───────────────────────────────────────────── */}
          <div
            className="flex items-start gap-4 px-6 py-5 rounded-2xl"
            style={{ border: "1px solid rgba(176,212,232,0.15)", backgroundColor: "rgba(176,212,232,0.05)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ border: "1px solid rgba(176,212,232,0.3)", backgroundColor: "rgba(176,212,232,0.07)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-1" style={{ color: "#B0D4E8" }}>Location</p>
              <p className="text-white/60 text-sm leading-relaxed">Lagos, Nigeria</p>
            </div>
          </div>

          {/* ─── UNIFIED CONTACT BOX ───────────────────────────────── */}
          <div
            className="rounded-2xl p-6 space-y-6"
            style={{ border: "1px solid rgba(176,212,232,0.15)", backgroundColor: "rgba(176,212,232,0.05)" }}
          >
            {/* Inquiries */}
            <div className="space-y-3">
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#B0D4E8" }}>
                Inquiries
              </p>

              <a
                href="tel:+2348061587993"
                className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                style={{ border: "1px solid rgba(176,212,232,0.1)", backgroundColor: "rgba(176,212,232,0.03)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.03)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ border: "1px solid rgba(176,212,232,0.25)", backgroundColor: "rgba(176,212,232,0.07)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70 group-hover:text-[#B0D4E8] transition-colors">
                  Call Us
                </span>
              </a>

              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                style={{ border: "1px solid rgba(176,212,232,0.1)", backgroundColor: "rgba(176,212,232,0.03)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.03)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ border: "1px solid rgba(176,212,232,0.25)", backgroundColor: "rgba(176,212,232,0.07)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B0D4E8">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70 group-hover:text-[#B0D4E8] transition-colors">
                  WhatsApp
                </span>
              </a>
            </div>

            <div style={{ height: "1px", backgroundColor: "rgba(176,212,232,0.1)" }} />

            <div>
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#B0D4E8" }}>Connect With Us</p>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="https://www.facebook.com/share/18W5YWxTBN/" target="_blank" rel="noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(176,212,232,0.25)", backgroundColor: "rgba(176,212,232,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.04)"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#B0D4E8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#B0D4E8] transition-colors">Facebook</span>
                </a>
                <a href="https://www.instagram.com/xcm_homesandproperties?igsh=MTkxaWsyc3p6ZGdiMA==" target="_blank" rel="noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(176,212,232,0.25)", backgroundColor: "rgba(176,212,232,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.04)"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#B0D4E8" stroke="none"/>
                  </svg>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#B0D4E8] transition-colors">Instagram</span>
                </a>
                <a href="mailto:xcminternational@gmail.com"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(176,212,232,0.25)", backgroundColor: "rgba(176,212,232,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(176,212,232,0.04)"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#B0D4E8] transition-colors">Email</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 border-t border-[#B0D4E8]/8 bg-black py-14 text-center">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5">
            <div className="h-8 w-px bg-gradient-to-b from-[#B0D4E8]/35 to-transparent" />
            <p className="text-[8px] uppercase tracking-[1em] text-white/20">
              © 2026 XCM Homes &amp; Properties • All Rights Reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}