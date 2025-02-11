import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {account} from '../services/appwrite.config';

export default function Dashboard() {
    const { user, loading, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return loading ? (
        <div className="flex items-center justify-center h-screen">
            <span className="font-semibold text-3xl">Loading...</span>
        </div>
    ) : (
        <>
        <div className="flex items-center justify-center h-screen">
            <span className="font-semibold text-3xl">Dashboard</span>
        </div>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}