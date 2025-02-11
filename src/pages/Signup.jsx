import { useAuth } from "../context/AuthContext";
import SignupComponent from "../components/Auth/SignupComponent";

export default function Signup() {
  const { user, loading, setUser } = useAuth();
  
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