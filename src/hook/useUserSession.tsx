// hooks/useUserSession.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  UserSession,
  UserSessionHook,
  ChangeDetection,
} from "../interfaces/user";
import { UpdateUserResponse } from "../interfaces/api";

const useUserSession = (): UserSessionHook => {
  const [session, setSession] = useState<UserSession>({
    token: null,
    name: null,
    role: null,
    asistencia: null,
    isAuthenticated: false,
  });
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [changeDetection, setChangeDetection] = useState<ChangeDetection>({
    hasChanges: false,
    changedFields: [],
    previousData: {},
  });

  const updatingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousSessionRef = useRef<UserSession>({ ...session });

  const API_URL = "https://cometsur-api.onrender.com";

  const loadFromStorage = useCallback((): UserSession => {
    const token = localStorage.getItem("Token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    const asistenciaStr = localStorage.getItem("UserAsistencia");

    return {
      token,
      name,
      role,
      asistencia: asistenciaStr ? parseInt(asistenciaStr) : null,
      isAuthenticated: !!(token && role),
    };
  }, []);

  // ✅ Función para detectar cambios importantes - MANTENER FUERA DE USECALLBACK
  const detectChanges = (
    oldData: UserSession,
    newData: UserSession
  ): ChangeDetection => {
    const changedFields: string[] = [];

    if (oldData.asistencia !== newData.asistencia)
      changedFields.push("asistencia");
    if (oldData.name !== newData.name) changedFields.push("name");
    if (oldData.role !== newData.role) changedFields.push("role");
    if (oldData.token !== newData.token) changedFields.push("token");

    return {
      hasChanges: changedFields.length > 0,
      changedFields,
      previousData: oldData,
    };
  };

  // ✅ Función para mostrar indicador temporal de cambios - MANTENER FUERA DE USECALLBACK
  const showTemporaryChangeIndicator = (changes: ChangeDetection) => {
    if (changes.hasChanges) {
      console.log("🔄 Cambios detectados:", changes.changedFields);
      setChangeDetection(changes);

      // Ocultar el indicador después de 3 segundos
      setTimeout(() => {
        setChangeDetection((prev) => ({
          ...prev,
          hasChanges: false,
          changedFields: [],
        }));
      }, 3000);
    }
  };

  // ✅ ACTUALIZACIÓN: Quitar dependencias problemáticas
  const updateSession = useCallback(async (): Promise<void> => {
    if (updatingRef.current) return;

    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId || token === "undefined") {
      setIsInitialized(true);
      return;
    }

    updatingRef.current = true;

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("Token");
        localStorage.removeItem("userId");
        setSession(loadFromStorage());
        setIsInitialized(true);
        return;
      }

      if (!response.ok) {
        setIsInitialized(true);
        return;
      }

      const data: UpdateUserResponse = await response.json();

      if (data.user) {
        const { name, estado, asistencia, _id } = data.user;

        const newSession: UserSession = {
          token: data.token || token,
          name,
          role: estado,
          asistencia: asistencia || 0,
          isAuthenticated: true,
        };

        // ✅ Detectar cambios ANTES de actualizar el estado
        const changes = detectChanges(previousSessionRef.current, newSession);

        // Actualizar localStorage
        const updates = {
          userName: name,
          userRole: estado,
          UserAsistencia: asistencia?.toString() || "0",
          userId: _id,
          Token: data.token || token,
        };

        Object.entries(updates).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, value);
        });

        // ✅ Actualizar la referencia ANTES del estado
        previousSessionRef.current = newSession;

        // ✅ Actualizar estado de una vez
        setSession(newSession);
        setLastUpdate(Date.now());
        setIsInitialized(true);

        // ✅ Mostrar indicador solo si hay cambios (DESPUÉS de actualizar estado)
        if (changes.hasChanges) {
          showTemporaryChangeIndicator(changes);
        }

        console.log("✅ Sesión actualizada. Cambios:", changes.changedFields);
      }
    } catch (error) {
      console.error("❌ Error actualizando sesión:", error);
      setIsInitialized(true);
    } finally {
      updatingRef.current = false;
    }
  }, [API_URL]); // ✅ SOLO dependencias esenciales

  // ✅ Efecto separado para cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key === "Token" || e.key.startsWith("user"))) {
        setSession(loadFromStorage());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadFromStorage]);

  // ✅ Efecto principal simplificado
  useEffect(() => {
    // Cargar datos iniciales
    const initialSession = loadFromStorage();
    setSession(initialSession);
    previousSessionRef.current = initialSession;
    setIsInitialized(true);

    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      console.log("🚀 Iniciando hook de sesión");

      // Primera actualización después de 2 segundos
      const initialTimer = setTimeout(() => {
        updateSession();
      }, 2000);

      // Actualizaciones periódicas silenciosas
      intervalRef.current = setInterval(updateSession, 60000);

      return () => {
        clearTimeout(initialTimer);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      setIsInitialized(true);
    }
  }, [updateSession, loadFromStorage]);

  return {
    ...session,
    lastUpdate,
    updateSession,
    isInitialized,
    changeDetection,
    isUpdating: false,
  };
};

export default useUserSession;
