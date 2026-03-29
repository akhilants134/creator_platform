import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
