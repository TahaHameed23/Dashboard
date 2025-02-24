import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { account } from "../services/appwrite.config";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* <div 
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">MyApp</h2>}
        <button 
          onClick={toggleSidebar}
          className="p-2 text-white hover:bg-gray-700 rounded"
        >
          {isCollapsed ? '➡' : '⬅'}
        </button>
      </div>

      <nav className="flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.path}
                className="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl w-5 text-center">{item.icon}</span>
                {!isCollapsed && (
                  <span className="opacity-100 transition-opacity">
                    {item.label}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div> */}
      <h2>Hello, {user.name}</h2>
      <div className="flex h-screen items-center justify-center">
        <span className="text-3xl font-semibold">Dashboard</span>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
