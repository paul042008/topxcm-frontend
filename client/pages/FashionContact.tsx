import FashionMenu from "../components/FashionMenu";

export default function FashionContact() {
  return (
    <div className="bg-[#F8FBFF] text-slate-800 min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#E0F2F7] to-[#B0E0E6]/10 pointer-events-none"></div>

      <header className="relative flex justify-between p-5 border-b border-blue-100 backdrop-blur-sm">
        <h1 className="text-[#1E3A8A] font-serif font-bold tracking-widest">CONTACT</h1>
        <FashionMenu />
      </header>

      <div className="relative max-w-3xl mx-auto px-5 py-16 text-center">
        <h2 className="text-3xl font-serif text-slate-900">About Us</h2>

        <p className="mt-6 text-slate-600 leading-7">
          We are a premium fashion brand focused on delivering high-quality
          traditional and modern outfits. Every piece is crafted with attention
          to detail, elegance, and comfort.
        </p>

        <div className="mt-10 space-y-3 text-slate-700 font-medium">
          <p className="flex items-center justify-center gap-2">
            <span className="text-[#1E3A8A]">Instagram:</span> @topstudios1
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-[#1E3A8A]">Phone:</span> +2348061587993
          </p>
          <p className="max-w-xs mx-auto">
            <span className="text-[#1E3A8A]">Location:</span> Behind Block 68, 34 Road, Gowon Estate, Lagos
          </p>
        </div>

        <a
          href="https://wa.me/2348061587993"
          target="_blank"
          className="mt-8 inline-block bg-[#1E3A8A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#3B82F6] transition-colors shadow-lg shadow-blue-900/10"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}