import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiMenu, FiX, FiGithub, FiFacebook } from "react-icons/fi";
import { profileData } from "../data/profileData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { id: "hero", label: "Trang Chủ" },
    { id: "about", label: "Giới Thiệu" },
    { id: "skills", label: "Kỹ Năng" },
    { id: "timeline", label: "Hành Trình" },
    { id: "projects", label: "Dự Án" },
    { id: "contact", label: "Liên Hệ" }
  ];

  // Track scroll position to change background transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for Scroll Spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when section is in viewport center
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    navLinks.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    return () => {
      navLinks.forEach((link) => {
        const section = document.getElementById(link.id);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of the sticky navbar
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-bg/75 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/20"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("hero");
          }}
          className="group flex items-center gap-1.5 font-mono text-xl font-bold tracking-wider"
        >
          <span className="text-neon-cyan group-hover:text-white transition-colors">&lt;</span>
          <span className="gradient-text bg-gradient-to-r from-neon-cyan to-neon-purple">
            TÍN.DEV
          </span>
          <span className="text-neon-purple group-hover:text-white transition-colors">/&gt;</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`relative py-2 transition-all duration-300 hover:text-neon-cyan ${
                    activeSection === link.id
                      ? "text-neon-cyan font-semibold text-glow-cyan"
                      : "text-slate-400"
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan to-neon-purple"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={profileData.about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-neon-cyan transition-colors"
              aria-label="GitHub Profile"
            >
              <FiGithub size={18} />
            </a>
            <a
              href={profileData.about.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-neon-purple transition-colors"
              aria-label="Facebook Profile"
            >
              <FiFacebook size={18} />
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-dark-bg/95 backdrop-blur-lg border-b border-white/5 shadow-2xl py-6 px-6 z-40"
        >
          <ul className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`block py-2 text-base font-semibold transition-colors ${
                    activeSection === link.id
                      ? "text-neon-cyan text-glow-cyan"
                      : "text-slate-400"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="my-6 border-t border-white/5" />

          {/* Mobile Social Links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href={profileData.about.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-neon-cyan transition-colors"
            >
              <FiGithub size={20} />
              <span className="text-sm font-mono">GitHub</span>
            </a>
            <a
              href={profileData.about.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-neon-purple transition-colors"
            >
              <FiFacebook size={20} />
              <span className="text-sm font-mono">Facebook</span>
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
