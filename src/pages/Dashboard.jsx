import { useState } from "react";
import { Outlet } from "react-router-dom"; // Add Outlet
import Sidebar from "../features/dashboard/components/ui/Sidebar";
import { DashboardProvider } from "../features/dashboard/context/DashboardContext";
import FloatingChatButton from "../features/chat-assistant/components/FloatingChatButton";


export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleSidebarToggle = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <DashboardProvider>
        <div className="relative min-h-screen">
          <div className="flex">
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

          {/* Floating Chat Button */}
          <FloatingChatButton />
        </div>
    
    </DashboardProvider>
  );
}