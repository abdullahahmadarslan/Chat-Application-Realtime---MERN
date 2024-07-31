import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const useSendMsg = () => {
  const [loading, setLoading] = useState(false);
  const { selectedContact, setMessages, selectedGroup } = useAuth();

  const sendMsg = async (message) => {
    setLoading(true);
    try {
      // url to be decided based on direct message or group
      const url = selectedGroup
        ? `http://localhost:5000/message/group/sndMsg/${selectedGroup.participants}`
        : `http://localhost:5000/message/sendMsg/${selectedContact._id}`;

      const serverResponse = await fetch(url, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      console.log("msg rcvd", data.newMessage);
      setMessages((prevMessages) =>
        Array.isArray(prevMessages) && prevMessages.length > 0
          ? [...prevMessages, data.newMessage]
          : [data.newMessage]
      );
      toast.success("message sent successfully");
    } catch (error) {
      toast.error("useSendMsg" + error.message);
      console.log(error);
    }
    setLoading(false);
  };
  return { loading, sendMsg };
};
