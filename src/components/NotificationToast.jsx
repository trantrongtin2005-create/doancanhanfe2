import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiAward, FiX } from "react-icons/fi";

const TOAST_THEMES = {
  success: {
    borderColor: "border-[#ffd700]/30",
    glowColor: "shadow-[0_0_15px_rgba(255,215,0,0.15)]",
    iconColor: "text-[#ffd700] text-glow-gold",
    icon: <FiCheckCircle size={18} />,
    barBg: "bg-gradient-to-r from-[#ffd700] to-[#ff006e]",
    badgeText: "CHUYỂN NHƯỢNG"
  },
  info: {
    borderColor: "border-[#00f5ff]/35",
    glowColor: "shadow-[0_0_15px_rgba(0,245,255,0.15)]",
    iconColor: "text-[#00f5ff] text-glow-cyan",
    icon: <FiInfo size={18} />,
    barBg: "bg-gradient-to-r from-[#00f5ff] to-[#7b2fff]",
    badgeText: "THÔNG TIN"
  },
  achievement: {
    borderColor: "border-[#ff006e]/35",
    glowColor: "shadow-[0_0_15px_rgba(255,0,110,0.15)]",
    iconColor: "text-[#ff006e] text-glow-pink",
    icon: <FiAward size={18} />,
    barBg: "bg-gradient-to-r from-[#ff006e] to-[#7b2fff]",
    badgeText: "THÀNH TÍCH"
  },
  warning: {
    borderColor: "border-amber-500/35",
    glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    iconColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    icon: <FiAlertTriangle size={18} />,
    barBg: "bg-gradient-to-r from-amber-500 to-red-500",
    badgeText: "CẢNH BÁO"
  }
};

export const NotificationToast = React.memo(({ toast, onDismiss, duration = 5000 }) => {
  const { id, type, title, message } = toast;
  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;
  const dismissRef = useRef(onDismiss);
  
  // Keep the latest callback ref to avoid resetting interval on prop change
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  // Handle auto-dismiss trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      dismissRef.current(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration]);

  // Swipe dismiss threshold for touch events (mobile)
  const handleDragEnd = (event, info) => {
    // If dragged horizontally more than 100px, dismiss it
    if (Math.abs(info.offset.x) > 100) {
      dismissRef.current(id);
    }
  };

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.5, right: 0.5 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 30, scale: 0.9, x: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 150, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.8 }}
      className={`relative w-full max-w-sm sm:max-w-md rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-md border ${theme.borderColor} ${theme.glowColor} p-4 sm:p-5 shadow-2xl overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing select-none group touch-pan-y`}
      style={{ originY: 0.5 }}
    >
      {/* Glow Corner Highlight Decorator */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/30" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30" />

      {/* Main card contents */}
      <div className="flex gap-4 items-start relative z-10">
        
        {/* Glowing Icon Slot */}
        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center ${theme.iconColor}`}>
          {theme.icon}
        </div>

        {/* Text Area */}
        <div className="flex-grow space-y-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {theme.badgeText}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">VIBELY APP</span>
          </div>
          <h5 className="font-display font-black text-sm tracking-wide text-white leading-tight">
            {title}
          </h5>
          <p className="text-slate-300 text-xs font-sans leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissRef.current(id);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 cursor-pointer flex-shrink-0"
          aria-label="Đóng thông báo"
        >
          <FiX size={14} />
        </button>
      </div>

      {/* GPU Accelerated Progress Bar (Animates transform instead of width) */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5">
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`h-full w-full ${theme.barBg} origin-left`}
        />
      </div>
    </motion.div>
  );
});

NotificationToast.displayName = "NotificationToast";
