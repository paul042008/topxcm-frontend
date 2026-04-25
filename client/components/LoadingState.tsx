import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">
      <div className="relative w-20 h-20">
        {/* First Circle */}
        <motion.div
          className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Second Circle (smaller and counter-rotating) */}
        <motion.div
          className="absolute inset-4 border-4 border-t-transparent border-r-rose-500 border-b-transparent border-l-amber-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Center Pulsing Dot */}
        <motion.div 
          className="absolute inset-[35%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
}