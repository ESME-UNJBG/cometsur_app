import React, { useState, useEffect } from "react";
import "../css/accesos.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
}

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Usuario[];
        setUsuarios(Array.isArray(parsed) ? parsed : []);
      } catch {
        setUsuarios([]);
      }
    }
  }, []);

  const filteredData = usuarios.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: Usuario): void => {
    setSearchTerm(user.name);
    setSelectedId(user.id);
    setErrorMsg(null);
  };

  const handleEliminar = async (): Promise<void> => {
    setErrorMsg(null);

    if (!selectedId) {
      setErrorMsg("Selecciona un usuario para eliminar.");
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
          const body: unknown = await response.json();
          if (
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof (body as Record<string, unknown>).message === "string"
          ) {
            backendMsg = `: ${(body as { message: string }).message}`;
          }
        } catch {
          /* ignorar parseo */
        }
        throw new Error(`Error eliminando usuario${backendMsg}`);
      }

      const nuevos = usuarios.filter((u) => u.id !== selectedId);
      setUsuarios(nuevos);
      localStorage.setItem("usuarios", JSON.stringify(nuevos));
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Error eliminando usuario");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="compu-overlay">
      <div className="compu-modal">
        {/* ======= CABECERA ======= */}
        <div className="compu-header">
          <h5>Buscador</h5>
          <button
            type="button"
            className="close-button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* ======= CUERPO ======= */}
        <div className="compu-body">
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

          <div
            style={{
              maxHeight: "50vh",
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <table className="table table-striped">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f8f9fa",
                  zIndex: 2,
                }}
              >
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      style={{
                        cursor: "pointer",
                        color: selectedId === user.id ? "blue" : "black",
                      }}
                    >
                      <td>{user.name}</td>
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

        {/* ======= PIE ======= */}
        <div className="compu-footer">
          <button
            className="btn btn-danger"
            onClick={handleEliminar}
            disabled={!selectedId || deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputadoraModal;
