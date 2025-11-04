import React from "react";

interface ForoHeaderProps {
  onClose: () => void;
}

const ForoHeader: React.FC<ForoHeaderProps> = ({ onClose }) => {
  return (
    <div className="modal-header">
      <h5 className="modal-title">💬 Foro en Tiempo Real</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

export default ForoHeader;
