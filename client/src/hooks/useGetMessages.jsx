import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useGetMessages = () => {
  const [loadingMsgs, setLoading] = useState(false);
  const { selectedContact, setMessages, selectedGroup } = useAuth();

  const getMessages = async () => {
    if (selectedContact || selectedGroup) {
      // url to be decided based on direct message or group
      // console.log(selectedGroup);
      const url = selectedGroup
        ? `http://localhost:5000/message/group/${selectedGroup.participants}/messages`
        : `http://localhost:5000/message/${selectedContact._id}`;

      setLoading(true);
      try {
        const serverResponse = await fetch(url, {
          method: "GET",
          withCredentials: true,
          credentials: "include",
        });
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          setMessages([]);
        }
        // console.log(data);

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
