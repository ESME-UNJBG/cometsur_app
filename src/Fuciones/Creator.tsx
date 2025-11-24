import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ima3 from "../Fuciones/imag/cometsur.png";
import "../css/QrCode.css";

const QrWithLogo = () => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const qrValue = "https://cometsur-app.onrender.com";

  const downloadPNG = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    const size = canvas.width;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    // Dibujar QR
    ctx.drawImage(canvas, 0, 0);

    // Dibujar logo cuando se cargue
    const logo = new Image();
    logo.src = ima3;
    logo.onload = () => {
      const logoSize = size * 0.25;
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;
      ctx.drawImage(logo, x, y, logoSize, logoSize);

      // Descargar PNG
      const link = document.createElement("a");
      link.href = tempCanvas.toDataURL("image/png");
      link.download = "cometsur-qr.png";
      link.click();
    };
    logo.onerror = () => alert("No se pudo cargar el logo");
  };

  return (
    <div className="qr-generator-container">
      <h3>QR Oficial COMETSUR</h3>
      <QRCodeCanvas
        value={qrValue}
        size={250}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        ref={qrRef}
      />
      <button onClick={downloadPNG}>Descargar PNG con logo</button>
    </div>
  );
};

export default QrWithLogo;
