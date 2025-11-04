import React, { useEffect, useState, ChangeEvent } from "react";
import "../css/Ventana.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  password?: string | null;
  email?: string | null;
  asistencia?: number | null;
}

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [updateName, setUpdateName] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [updateGmail, setUpdateGmail] = useState(false);

  const [sending, setSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // 🆕 MENSAJE DE ÉXITO

  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Usuario[];
      if (Array.isArray(parsed)) setUsuarios(parsed);
    } catch {
      setUsuarios([]);
    }
  }, []);

  const filteredData = usuarios.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: Usuario) => {
    setSearchTerm(user.name);
    setSelectedUser({ ...user });
    setErrorMsg(null);
    setSuccessMsg(null); // 🆕 LIMPIAR MENSAJES ANTERIORES
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) =>
    selectedUser && setSelectedUser({ ...selectedUser, name: e.target.value });

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
    selectedUser &&
    setSelectedUser({ ...selectedUser, password: e.target.value });

  const handleChangeGmail = (e: ChangeEvent<HTMLInputElement>) =>
    selectedUser && setSelectedUser({ ...selectedUser, email: e.target.value });

  const handleActualizar = async () => {
    if (!selectedUser) {
      setErrorMsg("Selecciona un usuario primero.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token en localStorage. Inicia sesión.");
      return;
    }

    const body: Record<string, unknown> = {};
    if (updateName) body.name = selectedUser.name;
    if (updatePassword) body.password = selectedUser.password;
    if (updateGmail) body.email = selectedUser.email;

    if (Object.keys(body).length === 0) {
      setErrorMsg("Selecciona al menos un campo para actualizar.");
      return;
    }

    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      console.log("📤 Enviando actualización...", body);

      // 🆕 PETICIÓN OPTIMIZADA PARA FRONTEND
      const res = await fetch(
        `https://cometsur-api.onrender.com/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(body),
        }
      );

      console.log("📥 Respuesta recibida:", res.status, res.statusText);

      // 🆕 VERIFICAR SI LA RESPUESTA ES OK
      if (res.ok) {
        const responseData = await res.json().catch(() => null);
        console.log("✅ Actualización exitosa:", responseData);

        // 🆕 ACTUALIZAR LISTA LOCAL
        const nuevos = usuarios.map((u) =>
          u.id === selectedUser.id ? { ...u, ...body } : u
        );
        setUsuarios(nuevos);
        localStorage.setItem("usuarios", JSON.stringify(nuevos));

        // 🆕 MOSTRAR MENSAJE DE ÉXITO
        setSuccessMsg("✅ Usuario actualizado correctamente");

        // 🆕 RESETEAR CAMPOS Y CHECKBOXES
        setUpdateName(false);
        setUpdatePassword(false);
        setUpdateGmail(false);
        setSelectedUser(null);
        setSearchTerm("");

        // 🆕 CERRAR MODAL DESPUÉS DE 1.5 SEGUNDOS (OPCIONAL)
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // 🆕 MANEJO DETALLADO DE ERRORES HTTP
        const errorText = await res.text();
        console.error("❌ Error del servidor:", res.status, errorText);

        let errorMessage = `Error ${res.status}: `;
        switch (res.status) {
          case 400:
            errorMessage += "Solicitud incorrecta";
            break;
          case 401:
            errorMessage += "No autorizado - Token inválido";
            // 🆕 LIMPIAR TOKEN SI ES INVÁLIDO
            localStorage.removeItem("Token");
            break;
          case 404:
            errorMessage += "Usuario no encontrado";
            break;
          case 500:
            errorMessage += "Error interno del servidor";
            break;
          default:
            errorMessage += errorText || "Error desconocido";
        }

        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("❌ Error en actualización:", err);

      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Error de conexión. Verifica tu internet.");
      }
    } finally {
      setSending(false);
    }
  };

  // 🆕 FUNCIÓN PARA LIMPIAR TODO
  const handleLimpiar = () => {
    setSelectedUser(null);
    setSearchTerm("");
    setUpdateName(false);
    setUpdatePassword(false);
    setUpdateGmail(false);
    setErrorMsg(null);
    setSuccessMsg(null);
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
        {/* Contenido scrollable */}
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
                disabled={sending}
              />
            </div>
          </div>

          {/* Buscador */}
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  handleLimpiar();
                }
              }}
              disabled={sending}
            />
            {/* 🆕 BOTÓN LIMPIAR */}
            {selectedUser && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleLimpiar}
                disabled={sending}
              >
                Limpiar
              </button>
            )}
          </div>

          {/* 🆕 MENSAJE DE ÉXITO */}
          {successMsg && (
            <div className="alert alert-success mt-2" role="alert">
              {successMsg}
            </div>
          )}

          {/* Mensajes de error */}
          {errorMsg && (
            <div className="alert alert-danger mt-2" role="alert">
              {errorMsg}
            </div>
          )}

          {/* Tabla */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ display: "none" }}>ID</th>
                  <th>Nombre</th>
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
                        onClick={() => !sending && handleSelectUser(user)}
                        style={{
                          cursor: sending ? "not-allowed" : "pointer",
                          color: "blue",
                          opacity: sending ? 0.6 : 1,
                        }}
                      >
                        {user.name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Campos con checkboxes */}
          {selectedUser && (
            <div className="mt-3">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={updateName}
                  onChange={(e) => setUpdateName(e.target.checked)}
                  disabled={sending}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  value={selectedUser.name}
                  onChange={handleChangeName}
                  disabled={!updateName || sending}
                />
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.checked)}
                  disabled={sending}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={selectedUser.password ?? ""}
                  onChange={handleChangePassword}
                  disabled={!updatePassword || sending}
                />
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={updateGmail}
                  onChange={(e) => setUpdateGmail(e.target.checked)}
                  disabled={sending}
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Gmail"
                  value={selectedUser.email ?? ""}
                  onChange={handleChangeGmail}
                  disabled={!updateGmail || sending}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botón fijo abajo */}
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLimpiar}
            disabled={sending || !selectedUser}
          >
            Limpiar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleActualizar}
            disabled={
              !selectedUser ||
              sending ||
              (!updateName && !updatePassword && !updateGmail)
            }
          >
            {sending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Actualizando...
              </>
            ) : (
              "Actualizar Usuario"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputadoraModal;
