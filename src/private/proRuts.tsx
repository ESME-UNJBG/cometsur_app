import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, role } = useAuth();

  // 🔒 Si no hay token → login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Si el rol no está permitido → redirigir a su zona correcta
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return role === "moderador" ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/home" replace />
    );
  }

  // ✅ Si está permitido
  return children;
};

export default ProtectedRoute;
