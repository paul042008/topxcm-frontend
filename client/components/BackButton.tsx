import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-[#fafafa] hover:text-[#D4AF37] transition"
    >
      <span className="text-2xl">←</span>
    </button>
  );
}

