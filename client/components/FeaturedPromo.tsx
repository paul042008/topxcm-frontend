import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedPromo() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // show after delay
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    // hide after a few seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-700 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10 pointer-events-none"
      }`}
    >
      <div className="w-[200px] bg-black border border-[#D4AF37]/20 rounded-lg p-3 shadow-md">

        {/* TEXT ONLY (clean + minimal) */}
        <p className="text-[10px] text-[#D4AF37] tracking-widest mb-1">
          NEW
        </p>

        <h4 className="text-xs font-serif text-white leading-tight">
          Ethereal Minimalism
        </h4>

        <button
          onClick={() => navigate("/fashion")}
          className="mt-2 text-[11px] text-[#D4AF37] hover:underline"
        >
          View →
        </button>
      </div>
    </div>
  );
}

