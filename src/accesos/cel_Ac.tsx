import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
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

const QR_REGION_ID = "html5qr-reader";

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [scannerStatus, setScannerStatus] = useState<
    "iniciando" | "escaneando" | "error" | "detenido"
  >("iniciando");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(
    null
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Estados para actualización - INICIALMENTE EN false
  const [updateName, setUpdateName] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);
  const [sending, setSending] = useState<boolean>(false);

  // Valores temporales para edición
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const usuariosRef = useRef<Usuario[]>([]);

  // 🔹 Cargar usuarios desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const usuariosData = JSON.parse(stored);
        setUsuarios(usuariosData);
        usuariosRef.current = usuariosData;
        console.log("📦 Usuarios cargados:", usuariosData);
      } catch {
        setUsuarios([]);
        usuariosRef.current = [];
      }
    } else {
      console.warn("⚠ No hay usuarios en localStorage");
    }
  }, []);

  // 🔹 SOLUCIÓN: Resetear solo los valores iniciales, NO los checkboxes
  useEffect(() => {
    if (usuarioEncontrado) {
      // Solo actualizar los valores, NO los estados de los checkboxes
      setNewName(usuarioEncontrado.name);
      setNewPassword(usuarioEncontrado.password ?? "");
      setNewEmail(usuarioEncontrado.email ?? "");
    }
  }, [usuarioEncontrado]);

  // 🔹 Detener scanner
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (error) {
        console.warn("Error deteniendo scanner:", error);
      }
      html5QrCodeRef.current = null;
    }
    setScannerStatus("detenido");
  }, []);

  // 🔹 Función para buscar usuario
  const buscarUsuario = useCallback((scannedId: string): Usuario | null => {
    const usuariosActuales = usuariosRef.current;
    console.log("🔍 Buscando usuario con ID:", scannedId);

    const user = usuariosActuales.find((u) => {
      const userId = String(u.id).trim().toLowerCase();
      const searchId = scannedId.trim().toLowerCase();
      return userId === searchId;
    });

    return user || null;
  }, []);

  // 🔹 Procesar QR escaneado
  const procesarQR = useCallback(
    async (decodedText: string) => {
      console.log("✅ QR escaneado:", decodedText);

      const scannedId = decodedText.trim();
      setQrContent(scannedId);

      const user = buscarUsuario(scannedId);

      if (user) {
        setUsuarioEncontrado({ ...user });
        setErrorMsg(null);
      } else {
        setUsuarioEncontrado(null);
        setErrorMsg(`Usuario con ID "${scannedId}" no encontrado`);
      }

      await stopScanner();
    },
    [buscarUsuario, stopScanner]
  );

  // 🔹 Iniciar scanner
  const startScanner = useCallback(async () => {
    if (html5QrCodeRef.current) return;

    if (!navigator.mediaDevices) {
      setErrorMsg("Tu navegador no soporta acceso a la cámara.");
      setScannerStatus("error");
      return;
    }

    setScannerStatus("iniciando");
    setErrorMsg(null);
    setQrContent(null);
    setUsuarioEncontrado(null);

    try {
      const html5QrCode = new Html5Qrcode(QR_REGION_ID, { verbose: false });
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      const onScanSuccess = async (decodedText: string) => {
        await procesarQR(decodedText);
      };

      const onScanFailure = (error: string) => {
        if (!error.includes("No multi format QR code")) {
          console.log("Escaneo fallido:", error);
        }
      };

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          onScanFailure
        );
        setScannerStatus("escaneando");
      } catch {
        try {
          await html5QrCode.start(
            { facingMode: "user" },
            config,
            onScanSuccess,
            onScanFailure
          );
          setScannerStatus("escaneando");
        } catch (error) {
          console.error("Error con cámara:", error);
          setErrorMsg("No se pudo acceder a ninguna cámara.");
          setScannerStatus("error");
          await stopScanner();
        }
      }
    } catch (error) {
      console.error("Error iniciando cámara:", error);
      setErrorMsg("No se pudo acceder a la cámara. Verifica los permisos.");
      setScannerStatus("error");
    }
  }, [stopScanner, procesarQR]);

  // 🔹 Hook de inicio
  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  // 🔹 Función para actualizar usuario
  const handleActualizar = async () => {
    if (!usuarioEncontrado) {
      setErrorMsg("No hay usuario seleccionado para actualizar.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token en localStorage. Inicia sesión de nuevo.");
      return;
    }

    const body: Record<string, unknown> = {};
    if (
      updateName &&
      newName.trim() !== "" &&
      newName !== usuarioEncontrado.name
    )
      body.name = newName;
    if (
      updatePassword &&
      newPassword.trim() !== "" &&
      newPassword !== (usuarioEncontrado.password ?? "")
    )
      body.password = newPassword;
    if (
      updateEmail &&
      newEmail.trim() !== "" &&
      newEmail !== (usuarioEncontrado.email ?? "")
    )
      body.email = newEmail;

    if (Object.keys(body).length === 0) {
      setErrorMsg("No hay cambios válidos para actualizar.");
      return;
    }

    try {
      setSending(true);
      setErrorMsg(null);

      const res = await fetch(
        `https://cometsur-api.onrender.com/users/${usuarioEncontrado.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error ${res.status}: ${res.statusText}`
        );
      }

      // Actualizar lista local
      const nuevos = usuarios.map((u) =>
        u.id === usuarioEncontrado.id ? { ...u, ...body } : u
      );
      setUsuarios(nuevos);
      usuariosRef.current = nuevos;
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      // Cerrar modal después de éxito
      onClose();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="login-container card">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ width: "33%" }} />
          <div style={{ width: "33%", textAlign: "center" }}>
            <p className="m-0 fw-bold">
              {scannerStatus === "detenido"
                ? "Usuario Encontrado"
                : "Escanear QR"}
            </p>
          </div>
          <div style={{ width: "33%", textAlign: "right" }}>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={async () => {
                await stopScanner();
                onClose();
              }}
            />
          </div>
        </div>

        {/* Contenedor del Scanner */}
        {scannerStatus !== "detenido" && (
          <div
            style={{
              width: "100%",
              height: "320px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              background: "#000",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div id={QR_REGION_ID} style={{ width: "100%", height: "100%" }} />
          </div>
        )}

        {/* Resultado del QR y Campos de Actualización */}
        {usuarioEncontrado && (
          <div className="mt-3">
            <div className="alert alert-success mt-3">
              <strong>ID escaneado:</strong> {qrContent}
              <br />
              <strong>Nombre actual:</strong> {usuarioEncontrado.name}
              {usuarioEncontrado.email && (
                <>
                  <br />
                  <strong>Email actual:</strong> {usuarioEncontrado.email}
                </>
              )}
            </div>

            <h6>Selecciona los campos a actualizar:</h6>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={updateName}
                onChange={(e) => setUpdateName(e.target.checked)}
                id="updateName"
              />
              <label className="form-check-label" htmlFor="updateName">
                Nombre
              </label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Nuevo nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!updateName}
                style={{ opacity: updateName ? 1 : 0.6 }}
              />
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={updatePassword}
                onChange={(e) => setUpdatePassword(e.target.checked)}
                id="updatePassword"
              />
              <label className="form-check-label" htmlFor="updatePassword">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!updatePassword}
                style={{ opacity: updatePassword ? 1 : 0.6 }}
              />
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={updateEmail}
                onChange={(e) => setUpdateEmail(e.target.checked)}
                id="updateEmail"
              />
              <label className="form-check-label" htmlFor="updateEmail">
                Email
              </label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Nuevo email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!updateEmail}
                style={{ opacity: updateEmail ? 1 : 0.6 }}
              />
            </div>

            {/* Botón Actualizar - SOLO se habilita cuando hay campos seleccionados */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary"
                onClick={handleActualizar}
                disabled={
                  sending || (!updateName && !updatePassword && !updateEmail)
                }
              >
                {sending ? "Actualizando..." : "Actualizar Usuario"}
              </button>
            </div>
          </div>
        )}

        {qrContent && !usuarioEncontrado && (
          <div className="alert alert-warning mt-3">
            <strong>ID escaneado:</strong> {qrContent}
            <br />
            <span className="text-danger">
              ⚠ Usuario no encontrado en la base de datos
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMsg}
          </div>
        )}
      </div>

      <style>
        {`
          #${QR_REGION_ID} video,
          #${QR_REGION_ID} canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          #${QR_REGION_ID} {
            background: #000 !important;
          }
        `}
      </style>
    </div>
  );
};

export default ComputadoraModal;
