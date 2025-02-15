import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/Auth/LoginComponent";
import Header from "../components/ui/Header";
import Loading from "../components/ui/Loading";
import { useEffect } from "react";

export default function Login() {
  const { user, setUser, loading } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Header />
      <LoginComponent setUser={setUser} />
    </div>
  );
}
