import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ima3 from "../Fuciones/imag/cometsur.png"; // ✅ tu logo
import "../css/QrCode.css";

const QRCodeExample = () => {
  const userId = localStorage.getItem("userId"); // ID único de Mongo
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setUserName(localStorage.getItem("userName"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="qr-container">
      <h4>Credenciales</h4>
      <div className="qr-content">
        {userId ? (
          <div className="qr-wrapper">
            <QRCodeCanvas
              value={userId}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              className="qr-code"
            />
            {/* ✅ Logo centrado */}
            <img src={ima3} alt="Logo empresa" className="qr-logo" />
          </div>
        ) : (
          <p>Cargando el ID de usuario...</p>
        )}

        {/* 👤 Información del usuario */}
        <div className="user-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bi bi-person user-icon"
            viewBox="0 0 16 16"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
          </svg>
          <div className="user-name">{userName ?? "Cargando nombre..."}</div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeExample;
