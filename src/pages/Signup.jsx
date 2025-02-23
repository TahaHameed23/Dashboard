import { useAuth } from "../context/AuthContext";
import SignupComponent from "../features/auth/components/SignupComponent"
import Loading from "../components/Loading";
import Header from "../components/Header";
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
