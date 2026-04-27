import FashionMenu from "../components/FashionMenu";

export default function FashionContact() {
  return (
    <div className="bg-[#F8FBFF] text-slate-800 min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#E0F2F7] to-[#B0E0E6]/10 pointer-events-none"></div>

      <header className="relative flex justify-between items-center p-5 border-b border-blue-100 backdrop-blur-sm">
        <h1 className="text-[#1E3A8A] font-serif font-bold tracking-widest uppercase">Contact</h1>
        <FashionMenu />
      </header>

      <div className="relative max-w-3xl mx-auto px-5 py-20 text-center">
        <h2 className="text-4xl font-serif text-slate-900 mb-8">About Us</h2>

        <p className="text-slate-600 leading-relaxed text-lg mb-12">
          We are a premium fashion brand focused on delivering high-quality
          traditional and modern outfits. Every piece is crafted with attention
          to detail, elegance, and comfort.
        </p>

        <div className="space-y-6 text-slate-700">
          <div className="flex flex-col items-center">
            <span className="text-[#1E3A8A] font-bold text-sm tracking-widest uppercase mb-1">Instagram</span>
            <p className="text-xl">@topstudios1</p>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-[#1E3A8A] font-bold text-sm tracking-widest uppercase mb-1">Phone</span>
            <p className="text-xl">+2348061587993</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#1E3A8A] font-bold text-sm tracking-widest uppercase mb-1">Location</span>
            <p className="text-lg max-w-xs">Behind Block 68, 34 Road, Gowon Estate, Lagos</p>
          </div>
        </div>

        <a
          href="https://wa.me/2348061587993"
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-block bg-[#1E3A8A] text-white px-10 py-4 rounded-full font-bold hover:bg-[#3B82F6] transition-all transform hover:scale-105 shadow-xl shadow-blue-900/10"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}