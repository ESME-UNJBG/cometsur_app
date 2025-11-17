import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config";
import { User } from "../interfaces/user";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      setError("No hay token de autenticación");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data: User[] = await response.json();

      // Normalizar
      const normalized = data.map((u) => ({
        ...u,
        id: u._id,
        asistencia: u.asistencia ?? null,
      }));

      setUsuarios(normalized);
      localStorage.setItem("usuarios", JSON.stringify(normalized));
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al cargar los usuarios");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();

    // Opcional: actualización automática
    const interval = setInterval(() => fetchUsuarios(), 10000);
    return () => clearInterval(interval);
  }, [fetchUsuarios]);

  return { usuarios, cargando, error };
};
