import { useState } from "react";
import FashionMenu from "../components/FashionMenu";

const WA1 = "https://wa.me/2348132799299";
const WA2 = "https://wa.me/2348061587993";

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

          {/* Two images — matching PhotoContact style */}
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

        {/* Phone Numbers */}
        <div>
          <p className="text-[#00AEEF] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Phone / WhatsApp</p>
          <div className="flex flex-col gap-4">
            <a
              href={WA1} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300"
              style={{ borderColor: "rgba(0,174,239,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
            >
              <div>
                <p className="font-serif text-xl tracking-wide" style={{ color: "#00AEEF" }}>+234 813 279 9299</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Tap to WhatsApp</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#00AEEF" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
            <a
              href={WA2} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300"
              style={{ borderColor: "rgba(0,174,239,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
            >
              <div>
                <p className="font-serif text-xl tracking-wide" style={{ color: "#00AEEF" }}>+234 806 158 7993</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Tap to WhatsApp</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#00AEEF" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-[#00AEEF] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Email</p>
          <a
            href="mailto:YOUR_EMAIL_HERE"
            className="group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300"
            style={{ borderColor: "rgba(0,174,239,0.15)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
          >
            <div>
              <p className="font-serif text-xl tracking-wide" style={{ color: "#00AEEF" }}>YOUR_EMAIL_HERE</p>
              <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Tap to email us</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="1.5" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>

        {/* Social */}
        <div>
          <p className="text-[#00AEEF] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Social Media</p>
          <div className="flex flex-col gap-4">
            <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-300"
              style={{ borderColor: "rgba(0,174,239,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,174,239,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <p className="font-serif text-lg" style={{ color: "#00AEEF" }}>Facebook</p>
            </a>
            <a href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-300"
              style={{ borderColor: "rgba(0,174,239,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,174,239,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#00AEEF" stroke="none"/></svg>
              </div>
              <p className="font-serif text-lg" style={{ color: "#00AEEF" }}>Instagram</p>
            </a>
            <a href="YOUR_TWITTER_LINK_HERE" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-300"
              style={{ borderColor: "rgba(0,174,239,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.45)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,174,239,0.15)"}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,174,239,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#00AEEF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L2.25 2.25h6.918l4.265 5.638 4.811-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
              </div>
              <p className="font-serif text-lg" style={{ color: "#00AEEF" }}>Twitter / X</p>
            </a>
          </div>
        </div>
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