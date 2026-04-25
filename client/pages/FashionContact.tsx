import FashionMenu from "../components/FashionMenu";

export default function FashionContact() {
  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex justify-between p-5 border-b border-white/10">
        <h1 className="text-[#D4AF37] font-serif">Contact</h1>
        <FashionMenu />
      </header>

      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <h2 className="text-3xl font-serif">About Us</h2>

        <p className="mt-6 text-white/70 leading-7">
          We are a premium fashion brand focused on delivering high-quality
          traditional and modern outfits. Every piece is crafted with attention
          to detail, elegance, and comfort.
        </p>

        <div className="mt-10 space-y-3 text-white/80">
          <p>Instagram: @topstudios1</p>
          <p>Phone: +2348061587993</p>
          <p>
            Location: Behind Block 68, 34 Road, Gowon Estate, Lagos
          </p>
        </div>

        <a
          href="https://wa.me/2348061587993"
          target="_blank"
          className="mt-8 inline-block bg-[#D4AF37] text-black px-6 py-3 rounded-full"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

