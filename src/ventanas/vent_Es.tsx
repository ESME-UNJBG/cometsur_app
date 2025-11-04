import React from "react";
import Es from "../Btns/bt_Es";

interface VentanaEsProps {
  show: boolean;
  onClose: () => void;
}

const VentanaEs: React.FC<VentanaEsProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="ventana-overlay" onClick={onClose}>
      <div className="ventana-content" onClick={(e) => e.stopPropagation()}>
        <Es onClose={onClose} />
      </div>
    </div>
  );
};

export default VentanaEs;
