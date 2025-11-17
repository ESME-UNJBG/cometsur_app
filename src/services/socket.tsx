import { io, Socket } from "socket.io-client";
import { API_URL } from "../config";
let socket: Socket | null = null;

export const initSocket = (opts?: { token?: string }): Socket | null => {
  const token = opts?.token ?? localStorage.getItem("Token");

  if (!token) {
    console.warn("⚠️ [SOCKET] initSocket: falta el token JWT");
    return null;
  }

  if (socket) {
    console.log("🔄 [SOCKET] Cerrando conexión anterior...");
    socket.disconnect();
    socket = null;
  }

  console.log("🔌 [SOCKET] Creando NUEVA conexión...");

  socket = io(`${API_URL}`, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: { token },
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("✅ [SOCKET] Conectado - ID:", socket?.id);
  });

  socket.on("conexion_establecida", (data) => {
    console.log("🎉 [SOCKET] Autenticación exitosa:", data);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ [SOCKET] Error de conexión:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 [SOCKET] Desconectado:", reason);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
export const isSocketConnected = (): boolean => socket?.connected ?? false;

export const waitForConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (socket?.connected) {
      resolve(true);
      return;
    }

    const timeout = setTimeout(() => {
      socket?.off("connect", onConnect);
      resolve(false);
    }, 5000);

    const onConnect = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    socket?.on("connect", onConnect);
  });
};

export const cleanupSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default initSocket;
