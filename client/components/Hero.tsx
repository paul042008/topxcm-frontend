import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapLockRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAdminTap = () => {
    if (tapLockRef.current) return;
    const now = Date.now();
    const diff = now - lastTapRef.current;

    if (diff > 0 && diff < 350) {
      tapLockRef.current = true;
      navigate("/admin");
      lastTapRef.current = 0;
      window.setTimeout(() => {
        tapLockRef.current = false;
      }, 500);
      return;
    }
    lastTapRef.current = now;
  };

  // Common button styles for "Invisible until interaction"
  const ghostButtonBase = `
    absolute bg-transparent text-white/20 border-2 border-transparent 
    transition-all duration-1000 ease-in-out px-10 py-4
    hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]
    active:scale-95 active:border-[#D4AF37] active:text-[#D4AF37]
  `;

  return (
    <section className="relative h-screen bg-black overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
            animation: "subtle-shift 15s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-12 text-center">
        
        {/* Heading */}
        <h1
          className={`text-6xl md:text-8xl font-serif font-bold text-white mb-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          TOPXCM
        </h1>

        {/* Calligraphic Empire Text */}
        <p
          className={`text-xl md:text-3xl text-[#D4AF37] mb-20 italic font-serif transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}
        >
          A fashion, photography, and real estate empire
        </p>

        {/* BUTTON AREA */}
        <div className="relative w-full max-w-3xl h-40 md:h-48 mt-10">
          {/* LEFT - Photography */}
          <button
            onClick={() => navigate("/photography")}
            className={`${ghostButtonBase} left-0 top-0 transform ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
            }`}
          >
            Photography
          </button>

          {/* RIGHT - Fashion */}
          <button
            onClick={() => navigate("/fashion")}
            className={`${ghostButtonBase} right-0 top-0 transform ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
            }`}
          >
            Fashion
          </button>

          {/* BOTTOM CENTER - Real Estate */}
          <button
            onClick={() => navigate("/real-estate")}
            className={`${ghostButtonBase} left-1/2 top-24 -translate-x-1/2 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            Real Estate
          </button>
        </div>
      </div>

      {/* ADMIN ACCESS ZONE */}
      <button
        type="button"
        onClick={handleAdminTap}
        className="fixed bottom-0 right-0 z-50 h-28 w-28 cursor-pointer bg-transparent opacity-0"
      />

      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500&display=swap');

        @keyframes subtle-shift {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(1.05); }
        }
      `}</style>
    </section>
  );
}