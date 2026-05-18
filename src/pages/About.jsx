import { motion } from "framer-motion";
import { FiUser, FiAward, FiBookOpen, FiMapPin, FiCpu } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-dark-bg/40">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-purple uppercase tracking-widest mb-3"
          >
            <FiUser size={12} />
            <span>01 // Giới Thiệu Bản Thân</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            ĐƯỜNG TRUYỀN <span className="gradient-text bg-gradient-to-r from-neon-purple to-neon-pink">HỒ SƠ</span>
          </motion.h2>
          <div className="w-16 h-[2px] bg-neon-purple rounded-full" />
        </div>

        {/* Layout Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Column 1: Graphic / Aesthetic Box */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group w-72 h-72 sm:w-85 sm:h-85">
              {/* Outer Glowing Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl opacity-35 blur-xl group-hover:opacity-60 transition-opacity duration-500" />
              
              {/* Box frame */}
              <div className="absolute inset-0 bg-dark-bg border border-white/10 rounded-2xl overflow-hidden glass-panel flex flex-col items-center justify-center p-6 text-center border-glow-cyan transition-all duration-500">
                
                {/* Tech Symbol */}
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiCpu size={36} className="text-neon-cyan animate-pulse" />
                </div>

                <span className="font-mono text-slate-400 text-xs uppercase tracking-widest mb-1">IDENTIFICATION PROTOCOL</span>
                <h3 className="text-2xl font-bold text-white mb-2">{profileData.about.name}</h3>
                
                <div className="h-[1px] w-24 bg-white/10 my-3" />
                
                <p className="font-mono text-xs text-neon-cyan leading-relaxed">
                  STUDENT ID: {profileData.about.mssv}<br />
                  DEPT: SOFTWARE ENGINEERING<br />
                  TERM: INTERN EXPECTED 2026
                </p>

                {/* Cyber grid overlays */}
                <div className="absolute top-2 left-2 font-mono text-[9px] text-white/10">SYS.INIT.OK</div>
                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-white/10">0x23211TT2568</div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Details & Content */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-neon-cyan font-mono">&gt;</span> Tóm Tắt Sứ Mệnh
            </h3>
            
            <p className="text-slate-300 leading-relaxed font-sans text-sm sm:text-base">
              {profileData.about.objective}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 glass-panel">
                <FiBookOpen className="text-neon-cyan mt-1 flex-shrink-0" size={18} />
                <div>
                  <span className="block text-xs font-mono text-slate-500 uppercase">Trường đào tạo</span>
                  <span className="text-sm font-semibold text-white">{profileData.about.school}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 glass-panel">
                <FiMapPin className="text-neon-purple mt-1 flex-shrink-0" size={18} />
                <div>
                  <span className="block text-xs font-mono text-slate-500 uppercase">Khu vực hoạt động</span>
                  <span className="text-sm font-semibold text-white">{profileData.about.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Profile Stats Grid */}
            <div className="pt-6">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Các Chỉ Số Cơ Bản</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {profileData.about.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl glass-panel border border-white/5 text-center group hover:border-neon-purple/30 transition-all duration-300"
                  >
                    <span className="block text-2xl sm:text-3xl font-extrabold text-white group-hover:text-neon-cyan transition-colors">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wide mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
