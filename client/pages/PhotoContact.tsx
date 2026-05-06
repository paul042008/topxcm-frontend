import { useState } from "react";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

const WA1 = "https://wa.me/2348132799299";
const WA2 = "https://wa.me/2348061587993";

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

        {/* About Us */}
<div>
  <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-6">About Us</p>

  {/* First Image (Up) */}
  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-6">
    <img
      src="/images/about1 (2).jpg"
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

  {/* Second Image (Down) */}
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

        {/* Phone Numbers */}
        <div>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Phone / WhatsApp</p>
          <div className="flex flex-col gap-4">
            <a
              href={WA1} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <div>
                <p className="text-white font-bold text-xl tracking-wide">+234 813 279 9299</p>
                <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Tap to WhatsApp</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#D4AF37" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
            <a
              href={WA2} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <div>
                <p className="text-white font-bold text-xl tracking-wide">+234 806 158 7993</p>
                <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Tap to WhatsApp</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#D4AF37" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Email</p>
          <a
            href="mailto:YOUR_EMAIL_HERE"
            className="group flex items-center justify-between px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
          >
            <div>
              <p className="text-white font-serif text-xl tracking-wide">YOUR_EMAIL_HERE</p>
              <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Tap to email us</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>

        {/* Social */}
        <div>
          <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold mb-8">Social Media</p>
          <div className="flex flex-col gap-4">
            <a href="https://www.facebook.com/share/1KToiX8cS4/" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#D4AF37"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <p className="text-white font-bold text-lg">Facebook</p>
            </a>
            <a href="https://www.instagram.com/topweddings1?igsh=MW11dTE5OWw5c3l1MA==" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#D4AF37" stroke="none"/></svg>
              </div>
              <p className="text-white font-bold text-lg">Instagram</p>
            </a>
            <a href="YOUR_TWITTER_LINK_HERE" target="_blank" rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#D4AF37"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </div>
              <p className="text-white font-bold text-lg">Twitter / X</p>
            </a>
          </div>
        </div>
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