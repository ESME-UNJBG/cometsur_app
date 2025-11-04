// src/foro/ChatModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../foro/useForo";
import { ChatMessages } from "../foro/foroMessages";
import { ChatInput } from "../foro/foroInput";
import { ChatStatus } from "../foro/foroStatus";

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

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const [isUserNearBottom, setIsUserNearBottom] = useState<boolean>(true);
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
  const prevMessagesCountRef = useRef<number>(mensajes.length);

  const detectScrollContainer = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return null;
    const inner = wrapper.querySelector<HTMLElement>(".chat-messages");
    if (inner) return inner;
    return wrapper;
  };

  const handleScroll = () => {
    const c = scrollContainerRef.current;
    if (!c) return;
    const scrollTop = c.scrollTop;
    const scrollHeight = c.scrollHeight;
    const clientHeight = (c as HTMLElement).clientHeight;
    const distance = scrollHeight - scrollTop - clientHeight;
    const near = distance < 120;
    setIsUserNearBottom(near);
    if (near) setNewMessagesCount(0);
  };

  useEffect(() => {
    const container = detectScrollContainer();
    scrollContainerRef.current = container;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
      scrollContainerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const scrollToBottom = () => {
    const c = scrollContainerRef.current;
    if (!c) return;
    c.scrollTop = c.scrollHeight;
    setNewMessagesCount(0);
    setIsUserNearBottom(true);
  };

  useEffect(() => {
    const prev = prevMessagesCountRef.current;
    const now = mensajes.length;
    const added = now - prev;
    prevMessagesCountRef.current = now;

    if (added <= 0) {
      return;
    }

    const lastMsg = mensajes[mensajes.length - 1];
    const lastIsOwn =
      lastMsg && currentUser && lastMsg.userId === currentUser.id;

    if (lastIsOwn) {
      scrollToBottom();
      return;
    }

    if (isUserNearBottom) {
      scrollToBottom();
      return;
    }

    setNewMessagesCount((c) => c + added);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajes, currentUser]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        const container = detectScrollContainer();
        if (container) {
          if (
            scrollContainerRef.current &&
            scrollContainerRef.current !== container
          ) {
            scrollContainerRef.current.removeEventListener(
              "scroll",
              handleScroll
            );
          }
          scrollContainerRef.current = container;
          scrollContainerRef.current.addEventListener("scroll", handleScroll, {
            passive: true,
          });
          container.scrollTop = container.scrollHeight;
        }
      }, 60);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">💬 Foro</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          <div className="modal-body p-0">
            <div className="px-3 pt-3">
              <ChatStatus
                estaConectado={estaConectado}
                conectando={conectando}
                currentUser={currentUser}
              />
            </div>

            <div className="position-relative">
              <div
                ref={wrapperRef}
                style={{
                  minHeight: 300,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                <ChatMessages
                  mensajes={mensajes}
                  currentUserId={currentUser?.id || null}
                />
                <div />
              </div>

              {/* BOTÓN MINIMALISTA - SIN NÚMERO */}
              {newMessagesCount > 0 && (
                <div
                  className="position-absolute"
                  style={{
                    bottom: "15px",
                    right: "15px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    className="btn btn-light btn-sm shadow-sm"
                    onClick={scrollToBottom}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      border: "1px solid #dee2e6",
                      backgroundColor: "white",
                    }}
                    title="Ver mensajes nuevos"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>

            {/* MÁS ESPACIO EN EL ÁREA DE ESCRITURA */}
            <div className="border-top mx-3 py-3">
              {" "}
              {/* Aumentado a py-3 */}
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
  );
};

export default ChatModal;
