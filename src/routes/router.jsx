import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PasswordReset from "../pages/PasswordReset";
import Dashboard from "../pages/Dashboard";
import Account from "../features/dashboard/pages/Account"
import Analytics from "../features/dashboard/pages/Analytics"
import Settings from "../features/dashboard/pages/Settings"
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Home from "../features/dashboard/pages/Home";
import Chat from "../features/chat-assistant/components/ChatAssistant";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ), // Protects Dashboard
    children: [
      {
        index: true, // This makes Home the default page for "/"
        element: <Home />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path:"/settings",
        element: <Settings/>
      },
      {
        path:"/analytics",
        element:<Analytics/>
      },
      {
        path:"chat",
        element:<Chat/>
      }
    ],
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
