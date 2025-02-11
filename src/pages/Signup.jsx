import { useAuth } from "../context/AuthContext";
import SignupComponent from "../components/Auth/SignupComponent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { user, loading, setUser } = useAuth();
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
    <>
    <SignupComponent setUser={setUser} user={user}/>
    </>
  );
}