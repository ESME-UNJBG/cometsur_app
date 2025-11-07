import { Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    role: string | null;
  }>({
    token: localStorage.getItem("Token"),
    role: localStorage.getItem("userRole"),
  });

  // Función estable con useCallback para evitar recreaciones
  const checkAuth = useCallback(() => {
    const currentToken = localStorage.getItem("Token");
    const currentRole = localStorage.getItem("userRole");

    return { token: currentToken, role: currentRole };
  }, []);

  // Efecto para sincronizar estado - CORREGIDO
  useEffect(() => {
    const { token, role } = checkAuth();

    // Solo actualizar estado si hay cambios reales
    if (token !== authState.token || role !== authState.role) {
      setAuthState({ token, role });
    }
  }, [authState.token, authState.role, checkAuth]); // Dependencias estables

  // Efecto SEPARADO para eventos - CORREGIDO
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "Token" || e.key === "userRole") {
        const { token, role } = checkAuth();

        if (!token || !role) {
          window.location.href = "/";
          return;
        }

        // Solo recargar si el rol cambió
        if (role !== authState.role) {
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [authState.role, checkAuth]); // Dependencias estables

  // Redirecciones - SIN EFECTO
  if (!authState.token || !authState.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(authState.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
