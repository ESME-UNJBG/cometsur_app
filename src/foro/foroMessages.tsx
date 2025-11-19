// src/foro/foroMessages.tsx
import React from "react";
import { Mensaje } from "./useForo";

interface ChatMessagesProps {
  mensajes: Mensaje[];
  currentUserId: string | null;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  mensajes,
  currentUserId,
}) => {
  return (
    <div className="chat-messages">
      {mensajes.map((msg) => {
        const esPropio = msg.userId === currentUserId;

        return (
          <div
            key={msg._id}
            className={`d-flex mb-3 ${
              esPropio ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`message-bubble p-2 rounded-3 ${
                esPropio
                  ? "bg-success text-white ms-auto" // CAMBIADO: bg-primary → bg-success
                  : "custom-dark-gray text-white me-auto" // MANTENIDO: bg-light
              }`}
              style={{ maxWidth: "80%" }}
            >
              {/* FILA 1: NOMBRE */}
              <div
                className="fw-semibold text-start"
                style={{ fontSize: "0.6rem" }}
              >
                {msg.userName}
              </div>

              {/* FILA 2: TEXTO */}
              <div
                className="mt-1 text-start"
                style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
              >
                {msg.texto}
              </div>

              {/* FILA 3: HORA */}
              <div className="d-flex justify-content-between align-items-center mt-2 small opacity-75">
                {msg.userEstado && ( // MOSTRAR CUALQUIER userEstado
                  <span
                    className="badge bg-secondary text-white ms-0"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {msg.userEstado}
                  </span>
                )}
                <span></span>{" "}
                {/* Espacio vacío para alinear hora a la derecha */}
                <span style={{ fontSize: "0.6rem" }}>
                  {new Date(msg.timestamp).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
