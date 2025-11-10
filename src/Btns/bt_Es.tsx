import React, { useState } from "react";
import "../css/bt.css";
import ComputadoraModal from "../accesos/comp_Es";
import CelularModal from "../accesos/cel_Es";

interface EsProps {
  onClose: () => void;
}

const Es: React.FC<EsProps> = ({ onClose }) => {
  const [showComputadoraModal, setShowComputadoraModal] = useState(false);
  const [showCelularModal, setShowCelularModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => onClose(), 300); // 300 ms coincide con el CSS
  };

  const handleOpenCelular = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowCelularModal(true);
    }, 300);
  };

  const handleOpenComputadora = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowComputadoraModal(true);
    }, 300);
  };

  return (
    <>
      {!showCelularModal && !showComputadoraModal && (
        <div
          className={`es-container ${
            fadeOut ? "fade-exit-active" : "fade-enter-active"
          }`}
        >
          <div className="es-card">
            <button
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>

            <h5>Check-in Digital</h5>

            <div className="es-buttons">
              <button
                className="es-btn es-btn-phone"
                onClick={handleOpenCelular}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-phone"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                  <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                </svg>
                Celular
              </button>

              <button
                className="es-btn es-btn-computer"
                onClick={handleOpenComputadora}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-pc-display-horizontal"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0z" />
                </svg>
                Computadora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Renderizar los modales posteriores */}
      {showCelularModal && <CelularModal onClose={onClose} />}
      {showComputadoraModal && <ComputadoraModal onClose={onClose} />}
    </>
  );
};

export default Es;
