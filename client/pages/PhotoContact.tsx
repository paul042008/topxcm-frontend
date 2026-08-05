import { useState } from "react";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

// Only one WhatsApp number now
const WA1 = "https://wa.me/2348132799299";

export default function PhotoContact() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <BackButton />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">Contact Us</p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">TOP</span>
        </div>
        <PhotoMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onCloseAction={() => setMenuOpen(false)} />
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-white/5 px-6 md:px-16 py-10">
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
            Contact
          </h1>
        </div>
      </div>

      <main className="px-6 md:px-16 py-16 max-w-3xl mx-auto space-y-16">

        {/* About Us (unchanged) */}
        <div>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">About Us</p>
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-6">
            <img
              src="/images/about1 (3).jpg"
              alt="TOP Photography team"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            Based in the heart of Lagos, <span className="text-base font-bold">TOP</span> is a creative photography brand founded and led by Dolapo, a passionate photographer with a keen eye for detail and storytelling.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            As the owner and creative force behind the brand, Dolapo together with her team brings a unique blend of artistry and professionalism to every project, ensuring each moment is captured with intention and style.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            At TOP, we believe every image should do more than just look beautiful, it should communicate emotion, preserve memories, and reflect authenticity.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            From weddings to portraits down to live coverage and aerial perspectives, our work is driven by a commitment to long lasting memories to always re-live With a client-focused approach, we create cinematic experiences that feel as powerful as the moments themselves.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            For us, Photography is more than just capturing images—it is the art of storytelling.
          </p>
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src="/images/about2 (2).jpg"
              alt="TOP Photography studio"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* ─── UNIFIED CONTACT BOX (updated with Call Us + WhatsApp buttons) ─── */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          {/* Inquiries – now with Call Us and WhatsApp buttons */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: "#D4AF37" }}>
              Inquiries
            </p>

            {/* Call Us button */}
            <a
              href="tel:+2348132799299"
              className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)";
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ border: "1px solid rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.07)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.08 6.08l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-[#D4AF37] transition-colors">
                Call Us
              </span>
            </a>

            {/* WhatsApp button */}
            <a
              href={WA1}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)";
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ border: "1px solid rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.07)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-[#D4AF37] transition-colors">
                WhatsApp
              </span>
            </a>
          </div>

          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />

          {/* Connect With Us – unchanged (already has TOP links) */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase mb-4" style={{ color: "#D4AF37" }}>Connect With Us</p>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#D4AF37] transition-colors">Facebook</span>
              </a>
              <a href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#D4AF37" stroke="none"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#D4AF37] transition-colors">Instagram</span>
              </a>
              <a href="YOUR_TWITTER_LINK_HERE" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#D4AF37] transition-colors">Twitter / X</span>
              </a>
              <a href="mailto:YOUR_EMAIL_HERE"
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(212,175,55,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[#D4AF37] transition-colors">Email</span>
              </a>
            </div>
          </div>
        </div>
        {/* ─── END UNIFIED BOX ─── */}

      </main>

      <footer className="py-20 text-center border-t border-white/5 mt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOP • All Right Reserve</p>
        </div>
      </footer>
    </div>
  );
}