import React, { useState, useEffect } from "react";
import "../css/Ventana.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
}

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        setUsuarios(JSON.parse(stored));
      } catch {
        setUsuarios([]);
      }
    }
  }, []);

  const filteredData = usuarios.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: Usuario) => {
    setSearchTerm(user.name);
    setSelectedId(user.id);
    setErrorMsg(null);
  };

  const handleEliminar = async () => {
    setErrorMsg(null);

    if (!selectedId) {
      setErrorMsg("No hay ningún usuario seleccionado para eliminar.");
      return;
    }

    const Token = localStorage.getItem("Token");
    if (!Token) {
      setErrorMsg("Falta el token en localStorage. Inicia sesión de nuevo.");
      return;
    }

    const url = `https://cometsur-api.onrender.com/users/${selectedId}`;

    try {
      setDeleting(true);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let backendMsg = "";
        try {
          const body = await response.json();
          if (body && typeof body === "object" && "message" in body) {
            const maybeMsg = (body as Record<string, unknown>)["message"];
            if (typeof maybeMsg === "string") backendMsg = `: ${maybeMsg}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(`Error eliminando usuario${backendMsg}`);
      }

      const nuevos = usuarios.filter((u) => u.id !== selectedId);
      setUsuarios(nuevos);
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      onClose();
    } catch (err: unknown) {
      console.error("Error eliminando usuario:", err);
      let message = "Error eliminando usuario";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setErrorMsg(message);
    } finally {
      setDeleting(false);
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ width: "33%" }}></div>
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

          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control mb-3"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === "") setSelectedId(null);
            }}
          />

          {/* Tabla responsiva */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr key={user.id}>
                      <td
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleSelectUser(user)}
                      >
                        {user.name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {errorMsg && (
            <div className="alert alert-danger mt-2" role="alert">
              {errorMsg}
            </div>
          )}

          {selectedId && (
            <div className="alert alert-info mt-2">
              <strong>Usuario seleccionado:</strong> {searchTerm}
            </div>
          )}
        </div>

        {/* Botón fijo al fondo */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-danger"
            onClick={handleEliminar}
            disabled={!selectedId || deleting}
            aria-disabled={!selectedId || deleting}
            title={
              !selectedId
                ? "Selecciona primero un usuario"
                : "Eliminar usuario seleccionado"
            }
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputadoraModal;
