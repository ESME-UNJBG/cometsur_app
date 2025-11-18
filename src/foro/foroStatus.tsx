// src/foro/foroStatus.tsx
import React from "react";

interface ChatStatusProps {
  estaConectado: boolean;
  conectando: boolean;
  currentUser: { id: string; name: string } | null;
}

export const ChatStatus: React.FC<ChatStatusProps> = ({
  estaConectado,
  conectando,
  currentUser,
}) => {
  const getStatusInfo = () => {
    if (conectando) {
      return {
        text: "🔄 Conectando...",
        variant: "warning",
      };
    }

    if (estaConectado && currentUser) {
      return {
        text: `✅ Conectado como ${currentUser.name}`,
        variant: "success",
      };
    }

    return {
      text: "❌ Desconectado del servidor",
      variant: "danger",
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`alert alert-${status.variant} py-2 px-3 mb-2`}>
      <small>{status.text}</small>
    </div>
  );
};

export default ChatStatus;
