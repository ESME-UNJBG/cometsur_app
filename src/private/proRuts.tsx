import { Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const SESSION_DURATION = 2 * 60 * 60 * 1000; // ⏱️ 5 minutos (para pruebas)

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    role: string | null;
  }>({
    token: localStorage.getItem("Token"),
    role: localStorage.getItem("userRole"),
  });

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("Token");
    const role = localStorage.getItem("userRole");
    const loginTime = localStorage.getItem("loginTime");

    // ⏱️ Validación de expiración
    if (token && loginTime) {
      const now = Date.now();
      const elapsed = now - Number(loginTime);

      if (elapsed >= SESSION_DURATION) {
        // ❌ Sesión expirada → borrar todo
        localStorage.removeItem("Token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("loginTime");
        window.dispatchEvent(new Event("storage"));

        return { token: null, role: null };
      }
    }

    return { token, role };
  }, []);

  useEffect(() => {
    const { token, role } = checkAuth();

    if (token !== authState.token || role !== authState.role) {
      setAuthState({ token, role });
    }
  }, [authState.token, authState.role, checkAuth]);

  // 🔁 Revisión frecuente (cada 10s)
  useEffect(() => {
    const interval = setInterval(() => {
      const { token, role } = checkAuth();

      if (!token || !role) {
        window.location.href = "/";
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [checkAuth]);

  if (!authState.token || !authState.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(authState.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
