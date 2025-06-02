import { openDB } from "idb";

const DB_NAME = "task_notifications";
const STORE_NAME = "notifications";

export const requestNotificationPermission = async () => {
  if (typeof Notification === "undefined") {
    console.warn("This browser does not support desktop notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const getDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: "taskId" });
    },
  });

export const saveNotification = async (task: {
  taskId: string;
  title: string;
  due: string;
  notified?: boolean;
}) => {
  const db = await getDB();
  await db.put(STORE_NAME, {
    ...task,
    notified: false,
  });
};

export const getAllNotifications = async () => {
  const db = await getDB();
  return db.getAll(STORE_NAME);
};

export const markAsNotified = async (taskId: string) => {
  const db = await getDB();
  const task = await db.get(STORE_NAME, taskId);
  if (task) {
    task.notified = true;
    await db.put(STORE_NAME, task);
  }
};
