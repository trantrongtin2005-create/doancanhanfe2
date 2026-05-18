import { motion } from "framer-motion";
import { FiLayers, FiServer, FiSettings, FiBriefcase } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function Skills() {
  const categories = [
    {
      id: "frontend",
      title: "Frontend Development",
      icon: <FiLayers size={20} className="text-neon-cyan" />,
      skills: profileData.skills.frontend,
      accentClass: "shadow-neon-cyan/5 border-neon-cyan/20 text-neon-cyan"
    },
    {
      id: "backend",
      title: "Backend Development",
      icon: <FiServer size={20} className="text-neon-purple" />,
      skills: profileData.skills.backend,
      accentClass: "shadow-neon-purple/5 border-neon-purple/20 text-neon-purple"
    },
    {
      id: "tools",
      title: "Công Cụ & Hệ Thống",
      icon: <FiSettings size={20} className="text-neon-pink" />,
      skills: profileData.skills.tools,
      accentClass: "shadow-neon-pink/5 border-neon-pink/20 text-neon-pink"
    },
    {
      id: "soft",
      title: "Kỹ Năng Mềm",
      icon: <FiBriefcase size={20} className="text-emerald-400" />,
      skills: profileData.skills.softSkills,
      accentClass: "shadow-emerald-400/5 border-emerald-400/20 text-emerald-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Title */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan uppercase tracking-widest mb-3"
          >
            <FiLayers size={12} />
            <span>02 // Bản Đồ Kỹ Năng</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            HỆ THỐNG <span className="gradient-text bg-gradient-to-r from-neon-cyan to-blue-500">KỸ NĂNG</span>
          </motion.h2>
          <div className="w-16 h-[2px] bg-neon-cyan rounded-full" />
        </div>

        {/* Skills Grid Dashboard */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              className={`p-6 rounded-2xl glass-panel border shadow-lg hover:shadow-xl hover:border-white/15 transition-all duration-300 group`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-glow transition-all">
                  {cat.title}
                </h3>
              </div>

              {/* Individual Skill Progress Bars */}
              <div className="space-y-5">
                {cat.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">{skill.name}</span>
                      <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.05 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          cat.id === "frontend"
                            ? "from-cyan-500 to-blue-500"
                            : cat.id === "backend"
                            ? "from-purple-500 to-indigo-600"
                            : cat.id === "tools"
                            ? "from-pink-500 to-rose-500"
                            : "from-emerald-400 to-teal-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Stack Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-6 rounded-2xl glass-panel border border-white/5 text-center"
        >
          <h4 className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-4">Các Công Nghệ Đang Tiếp Cận & Nghiên Cứu</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js", "Docker", "REST API", "Tailwind v4", "TypeScript", "Redux Toolkit", "Prisma", "PostgreSQL", "Linux"].map((tech, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-neon-cyan hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
