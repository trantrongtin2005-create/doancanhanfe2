import { motion } from "framer-motion";
import { FiCalendar, FiAward, FiBookOpen } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function Timeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <section id="timeline" className="section-padding relative overflow-hidden bg-dark-bg/30">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Title */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-pink uppercase tracking-widest mb-3"
          >
            <FiAward size={12} />
            <span>03 // Lịch Sử Phát Triển</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            HÀNH TRÌNH <span className="gradient-text bg-gradient-to-r from-neon-pink to-neon-purple">ACADEMIC</span>
          </motion.h2>
          <div className="w-16 h-[2px] bg-neon-pink rounded-full" />
        </div>

        {/* Timeline Core */}
        <div className="relative max-w-4xl mx-auto mt-12">
          {/* Vertical central spine line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink opacity-25" />

          {/* Timeline Nodes Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-12"
          >
            {profileData.education.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row items-stretch ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Glowing Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-[7px] md:-translate-x-1.5 top-6 z-20">
                    <div className="relative w-3.5 h-3.5 rounded-full bg-dark-bg border-2 border-neon-cyan timeline-dot" />
                  </div>

                  {/* Spacer or Card content block */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <div
                      className={`p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/10 shadow-lg transition-all duration-300 relative group ${
                        isEven ? "hover:border-glow-cyan" : "hover:border-glow-purple"
                      }`}
                    >
                      {/* Date Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-semibold text-neon-cyan mb-4">
                        <FiCalendar size={12} />
                        {item.duration}
                      </span>

                      {/* Header */}
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                        {item.role}
                      </h3>
                      
                      <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-1.5">
                        <FiBookOpen size={13} className="text-slate-500" />
                        {item.institution}
                      </h4>

                      {/* Description */}
                      <p className="text-slate-300 text-sm leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {/* Subtle futuristic coordinates */}
                      <span className="absolute bottom-2 right-4 font-mono text-[9px] text-white/5">
                        [0{idx + 1} // SEC.LOG]
                      </span>
                    </div>
                  </div>

                  {/* Empty Spacer Column for Desktop alternating */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
