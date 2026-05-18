import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiSkipForward, FiCpu, FiGithub, FiFacebook, FiMail, FiHeart } from "react-icons/fi";
import FootballGame from "./components/FootballGame";
import Dashboard from "./pages/Dashboard";
import { playWhistle } from "./utils/audioSynth";
import { profileData } from "./data/profileData";

function App() {
  const [screen, setScreen] = useState("game"); // game, dashboard
  const currentYear = new Date().getFullYear();

  const handleGoalScored = () => {
    // Triggers when penalty kick is successful
    setTimeout(() => {
      setScreen("dashboard");
    }, 400);
  };

  const handleSkipGame = () => {
    playWhistle(); // program referee whistle blast
    setScreen("dashboard");
  };

  return (
    <div className="relative min-h-screen bg-fc-dark text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
      
      {/* Dynamic Ambient Neon Lights */}
      <div className="absolute top-[10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-fc-lime/5 blur-[130px] pointer-events-none z-[1]" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-fc-gold/5 blur-[130px] pointer-events-none z-[1]" />

      {/* Header Sticky Glassmorphic Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#090a0f]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Branding */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setScreen("game");
            }}
            className="group flex items-center gap-1.5 font-display text-lg sm:text-xl font-black tracking-wider uppercase fc-title-slanted"
          >
            <span className="text-[#00f5ff] group-hover:text-white transition-colors">&lt;</span>
            <span className="text-white group-hover:text-fc-lime transition-colors">
              TÍN.DEV
            </span>
            <span className="text-[#bd00ff] group-hover:text-white transition-colors">/&gt;</span>
          </a>

          {/* Quick Info & Skip controls */}
          <div className="flex items-center gap-4">
            {screen === "game" ? (
              <button
                onClick={handleSkipGame}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#bd00ff] hover:bg-[#bd00ff]/10 hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] text-xs font-mono font-bold tracking-wider uppercase text-slate-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
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
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#00f5ff] hover:bg-[#00f5ff]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] text-xs font-mono font-bold tracking-wider uppercase text-slate-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 animate-pulse"
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
                <h1 className="fc-title-slanted text-4xl sm:text-6xl font-black tracking-wider leading-none mb-3 bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(189,0,255,0.4)]">
                  KHÓA CV
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans max-w-lg mx-auto">
                  Sử dụng mũi tên chỉ hướng sút để đánh bại thủ môn và kích hoạt chuyển giao dữ liệu hồ sơ năng lực.
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
      <footer className="relative z-10 border-t border-white/5 bg-[#090a0f]/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase">
              TRẦN TRỌNG TÍN // {profileData.about.mssv}
            </span>
            <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
              HỌC VIỆN CAO ĐẲNG CÔNG NGHỆ THỦ ĐỨC • KHOA CNTT
            </p>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
            <span>STADIUM ENGINE v2.0 • MADE WITH</span>
            <FiHeart size={12} className="text-fc-lime animate-pulse fill-fc-lime" />
            <span>BY TIN IN {currentYear}</span>
          </div>

          {/* Social connections */}
          <div className="flex items-center gap-4">
            <a
              href={profileData.about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-fc-lime transition-colors"
              aria-label="GitHub Profile"
            >
              <FiGithub size={16} />
            </a>
            <a
              href={profileData.about.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-fc-lime transition-colors"
              aria-label="Facebook Profile"
            >
              <FiFacebook size={16} />
            </a>
            <a
              href={`mailto:${profileData.about.email}`}
              className="text-slate-500 hover:text-fc-lime transition-colors"
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
