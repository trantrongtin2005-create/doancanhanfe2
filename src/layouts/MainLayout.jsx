import Navbar from "../components/Navbar";
import BackgroundCanvas from "../components/BackgroundCanvas";
import { FiHeart, FiGithub, FiFacebook, FiMail } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function MainLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen bg-dark-bg text-slate-100 flex flex-col overflow-hidden">
      {/* 2D Canvas Interactive Particles */}
      <BackgroundCanvas />

      {/* Radiant Glow Ambient Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none z-[2]" />
      <div className="absolute top-[60%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none z-[2]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-neon-pink/3 blur-[120px] pointer-events-none z-[2]" />

      {/* Sticky Header */}
      <Navbar />

      {/* Main Pages Content */}
      <main className="relative flex-grow z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-dark-bg/60 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-mono text-base font-bold tracking-widest text-slate-300">
              &lt;<span className="gradient-text bg-gradient-to-r from-neon-cyan to-neon-purple">TRẦN TRỌNG TÍN</span> /&gt;
            </span>
            <p className="text-xs text-slate-500 mt-1">
              MSSV: {profileData.about.mssv} • Cao Đẳng Công Nghệ Thủ Đức
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <span>Thiết kế & thực hiện với</span>
            <FiHeart size={14} className="text-neon-pink fill-neon-pink animate-pulse" />
            <span>năm {currentYear}</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={profileData.about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <FiGithub size={16} />
            </a>
            <a
              href={profileData.about.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-neon-purple hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all duration-300"
              aria-label="Facebook Profile"
            >
              <FiFacebook size={16} />
            </a>
            <a
              href={`mailto:${profileData.about.email}`}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-neon-pink hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all duration-300"
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
