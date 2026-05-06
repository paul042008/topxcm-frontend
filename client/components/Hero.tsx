import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Hero() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSlogan, setShowSlogan] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const navigate = useNavigate();
  const sloganText = "A Fashion - Photography\n& Real Estate Empire";

  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) navigate("/admin");
    lastTap = now;
  };

  useEffect(() => {
    setTimeout(() => setShowWelcome(true), 300);
    setTimeout(() => setShowTitle(true), 1000);
    setTimeout(() => setShowSlogan(true), 1800);
    setTimeout(() => setShowButtons(true), 2500);
  }, []);

  useEffect(() => {
    if (showSlogan) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(sloganText.slice(0, i + 1));
        i++;
        if (i === sloganText.length) clearInterval(interval);
      }, 50); 
      return () => clearInterval(interval);
    }
  }, [showSlogan]);

  return (
    <section 
      className="fixed inset-0 h-[100dvh] w-full bg-black overflow-hidden select-none flex flex-col items-center justify-between"
      onDoubleClick={() => navigate("/admin")} 
      onTouchEnd={handleDoubleTap}              
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10" />

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center px-6 text-center mt-32 z-10 pointer-events-none">
        
        {/* CHANGED: Text updated, smaller, and forced to one line */}
        <p className={`pointer-events-auto text-sm md:text-lg text-[#D4AF37] italic font-serif whitespace-nowrap transition-all duration-700 ${showWelcome ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}>
          Welcome to the official website of...
        </p>

        {/* UNTOUCHED: Kept exactly as you requested */}
        <h1 className={`pointer-events-auto text-4xl md:text-6xl font-sans font-black tracking-[0.2em] text-white mt-3 mb-3 transition-all duration-700 ${showTitle ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          TOPXCM
        </h1>

        {/* CHANGED: Container widened, text made smaller and forced to one line */}
        <div className="pointer-events-auto w-full max-w-2xl min-h-[60px] flex items-center justify-center">
          <p className="text-[10px] md:text-sm text-white/70 uppercase tracking-[0.25em] font-sans leading-relaxed whitespace-pre-line text-center">
            {displayedText}<span className="animate-pulse ml-1 text-[#D4AF37]">|</span>
          </p>
        </div>
      </div>

      {/* Navigation with Passing Light Effect */}
      <div className={`relative z-10 w-full max-w-5xl px-6 pb-24 transition-opacity duration-1000 ${showButtons ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-col gap-8">
          
          <div className="flex justify-between items-center px-2 md:px-10 gap-2">
            {/* Photography Box */}
            <Link to="/photography" className="group relative overflow-hidden flex items-center justify-center px-4 py-3 md:px-8 border border-white/10 rounded-full animate-[slideInLeft_1s_ease-out_2s_both] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:duration-500 animate-[sweep_4s_infinite] pointer-events-none" />
              <span className="relative z-10 text-[#D4AF37] text-[9px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase group-hover:text-white transition-colors">
                &larr; Photography
              </span>
            </Link>

            {/* Fashion Box */}
            <Link to="/fashion" className="group relative overflow-hidden flex items-center justify-center px-4 py-3 md:px-8 border border-white/10 rounded-full animate-[slideInRight_1s_ease-out_2s_both] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[sweep_4s_infinite_1s] pointer-events-none" />
              <span className="relative z-10 text-[#3b82f6] text-[9px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase group-hover:text-white transition-colors">
                Fashion &rarr;
              </span>
            </Link>
          </div>

          {/* Real Estate Box */}
          <div className="flex justify-center">
            <Link to="/real-estate" className="group relative overflow-hidden flex items-center justify-center px-6 py-3 md:px-10 border border-white/10 rounded-full animate-[slideInUp_1s_ease-out_2.3s_both] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[sweep_4s_infinite_2s] pointer-events-none" />
              <span className="relative z-10 text-[#3b82f6] text-[10px] md:text-[12px] font-bold tracking-[0.4em] uppercase group-hover:text-white transition-colors">
                Real Estate
              </span>
            </Link>
          </div>
          <p className="absolute bottom-6 left-0 right-0 text-center text-[8px] tracking-[0.8em] text-white/15 uppercase z-10">
  © 2026 TOPXCM • All Right Reserve
</p>

        </div>
      </div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          20% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }

        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        html, body { overflow: hidden; height: 100%; position: fixed; width: 100%; }
      `}</style>
    </section>
  );
}