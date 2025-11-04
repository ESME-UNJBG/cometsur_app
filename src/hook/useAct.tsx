// src/hooks/useActualizarUsuario.ts
import { useEffect, useState } from "react";

// 🔹 Singleton global para evitar fetch duplicados
let globalUpdating: boolean = false;

const useActualizarUsuario = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      // ✅ Evitar llamadas concurrentes
      if (globalUpdating) return;

      const Token = localStorage.getItem("Token");
      const userId = localStorage.getItem("userId");

      if (!Token || !userId) {
        console.warn("❌ Faltan credenciales en localStorage");
        return;
      }

      globalUpdating = true;
      setIsUpdating(true);

      try {
        const response = await fetch(
          `https://cometsur-api.onrender.com/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // ✅ Manejar errores HTTP
        if (response.status === 404 || response.status === 401) {
          console.warn(
            "⚠️ Usuario eliminado o token inválido, limpiando sesión"
          );
          localStorage.removeItem("Token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          localStorage.removeItem("UserAsistencia");
          return;
        }

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        // ✅ Actualizar localStorage con datos del usuario
        if (data.name) localStorage.setItem("userName", data.name);
        if (data.estado) localStorage.setItem("userRole", data.estado);
        if (data._id) localStorage.setItem("userId", data._id);
        if (data.asistencia !== undefined)
          localStorage.setItem("UserAsistencia", data.asistencia.toString());
        if (data.token) localStorage.setItem("Token", data.token);

        console.log("✅ Datos de usuario actualizados en localStorage");
      } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
      } finally {
        globalUpdating = false;
        setIsUpdating(false);
      }
    };

    // 🔹 Ejecutar inmediatamente al montar
    fetchUsuario();

    // 🔹 Ejecutar cada 30 segundos
    const interval = setInterval(fetchUsuario, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isUpdating };
};

export default useActualizarUsuario;
