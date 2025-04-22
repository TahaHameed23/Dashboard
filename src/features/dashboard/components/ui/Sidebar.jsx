/* eslint-disable react/prop-types */
import { RiArrowRightSLine, RiArrowLeftSLine, RiApps2Line,RiAccountBox2Line, RiLineChartLine,RiSettings2Line  } from "@remixicon/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isCollapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <RiApps2Line/>, label: "Dashboard", path: "/" },
    { icon: <RiLineChartLine/>, label: "Analytics", path: "/analytics" },
    { icon: <RiAccountBox2Line/>, label: "Account", path: "/account" },
    { icon: <RiSettings2Line/>, label: "Settings", path: "/settings" },
  ];

  const handleToggle = () => {
    onToggle(!isCollapsed); // Notify parent of new state
  };

  const handleNavigation = (path) => {
    navigate(path); // Programmatic navigation without refresh
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-10 bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Datafloww</h2>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="my-1 hover:bg-gray-100 rounded p-2 transition-colors flex items-center justify-center"
        >
          {isCollapsed ? (
            <RiArrowRightSLine size={24} className="text-gray-600"/>
          ) : (
            <RiArrowLeftSLine size={24} className="text-gray-600"/>
          )}
        </button>
      </div>

      <nav className="flex-1 py-2">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-4 p-3 w-full text-left rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  isActive(item.path) 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600'
                }`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="opacity-100 transition-opacity">
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}