import React, { useState } from "react";
import { ChatModal } from "../foro/ForoModal";

export const ChatButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <span>💬</span>
        Chat
      </button>

      <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ChatButton;
