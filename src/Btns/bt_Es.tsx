import React, { useState } from "react";
import "../css/Ventana.css";
import ComputadoraModal from "..//accesos/comp_Es"; // 👈 importar el nuevo modal
import CelularModal from "../accesos/cel_Es";
interface EsProps {
  onClose: () => void;
}

const Es: React.FC<EsProps> = ({ onClose }) => {
  const [showComputadoraModal, setShowComputadoraModal] =
    useState<boolean>(false);
  const [showCelularModal, setShowCelularModal] = useState<boolean>(false);

  return (
    <>
      <div className="login-container card">
        <div className="card-body">
          {/* 🔹 Fila superior: texto centrado + botón cerrar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ width: "33%" }}></div>
            <div style={{ width: "33%", textAlign: "center" }}>
              <p className="m-0 fw-bold">Check-in Digital</p>
            </div>
            <div style={{ width: "33%", textAlign: "right" }}>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
          </div>

          {/* 🔹 Botón de celular */}
          <div className="d-flex justify-content-between mt-3">
            <button
              type="button"
              className="btn text-white w-50 me-2"
              style={{ background: "#2e6f70" }}
              onClick={() => setShowCelularModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-phone"
                viewBox="0 0 16 16"
              >
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
            </button>

            {/* 🔹 Botón de computadora */}
            <button
              type="button"
              className="btn text-white w-50 ms-2"
              style={{ background: "#6b2d3c" }}
              onClick={() => setShowComputadoraModal(true)} // 👈 abre la ventana
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-pc-display-horizontal"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Renderizamos el modal de computadora */}
      {showComputadoraModal && (
        <ComputadoraModal onClose={() => setShowComputadoraModal(false)} />
      )}
      {/* Modal Celular */}
      {showCelularModal && (
        <CelularModal onClose={() => setShowCelularModal(false)} />
      )}
    </>
  );
};
export default Es;
