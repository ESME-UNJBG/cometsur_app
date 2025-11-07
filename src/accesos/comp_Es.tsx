import React, { useState, useEffect } from "react";
import "../css/Ventana.css";

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
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) => {
            const obj = p as Partial<Usuario>;
            return {
              id: String(obj.id ?? ""),
              name: String(obj.name ?? ""),
              asistencia:
                typeof obj.asistencia === "number" ? obj.asistencia : null,
            } as Usuario;
          });
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
          const body = (await res.json()) as unknown;
          if (
            body &&
            typeof body === "object" &&
            "message" in body &&
            typeof (body as { message?: unknown }).message === "string"
          ) {
            backendMsg = `: ${(body as { message: string }).message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(`Error en la petición${backendMsg}`);
      }

      const nuevos = usuarios.map((u) =>
        u.id === selectedId ? { ...u, asistencia: num } : u
      );
      setUsuarios(nuevos);
      try {
        localStorage.setItem("usuarios", JSON.stringify(nuevos));
      } catch {
        console.warn("No se pudo actualizar localStorage");
      }

      setSuccessMsg(`Asistencia ${num} guardada.`);
    } catch (err: unknown) {
      console.error("Error actualizando asistencia:", err);
      let message = "Error actualizando asistencia.";
      if (err instanceof Error && err.message) message = err.message;
      setErrorMsg(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="login-container card"
      style={{
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="card-body d-flex flex-column"
        style={{ flex: 1, overflow: "hidden" }}
      >
        {/* Contenido principal con scroll */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ width: "33%" }} />
            <div style={{ width: "33%", textAlign: "center" }}>
              <p className="m-0 fw-bold">Buscador</p>
            </div>
            <div style={{ width: "33%", textAlign: "right" }}>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>
          </div>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control mb-3"
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

          {/* Tabla */}
          <div className="table-responsive">
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
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLTableCellElement>
                        ) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectUser(user);
                          }
                        }}
                        onClick={() => handleSelectUser(user)}
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

        {/* Botones de asistencia fijos al fondo */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              className="btn btn-primary flex-grow-1"
              style={{ minWidth: "120px", maxWidth: "200px" }}
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
