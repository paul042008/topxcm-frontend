import { useState } from "react";
import RealEstateMenu from "../components/RealEstateMenu";
import { useNavigate } from "react-router-dom";

const WA1 = "https://wa.me/2348132799299";
const WA2 = "https://wa.me/2348061587993";

export default function RealEstateContact() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#B0D4E8]/10 bg-white/90 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#B0D4E8] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">Contact Us</p>
          <span className="text-slate-400 text-[8px] tracking-[0.3em] uppercase">TOPXCM Real Estate</span>
        </div>
        <RealEstateMenu
          isRealEstateLanding={false}
          onOpenAction={() => setMenuOpen(true)}
          onCloseAction={() => setMenuOpen(false)}
        />
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-[#B0D4E8]/10 px-6 md:px-16 py-10">
          <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: "#B0D4E8", fontFamily: "Impact, 'Arial Black', sans-serif" }}>
            Contact
          </h1>
        </div>
      </div>

      <main className="px-6 md:px-16 py-16 max-w-3xl mx-auto space-y-16">

        {/* About Us */}
        <div>
          <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">About Us</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            TOPXCM Real Estate is more than property — it's about placing you in spaces that inspire.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            We curate premium homes, apartments, and investment properties across Lagos, connecting
            you with opportunities that match your lifestyle and ambitions. Let us guide you home.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#B0D4E8]/15 bg-[#B0D4E8]/5">
              <img
                src="/images/1777805031168~2.png"
                alt="TOPXCM Real Estate"
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#B0D4E8]/15 bg-[#B0D4E8]/5">
              <img
                src="/images/fashion-about2.jpg"
                alt="TOPXCM Real Estate properties"
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div
          className="flex items-start gap-4 px-6 py-5 rounded-2xl"
          style={{ border: "1px solid rgba(176,212,232,0.15)", backgroundColor: "rgba(176,212,232,0.03)" }}
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
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-1 text-[#B0D4E8]">Location</p>
            <p className="text-slate-600 text-sm leading-relaxed">Lagos, Nigeria</p>
          </div>
        </div>

        {/* Phone Numbers */}
        <div>
          <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Phone / WhatsApp</p>
          <div className="flex flex-col gap-4">
            {[
              { href: WA1, number: "+234 813 279 9299" },
              { href: WA2, number: "+234 806 158 7993" },
            ].map((w) => (
              <a
                key={w.number}
                href={w.href} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300"
                style={{ borderColor: "rgba(176,212,232,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.5)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.15)"}
              >
                <div>
                  <p className="font-bold text-xl tracking-wide text-[#B0D4E8]">{w.number}</p>
                  <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Tap to WhatsApp</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#B0D4E8" className="opacity-40 group-hover:opacity-100 transition-opacity">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52 -.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5 -.669 -.51 -.173 -.008 -.371 -.01 -.57 -.01 -.198 0 -.52 .074 -.792 .372 -.272 .297 -1.04 1.016 -1.04 2.479 0 1.462 １．０６５ ２．８７５ １．２１３ ３．０７４ .１４９ .１９８ ２．０９６ ３．２ ５．０７７ ４．４８７ .７０９ .３０６ １．２６２ .４８９ １．６９４ .６２５ .７１２ .２２７ １．３６ .１９５ １．８７１ .１１８ .５７１ -.０８５ １．７５８ -.７１９ ２．００６ -１．４１３ .２４８ -.６９４ .２４８ -１．２８９ .１７３ -１．４１３ -.０７４ -.１２４ -.２７２ -.１９８ -.５７ -.３４７z"/>
                  <path d="M₁₂ ₀C₅．₃₇₃ ₀ ₀ ₅．₃₇₃ ₀ ₁₂c₀ ₂．₁₂₆ .₅₅₅ ₄．₁₂₆ ₁．₅₂₄ ₅．₈₆₈L₀．₀₅₇ ₂₃．₅l₅．⁸₀₆ -₁．⁵₂⁴A₁₁．⁹⁵³₁₁．⁹⁵³ ₀ ₀ ₀₁₂²⁴c⁶．⁶²⁷ ₀ ₁² -⁵．³⁷³ ₁² -¹²S₁⁸．⁶²⁷ ₀ ᴛᴡᴏ ᴛᴡᴏz"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Email</p>
          <a
            href="mailto:YOUR_EMAIL_HERE"
            className="group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300"
            style={{ borderColor: "rgba(176,212,232,0.15)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.5)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.15)"}
          >
            <div>
              <p className="font-bold text-xl tracking-wide text-[#B0D4E8]">YOUR_EMAIL_HERE</p>
              <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Tap to email us</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="1.5" className="opacity-40 group-hover:opacity-100 transition-opacity">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </div>

        {/* Social */}
        <div>
          <p className="text-[#B0D4E8] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Social Media</p>
          <div className="flex flex-col gap-4">
            {[
              {
                href: "https://www.facebook.com/share/1KToiX8cS4/",
                label: "Facebook",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#B0D4E8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              },
              {
                href: "https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==",
                label: "Instagram",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B0D4E8" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#B0D4E8" stroke="none"/></svg>,
              },
              {
                href: "YOUR_TWITTER_LINK_HERE",
                label: "Twitter / X",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#B0D4E8"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href} target="_blank" rel="noreferrer"
                className="group flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-300"
                style={{ borderColor: "rgba(176,212,232,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.5)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(176,212,232,0.15)"}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(176,212,232,0.1)" }}>
                  {s.icon}
                </div>
                <p className="font-bold text-lg text-[#B0D4E8]">{s.label}</p>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-20 text-center border-t mt-16" style={{ borderColor: "rgba(176,212,232,0.1)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px]" style={{ background: "linear-gradient(to bottom, #B0D4E8, transparent)" }} />
          <p className="text-[8px] tracking-[1em] uppercase" style={{ color: "rgba(176,212,232,0.3)" }}>
            © 2026 TOPXCM Real Estate • Lagos, Nigeria
          </p>
        </div>
      </footer>
    </div>
  );
}