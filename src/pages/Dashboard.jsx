import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiUser, FiSliders, FiCalendar, FiTrendingUp, FiSend, FiCheckCircle, FiExternalLink, FiGithub, FiArrowRight } from "react-icons/fi";
import { profileData } from "../data/profileData";
import PlayerCard from "../components/PlayerCard";
import confetti from "canvas-confetti";
import { playWhistle, playCrowdGoal } from "../utils/audioSynth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("about");
  const contentRef = useRef(null);

  useEffect(() => {
    // Smooth scroll to content drawer on tab change, especially useful for mobile!
    if (contentRef.current) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeTab]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success, error

  const tabs = [
    { id: "about", label: "SQUAD PROFILE // HỒ SƠ", icon: <FiUser size={16} /> },
    { id: "attributes", label: "PLAYER STATS // CHỈ SỐ", icon: <FiSliders size={16} /> },
    { id: "trophies", label: "TROPHY CABINET // DỰ ÁN", icon: <FiAward size={16} /> },
    { id: "seasons", label: "CAREER SEASONS // HÀNH TRÌNH", icon: <FiCalendar size={16} /> },
    { id: "transfer", label: "TRANSFER OFFER // LIÊN HỆ", icon: <FiTrendingUp size={16} /> }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    setTimeout(() => {
      setFormStatus("success");
      
      // Celebrate transfer contract signing!
      playWhistle();
      playCrowdGoal();
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#ccff00", "#ffffff", "#d1a850", "#00f5ff"]
      });

      // Clear Form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1800);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35 }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
  };

  return (
    <section className="min-h-screen pt-28 pb-16 fc-grid-bg relative z-10">
      {/* Visual cyber mesh overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-fc-dark via-transparent to-fc-dark pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Grid: Card left, Console panel right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: FUT PLAYER CARD SHOWCASE (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-full"
            >
              <PlayerCard />
            </motion.div>

            {/* Quick Stats Panel */}
            <div className="mt-4 w-full p-4 rounded-2xl fc-glass-card border border-fc-lime/10 text-center">
              <span className="font-mono text-[9px] text-fc-lime tracking-widest block mb-1">
                CURRENT FORM STATUS
              </span>
              <h4 className="fc-title-slanted text-lg font-black text-white flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fc-lime animate-ping" />
                SẴN SÀNG CHUYỂN NHƯỢNG
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                GPA: Khá - Giỏi • MSSV: {profileData.about.mssv}
              </p>
            </div>
          </div>

          {/* COLUMN 2: FUT CONSOLE PANELS (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* EA Sports Tab Bar Menu */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    playWhistle(); // program whistle on tab select for arcade vibe!
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-display text-xs font-black uppercase tracking-wider transition-all duration-300 flex-shrink-0 relative overflow-hidden ${
                    activeTab === tab.id
                      ? "bg-fc-lime text-fc-dark shadow-lg shadow-fc-lime/25 scale-102"
                      : "fc-glass-card border border-white/5 text-slate-400 hover:text-white hover:border-fc-lime/30"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Drawer holding Active Panels */}
            <div ref={contentRef} className="fc-glass-card border border-fc-lime/10 rounded-3xl p-6 sm:p-8 min-h-[460px] relative overflow-hidden">
              {/* slanted subtle background overlay */}
              <div className="absolute inset-0 fc-slanted-bg opacity-[0.15] pointer-events-none" />

              <AnimatePresence mode="wait">
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <span className="font-mono text-xs text-fc-lime">SQUAD REGISTER // [INFO]</span>
                      <h3 className="fc-title-slanted text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        SƠ YẾU <span className="text-fc-lime">LÝ LỊCH</span>
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                      {profileData.about.objective}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="block text-[10px] font-mono text-slate-500 uppercase">HỌ VÀ TÊN // PLAYER</span>
                        <span className="text-base font-bold text-white mt-1 block">{profileData.about.name}</span>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="block text-[10px] font-mono text-slate-500 uppercase">HỌC VIỆN // CLUB</span>
                        <span className="text-base font-bold text-white mt-1 block">{profileData.about.school}</span>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="block text-[10px] font-mono text-slate-500 uppercase">VỊ TRÍ // ROLE</span>
                        <span className="text-base font-bold text-fc-lime mt-1 block">{profileData.about.title}</span>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="block text-[10px] font-mono text-slate-500 uppercase">QUỐC GIA // REGION</span>
                        <span className="text-base font-bold text-white mt-1 block">{profileData.about.location}</span>
                      </div>
                    </div>

                    {/* Mission statements */}
                    <div className="p-4 rounded-xl bg-fc-lime/5 border border-fc-lime/20 mt-4">
                      <span className="block text-[10px] font-mono text-fc-lime uppercase tracking-widest mb-1.5">SỨ MỆNH MỤC TIÊU // SQUAD MISSION</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic">
                        "{profileData.about.mission}"
                      </p>
                    </div>

                    {/* Guided Next Button */}
                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={() => {
                          playWhistle();
                          setActiveTab("attributes");
                        }}
                        className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#bd00ff] text-white font-display font-extrabold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer border border-white/10"
                      >
                        <span>XEM CHỈ SỐ KỸ NĂNG (STATS)</span>
                        <FiArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "attributes" && (
                  <motion.div
                    key="attributes"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <span className="font-mono text-xs text-fc-lime">TACTICAL ABILITIES // [METRICS]</span>
                      <h3 className="fc-title-slanted text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        CHỈ SỐ <span className="text-fc-lime">KỸ NĂNG</span>
                      </h3>
                    </div>

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      Hệ thống chỉ số kỹ năng lập trình được lượng hóa theo khung đánh giá học thuật và dự án thực chiến tại trường TDC.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Frontend category */}
                      <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-white/5">
                        <h4 className="font-display text-xs text-glow-lime text-fc-lime font-black uppercase tracking-wider pb-2 border-b border-white/5">
                          FRONTEND ABILITIES
                        </h4>
                        <div className="space-y-3.5">
                          {profileData.skills.frontend.map((skill, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-300">{skill.name}</span>
                                <span className="font-mono text-fc-lime">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full rounded-full bg-gradient-to-r from-fc-lime to-emerald-400"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Backend category */}
                      <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-white/5">
                        <h4 className="font-display text-xs text-glow-lime text-fc-lime font-black uppercase tracking-wider pb-2 border-b border-white/5">
                          BACKEND ABILITIES
                        </h4>
                        <div className="space-y-3.5">
                          {profileData.skills.backend.map((skill, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-300">{skill.name}</span>
                                <span className="font-mono text-fc-lime">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full rounded-full bg-gradient-to-r from-fc-lime to-emerald-400"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Guided Next Button */}
                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={() => {
                          playWhistle();
                          setActiveTab("trophies");
                        }}
                        className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#bd00ff] text-white font-display font-extrabold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer border border-white/10"
                      >
                        <span>XEM PHÒNG CÚP DỰ ÁN (PROJECTS)</span>
                        <FiArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "trophies" && (
                  <motion.div
                    key="trophies"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <span className="font-mono text-xs text-fc-lime">TROPHY CHAMBER // [PROJECTS]</span>
                      <h3 className="fc-title-slanted text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        PHÒNG TRƯNG BÀY <span className="text-fc-lime">CÚP DỰ ÁN</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profileData.projects.map((project, idx) => (
                        <div
                          key={project.id}
                          className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-fc-lime/30 transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="px-2 py-0.5 rounded bg-fc-lime/10 border border-fc-lime/20 text-[8px] font-mono text-fc-lime tracking-widest font-bold">
                                {project.category.toUpperCase()}
                              </span>
                              <span className="text-slate-500 font-mono text-[9px]">[CÚP 0{idx + 1}]</span>
                            </div>
                            <h4 className="text-lg font-bold text-white group-hover:text-fc-lime transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-slate-400 text-xs mt-2 font-sans leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 text-[10px]">
                            {/* Github */}
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
                            >
                              <FiGithub size={12} />
                              <span>Source Code</span>
                            </a>
                            {/* Live */}
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-fc-lime hover:text-white font-bold transition-colors"
                            >
                              <span>Demo</span>
                              <FiExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Guided Next Button */}
                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={() => {
                          playWhistle();
                          setActiveTab("seasons");
                        }}
                        className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#bd00ff] text-white font-display font-extrabold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer border border-white/10"
                      >
                        <span>XEM NHẬT KÝ MÙA GIẢI (CAREER)</span>
                        <FiArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "seasons" && (
                  <motion.div
                    key="seasons"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <span className="font-mono text-xs text-fc-lime">CAREER LOGS // [EDUCATION]</span>
                      <h3 className="fc-title-slanted text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        NHẬT KÝ <span className="text-fc-lime">MÙA GIẢI</span>
                      </h3>
                    </div>

                    <div className="relative border-l border-white/10 pl-6 space-y-8 mt-4 ml-2">
                      {profileData.education.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Chrono dot */}
                          <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-fc-dark border-2 border-fc-lime shadow-[0_0_8px_#ccff00]" />
                          
                          <span className="text-xs font-mono font-bold text-fc-lime uppercase tracking-widest block">
                            SEASON {item.duration}
                          </span>
                          
                          <h4 className="text-lg font-bold text-white mt-1">
                            {item.role}
                          </h4>
                          
                          <span className="text-xs text-slate-400 font-sans block mt-0.5">
                            {item.institution}
                          </span>
                          
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2 font-sans">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Guided Next Button */}
                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={() => {
                          playWhistle();
                          setActiveTab("transfer");
                        }}
                        className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#bd00ff] text-white font-display font-extrabold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer border border-white/10"
                      >
                        <span>ĐỀ XUẤT HỢP ĐỒNG (CONTACT)</span>
                        <FiArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "transfer" && (
                  <motion.div
                    key="transfer"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <span className="font-mono text-xs text-fc-lime">TRANSFER OFFER CONTRACT // [CONTACT]</span>
                      <h3 className="fc-title-slanted text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        HỢP ĐỒNG <span className="text-fc-lime">CHUYỂN NHƯỢNG</span>
                      </h3>
                    </div>

                    {formStatus === "success" ? (
                      /* Contract Success */
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center py-10 space-y-5"
                      >
                        <div className="w-16 h-16 rounded-full bg-fc-lime/10 border border-fc-lime/20 flex items-center justify-center">
                          <FiCheckCircle size={32} className="text-fc-lime" />
                        </div>
                        <div>
                          <h4 className="fc-title-slanted text-xl font-bold text-white">HỢP ĐỒNG ĐÃ ĐƯỢC KÝ KẾT!</h4>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto mt-2 leading-relaxed font-sans">
                            Cảm ơn bạn đã đề xuất chuyển nhượng (Liên hệ). Cổng thông tin của Trần Trọng Tín đã ghi nhận và sẽ phản hồi sớm nhất qua email của bạn!
                          </p>
                        </div>
                        <button
                          onClick={() => setFormStatus("idle")}
                          className="px-5 py-2.5 rounded bg-white/5 border border-white/10 hover:border-fc-lime text-xs font-mono uppercase font-bold text-slate-300 hover:text-fc-lime transition-all duration-300"
                        >
                          Gửi Bản Đề Xuất Khác
                        </button>
                      </motion.div>
                    ) : (
                      /* Contact Form */
                      <form onSubmit={handleFormSubmit} className="space-y-5">
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                          Nhập Thông Tin Đề Xuất Ký Hợp Đồng
                        </h4>

                        {formStatus === "error" && (
                          <div className="p-3.5 rounded bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold">
                            ⚠️ Vui lòng hoàn thành đầy đủ thông tin bắt buộc trước khi gửi!
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                              HỌ & TÊN ĐẠI DIỆN *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              disabled={formStatus === "sending"}
                              required
                              className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 focus:border-fc-lime focus:outline-none text-xs text-white transition-all font-sans"
                              placeholder="Nhập tên nhà tuyển dụng..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                              EMAIL LIÊN HỆ *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              disabled={formStatus === "sending"}
                              required
                              className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 focus:border-fc-lime focus:outline-none text-xs text-white transition-all font-sans"
                              placeholder="hr@congtytech.com"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            VỊ TRÍ CHUYỂN NHƯỢNG // TIÊU ĐỀ
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleFormChange}
                            disabled={formStatus === "sending"}
                            className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 focus:border-fc-lime focus:outline-none text-xs text-white transition-all font-sans"
                            placeholder="Thực tập Frontend / Thực tập Fullstack..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            CHI TIẾT ĐIỀU KHOẢN // LỜI NHẮN *
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            disabled={formStatus === "sending"}
                            rows={4}
                            required
                            className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 focus:border-fc-lime focus:outline-none text-xs text-white transition-all resize-none font-sans"
                            placeholder="Lời nhắn kết nối phỏng vấn..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={formStatus === "sending"}
                          className="w-full py-3.5 rounded-lg bg-fc-lime text-fc-dark font-display font-extrabold text-xs uppercase tracking-widest hover:scale-102 hover:shadow-lg hover:shadow-fc-lime/20 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                          {formStatus === "sending" ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-fc-dark border-t-transparent rounded-full animate-spin" />
                              <span>ĐANG TRUYỀN TẢI HỢP ĐỒNG...</span>
                            </>
                          ) : (
                            <>
                              <FiSend size={13} />
                              <span>KÝ HỢP ĐỒNG CHUYỂN NHƯỢNG</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
