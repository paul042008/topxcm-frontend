import { useEffect } from "react";

export default function ProtectedMedia({
  src,
  type = "image",
  alt = "",
  className = "",
}: {
  src: string;
  type?: "image" | "video";
  alt?: string;
  className?: string;
}) {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();

    // Block right click + drag + select
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("selectstart", prevent);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("selectstart", prevent);
    };
  }, []);

  return (
    <div className="relative group overflow-hidden">
      {/* IMAGE */}
      {type === "image" && (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`pointer-events-none select-none ${className}`}
        />
      )}

      {/* VIDEO */}
      {type === "video" && (
        <video
          src={src}
          muted
          loop
          playsInline
          className={`pointer-events-none ${className}`}
        />
      )}

      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/10 text-2xl md:text-4xl font-serif tracking-widest">
          TOPXCM
        </span>
      </div>

      {/* HOVER DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
    </div>
  );
} 

