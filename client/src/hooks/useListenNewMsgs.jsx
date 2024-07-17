// hooks/useListenNewMsgs.js

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const useListenNewMsgs = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
    // eslint-disable-next-line
  }, []);
};
