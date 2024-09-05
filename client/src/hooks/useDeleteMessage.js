import { useCallback } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useDeleteMessage = () => {
  const setMessages = useStore((state) => state.setMessages);

  const deleteMessage = useCallback(
    async (messageId, receiver) => {
      try {
        const response = await fetch(
          `http://localhost:5000/message/${messageId}`,
          {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiver }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete message");
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, isDeleted: true, message: "Message deleted" }
              : msg
          )
        );
        toast.success("Message deleted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
    [setMessages]
  );

  return { deleteMessage };
};
