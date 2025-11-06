// src/private/proRuts.tsx
import { Navigate } from "react-router-dom";
import useUserSession from "../hook/useUserSession";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, role, isAuthenticated, isInitialized } = useUserSession();

  // 🔄 Mientras se inicializa, mostrar loading
  if (!isInitialized) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // 🔒 Si no está autenticado → login
  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Si el rol no está permitido → redirigir según el rol
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "moderador") {
      return <Navigate to="/moderador" replace />;
    } else if (role === "usuario") {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // ✅ Si está autenticado y el rol es permitido
  return children;
};

export default ProtectedRoute;
