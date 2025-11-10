import React, { useState, useEffect } from "react";
import "../css/accesos.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  asistencia?: number | null;
}

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) => ({
            id: String(p.id ?? ""),
            name: String(p.name ?? ""),
            asistencia: typeof p.asistencia === "number" ? p.asistencia : null,
          }));
          setUsuarios(normalized);
        } else {
          setUsuarios([]);
        }
      } catch {
        setUsuarios([]);
      }
    }
  }, []);

  const filteredData = usuarios.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: Usuario) => {
    console.log("Usuario seleccionado:", user.id, user.name);
    setSearchTerm(user.name);
    setSelectedId(user.id);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleAsistencia = async (num: number) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedId) {
      setErrorMsg("Selecciona un usuario primero.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token en localStorage. Por favor inicia sesión.");
      return;
    }

    const url = `https://cometsur-api.onrender.com/users/${selectedId}`;

    try {
      setSending(true);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asistencia: num }),
      });

      if (!res.ok) {
        let backendMsg = "";
        try {
          const body = await res.json();
          if (body?.message) backendMsg = `: ${body.message}`;
        } catch {
          // ignore parse errors
        }
        throw new Error(`Error en la petición${backendMsg}`);
      }

      const nuevos = usuarios.map((u) =>
        u.id === selectedId ? { ...u, asistencia: num } : u
      );
      setUsuarios(nuevos);
      localStorage.setItem("usuarios", JSON.stringify(nuevos));
      setSuccessMsg(`Asistencia ${num} guardada.`);
    } catch (err: unknown) {
      console.error("Error actualizando asistencia:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Error actualizando asistencia."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="compu-overlay">
      <div className="compu-modal">
        {/* HEADER */}
        <div className="compu-header">
          <h5>Buscador</h5>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* BODY */}
        <div className="compu-body">
          <div className="compu-search">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="form-control mb-2"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  setSelectedId(null);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }
              }}
            />
          </div>

          {/* Tabla con scroll interno */}
          <div className="table-scroll">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ display: "none" }}>ID</th>
                  <th>Nombre</th>
                  <th>Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr key={user.id}>
                      <td style={{ display: "none" }}>{user.id}</td>
                      <td
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectUser(user)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectUser(user);
                          }
                        }}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        {user.name}
                      </td>
                      <td>{user.asistencia ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mensajes */}
          {errorMsg && (
            <div className="alert alert-danger mt-2" role="alert">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success mt-2" role="status">
              {successMsg}
            </div>
          )}
          {selectedId && (
            <div className="alert alert-info mt-2" role="status">
              <strong>Usuario seleccionado.</strong>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="compu-footer">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              className="btn btn-primary"
              onClick={() => handleAsistencia(num)}
              disabled={!selectedId || sending}
              title={
                !selectedId
                  ? "Selecciona primero un usuario"
                  : `Actualizar asistencia ${num}`
              }
            >
              {sending ? "Actualizando..." : `Asistencia ${num}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComputadoraModal;
