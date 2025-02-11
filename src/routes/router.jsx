import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import EmailVerification from "../components/Auth/EmailVerification";
import ProtectedRoute from "../components/Auth/ProtectedRoute";


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
        children: [
            {
                path: "verify-email",
                element: <EmailVerification />,
            },
        ] 
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);
