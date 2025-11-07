import { useState, useCallback } from "react";

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  estado: string;
  asistencia: number;
  university: string;
  importe: string;
  category: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiErrorResponse {
  message: string;
}

interface UseLoginReturn {
  login: (data: LoginData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

const LOCAL_STORAGE_KEYS = {
  TOKEN: "Token",
  USER_ID: "userId",
  USER_ROLE: "userRole",
  USER_NAME: "userName",
  USER_EMAIL: "userEmail",
  USER_ASISTENCIA: "userAsistencia",
  USER_UNIVERSITY: "userUniversity",
  USER_IMPORTE: "userImporte",
  USER_CATEGORY: "userCategory",
} as const;

const API_URL = "https://cometsur-api.onrender.com";

const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const saveUserData = useCallback((data: LoginResponse) => {
    try {
      const { token, user } = data;

      console.log("🔐 Guardando datos en localStorage:", user);

      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, user._id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, user.estado);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_NAME, user.name);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, user.email);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER_ASISTENCIA,
        user.asistencia.toString()
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_UNIVERSITY, user.university);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_IMPORTE, user.importe);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CATEGORY, user.category);

      console.log("✅ Datos guardados en localStorage correctamente");

      // Disparar evento personalizado para notificar a toda la app
      window.dispatchEvent(new Event("localStorageUpdated"));
      window.dispatchEvent(new Event("storage"));
    } catch (storageError) {
      console.error("❌ Error al guardar en localStorage:", storageError);
      throw new Error("Error al guardar la sesión");
    }
  }, []);

  const login = async (loginData: LoginData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    console.log("🚀 Iniciando proceso de login con:", loginData.email);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log(
        "📡 Respuesta del servidor:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorMessage = "Error en el inicio de sesión";

        try {
          const errorData: ApiErrorResponse = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        console.error("❌ Error en login:", errorMessage);
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      console.log("✅ Login exitoso, datos recibidos:", data);

      if (!data.token || !data.user) {
        throw new Error("Respuesta del servidor inválida");
      }

      saveUserData(data);
      console.log("🎉 Proceso de login completado exitosamente");
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al iniciar sesión";
      console.error("💥 Error completo en login:", err);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, resetError };
};

export default useLogin;
