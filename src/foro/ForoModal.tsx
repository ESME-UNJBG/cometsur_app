// src/foro/ChatModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../foro/useForo";
import { ChatMessages } from "../foro/foroMessages";
import { ChatInput } from "../foro/foroInput";
//import { ChatStatus } from "../foro/foroStatus";
import "../css/chatModal.css";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const {
    mensaje,
    mensajes,
    estaConectado,
    conectando,
    currentUser,
    setMensaje,
    enviarMensaje,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true);

  // 🔥 NUEVO: CORRECCIÓN DE DESPLAZAMIENTO AL ABRIR MODAL
  useEffect(() => {
    if (!isOpen) return;

    // Pequeño delay para asegurar que el DOM esté renderizado
    const timer = setTimeout(() => {
      // Forzar el centrado del modal y prevenir desplazamiento
      const modalElement = document.querySelector(
        ".modal.fade.show.d-block.chat-modal-override"
      );
      if (modalElement) {
        // Scroll al inicio del viewport para evitar desplazamiento hacia arriba
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });

        // Asegurar que el body no tenga scroll
        document.body.classList.add("modal-open");
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // 1. SCROLL AL ABRIR EL MODAL - Solo una vez al inicio
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para asegurar que el DOM está renderizado
      setTimeout(() => {
        scrollToBottom();
        setIsAutoScrollEnabled(true);
      }, 100);
    }
  }, [isOpen]);

  // 2. SCROLL AUTOMÁTICO SOLO PARA MENSAJES PROPIOS
  useEffect(() => {
    if (mensajes.length === 0) return;

    const lastMessage = mensajes[mensajes.length - 1];
    const isOwnMessage = currentUser && lastMessage.userId === currentUser.id;

    if (isOwnMessage && isAutoScrollEnabled) {
      // Scroll inmediato para mensajes propios
      scrollToBottom();
    } else if (!isOwnMessage && isAutoScrollEnabled) {
      // Scroll para mensajes de otros solo si el auto-scroll está activado
      scrollToBottom();
    } else if (!isOwnMessage && !isAutoScrollEnabled) {
      // Mostrar botón de nuevos mensajes si no está en auto-scroll
      setNewMessagesCount((prev) => prev + 1);
    }
  }, [mensajes, currentUser, isAutoScrollEnabled]);

  // 3. DETECTAR CUANDO EL USUARIO HACE SCROLL MANUAL
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Si el usuario scrollea hacia arriba (más de 100px desde el fondo), desactivar auto-scroll
    if (distanceFromBottom > 100) {
      setIsAutoScrollEnabled(false);
    } else {
      // Si está cerca del fondo, reactivar auto-scroll
      setIsAutoScrollEnabled(true);
      setNewMessagesCount(0);
    }
  };

  // 4. FUNCIÓN SIMPLE DE SCROLL
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  // 5. MANEJO MANUAL DEL SCROLL
  const handleManualScrollToBottom = () => {
    scrollToBottom();
    setIsAutoScrollEnabled(true);
    setNewMessagesCount(0);
  };

  // 6. MANEJO DE TECLADO
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="modal-backdrop show"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      {/* Modal principal - CORREGIDO EL CENTRADO */}
      <div
        className="modal fade show d-block chat-modal-override"
        tabIndex={-1}
        style={{
          zIndex: 1050,
          display: isOpen ? "flex" : "none",
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg foro-modal-dialog">
          <div className="modal-content foro-modal-content">
            {/* Header */}
            <div className="modal-header foro-header">
              <h5 className="modal-title foro-title">💬 Foro</h5>
              <button
                type="button"
                className="foro-close-btn"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body p-0">
              {/*<div className="px-3 pt-3">
                <ChatStatus
                  estaConectado={estaConectado}
                  conectando={conectando}
                  currentUser={currentUser}
                />
              </div>*/}

              {/* Área de mensajes con scroll */}
              <div className="position-relative">
                <div
                  ref={scrollContainerRef}
                  className="chat-messages-container"
                  onScroll={handleScroll}
                >
                  <ChatMessages
                    mensajes={mensajes}
                    currentUserId={currentUser?.id || null}
                  />
                  <div ref={messagesEndRef} />
                </div>

                {/* Botón de nuevos mensajes */}
                {newMessagesCount > 0 && (
                  <div className="foro-new-messages-indicator">
                    <button
                      className="foro-new-messages-btn"
                      onClick={handleManualScrollToBottom}
                      title={`Ver ${newMessagesCount} mensaje${
                        newMessagesCount > 1 ? "s" : ""
                      } nuevo${newMessagesCount > 1 ? "s" : ""}`}
                    >
                      <span>↓</span>
                      <span className="foro-new-messages-badge">
                        {newMessagesCount}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Área de input */}
              <div className="foro-input-container">
                <ChatInput
                  mensaje={mensaje}
                  setMensaje={setMensaje}
                  enviarMensaje={enviarMensaje}
                  estaConectado={estaConectado}
                  conectando={conectando}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
