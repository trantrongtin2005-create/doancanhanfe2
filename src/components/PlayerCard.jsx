import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import { playHoverSound } from "../utils/audioSynth";

export default function PlayerCard() {
  // Dynamic holographic positioning variables
  const [holoStyle, setHoloStyle] = useState({
    "--holo-x": "50%",
    "--holo-y": "50%"
  });

  // Motion values for 3D card tilt effect on mouse hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map motion values to tilt rotation degrees
  const rotateX = useTransform(y, [-150, 150], [22, -22]);
  const rotateY = useTransform(x, [-150, 150], [-22, 22]);

  // Spring animations for a realistic physics-based kinetic inertia
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseEnter = () => {
    playHoverSound();
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to card center for tilt
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);

    // Calculate percentage coords for holographic foil shine sweep
    const pctX = ((e.clientX - rect.left) / width) * 100;
    const pctY = ((e.clientY - rect.top) / height) * 100;
    setHoloStyle({
      "--holo-x": `${pctX}%`,
      "--holo-y": `${pctY}%`
    });
  };

  const handleMouseLeave = () => {
    // Smooth reset tilt
    x.set(0);
    y.set(0);
    setHoloStyle({
      "--holo-x": "50%",
      "--holo-y": "50%"
    });
  };

  // Three Core attributes
  const devStats = [
    { label: "PAC", val: 99 },
    { label: "SHO", val: 99 },
    { label: "PAS", val: 99 }
  ];

  return (
    <div className="flex justify-center items-center py-6">
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
          ...holoStyle
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-76 h-112 sm:w-80 sm:h-120 cursor-grab active:cursor-grabbing group select-none transition-shadow duration-300 rounded-3xl aaa-card-entrance"
      >
        {/* Glowing FUT outer backdrop shadow */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#ffd700] opacity-40 blur-2xl group-hover:opacity-80 group-hover:blur-3xl transition-all duration-500" />

        {/* Dynamic Rainbow Edge Reflective Border */}
        <div className="holo-border-glow" />

        {/* FUT Card Outer Shield (Standard FUT 24 Card Shape) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#bd00ff] via-[#00f5ff] to-[#ffd700] p-[2.5px] fut-card-clip transition-all duration-300">
          
          {/* Inner Card Shell */}
          <div className="absolute inset-[2.5px] bg-[#0c0d13] fut-card-inner-clip flex flex-col p-5 fc-slanted-bg overflow-hidden justify-between">
            
            {/* Telemetry abstract lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,245,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

            {/* True Interactive Holographic Foil Layer */}
            <div className="holo-shine-layer" />

            {/* Floating Gold Dust Aura */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(255,215,0,0.06)_0%,transparent_70%)] animate-pulse" />

            {/* Top Row: Overall Rating & Position */}
            <div className="flex justify-between items-start pt-4 relative z-10" style={{ transform: "translateZ(30px)" }}>
              <div className="flex flex-col items-center">
                <span className="font-display text-4xl sm:text-5xl font-black text-[#ffd700] text-glow-gold leading-none drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]">
                  99
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  DEV
                </span>
                <div className="w-6 h-[1.5px] bg-[#00f5ff]/40 my-1.5" />
                <span className="text-lg font-mono text-[#00f5ff] text-glow-cyan font-bold">VN</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-[#bd00ff]/20 flex items-center justify-center">
                  <FiCpu size={16} className="text-[#00f5ff] animate-pulse drop-shadow-[0_0_6px_#00f5ff]" />
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-semibold">TDC</span>
              </div>
            </div>

            {/* Center Row: Glowing tech avatar */}
            <div className="flex justify-center items-center my-1 relative z-10" style={{ transform: "translateZ(45px)" }}>
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-[#00f5ff]/30 bg-gradient-to-t from-[#00f5ff]/20 via-[#7b2fff]/10 to-transparent flex items-center justify-center overflow-hidden relative group-hover:scale-108 transition-transform duration-300">
                {/* Glowing neon athlete outline SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 sm:w-28 sm:h-28 text-[#00f5ff] fill-current drop-shadow-[0_0_15px_rgba(0,245,255,0.7)] animate-pulse"
                >
                  <path d="M50,15 C42,15 35,22 35,30 C35,38 42,45 50,45 C58,45 65,38 65,30 C65,22 58,15 50,15 Z M50,50 C32,50 15,62 15,78 C15,84 20,90 28,90 L72,90 C80,90 85,84 85,78 C85,62 68,50 50,50 Z" />
                </svg>
              </div>
            </div>

            {/* Player Name Banner */}
            <div className="text-center relative z-10" style={{ transform: "translateZ(35px)" }}>
              <h3 className="fc-title-slanted text-2xl sm:text-3xl font-black text-white text-glow-cyan tracking-widest drop-shadow-[0_0_8px_rgba(0,245,255,0.3)]">
                TÍN
              </h3>
              <div className="w-36 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mx-auto my-2" />
            </div>

            {/* Three Core Attributes */}
            <div 
              className="grid grid-cols-3 gap-x-2 pt-3 pb-3 relative z-10 border border-white/5 bg-black/60 p-3 rounded-xl border-cyan-500/10 divide-x divide-white/5 text-center"
              style={{ transform: "translateZ(25px)" }}
            >
              {devStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
                    {stat.label}
                  </span>
                  <span className="text-xl font-display font-black text-[#ffd700] text-glow-gold drop-shadow-[0_0_8px_#ffd700] mt-0.5">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Micro chip telemetry detail */}
            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 relative z-10 px-2 pb-1">
              <span>GOAT EDITION</span>
              <span>VER: 2026.TDC</span>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
