import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../css/Ventana.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  asistencia?: number | null;
}

const QR_REGION_ID = "html5qr-reader";

const ComputadoraModal: React.FC<ComputadoraModalProps> = ({ onClose }) => {
  const [scannerStatus, setScannerStatus] = useState<
    "iniciando" | "escaneando" | "error"
  >("iniciando");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(
    null
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sending, setSending] = useState<boolean>(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const usuariosRef = useRef<Usuario[]>([]);

  // 🔹 Cargar usuarios desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("usuarios");
    if (stored) {
      try {
        const usuariosData: Usuario[] = JSON.parse(stored);
        setUsuarios(usuariosData);
        usuariosRef.current = usuariosData;
      } catch {
        setUsuarios([]);
        usuariosRef.current = [];
      }
    }
  }, []);

  // 🔹 Buscar usuario
  const buscarUsuario = useCallback((scannedId: string): Usuario | null => {
    const user = usuariosRef.current.find(
      (u) =>
        String(u.id).trim().toLowerCase() === scannedId.trim().toLowerCase()
    );
    return user || null;
  }, []);

  // 🔹 Procesar QR escaneado
  const procesarQR = useCallback(
    async (decodedText: string) => {
      if (sending) return; // evita múltiples escaneos mientras se envía
      const scannedId = decodedText.trim();
      setQrContent(scannedId);
      setErrorMsg(null);
      setSuccessMsg(null);

      const user = buscarUsuario(scannedId);
      if (user) {
        setUsuarioEncontrado(user);
      } else {
        setUsuarioEncontrado(null);
        setErrorMsg(`Usuario con ID "${scannedId}" no encontrado`);
      }
    },
    [buscarUsuario, sending]
  );

  // 🔹 Iniciar scanner (solo una vez)
  const startScanner = useCallback(async () => {
    if (html5QrCodeRef.current) return;

    if (!navigator.mediaDevices) {
      setErrorMsg("Tu navegador no soporta acceso a la cámara.");
      setScannerStatus("error");
      return;
    }

    setScannerStatus("iniciando");
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

      setScannerStatus("escaneando");
    } catch (err) {
      console.error("❌ Error al iniciar cámara:", err);
      setErrorMsg("No se pudo acceder a la cámara.");
      setScannerStatus("error");
    }
  }, [procesarQR]);

  // 🔹 Detener scanner (solo al cerrar)
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

  // 🔹 Pasar asistencia
  const handleAsistencia = async (num: number) => {
    if (!usuarioEncontrado) {
      setErrorMsg("No hay usuario seleccionado para pasar asistencia.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Falta el token en localStorage. Por favor inicia sesión.");
      return;
    }

    const url = `https://cometsur-api.onrender.com/users/${usuarioEncontrado.id}`;

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

      if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);

      const nuevos = usuarios.map((u) =>
        u.id === usuarioEncontrado.id ? { ...u, asistencia: num } : u
      );
      setUsuarios(nuevos);
      usuariosRef.current = nuevos;
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      setSuccessMsg(
        `✅ Asistencia ${num} guardada para ${usuarioEncontrado.name}`
      );

      // 🔹 Mostrar mensaje 2 s y reiniciar escaneo
      setTimeout(() => {
        setSuccessMsg(null);
        setUsuarioEncontrado(null);
        setQrContent(null);
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error actualizando asistencia.";
      setErrorMsg(message);
    } finally {
      setSending(false);
    }
  };

  // 🔹 Iniciar cámara al montar
  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  // 🔹 Calcular el siguiente botón verde
  const siguienteAsistencia =
    usuarioEncontrado?.asistencia !== undefined &&
    usuarioEncontrado?.asistencia !== null
      ? usuarioEncontrado.asistencia + 1
      : 1;

  return (
    <div className="login-container card">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ width: "33%" }} />
          <div style={{ width: "33%", textAlign: "center" }}>
            <p className="m-0 fw-bold">
              {usuarioEncontrado ? "Usuario Encontrado" : "Escanear QR"}
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
          {scannerStatus === "iniciando" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.7)",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Iniciando cámara...
            </div>
          )}
        </div>

        {/* Resultado */}
        {usuarioEncontrado && (
          <div className="mt-3">
            <div className="alert alert-success">
              <strong>✅ Usuario Encontrado</strong>
              <br />
              <strong>ID:</strong> {qrContent}
              <br />
              <strong>Nombre:</strong> {usuarioEncontrado.name}
              <br />
              <strong>Asistencia actual:</strong>{" "}
              {usuarioEncontrado.asistencia ?? 0}
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isNext = num === siguienteAsistencia;
                return (
                  <button
                    key={num}
                    type="button"
                    className={`btn ${
                      isNext ? "btn-success" : "btn-primary"
                    } flex-grow-1`}
                    style={{ minWidth: "120px", maxWidth: "200px" }}
                    onClick={() => handleAsistencia(num)}
                    disabled={sending}
                  >
                    {sending ? "Actualizando..." : `Asistencia ${num}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
        {successMsg && (
          <div className="alert alert-success mt-3">{successMsg}</div>
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
