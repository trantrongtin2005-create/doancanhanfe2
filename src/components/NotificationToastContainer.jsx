import { AnimatePresence } from "framer-motion";
import { useVibelyNotifications } from "./VibelyNotificationProvider";
import { NotificationToast } from "./NotificationToast";

export default function NotificationToastContainer() {
  const { toasts, dismissToast } = useVibelyNotifications();

  return (
    <div
      className="fixed z-[9999] flex flex-col gap-3 pointer-events-none
                 top-24 left-4 right-4 items-center
                 md:top-auto md:bottom-6 md:right-6 md:left-auto md:items-end md:max-w-sm w-auto"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
