import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../css/Ventana.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  asistencia: number[]; // Cambiado a array para nuevo formato
}

const QR_REGION_ID = "html5qr-reader";

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(
    null
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3 | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const usuariosRef = useRef<Usuario[]>([]);

  // Mapeo de días a posiciones
  const dayMapping = {
    1: { morning: 0, afternoon: 1 },
    2: { morning: 2, afternoon: 3 },
    3: { morning: 4, afternoon: 5 },
  };

  // Cargar usuarios desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const usuariosData: Usuario[] = JSON.parse(stored);
        // Normalizar datos - asegurar que asistencia sea array de 6 elementos
        const normalizedUsers = usuariosData.map((user) => ({
          ...user,
          asistencia: Array.isArray(user.asistencia)
            ? user.asistencia
            : [0, 0, 0, 0, 0, 0],
        }));
        setUsuarios(normalizedUsers);
        usuariosRef.current = normalizedUsers;
      } catch {
        const emptyUsers: Usuario[] = [];
        setUsuarios(emptyUsers);
        usuariosRef.current = emptyUsers;
      }
    }
  }, []);

  // Detener scanner (solo al cerrar)
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
  }, []);

  // Buscar usuario
  const buscarUsuario = useCallback((scannedId: string): Usuario | null => {
    const user = usuariosRef.current.find(
      (u) =>
        String(u.id).trim().toLowerCase() === scannedId.trim().toLowerCase()
    );
    return user || null;
  }, []);

  // Procesar QR escaneado
  const procesarQR = useCallback(
    async (decodedText: string) => {
      const scannedId = decodedText.trim();
      setErrorMsg(null);
      setSuccessMsg(null);

      const user = buscarUsuario(scannedId);

      if (user) {
        setUsuarioEncontrado(user);
        setOverlayVisible(true);
        // Ocultar overlay luego de 4 segundos
        setTimeout(() => setOverlayVisible(false), 4000);
      } else {
        setUsuarioEncontrado(null);
        setErrorMsg(`Usuario con ID "${scannedId}" no encontrado`);
      }
    },
    [buscarUsuario]
  );

  // Iniciar scanner (solo una vez)
  const startScanner = useCallback(async () => {
    if (html5QrCodeRef.current) return;

    if (!navigator.mediaDevices) {
      setErrorMsg("Tu navegador no soporta acceso a la cámara.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const html5QrCode = new Html5Qrcode(QR_REGION_ID, { verbose: false });
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => procesarQR(decodedText),
        (error: string) => {
          if (!error.includes("No multi format QR code"))
            console.log("Escaneo fallido:", error);
        }
      );
    } catch (err) {
      console.error("❌ Error al iniciar cámara:", err);
      setErrorMsg("No se pudo acceder a la cámara.");
      await stopScanner();
    }
  }, [procesarQR, stopScanner]);

  // Pasar asistencia (NUEVO FORMATO)
  const handleAsistencia = async (turno: "morning" | "afternoon") => {
    if (!usuarioEncontrado || !selectedDay) {
      setErrorMsg("No hay usuario seleccionado o día no definido.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token en localStorage. Por favor inicia sesión.");
      return;
    }

    const index = dayMapping[selectedDay][turno];
    const url = `https://cometsur-api.onrender.com/users/${usuarioEncontrado.id}`;

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
          valor: 1, // Siempre 1 para marcar asistencia
        }),
      });

      if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);

      // Actualizar lista local - modificar solo la posición específica
      const nuevos = usuarios.map((u) => {
        if (u.id === usuarioEncontrado.id) {
          const newAsistencia = [...u.asistencia];
          newAsistencia[index] = 1;
          return { ...u, asistencia: newAsistencia };
        }
        return u;
      });

      setUsuarios(nuevos);
      usuariosRef.current = nuevos;
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      // Actualizar usuario encontrado con nuevos datos
      const actualizado = nuevos.find((u) => u.id === usuarioEncontrado.id);
      setUsuarioEncontrado(actualizado || null);

      const turnoText = turno === "morning" ? "Mañana" : "Tarde";
      setSuccessMsg(
        `✅ Asistencia ${turnoText} (Día ${selectedDay}) guardada para ${usuarioEncontrado.name}`
      );

      // Mostrar overlay actualizado
      setOverlayVisible(true);

      // Resetear después de 0.5 segundos (manteniendo cámara activa)
      setTimeout(() => {
        setOverlayVisible(false);
        setUsuarioEncontrado(null); // Permitir nuevo escaneo
      }, 500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error actualizando asistencia.";
      setErrorMsg(message);
    } finally {
      setSending(false);
    }
  };

  // Iniciar cámara cuando se selecciona un día
  useEffect(() => {
    if (selectedDay) {
      startScanner();
    }
    return () => {
      if (!selectedDay) {
        stopScanner();
      }
    };
  }, [selectedDay, startScanner, stopScanner]);

  // Resetear al cerrar
  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  // Pantalla de selección de días
  if (!selectedDay) {
    return (
      <div className="login-container card">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div style={{ width: "33%" }} />
            <div style={{ width: "33%", textAlign: "center" }}>
              <p className="m-0 fw-bold">Seleccionar Día</p>
            </div>
            <div style={{ width: "33%", textAlign: "right" }}>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={handleClose}
              />
            </div>
          </div>

          {/* Botones de días */}
          <div className="d-flex flex-column gap-3">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setSelectedDay(day as 1 | 2 | 3)}
                style={{
                  padding: "15px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Día {day}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="alert alert-danger mt-3">{errorMsg}</div>
          )}
        </div>
      </div>
    );
  }

  // Pantalla de cámara y asistencia
  return (
    <div className="login-container card">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ width: "33%" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedDay(null);
                setUsuarioEncontrado(null);
                setOverlayVisible(false);
              }}
            >
              ← Volver
            </button>
          </div>
          <div style={{ width: "33%", textAlign: "center" }}>
            <p className="m-0 fw-bold">Día {selectedDay} - Escanear QR</p>
          </div>
          <div style={{ width: "33%", textAlign: "right" }}>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={handleClose}
            />
          </div>
        </div>

        {/* Scanner */}
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

          {/* Overlay central */}
          {overlayVisible && usuarioEncontrado && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textAlign: "center",
                fontSize: "0.9rem",
                maxWidth: "90%",
              }}
            >
              <strong>✅ {usuarioEncontrado.name}</strong>
              <br />
              ID: {usuarioEncontrado.id}
              <br />
              Día {selectedDay} seleccionado
            </div>
          )}
        </div>

        {/* Botones de asistencia (Mañana/Tarde) - Solo cuando hay usuario escaneado */}
        {usuarioEncontrado && (
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <button
              type="button"
              className="btn btn-success flex-grow-1"
              style={{
                minWidth: "140px",
                padding: "12px",
                fontSize: "1.1rem",
              }}
              onClick={() => handleAsistencia("morning")}
              disabled={sending}
            >
              {sending ? "Actualizando..." : "🌅 Mañana"}
            </button>

            <button
              type="button"
              className="btn btn-warning flex-grow-1"
              style={{
                minWidth: "140px",
                padding: "12px",
                fontSize: "1.1rem",
              }}
              onClick={() => handleAsistencia("afternoon")}
              disabled={sending}
            >
              {sending ? "Actualizando..." : "🌇 Tarde"}
            </button>
          </div>
        )}

        {/* Mensajes de estado */}
        {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
        {successMsg && (
          <div className="alert alert-success mt-3">{successMsg}</div>
        )}

        {/* Indicador de día seleccionado */}
        {!usuarioEncontrado && (
          <div className="alert alert-info mt-3">
            <strong>Día {selectedDay} seleccionado</strong> - Escanea un código
            QR para pasar asistencia
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
