import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useGetMessages = () => {
  const [loadingMsgs, setLoading] = useState(false);
  const { selectedContact, setMessages, selectedGroup } = useStore((state) => ({
    selectedContact: state.selectedContact,
    setMessages: state.setMessages,
    selectedGroup: state.selectedGroup,
  }));

  const getMessages = useCallback(async () => {
    if (selectedContact || selectedGroup) {
      // url to be decided based on direct message or group
      // console.log(selectedGroup);
      const url = selectedGroup
        ? `http://localhost:5000/message/group/${selectedGroup.participants}/messages?isGroup=true`
        : `http://localhost:5000/message/${selectedContact._id}?isGroup=false`;

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
        setMessages(data);
        // console.log(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  }, [selectedContact, selectedGroup, setMessages]);
  return { loadingMsgs, getMessages };
};
