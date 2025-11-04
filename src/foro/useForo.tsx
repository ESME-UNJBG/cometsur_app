// src/foro/useForo.ts
import { useEffect, useState, useRef, useCallback } from "react";
import initSocket, {
  waitForConnection,
  cleanupSocket,
} from "../services/socket";
import { Socket } from "socket.io-client";

export interface Mensaje {
  _id: string;
  userId: string;
  userName: string;
  texto: string;
  timestamp: string;
  userEstado: string;
  expiresAt: string;
  // campos locales/optativos
  esPropio?: boolean;
  pending?: boolean;
}

interface UseChatReturn {
  mensaje: string;
  mensajes: Mensaje[];
  estaConectado: boolean;
  conectando: boolean;
  currentUser: { id: string; name: string } | null;
  setMensaje: (mensaje: string) => void;
  enviarMensaje: () => void;
  desconectar: () => void;
  reconectar: () => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const [mensaje, setMensaje] = useState<string>("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [estaConectado, setEstaConectado] = useState<boolean>(false);
  const [conectando, setConectando] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const mensajesRecibidosRef = useRef<Set<string>>(new Set());

  const obtenerUsuario = useCallback(() => {
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!token || !userId || !userName) return null;
    return { id: userId, name: userName, token };
  }, []);

  const desconectar = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    cleanupSocket();
    setEstaConectado(false);
    setConectando(false);
    setCurrentUser(null);
    mensajesRecibidosRef.current.clear();
  }, []);

  const conectar = useCallback(async () => {
    const usuario = obtenerUsuario();
    if (!usuario) {
      console.warn("❌ [CHAT] No hay usuario logueado");
      return;
    }

    desconectar();
    setConectando(true);

    try {
      const socket = initSocket({ token: usuario.token });
      if (!socket) throw new Error("No se pudo crear el socket");

      socketRef.current = socket;

      const conectado = await waitForConnection();
      if (!conectado) throw new Error("Timeout de conexión");

      // manejar mensajes desde servidor
      socket.on("mensaje_general", (serverMsg: Mensaje) => {
        if (!serverMsg || !serverMsg._id) return;

        // si ya procesamos este id, salir
        if (mensajesRecibidosRef.current.has(serverMsg._id)) return;
        mensajesRecibidosRef.current.add(serverMsg._id);

        setMensajes((prev) => {
          // Intentar encontrar mensaje local 'pending' similar (mismo userId y mismo texto)
          const idx = prev.findIndex(
            (m) =>
              m.pending &&
              m.userId === serverMsg.userId &&
              m.texto === serverMsg.texto
          );

          if (idx !== -1) {
            // reemplazar la versión local pendiente por la del servidor
            const copy = [...prev];
            copy[idx] = serverMsg;
            return copy;
          }

          // Si no hay pendiente, añadir si no existe
          const existe = prev.some((m) => m._id === serverMsg._id);
          return existe ? prev : [...prev, serverMsg];
        });
      });

      socket.on("mensajes_historicos", (msgs: Mensaje[]) => {
        const validos = Array.isArray(msgs)
          ? msgs.filter((m) => m && m._id)
          : [];
        mensajesRecibidosRef.current.clear();
        validos.forEach((m) => mensajesRecibidosRef.current.add(m._id));
        setMensajes(validos);
      });

      socket.on("disconnect", () => {
        setEstaConectado(false);
      });

      setCurrentUser({ id: usuario.id, name: usuario.name });
      setEstaConectado(true);
      setConectando(false);
    } catch (err) {
      console.error("❌ [CHAT] Error conectando:", err);
      setConectando(false);
      setEstaConectado(false);
    }
  }, [obtenerUsuario, desconectar]);

  const reconectar = useCallback(async () => {
    await conectar();
  }, [conectar]);

  // enviar mensaje con UI optimista
  const enviarMensaje = useCallback(() => {
    if (!socketRef.current || !estaConectado || !currentUser) {
      alert("❌ No estás conectado");
      return;
    }

    const texto = mensaje.trim();
    if (!texto) {
      alert("⚠️ Mensaje vacío");
      return;
    }

    // crear mensaje local optimista
    const localId = `local-${Date.now()}`;
    const now = new Date().toISOString();
    const localMsg: Mensaje = {
      _id: localId,
      userId: currentUser.id,
      userName: currentUser.name,
      texto,
      timestamp: now,
      userEstado: "usuario",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      esPropio: true,
      pending: true,
    };

    // añadir localmente YA (optimistic UI)
    setMensajes((prev) => [...prev, localMsg]);

    // limpiar input inmediatamente
    setMensaje("");

    // emitir al servidor
    // (si tu backend acepta extra fields, podrías enviar localId; si no, no importa)
    socketRef.current.emit("mensaje", { texto });

    // Nota: el servidor emitirá luego el mensaje real con _id,
    // el handler 'mensaje_general' reemplazará el pending por el server msg
  }, [mensaje, estaConectado, currentUser]);

  // intentar conectar si hay credenciales
  useEffect(() => {
    const verificarYConectar = () => {
      const usuario = obtenerUsuario();
      if (usuario && !estaConectado && !conectando) {
        conectar();
      }
    };
    const interval = setInterval(verificarYConectar, 2000);
    verificarYConectar();
    return () => clearInterval(interval);
  }, [obtenerUsuario, conectar, estaConectado, conectando]);

  // limpiar mensajes expirados
  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = Date.now();
      setMensajes((prev) =>
        prev.filter((m) => {
          try {
            return ahora - new Date(m.timestamp).getTime() < 30 * 60 * 1000;
          } catch {
            return false;
          }
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    mensaje,
    mensajes,
    estaConectado,
    conectando,
    currentUser,
    setMensaje,
    enviarMensaje,
    desconectar,
    reconectar,
  };
};
