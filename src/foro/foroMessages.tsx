import React from "react";
import { Mensaje } from "../foro/useForo";

interface ChatMessagesProps {
  mensajes: Mensaje[];
  currentUserId: string | null;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  mensajes,
  currentUserId,
}) => {
  if (mensajes.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <p>No hay mensajes aún</p>
        <small>¡Sé el primero en escribir!</small>
      </div>
    );
  }

  return (
    <div
      className="chat-messages"
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      {mensajes.map((mensaje) => (
        <div
          key={mensaje._id}
          className={`message-container d-flex mb-2 ${
            mensaje.userId === currentUserId
              ? "justify-content-end"
              : "justify-content-start"
          }`}
        >
          <div
            className={`message-bubble rounded ${
              mensaje.userId === currentUserId
                ? "bg-primary text-white"
                : "bg-light border text-dark"
            }`}
            style={{
              maxWidth: "75%",
              padding: "6px 14px",
              // Margen derecho para mis mensajes, margen izquierdo para mensajes de otros
              marginRight: mensaje.userId === currentUserId ? "8px" : "0px",
              marginLeft: mensaje.userId === currentUserId ? "0px" : "8px",
            }}
          >
            {/* Línea 1: Nombre del usuario */}
            <div className="message-user mb-1">
              <strong
                className={
                  mensaje.userId === currentUserId ? "text-white" : "text-dark"
                }
                style={{ fontSize: "0.68rem" }}
              >
                {mensaje.userId === currentUserId ? "Tú" : mensaje.userName}
              </strong>
            </div>

            {/* Línea 2: Texto del mensaje */}
            <div className="message-text mb-1" style={{ fontSize: "0.95rem" }}>
              {mensaje.texto}
            </div>

            {/* Línea 3: Rol y hora juntos */}
            <div className="message-meta d-flex align-items-center gap-1">
              {mensaje.userEstado !== "usuario" && (
                <small
                  className={`badge ${
                    mensaje.userId === currentUserId
                      ? "bg-light text-dark"
                      : "bg-secondary text-white"
                  }`}
                  style={{
                    fontSize: "0.55rem",
                    padding: "2px 4px",
                  }}
                >
                  {mensaje.userEstado}
                </small>
              )}
              <small
                className={`opacity-75 ${
                  mensaje.userId === currentUserId
                    ? "text-white-50"
                    : "text-muted"
                }`}
                style={{
                  fontSize: "0.6rem",
                  lineHeight: "1",
                }}
              >
                {new Date(mensaje.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
