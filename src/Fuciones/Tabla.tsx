import { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import BotonExportarExcel from "./BotonExportarExcel";

import { User } from "../interfaces/user";

const TablaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const actualizarUsuarios = useCallback(async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("❌ Falta el token en localStorage");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`https://cometsur-api.onrender.com/users/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data: User[] = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name));

      // Normalizar usuarios para el modal sin afectar otros componentes
      const normalized = data.map((u) => ({
        ...u, // conserva _id y cualquier otro campo
        id: u._id, // alias para el modal
        asistencia: u.asistencia ?? null,
      }));

      setUsuarios(normalized);
      localStorage.setItem("usuarios", JSON.stringify(normalized));
    } catch (error) {
      console.error("❌ Error actualizando usuarios:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    actualizarUsuarios();
    const interval = setInterval(() => actualizarUsuarios(), 10000);
    return () => clearInterval(interval);
  }, [actualizarUsuarios]);

  return (
    <div className="card mb-3" style={{ width: "100%", fontSize: "15px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-bold">Lista de asistentes</h5>

          <div className="d-flex gap-2">
            <BotonExportarExcel usuarios={usuarios} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>QR</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={2}>Cargando usuarios...</td>
                </tr>
              ) : usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <tr key={user._id}>
                    <td className="align-middle">{user.name}</td>
                    <td className="align-middle">
                      <QRCodeCanvas value={user._id} size={64} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>No hay usuarios cargados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaUsuarios;
