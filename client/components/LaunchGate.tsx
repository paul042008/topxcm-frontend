import { useState, useEffect, type ReactNode } from "react";

// ─── SET YOUR LAUNCH DATE HERE (UTC) ────────────────────────────────────────
// Format: YYYY-MM-DDTHH:mm:ssZ   (Z = UTC / GMT)
// Currently: Saturday, Oct 3, 2026 at 8:00 AM Nigeria time (UTC+1 = 07:00 UTC)
const LAUNCH_DATE = new Date("2026-10-03T11:00:00Z").getTime();
// ────────────────────────────────────────────────────────────────────────────

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, LAUNCH_DATE - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, LAUNCH_DATE - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const blocks = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* ─── Ambient background — gold tinted like the Hero ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.12),transparent_55%)]" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* ─── Brand block ─── */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <span
            className="text-sm md:text-lg text-[#D4AF37] italic font-serif whitespace-nowrap"
          >
            Welcome to the official website of...
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-black tracking-[0.2em] text-white mt-3">
            TOPXCM
          </h2>
        </div>

        {/* ─── Headline ─── */}
        <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-3 leading-[0.95]">
          We're going live soon
        </h1>

        {/* ─── Slogan with accent ─── */}
        <p className="text-[10px] md:text-sm text-white/70 uppercase tracking-[0.25em] font-sans leading-relaxed mb-12 max-w-md">
          Something new is coming. The doors open in:
        </p>

        {/* ─── Countdown grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl w-full">
          {blocks.map((b) => (
            <div
              key={b.label}
              className="relative rounded-2xl border border-[#D4AF37]/25 bg-[#0d0d0d]/80 backdrop-blur-sm px-4 py-6 md:py-8 overflow-hidden group"
            >
              {/* subtle sweep shine like the nav buttons */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full animate-[sweep_6s_infinite] pointer-events-none" />

              <p className="relative z-10 text-4xl md:text-5xl font-black tabular-nums text-white leading-none">
                {String(b.value).padStart(2, "0")}
              </p>
              <p className="relative z-10 mt-2 text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/80 font-bold">
                {b.label}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Small footer ─── */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="h-8 w-px bg-gradient-to-b from-[#D4AF37]/40 to-transparent" />
          <p className="text-[8px] uppercase tracking-[1em] text-white/20">
            © 2026 TOPXCM • All Rights Reserved
          </p>
        </div>
      </div>

      {/* ─── Sweep animation ─── */}
      <style>{`
        @keyframes sweep {
          0%   { transform: translateX(-150%) skewX(-25deg); }
          20%  { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
      `}</style>
    </div>
  );
}

export default function LaunchGate({ children }: { children: ReactNode }) {
  // ?preview=1 in the URL bypasses the gate (great for testing)
  const bypass =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "1";

  const [isLive, setIsLive] = useState(() => bypass || Date.now() >= LAUNCH_DATE);

  useEffect(() => {
    if (isLive) return;

    // Check every second — this is what makes it "auto-launch"
    const id = setInterval(() => {
      if (Date.now() >= LAUNCH_DATE) {
        setIsLive(true);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [isLive]);

  if (!isLive) return <Countdown />;
  return <>{children}</>;
}