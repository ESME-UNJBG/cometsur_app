import { useEffect, useState } from "react";

interface AuthState {
  id: string | null;
  token: string | null;
  role: string | null;
  name: string | null;
}

const useAuth = (): AuthState => {
  const [auth, setAuth] = useState<AuthState>({
    id: localStorage.getItem("userId"),
    token: localStorage.getItem("Token"),
    role: localStorage.getItem("userRole"),
    name: localStorage.getItem("userName"),
  });

  useEffect(() => {
    const checkAuth = () => {
      const newAuth = {
        id: localStorage.getItem("userId"),
        token: localStorage.getItem("Token"),
        role: localStorage.getItem("userRole"),
        name: localStorage.getItem("userName"),
      };

      // ✅ Solo actualizar si realmente cambió
      if (
        newAuth.id !== auth.id ||
        newAuth.token !== auth.token ||
        newAuth.role !== auth.role ||
        newAuth.name !== auth.name
      ) {
        setAuth(newAuth);
      }
    };

    // ✅ Escuchar cambios en localStorage (más eficiente)
    const handleStorageChange = () => {
      checkAuth();
    };

    // ✅ Verificar cada 30 segundos (en lugar de 1 segundo)
    const interval = setInterval(checkAuth, 30000);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [auth]); // ✅ Dependencia necesaria para la comparación

  return auth;
};

export default useAuth;
