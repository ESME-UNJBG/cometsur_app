import React from "react";
import De from "../Btns/bt_De";

interface VentanaDeProps {
  show: boolean;
  onClose: () => void;
}

const VentanaDe: React.FC<VentanaDeProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="ventana-overlay" onClick={onClose}>
      <div className="ventana-content" onClick={(e) => e.stopPropagation()}>
        <De onClose={onClose} />
      </div>
    </div>
  );
};

export default VentanaDe;
