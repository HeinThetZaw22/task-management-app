import { useThemeMode } from "@/theme/theme-provider";
import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: isDark ? "#333" : "#fff",
          color: isDark ? "#fff" : "#000",
          border: isDark ? "1px solid #444" : "1px solid #ccc",
        },
        success: {
          iconTheme: {
            primary: "#4caf50",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f44336",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default CustomToaster;
