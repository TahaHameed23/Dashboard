import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/Auth/LoginComponent";
import { useEffect } from "react";

export default function Login() {
  const { user, setUser, loading } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate('/');
    }    
  },[user, navigate]);

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <span className="font-semibold text-3xl">Loading...</span>
    </div>
  ) : (
    <div>
      <LoginComponent setUser={setUser} />
    </div>
  );
}
