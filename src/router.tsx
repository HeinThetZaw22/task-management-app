import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/login/login";
import NotFound from "./pages/not-found/not-found";
import Home from "./pages/home";
import RegisterPage from "./pages/register/register";
import EditTask from "./pages/task/edit/edit-task";
import ProtectedRoute from "./components/protected-route";
import AddTaskPage from "./pages/task/add-task-page";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/add-task/:tasklistId?", element: <AddTaskPage /> },
          { path: "/edit-task", element: <EditTask /> },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
