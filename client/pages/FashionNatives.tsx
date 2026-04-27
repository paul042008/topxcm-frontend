import { useState, useEffect } from "react";
import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";
import { X } from "lucide-react";

export default function FashionNatives() {
  const { data, loading } = useData();
  const [displayedText, setDisplayedText] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fullText = "The XCM Tailoring & Bespoke Collection";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingState />;

  const items = data.filter((item) => item.category === "natives");

  return (
    <div className="bg-[#E0F2F7] text-slate-800 h-screen w-screen relative overflow-hidden flex flex-col">
      
      {/* Background Radiation Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full mix-blend-screen opacity-40"
             style={{
               background: "radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)",
               animation: "pulse-glow 4s infinite alternate ease-in-out"
             }} />
      </div>

      <header className="relative flex items-center justify-between p-6 z-50 shrink-0">
        <BackButton />
        <h1 className="text-[#1E3A8A] font-sans text-[15px] font-bold tracking-[0.3em] uppercase">
          Natives Collection
        </h1>
        <FashionMenu />
      </header>

      {/* HERO TEXT */}
      <div className="relative z-15 text-center pt-4 shrink-0">
        <p className="text-xs text-[#1E3A8A] italic font-serif">The Art of Elegance</p>
        <div className="min-h-[25px] mt-2">
          <p className="text-[15px] text-[#1E3A8A] font-bold uppercase tracking-[0.2em]">
            {displayedText}<span className="animate-pulse ml-1 text-[#D4AF37]">|</span>
          </p>
        </div>
      </div>

      {/* SLIDER */}
      <div className="flex-grow relative z-10">
        <div className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-screen h-full snap-center flex flex-col items-center justify-center p-6">
              
              {/* CLICKABLE IMAGE CARD */}
              <div 
                onClick={() => setSelectedItem(item)}
                className="w-full max-w-[300px] sm:max-w-[340px] aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-[#1E3A8A]/30 transition-transform duration-500 scale-95 active:scale-90 cursor-pointer"
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              <div className="mt-6 flex flex-col items-center text-center w-full px-6">
                <h3 className="text-lg font-sans font-black uppercase tracking-[0.2em] text-[#1E3A8A]">{item.title}</h3>
                <p className="mt-2 text-[11px] text-slate-600 uppercase tracking-widest max-w-[280px]">{item.description}</p>
                <p className="text-[#D4AF37] font-bold mt-3 text-base">{item.price || "Price on Request"}</p>
                
                {/* ORDER NOW ON SLIDER (Always Visible) */}
                <a
                  href={`https://wa.me/2348061587993?text=Hello, I want to order this piece: ${item.title}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block bg-[#1E3A8A] text-white px-10 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
                >
                  Order Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE POPUP MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-[400px] bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 z-50 bg-white/80 backdrop-blur-md p-2 rounded-full text-[#1E3A8A]"
            >
              <X size={24} />
            </button>
            
            <img src={selectedItem.image} className="w-full aspect-[4/5] object-cover" alt="Selected" />
            
            <div className="p-8 text-center">
              <h2 className="text-xl font-black uppercase tracking-tighter text-[#1E3A8A]">{selectedItem.title}</h2>
              <p className="text-[#D4AF37] font-bold text-lg mt-1">{selectedItem.price || "Price on Request"}</p>
              
              {/* ORDER NOW ON POPUP */}
              <a
                href={`https://wa.me/2348061587993?text=Hello, I am interested in: ${selectedItem.title}`}
                target="_blank" rel="noreferrer"
                className="mt-6 inline-block w-full bg-[#1E3A8A] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes pulse-glow { 0% { transform: scale(0.95); opacity: 0.3; } 100% { transform: scale(1.1); opacity: 0.6; } }
      `}</style>
    </div>
  );
}