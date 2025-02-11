import { createContext,useState, useContext, useEffect } from "react";
import {account} from "../services/appwrite.config";
import { Navigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.get();
                setUser(session);
            } catch {
                setUser(null);
                <Navigate to={"/login"}/>
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    },[]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}    

export const useAuth = () => {
    return useContext(AuthContext);
}