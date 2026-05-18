import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiFacebook } from "react-icons/fi";
import { profileData } from "../data/profileData";
import confetti from "canvas-confetti";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // Simulate secure transmission API call
    setTimeout(() => {
      setStatus("success");
      
      // Fire premium canvas-confetti explosion!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f5ff", "#bd00ff", "#ff007f", "#10b981"]
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1800);
  };

  const contactMethods = [
    {
      icon: <FiMail size={22} className="text-neon-cyan" />,
      label: "Hộp Thư Điện Tử",
      value: profileData.about.email,
      href: `mailto:${profileData.about.email}`,
      colorClass: "hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
    },
    {
      icon: <FiPhone size={22} className="text-neon-purple" />,
      label: "Số Điện Thoại",
      value: profileData.about.phone,
      href: `tel:${profileData.about.phone.replace(/\s/g, "")}`,
      colorClass: "hover:border-neon-purple/40 hover:bg-neon-purple/5"
    },
    {
      icon: <FiFacebook size={22} className="text-neon-pink" />,
      label: "Facebook Cá Nhân",
      value: "fb.com/tin.tran.131410",
      href: profileData.about.facebook,
      colorClass: "hover:border-neon-pink/40 hover:bg-neon-pink/5"
    }
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-dark-bg/40">
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
            <FiMail size={12} />
            <span>05 // Kênh Kết Nối</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            LIÊN HỆ <span className="gradient-text bg-gradient-to-r from-neon-cyan to-neon-pink">HỢP TÁC</span>
          </motion.h2>
          <div className="w-16 h-[2px] bg-neon-cyan rounded-full" />
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-stretch">
          {/* Column 1: Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-3">
                Thông Tin Kênh Liên Lạc
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-sans mb-8">
                Tôi luôn sẵn sàng tiếp nhận các cơ hội thực tập, thảo luận dự án sáng tạo mới hoặc chia sẻ định hướng công nghệ. Vui lòng gửi email hoặc gọi trực tiếp qua các cổng thông tin bảo mật bên dưới.
              </p>

              {/* Direct Cards */}
              <div className="space-y-4">
                {contactMethods.map((method, idx) => (
                  <motion.a
                    key={idx}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`flex items-center gap-4 p-5 rounded-2xl glass-panel border border-white/5 shadow-md transition-all duration-300 group ${method.colorClass}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {method.icon}
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {method.label}
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-white group-hover:text-neon-cyan transition-colors">
                        {method.value}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Geographical Location Card */}
            <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center gap-4 text-slate-400 text-xs font-mono">
              <FiMapPin size={18} className="text-slate-500 flex-shrink-0" />
              <span>TP. THỦ ĐỨC, THÀNH PHỐ HỒ CHÍ MINH, VIỆT NAM</span>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/5 shadow-2xl relative"
            >
              {status === "success" ? (
                /* Success Layout */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FiCheckCircle size={36} className="text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Tin Nhắn Đã Gửi Thành Công!</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto font-sans leading-relaxed">
                      Cảm ơn bạn đã kết nối. Tôi đã tiếp nhận tín hiệu và sẽ phản hồi lại qua hòm thư điện tử của bạn trong thời gian sớm nhất.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-neon-cyan/50 text-xs font-semibold font-mono uppercase tracking-wider text-slate-300 hover:text-neon-cyan transition-all duration-300"
                  >
                    Gửi Tin Nhắn Khác
                  </button>
                </motion.div>
              ) : (
                /* Main Form Layout */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Gửi Tín Hiệu Tin Nhắn
                  </h3>

                  {status === "error" && (
                    <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold">
                      ⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc (Họ Tên, Email, Tin Nhắn)!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="name" className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Họ Và Tên <span className="text-neon-pink">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={status === "sending"}
                        className="px-4 py-3 rounded-lg bg-dark-bg/60 border border-white/10 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan text-sm text-slate-200 transition-all font-sans"
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="email" className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Địa Chỉ Email <span className="text-neon-pink">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={status === "sending"}
                        className="px-4 py-3 rounded-lg bg-dark-bg/60 border border-white/10 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan text-sm text-slate-200 transition-all font-sans"
                        placeholder="a@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="subject" className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Tiêu Đề Tin Nhắn
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={status === "sending"}
                      className="px-4 py-3 rounded-lg bg-dark-bg/60 border border-white/10 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan text-sm text-slate-200 transition-all font-sans"
                      placeholder="Cơ hội thực tập / Thảo luận dự án"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="message" className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Nội Dung Tin Nhắn <span className="text-neon-pink">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status === "sending"}
                      className="px-4 py-3 rounded-lg bg-dark-bg/60 border border-white/10 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan text-sm text-slate-200 transition-all resize-none font-sans"
                      placeholder="Lời nhắn hợp tác..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full relative px-6 py-3.5 rounded-lg overflow-hidden font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg border border-transparent shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                        <span>Đang Truyền Tải Bảo Mật...</span>
                      </>
                    ) : (
                      <>
                        <FiSend size={15} />
                        <span>Gửi Tin Nhắn</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
