import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { playNotificationChime } from "../utils/audioSynth";

const VibelyNotificationContext = createContext(null);

const MOCK_NOTIFICATIONS = [
  {
    type: "success",
    title: "Đề xuất chuyển nhượng",
    message: "HR từ Techcombank đã xem hồ sơ và gửi yêu cầu kết nối.",
  },
  {
    type: "info",
    title: "Lượng truy cập tăng vọt",
    message: "Có 15 nhà tuyển dụng đang trực tuyến xem CV của bạn.",
  },
  {
    type: "achievement",
    title: "Cột mốc bóng đá",
    message: "Dự án 'Penalty Game' đạt mốc 100+ lượt sút thành công hôm nay!",
  },
  {
    type: "warning",
    title: "Cảnh báo hệ thống",
    message: "Tốc độ tải tài nguyên ảnh profile chậm hơn bình thường 1.2s.",
  },
  {
    type: "info",
    title: "Hoạt động GitHub",
    message: "Một HR từ VNG Corporation đã click xem mã nguồn dự án Vibely.",
  },
  {
    type: "success",
    title: "Thách thức hoàn thành",
    message: "Một khách truy cập từ TP.HCM vừa sút tung lưới thủ môn AI!",
  },
  {
    type: "achievement",
    title: "Kỹ năng đánh giá cao",
    message: "Chỉ số Tailwind CSS / CSS3 của bạn được đề xuất tăng +5 điểm.",
  },
  {
    type: "warning",
    title: "Khuyên dùng tối ưu",
    message: "Cần nén file âm thanh audioSynth.js để giảm 15% thời gian load đầu.",
  }
];

export function VibelyNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    // Pre-populate with a couple of nice initial items so the list isn't empty at start
    return [
      {
        id: "init-1",
        type: "achievement",
        title: "Chào mừng đến Vibely",
        message: "Hệ thống thông báo Vibely tối ưu 60fps đã được kích hoạt thành công!",
        timestamp: new Date(Date.now() - 60000 * 5), // 5 mins ago
        read: false,
      },
      {
        id: "init-2",
        type: "info",
        title: "Hướng dẫn tương tác",
        message: "Vuốt ngang trên điện thoại hoặc click nút X để đóng nhanh thông báo.",
        timestamp: new Date(Date.now() - 60000 * 15), // 15 mins ago
        read: true,
      }
    ];
  });

  const [toasts, setToasts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationInterval, setSimulationInterval] = useState(25); // seconds
  const mockIndexRef = useRef(0);

  // sound player helper
  const playSound = useCallback((type) => {
    playNotificationChime(type);
  }, []);

  // Main function to trigger a new notification
  const addNotification = useCallback((type, title, message) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotif = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };

    // 1. Play sound chime
    playSound(type);

    // 2. Add to history log (limit to max 50 items for memory/performance)
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      return updated.slice(0, 50);
    });

    // 3. Add to active floating toasts list
    setToasts((prev) => [...prev, newNotif]);

    return id;
  }, [playSound]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Background Simulator Engine
  useEffect(() => {
    if (!isSimulating) return;

    const runSimulation = () => {
      const template = MOCK_NOTIFICATIONS[mockIndexRef.current];
      addNotification(template.type, template.title, template.message);
      
      // Advance template index cyclically
      mockIndexRef.current = (mockIndexRef.current + 1) % MOCK_NOTIFICATIONS.length;
    };

    // Initial delay so it doesn't pop up immediately on page mount
    const timerId = setInterval(runSimulation, simulationInterval * 1000);

    return () => clearInterval(timerId);
  }, [isSimulating, simulationInterval, addNotification]);

  const contextValue = useMemo(() => ({
    notifications,
    toasts,
    isSimulating,
    simulationInterval,
    addNotification,
    dismissToast,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    setIsSimulating,
    setSimulationInterval
  }), [
    notifications,
    toasts,
    isSimulating,
    simulationInterval,
    addNotification,
    dismissToast,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  ]);

  return (
    <VibelyNotificationContext.Provider value={contextValue}>
      {children}
    </VibelyNotificationContext.Provider>
  );
}

export function useVibelyNotifications() {
  const context = useContext(VibelyNotificationContext);
  if (!context) {
    throw new Error("useVibelyNotifications must be used within a VibelyNotificationProvider");
  }
  return context;
}
