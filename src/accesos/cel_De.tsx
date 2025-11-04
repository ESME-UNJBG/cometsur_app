import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../css/Ventana.css";

interface ComputadoraModalProps {
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
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
  const [deleting, setDeleting] = useState(false);

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
        setUsuarioEncontrado(user);
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

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      const onScanSuccess = async (decodedText: string) => {
        console.log("🔔 QR detectado:", decodedText);
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
      } catch (err) {
        console.warn("Cámara trasera no disponible, intentando frontal...");
        try {
          await html5QrCode.start(
            { facingMode: "user" },
            config,
            onScanSuccess,
            onScanFailure
          );
          setScannerStatus("escaneando");
        } catch (error) {
          console.error("Error con cámara frontal:", error);
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

  // 🔹 Eliminar usuario
  const handleEliminar = async () => {
    if (!usuarioEncontrado) {
      setErrorMsg("No hay usuario válido para eliminar.");
      return;
    }

    const selectedId = usuarioEncontrado.id;
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
          // ignorar parse errors
        }
        throw new Error(`Error eliminando usuario${backendMsg}`);
      }

      const nuevos = usuarios.filter((u) => u.id !== selectedId);
      setUsuarios(nuevos);
      usuariosRef.current = nuevos;
      localStorage.setItem("usuarios", JSON.stringify(nuevos));

      onClose();
    } catch (err: unknown) {
      console.error("Error eliminando usuario:", err);
      let message = "Error eliminando usuario";
      if (err instanceof Error) message = err.message;
      else if (typeof err === "string") message = err;
      setErrorMsg(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="login-container card">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ width: "33%" }} />
          <div style={{ width: "33%", textAlign: "center" }}>
            <p className="m-0 fw-bold">Escanear QR</p>
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

            {scannerStatus === "iniciando" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "10px 20px",
                  borderRadius: "5px",
                }}
              >
                Iniciando cámara...
              </div>
            )}

            {scannerStatus === "escaneando" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "0",
                  right: "0",
                  textAlign: "center",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "5px",
                  fontSize: "14px",
                }}
              >
                Escaneando... acerca el código QR
              </div>
            )}
          </div>
        )}

        {/* Resultado del QR */}
        {qrContent && (
          <div
            className={`alert ${
              usuarioEncontrado ? "alert-success" : "alert-warning"
            } mt-3`}
          >
            <strong>ID escaneado:</strong> {qrContent}
            <br />
            {usuarioEncontrado ? (
              <>
                <strong>Nombre:</strong> {usuarioEncontrado.name}
              </>
            ) : (
              <span className="text-danger">⚠ Usuario no encontrado</span>
            )}
          </div>
        )}

        {/* Botón Eliminar */}
        {usuarioEncontrado && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-danger"
              onClick={handleEliminar}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar usuario"}
            </button>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Información */}
        {scannerStatus !== "detenido" && (
          <div className="alert alert-info mt-3">
            <small>
              <strong>Instrucciones:</strong> Asegúrate de permitir el acceso a
              la cámara cuando el navegador lo solicite.
            </small>
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
