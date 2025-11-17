import React, { useState, useEffect } from "react";
import "../css/accesos.css";
import { API_URL } from "../config";
interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  asistencia: number[]; // siempre será array de 6 números
}

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Cargar del localStorage
  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const normalized: Usuario[] = parsed.map((p) => ({
            id: String(p.id ?? ""),
            name: String(p.name ?? ""),
            asistencia: Array.isArray(p.asistencia)
              ? p.asistencia.map((n: unknown) =>
                  typeof n === "number" ? n : 0
                )
              : [0, 0, 0, 0, 0, 0],
          }));

          setUsuarios(normalized);
        }
      } catch {
        setUsuarios([]);
      }
    }
  }, []);

  const filteredData = usuarios.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: Usuario): void => {
    setSearchTerm(user.name);
    setSelectedId(user.id);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleAsistencia = async (index: number): Promise<void> => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedId) {
      setErrorMsg("Selecciona un usuario primero.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token. Inicia sesión.");
      return;
    }

    const url = `${API_URL}/users/${selectedId}`;

    try {
      setSending(true);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index,
          valor: 1,
        }),
      });

      if (!res.ok) {
        let backendMsg = "";

        try {
          const body = (await res.json()) as { message?: string };
          if (body.message) backendMsg = `: ${body.message}`;
        } catch {
          // ignorar error json
        }

        throw new Error(`Error en la petición${backendMsg}`);
      }

      // actualizar visualmente
      const nuevos = usuarios.map((u) => {
        if (u.id !== selectedId) return u;

        const newAsis = [...u.asistencia];
        newAsis[index] = 1;

        return {
          ...u,
          asistencia: newAsis,
        };
      });

      setUsuarios(nuevos);
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      setSuccessMsg(`Asistencia actualizada en la posición ${index}.`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error actualizando asistencia.");
      }
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

          {/* TABLA */}
          <div className="table-scroll">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ display: "none" }}>ID</th>
                  <th>Nombre</th>
                  <th>Día 1</th>
                  <th>Día 2</th>
                  <th>Día 3</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr key={user.id}>
                      <td style={{ display: "none" }}>{user.id}</td>

                      {/* Nombre */}
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

                      {/* Día 1 */}
                      <td>
                        {`${user.asistencia[0] === 1 ? "✔" : "✖"} ${
                          user.asistencia[1] === 1 ? "✔" : "✖"
                        }`}
                      </td>

                      {/* Día 2 */}
                      <td>
                        {`${user.asistencia[2] === 1 ? "✔" : "✖"} ${
                          user.asistencia[3] === 1 ? "✔" : "✖"
                        }`}
                      </td>

                      {/* Día 3 */}
                      <td>
                        {`${user.asistencia[4] === 1 ? "✔" : "✖"} ${
                          user.asistencia[5] === 1 ? "✔" : "✖"
                        }`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mensajes */}
          {errorMsg && (
            <div className="alert alert-danger mt-2">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="alert alert-success mt-2">{successMsg}</div>
          )}
          {selectedId && (
            <div className="alert alert-info mt-2">
              <strong>Usuario seleccionado.</strong>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="compu-footer">
          {selectedDay === null ? (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedDay(1)}
                disabled={!selectedId || sending}
              >
                Día 1
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedDay(2)}
                disabled={!selectedId || sending}
              >
                Día 2
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedDay(3)}
                disabled={!selectedId || sending}
              >
                Día 3
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedDay(null)}
                disabled={sending}
              >
                ← Volver
              </button>

              {(() => {
                const baseIndex = (selectedDay - 1) * 2;

                return (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAsistencia(baseIndex)}
                      disabled={!selectedId || sending}
                    >
                      Mañana
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAsistencia(baseIndex + 1)}
                      disabled={!selectedId || sending}
                    >
                      Tarde
                    </button>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComputadoraModal;
