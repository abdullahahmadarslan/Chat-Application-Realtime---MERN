import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useSendMsg = () => {
  const [loading, setLoading] = useState(false);
  const { selectedContact, setMessages, selectedGroup } = useStore((state) => ({
    selectedContact: state.selectedContact,
    setMessages: state.setMessages,
    selectedGroup: state.selectedGroup,
  }));

  const sendMsg = useCallback(
    async (message, type, isSafe = true) => {
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
          body: JSON.stringify({
            message,
            type,
            isGroup: selectedGroup ? true : false,
            isSafe,
          }),
        });
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          throw new Error(data.message);
        }
        // console.log("msg rcvd", data.populatedMessage);

        // setMessages((prevMessages) =>
        //   Array.isArray(prevMessages) && prevMessages.length > 0
        //     ? [...prevMessages, data.newMessage]
        //     : [data.newMessage]
        // );
        setMessages((prevMessages) => {
          return prevMessages.length > 0
            ? [...prevMessages, data.populatedMessage]
            : [data.populatedMessage];
        });

        // toast.success("message sent successfully");
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
      setLoading(false);
    },
    [selectedContact, selectedGroup, setMessages]
  );

  return { loading, sendMsg };
};
