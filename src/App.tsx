import { Outlet } from "react-router-dom";
import { useTaskNotificationScheduler } from "./hooks/useTaskNotificationScheduler";
import { useEffect } from "react";
import { requestNotificationPermission } from "./utils/notification-db";

const App = () => {
  useTaskNotificationScheduler();

  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default App;
