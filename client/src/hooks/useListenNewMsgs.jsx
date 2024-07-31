import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const useListenNewMsgs = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) =>
        Array.isArray(prevMessages)
          ? [...prevMessages, newMessage]
          : [newMessage]
      );
    };

    const handleMessageEdited = (editedMessage) => {
      setMessages((prevMessages) =>
        Array.isArray(prevMessages)
          ? prevMessages.map((msg) =>
              msg._id === editedMessage._id
                ? { ...msg, message: editedMessage.message, isEdited: true }
                : msg
            )
          : []
      );
    };

    const handleMessageDeleted = (deletedMessage) => {
      setMessages((prevMessages) =>
        Array.isArray(prevMessages)
          ? prevMessages.map((msg) =>
              msg._id === deletedMessage._id
                ? { ...msg, isDeleted: true, message: "Message deleted" }
                : msg
            )
          : []
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, setMessages, messages]);
};
