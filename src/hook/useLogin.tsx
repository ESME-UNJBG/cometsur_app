// hooks/useLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginData, LoginResponse, ApiErrorResponse } from "../interfaces/auth";

interface UseLoginReturn {
  login: (data: LoginData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = "https://cometsur-api.onrender.com";

  const login = async (loginData: LoginData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      console.log("📤 Enviando login...");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        let errorMessage = "Error en el login";
        try {
          const errorData: ApiErrorResponse = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();

      if (data.token && data.user) {
        const essentialData = {
          Token: data.token,
          userId: data.user._id,
          userName: data.user.name,
          userRole: data.user.estado,
          UserAsistencia: data.user.asistencia?.toString() || "0",
        };

        // 🔄 Guardar datos esenciales
        Object.entries(essentialData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

        console.log("✅ Login exitoso, datos guardados:", {
          name: data.user.name,
          role: data.user.estado,
        });

        // 🔄 Disparar evento storage para sincronizar inmediatamente
        window.dispatchEvent(new Event("storage"));

        // 🧭 Redirigir después de una pequeña pausa para asegurar la sincronización
        setTimeout(() => {
          if (data.user.estado === "usuario") {
            navigate("/home");
          } else if (data.user.estado === "moderador") {
            navigate("/moderador");
          } else {
            console.warn("Rol no reconocido:", data.user.estado);
            setError("Rol no reconocido, contacte al administrador");
          }
        }, 200); // Pequeña pausa para sincronización
      } else {
        throw new Error("Respuesta del servidor incompleta");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Error desconocido al iniciar sesión");
      }
      console.error("❌ Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
