import React from "react";

interface ChatInputProps {
  mensaje: string;
  setMensaje: (mensaje: string) => void;
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
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
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
            conectando
              ? "Conectando..."
              : estaConectado
              ? "Escribe tu mensaje..."
              : "Desconectado"
          }
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!estaConectado || conectando}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!estaConectado || conectando || !mensaje.trim()}
        >
          {conectando ? "⌛" : "📤"}
        </button>
      </div>
    </form>
  );
};
