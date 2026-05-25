import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiAward, FiX, FiCheck, FiTrash2, FiBell } from "react-icons/fi";
import { useVibelyNotifications } from "./VibelyNotificationProvider";

const TYPE_DECORATORS = {
  success: {
    icon: <FiCheckCircle size={15} />,
    color: "text-[#ffd700] text-glow-gold",
    bg: "bg-[#ffd700]/10 border-[#ffd700]/25",
    label: "TUYỂN DỤNG"
  },
  info: {
    icon: <FiInfo size={15} />,
    color: "text-[#00f5ff] text-glow-cyan",
    bg: "bg-[#00f5ff]/10 border-[#00f5ff]/25",
    label: "Hệ thống"
  },
  achievement: {
    icon: <FiAward size={15} />,
    color: "text-[#ff006e] text-glow-pink",
    bg: "bg-[#ff006e]/10 border-[#ff006e]/25",
    label: "THÀNH TÍCH"
  },
  warning: {
    icon: <FiAlertTriangle size={15} />,
    color: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    bg: "bg-amber-500/10 border-amber-500/25",
    label: "CẢNH BÁO"
  }
};

// Simple relative date formatter
function formatRelativeTime(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 10) return "Vừa xong";
  if (diffSecs < 60) return `${diffSecs} giây trước`;
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return new Date(date).toLocaleDateString("vi-VN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function NotificationCenter({ isOpen, onClose }) {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useVibelyNotifications();

  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8); // Lazy load rendering limit

  // Reset pagination limit when switching tabs or reopening
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisibleCount(8);
  };

  // Filtered notifications logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "transfer") return item.type === "success";
      if (activeTab === "achievement") return item.type === "achievement";
      if (activeTab === "system") return item.type === "info" || item.type === "warning";
      return true;
    });
  }, [notifications, activeTab]);

  // Sliced items for performance (Lazy rendering/Pagination)
  const slicedNotifications = useMemo(() => {
    return filteredNotifications.slice(0, visibleCount);
  }, [filteredNotifications, visibleCount]);

  const hasMore = filteredNotifications.length > visibleCount;

  // Unread counter
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay for mobile clicks / closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[9990] backdrop-blur-[2px] md:hidden pointer-events-auto"
          />

          {/* Core Panel Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md h-screen z-[9991] flex flex-col
                       bg-[#0a0a0f]/95 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 backdrop-blur-xl
                       md:absolute md:top-[76px] md:right-6 md:inset-auto md:w-96 md:h-[500px] md:max-h-[500px]
                       md:rounded-2xl md:border md:border-[#00f5ff]/20 md:shadow-2xl md:p-4 pointer-events-auto"
          >
            {/* HUD Corner decors */}
            <div className="hidden md:block hud-bracket-left" />
            <div className="hidden md:block hud-bracket-right" />
            <div className="absolute inset-0 fc-slanted-bg opacity-[0.05] pointer-events-none rounded-2xl" />

            {/* Header section */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FiBell className="text-[#00f5ff] text-glow-cyan" size={16} />
                <span className="font-display font-black text-xs sm:text-sm tracking-wider text-white">
                  THÔNG BÁO ({unreadCount})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                aria-label="Đóng panel"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Tabs control bar */}
            <div className="flex gap-1 py-2.5 border-b border-white/5 overflow-x-auto scrollbar-none flex-shrink-0">
              {[
                { id: "all", label: "TẤT CẢ" },
                { id: "transfer", label: "TUYỂN DỤNG" },
                { id: "achievement", label: "THÀNH TÍCH" },
                { id: "system", label: "HỆ THỐNG" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all flex-shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#7b2fff] text-white shadow-[0_0_8px_rgba(123,47,255,0.4)] border border-[#00f5ff]/20"
                      : "text-slate-400 hover:text-white bg-white/5 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notification logs list (With scroll container) */}
            <div className="flex-grow overflow-y-auto py-2.5 scrollbar-thin space-y-2 pr-1">
              {slicedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 font-sans">
                  <FiBell size={32} className="opacity-30 mb-3 animate-pulse" />
                  <p className="text-xs font-semibold">Chưa có thông báo nào trong mục này</p>
                  <p className="text-[10px] opacity-75 mt-1 font-mono">SIMULATED WEB ALERTS WILL LAND HERE</p>
                </div>
              ) : (
                slicedNotifications.map((item) => {
                  const decorator = TYPE_DECORATORS[item.type] || TYPE_DECORATORS.info;
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`relative p-3 rounded-xl border transition-all duration-300 flex gap-3 group cursor-pointer overflow-hidden ${
                        item.read
                          ? "bg-black/30 border-white/5 hover:border-white/10 opacity-70"
                          : "bg-[#7b2fff]/5 border-[#7b2fff]/20 hover:border-[#00f5ff]/30 shadow-[inset_0_0_10px_rgba(123,47,255,0.03)]"
                      }`}
                    >
                      {/* Left glow block if unread */}
                      {!item.read && (
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#00f5ff] to-[#7b2fff]" />
                      )}

                      {/* Icon Slot */}
                      <div className={`p-2 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center h-8 w-8 ${decorator.color}`}>
                        {decorator.icon}
                      </div>

                      {/* Content block */}
                      <div className="flex-grow space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${decorator.bg}`}>
                            {decorator.badgeText || decorator.label}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 flex-shrink-0">
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </div>
                        <h6 className={`font-display text-xs font-bold truncate leading-tight ${item.read ? "text-slate-300" : "text-white font-black"}`}>
                          {item.title}
                        </h6>
                        <p className="text-slate-400 text-[11px] font-sans leading-relaxed font-medium break-words">
                          {item.message}
                        </p>
                      </div>

                      {/* Delete item button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(item.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-[#ff006e] hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 self-start cursor-pointer border border-transparent hover:border-white/5"
                        title="Xóa thông báo này"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}

              {/* Lazy load trigger button */}
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="w-full py-2 mt-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono font-bold tracking-widest text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer text-center"
                >
                  XEM THÊM THÔNG BÁO ({filteredNotifications.length - visibleCount})
                </button>
              )}
            </div>

            {/* Bottom Actions footer bar */}
            {notifications.length > 0 && (
              <div className="flex gap-2 pt-3 border-t border-white/5 flex-shrink-0 justify-between text-[10px] font-mono">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-slate-400 hover:text-[#00f5ff] hover:text-glow-cyan transition-colors cursor-pointer"
                >
                  <FiCheck size={12} />
                  <span>ĐỌC TẤT CẢ</span>
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-slate-400 hover:text-[#ff006e] hover:text-glow-pink transition-colors cursor-pointer"
                >
                  <FiTrash2 size={12} />
                  <span>XÓA HẾT</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
