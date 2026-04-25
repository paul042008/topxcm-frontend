import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
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
        {/* LOGO */}
        <div
          className={`mb-6 inline-flex items-center justify-center rounded-[1.75rem] border border-[#D4AF37]/20 bg-white/5 px-6 py-5 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.10)] transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            animation: logoReady
              ? "logoFloat 6s ease-in-out infinite, logoGlow 3s ease-in-out infinite alternate"
              : "none",
          }}
        >
          <img
            src="/images/logo.jpg"
            alt="TOPXCM Logo"
            onLoad={() => setLogoReady(true)}
            className={`h-20 md:h-28 w-auto object-contain mx-auto transition-all duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${
              logoReady ? "scale-100 opacity-100" : "scale-95 opacity-90"
            }`}
          />
        </div>

        {/* Heading */}
        <h1
          className={`text-5xl md:text-7xl font-serif font-bold text-white mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            animation: isVisible ? "fadeIn 1s ease-out" : "none",
          }}
        >
          Welcome to TOPXCM
        </h1>

        {/* Subtext */}
        <p
          className={`text-lg md:text-2xl text-[#D4AF37] mb-2 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            animation: isVisible ? "fadeIn 1s ease-out 0.2s backwards" : "none",
          }}
        >
          A fashion, photography, and real estate empire
        </p>

        {/* Subtitle */}
        <p
          className={`text-sm md:text-base text-white/70 mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            animation: isVisible ? "fadeIn 1s ease-out 0.4s backwards" : "none",
          }}
        >
          Choose a service to explore
        </p>

        {/* BUTTON AREA */}
        <div className="relative w-full max-w-3xl h-40 md:h-48">
          {/* LEFT - Photography */}
          <button
            onClick={() => navigate("/photography")}
            className={`absolute left-0 top-0 px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37]
            bg-transparent transition-all duration-700 ease-out
            hover:bg-[#D4AF37] hover:text-black
            hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
            active:scale-95 active:shadow-[0_0_30px_rgba(212,175,55,0.6)]
            transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-32 opacity-0"
            }`}
          >
            Photography
          </button>

          {/* RIGHT - Fashion */}
          <button
            onClick={() => navigate("/fashion")}
            className={`absolute right-0 top-0 px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37]
            bg-transparent transition-all duration-700 ease-out
            hover:bg-[#D4AF37] hover:text-black
            hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
            active:scale-95 active:shadow-[0_0_30px_rgba(212,175,55,0.6)]
            transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-32 opacity-0"
            }`}
          >
            Fashion
          </button>

          {/* BOTTOM CENTER - Real Estate */}
          <button
            onClick={() => navigate("/real-estate")}
            className={`absolute left-1/2 top-20 md:top-24 -translate-x-1/2 px-10 py-4 border-2 border-[#D4AF37] text-[#D4AF37]
            bg-transparent transition-all duration-700 ease-out
            hover:bg-[#D4AF37] hover:text-black
            hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
            active:scale-95 active:shadow-[0_0_30px_rgba(212,175,55,0.6)]
            transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            Real Estate
          </button>
        </div>
      </div>

      {/* ADMIN ACCESS - bottom right double tap zone */}
      <button
        type="button"
        onClick={handleAdminTap}
        aria-label="Admin access"
        className="fixed bottom-0 right-0 z-50 h-28 w-28 md:h-36 md:w-36 cursor-pointer bg-transparent opacity-0"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#D4AF37]/50 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes subtle-shift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes logoGlow {
          0% { box-shadow: 0 0 18px rgba(212,175,55,0.08), 0 0 0 rgba(212,175,55,0); }
          100% { box-shadow: 0 0 26px rgba(212,175,55,0.18), 0 0 34px rgba(212,175,55,0.10); }
        }
      `}</style>
    </section>
  );
}

