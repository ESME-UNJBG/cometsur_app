import React from "react";
import Ac from "../Btns/bt_Ac";

interface VentanaAcProps {
  show: boolean;
  onClose: () => void;
}

const VentanaAc: React.FC<VentanaAcProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="ventana-overlay" onClick={onClose}>
      <div className="ventana-content" onClick={(e) => e.stopPropagation()}>
        <Ac onClose={onClose} />
      </div>
    </div>
  );
};

export default VentanaAc;
