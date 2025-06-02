import { useEffect } from "react";
import { getAllNotifications, markAsNotified } from "@/utils/notification-db";

const showNotification = (title: string, body?: string) => {
  if (
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  ) {
    new Notification(title, { body, requireInteraction: true });
  }
};

export const useTaskNotificationScheduler = () => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof Notification === "undefined")
      return;

    const checkNotifications = async () => {
      const tasks = await getAllNotifications();
      const now = Date.now();

      for (const task of tasks) {
        const due = new Date(task.due).getTime();

        if (!task.notified && due - now <= 5 * 60 * 1000 && due > now) {
          showNotification(task.title, "Task is due soon!");
          await markAsNotified(task.taskId);
        }
      }
    };

    Notification.requestPermission();

    const interval = setInterval(checkNotifications, 60000); // every 1 minute
    return () => clearInterval(interval);
  }, []);
};
