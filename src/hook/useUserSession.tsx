import { useState, useEffect, useCallback, useRef } from "react";
import { API_URL } from "../config";
export interface UserData {
  _id: string;
  name: string;
  email: string;
  estado: string;
  asistencia: number[]; // ✅ ahora es un array
  university: string;
  importe: string;
  category: string;
  token?: string;
}

interface UseUserSessionFullReturn {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserSessionFull = (
  token: string | null,
  userId: string | null
): UseUserSessionFullReturn => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const previousUserData = useRef<UserData | null>(null);
  const isFetching = useRef<boolean>(false);

  const updateLocalStorage = useCallback((data: UserData) => {
    try {
      // Solo actualizar localStorage si hay cambios reales
      if (
        previousUserData.current &&
        JSON.stringify(previousUserData.current) === JSON.stringify(data)
      ) {
        return false; // No hay cambios
      }

      localStorage.setItem("userRole", data.estado);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userUniversity", data.university);
      localStorage.setItem("userImporte", data.importe);
      localStorage.setItem("userCategory", data.category);

      // ✅ Guardar asistencia como array en formato JSON
      localStorage.setItem("userAsistencia", JSON.stringify(data.asistencia));

      previousUserData.current = data;
      window.dispatchEvent(new Event("storage"));
      return true; // Hubo cambios
    } catch (storageError) {
      console.error("Error al actualizar localStorage:", storageError);
      return false;
    }
  }, []);

  const fetchUserData = useCallback(
    async (isBackgroundUpdate: boolean = false) => {
      if (!token || !userId || isFetching.current) {
        return;
      }

      try {
        // Solo mostrar loading en la primera carga o en actualizaciones manuales
        if (!isBackgroundUpdate) {
          setLoading(true);
        }

        isFetching.current = true;
        setError(null);

        const res = await fetch(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data: UserData = await res.json();

        // ✅ Aseguramos que asistencia siempre sea un array
        if (!Array.isArray(data.asistencia)) {
          data.asistencia = [];
        }

        // Solo actualizar el estado si hay cambios reales
        if (
          !previousUserData.current ||
          JSON.stringify(previousUserData.current) !== JSON.stringify(data)
        ) {
          setUserData(data);
          updateLocalStorage(data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";

        // Solo mostrar errores que no sean de fondo
        if (!isBackgroundUpdate) {
          console.error("❌ Error al actualizar sesión:", errorMessage);
          setError(errorMessage);
        }

        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("Token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          window.dispatchEvent(new Event("storage"));
        }
      } finally {
        if (!isBackgroundUpdate) {
          setLoading(false);
          setInitialLoad(false);
        }
        isFetching.current = false;
      }
    },
    [token, userId, updateLocalStorage]
  );

  useEffect(() => {
    if (initialLoad && token && userId) {
      fetchUserData(false); // Primera carga con loading
    }
  }, [initialLoad, token, userId, fetchUserData]);

  useEffect(() => {
    if (!token || !userId) return;

    // Polling en segundo plano (sin loading)
    const interval = setInterval(() => {
      fetchUserData(true); // Actualización de fondo
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUserData, token, userId]);

  return {
    userData,
    loading: loading && initialLoad, // Solo loading en carga inicial
    error,
    refetch: () => fetchUserData(false),
  };
};
