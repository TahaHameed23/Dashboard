import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { account } from "../services/appwrite.config";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

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
      <h2>Hello, {user.name}</h2>
      <div className="flex h-screen items-center justify-center">
        <span className="text-3xl font-semibold">Dashboard</span>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
