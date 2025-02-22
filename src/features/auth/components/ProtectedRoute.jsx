/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../../components/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
