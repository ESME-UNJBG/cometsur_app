// src/foro/foroInput.tsx
import React from "react";

interface ChatInputProps {
  mensaje: string;
  setMensaje: (v: string) => void;
  enviarMensaje: () => void;
  estaConectado: boolean;
  conectando: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  mensaje,
  setMensaje,
  enviarMensaje,
  estaConectado,
  conectando,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarMensaje();
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={
            !estaConectado
              ? "Conectando..."
              : conectando
              ? "Conectando al chat…"
              : "Escribe un mensaje..."
          }
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          disabled={!estaConectado || conectando}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!mensaje.trim() || !estaConectado || conectando}
          title="Enviar mensaje"
        >
          ➤
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
