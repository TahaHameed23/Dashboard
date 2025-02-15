import { useAuth } from "../context/AuthContext";
import SignupComponent from "../components/Auth/SignupComponent";
import Loading from "../components/ui/Loading";
import Header from "../components/ui/Header";
export default function Signup() {
  const { user, loading, setUser } = useAuth();

  return loading ? (
    <Loading />
  ) : (
    <>
      <Header />
      <SignupComponent setUser={setUser} user={user} />
    </>
  );
}
