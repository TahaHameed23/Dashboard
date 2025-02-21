import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PasswordReset from "../pages/PasswordReset";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ), // Protects Dashboard
    errorElement: <h1>404 Not Found</h1>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "login/reset-password",
    element: <PasswordReset />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
