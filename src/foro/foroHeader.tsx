// src/foro/ForoHeader.tsx
import React from "react";

interface ForoHeaderProps {
  onClose: () => void;
}

const ForoHeader: React.FC<ForoHeaderProps> = ({ onClose }) => {
  return (
    <div className="foro-header">
      <h5 className="foro-title">💬 Foro en Tiempo Real</h5>

      {/* botón simple con X visible y accesible */}
      <button
        className="foro-close-btn"
        onClick={onClose}
        aria-label="Cerrar foro"
        type="button"
      >
        ✕
      </button>
    </div>
  );
};

export default ForoHeader;
