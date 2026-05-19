import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiSkipForward, FiGithub, FiFacebook, FiMail, FiHeart } from "react-icons/fi";
import FootballGame from "./components/FootballGame";
import Dashboard from "./pages/Dashboard";
import { playWhistle, playBeepSound, playHoverSound } from "./utils/audioSynth";
import { profileData } from "./data/profileData";

function App() {
  const [screen, setScreen] = useState("game"); 
  const currentYear = new Date().getFullYear();

  const handleGoalScored = () => {
    setTimeout(() => {
      setScreen("dashboard");
    }, 400);
  };

  const handleSkipGame = () => {
    playWhistle(); 
    setScreen("dashboard");
  };

  return (
    <div className="relative min-h-screen aaa-space-bg text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
      
      {/* 🌌 Cinematic Background Multi-Layers */}
      <div className="aaa-starfield" />
      <div className="aaa-starfield-fast" />
      <div className="aaa-aurora" />
      <div className="aaa-scanlines" />
      <div className="aaa-vignette" />

      {/* Header Sticky Glassmorphic Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Branding */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              playBeepSound();
              setScreen("game");
            }}
            onMouseEnter={() => playHoverSound()}
            className="group flex items-center gap-1.5 font-display text-lg sm:text-xl font-black tracking-wider uppercase fc-title-slanted"
          >
            <span className="text-[#00f5ff] text-glow-cyan group-hover:text-white transition-colors">&lt;</span>
            <span className="text-white group-hover:text-[#ffd700] group-hover:text-glow-gold transition-all">
              TÍN.DEV
            </span>
            <span className="text-[#ff006e] text-glow-pink group-hover:text-white transition-colors">/&gt;</span>
          </a>

          {/* Quick Info & Skip controls */}
          <div className="flex items-center gap-4">
            {screen === "game" ? (
              <button
                onClick={handleSkipGame}
                onMouseEnter={() => playHoverSound()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#ff006e] hover:bg-[#ff006e]/10 hover:shadow-[0_0_15px_rgba(255,0,110,0.4)] text-xs font-mono font-bold tracking-wider uppercase text-slate-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 btn-shimmer"
              >
                <span>Bỏ Qua Game</span>
                <FiSkipForward size={14} />
              </button>
            ) : (
              <button
                onClick={() => {
                  playWhistle();
                  setScreen("game");
                }}
                onMouseEnter={() => playHoverSound()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#00f5ff] hover:bg-[#00f5ff]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] text-xs font-mono font-bold tracking-wider uppercase text-slate-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 animate-pulse btn-shimmer"
              >
                <span>Chơi Lại Game</span>
                <FiPlay size={12} className="fill-current" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Screen Mount Coordinate */}
      <main className="relative flex-grow z-10 w-full">
        <AnimatePresence mode="wait">
          {screen === "game" ? (
            /* SECTION 1: interactive 2D kick canvas */
            <motion.div
              key="game-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12"
            >
              <div className="text-center mb-6 max-w-xl">
                <h1 className="fc-title-slanted text-4xl sm:text-6xl font-black tracking-wider leading-none mb-3 bg-gradient-to-r from-[#ffd700] via-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,245,255,0.45)]">
                  KHÓA CV
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans max-w-lg mx-auto font-medium">
                  Sử dụng phím D hoặc nhắm sút Penalty chính xác để cản phá/vượt qua thủ môn và giải mã hồ sơ năng lực full-stack.
                </p>
              </div>

              <FootballGame onGoalScored={handleGoalScored} />
            </motion.div>
          ) : (
            /* SECTION 2: FUT dashboard panels */
            <motion.div
              key="dashboard-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Details */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase">
              TRẦN TRỌNG TÍN // {profileData.about.mssv}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              HỌC VIỆN CAO ĐẰNG CÔNG NGHỆ THỦ ĐỨC • KHOA CNTT
            </p>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
            <span>STADIUM ENGINE v3.0 • MADE WITH</span>
            <FiHeart size={12} className="text-[#ff006e] text-glow-pink animate-pulse fill-[#ff006e]" />
            <span>BY TIN IN {currentYear}</span>
          </div>

          {/* Social connections */}
          <div className="flex items-center gap-4">
            <a
              href={profileData.about.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playHoverSound()}
              className="text-slate-500 hover:text-[#00f5ff] hover:text-glow-cyan transition-all"
              aria-label="GitHub Profile"
            >
              <FiGithub size={16} />
            </a>
            <a
              href={profileData.about.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playHoverSound()}
              className="text-slate-500 hover:text-[#00f5ff] hover:text-glow-cyan transition-all"
              aria-label="Facebook Profile"
            >
              <FiFacebook size={16} />
            </a>
            <a
              href={`mailto:${profileData.about.email}`}
              onMouseEnter={() => playHoverSound()}
              className="text-slate-500 hover:text-[#00f5ff] hover:text-glow-cyan transition-all"
              aria-label="Send Email"
            >
              <FiMail size={16} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
