import React from "react";
import RegisterForm from "../Btns/Register";

interface VentanaReProps {
  show: boolean;
  onClose: () => void;
}

const VentanaRe: React.FC<VentanaReProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="ventana-overlay" onClick={onClose}>
      <div className="ventana-content" onClick={(e) => e.stopPropagation()}>
        <RegisterForm show={show} onClose={onClose} />
      </div>
    </div>
  );
};

export default VentanaRe;
