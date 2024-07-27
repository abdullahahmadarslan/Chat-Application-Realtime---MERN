import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useDeleteMessage = () => {
  const { setMessages } = useAuth();

  const deleteMessage = async (messageId) => {
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
      toast.error("useDeleteMessage", error.message);
    }
  };

  return { deleteMessage };
};
