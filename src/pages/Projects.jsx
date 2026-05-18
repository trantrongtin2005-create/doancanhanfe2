import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiExternalLink, FiGithub, FiTag } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "Tất Cả" },
    { id: "Fullstack", label: "Fullstack PHP/Node" },
    { id: "Frontend", label: "Frontend React/CSS" }
  ];

  // Filter project array
  const filteredProjects = filter === "all" 
    ? profileData.projects 
    : profileData.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Title */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan uppercase tracking-widest mb-3"
          >
            <FiFolder size={12} />
            <span>04 // Danh Mục Dự Án</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            KHO DỰ ÁN <span className="gradient-text bg-gradient-to-r from-neon-cyan to-neon-purple">SÁNG TẠO</span>
          </motion.h2>
          <div className="w-16 h-[2px] bg-neon-cyan rounded-full" />
        </div>

        {/* Filter Buttons Navigation */}
        <div className="flex justify-center items-center gap-3 mb-16 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all duration-300 relative overflow-hidden ${
                filter === cat.id
                  ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg shadow-md shadow-neon-cyan/25 hover:scale-105"
                  : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20 glass-panel"
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45 }}
                className="group relative rounded-2xl glass-panel border border-white/5 overflow-hidden flex flex-col hover:border-white/15 transition-all duration-300 shadow-xl"
              >
                {/* Image Placeholder Card Cover with custom color gradients */}
                <div className={`h-48 w-full bg-gradient-to-br ${project.imageColor} relative p-6 flex flex-col justify-between overflow-hidden`}>
                  {/* Backdrop glowing grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                  
                  {/* Floating ID badge */}
                  <div className="flex justify-between items-start relative z-10 w-full">
                    <span className="px-2.5 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neon-cyan uppercase tracking-wider">
                      {project.category}
                    </span>
                    <FiFolder size={20} className="text-white/40 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Project Main Title Tag */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-2xl font-extrabold text-white text-glow-cyan drop-shadow-md">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card details body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed font-sans">
                      {project.description}
                    </p>

                    {/* Tech Badges List */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono font-medium text-slate-400 group-hover:text-slate-200 group-hover:border-white/10 transition-colors"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Links Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {/* Source Code link */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-neon-cyan transition-colors"
                    >
                      <FiGithub size={14} />
                      <span>Xem Source Code</span>
                    </a>

                    {/* Live Demo link */}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neon-cyan/5 border border-neon-cyan/20 text-xs font-semibold text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300 shadow-sm"
                    >
                      <span>Trang Demo</span>
                      <FiExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
