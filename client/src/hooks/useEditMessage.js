import { toast } from "react-toastify";
import useStore from "../stores/useStore";
import { useCallback } from "react";

export const useEditMessage = () => {
  const setMessages = useStore((state) => state.setMessages);

  const editMessage = useCallback(
    async (messageId, newMessage) => {
      try {
        const response = await fetch(
          `http://localhost:5000/message/${messageId}`,
          {
            method: "PUT",
            credentials: "include",
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage }),
          }
        );
        // console.log(response);

        if (!response.ok) {
          throw new Error("Failed to edit message");
        }

        // const updatedMessage = await response.json();

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, message: newMessage, isEdited: true }
              : msg
          )
        );

        toast.success("Message edited successfully");
      } catch (error) {
        return toast.error(error.message);
      }
    },
    [setMessages]
  );
  return { editMessage };
};
