import { useState } from "react";
import { Outlet } from "react-router-dom"; // Add Outlet
import { useAuth } from "../context/AuthContext";
import Sidebar from "../features/dashboard/components/ui/Sidebar";
export default function Dashboard() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar isCollapsed={isCollapsed} onToggle={handleSidebarToggle} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-4">
          {/* Render child routes here */}
          <Outlet />
          {/* Logout button always visible */}
          
        </div>
      </main>
    </div>
  );
}