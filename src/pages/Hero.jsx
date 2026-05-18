import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload, FiMessageSquare } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    "Fullstack Developer Intern",
    "Frontend Web Developer",
    "ReactJS & Laravel Enthusiast",
    "Creative Interface Architect"
  ];

  // Typing Effect Loop
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (isDeleting) {
      // Deleting speed
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 40);
    } else {
      // Typing speed
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 95);
    }

    // Handle role typing transition states
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      timer = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
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
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-neon-grid"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 px-4 py-1.5 rounded-full glass-panel border border-neon-cyan/20 text-xs font-mono text-neon-cyan uppercase tracking-widest flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
            <span>Sẵn Sàng Thực Tập // Intern Ready</span>
          </motion.div>

          {/* Subheading Greeting */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 font-mono text-sm sm:text-base mb-3 tracking-wide"
          >
            Xin chào, tôi là
          </motion.p>

          {/* Title - Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4"
          >
            <span className="text-white">TRẦN TRỌNG </span>
            <span className="gradient-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-glow-cyan">
              TÍN
            </span>
          </motion.h1>

          {/* Typwriter Subtitle */}
          <motion.div
            variants={itemVariants}
            className="h-10 sm:h-12 flex items-center mb-6"
          >
            <span className="text-xl sm:text-3xl font-bold font-mono text-slate-200">
              {typedText}
            </span>
            <span className="w-[3px] h-6 sm:h-8 bg-neon-cyan ml-1 animate-pulse" />
          </motion.div>

          {/* Short Bio Intro */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-slate-400 text-sm sm:text-base md:text-lg mb-10 leading-relaxed font-sans"
          >
            {profileData.about.mission}
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo("projects")}
              className="group relative px-8 py-3.5 rounded-lg overflow-hidden font-semibold text-sm transition-all duration-300 w-full sm:w-auto bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg border border-transparent shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Xem Các Dự Án
                <FiArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </button>

            <button
              onClick={() => handleScrollTo("contact")}
              className="group px-8 py-3.5 rounded-lg border border-white/10 glass-panel hover:border-neon-purple/50 font-semibold text-sm text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-neon-purple/5 shadow-md shadow-black/10"
            >
              <FiMessageSquare size={16} className="text-slate-400 group-hover:text-neon-purple transition-colors" />
              <span>Liên Hệ Ngay</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 cursor-pointer hidden md:flex"
        onClick={() => handleScrollTo("about")}
      >
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Cuộn Xuống
        </span>
        <div className="w-[20px] h-[34px] border-2 border-slate-600 rounded-full flex justify-center py-1.5 mt-1">
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[4px] h-[6px] bg-neon-cyan rounded-full"
          />
        </div>
      </motion.div>

      {/* Futuristic Grid background line overlay (Subtle CSS mesh) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
    </section>
  );
}
