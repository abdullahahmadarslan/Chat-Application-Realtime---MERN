import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useGetMessages = () => {
  const [loadingMsgs, setLoading] = useState(false);
  const { selectedContact, setMessages } = useAuth();

  const getMessages = async () => {
    if (selectedContact) {
      setLoading(true);
      try {
        const serverResponse = await fetch(
          `http://localhost:5000/message/${selectedContact._id}`,
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          setMessages([]);
        }
        setMessages(data);
        // console.log(data);
      } catch (error) {
        toast.error("useGetMessages" + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };
  return { loadingMsgs, getMessages };
};
