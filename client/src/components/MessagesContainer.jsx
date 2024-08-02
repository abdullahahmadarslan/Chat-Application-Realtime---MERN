import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { IoIosSend } from "react-icons/io";
import { useSendMsg } from "../hooks/useSendMsg";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useGetMessages } from "../hooks/useGetMessages";
import { useListenNewMsgs } from "../hooks/useListenNewMsgs";
import ChatLoader from "../skeletons/ChatLoader";
import WelcomeScreen from "./WelcomeScreen";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import { useEditMessage } from "../hooks/useEditMessage";
import { AttachmentButton } from "./AttachmentButton";

// const MessagesLoader = () => {
//   return <div className="text-center">Loading messages...</div>;
// };

export const MessagesContainer = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMsg } = useSendMsg();
  const { selectedContact, setSelectedContact, messages, selectedGroup } =
    useAuth();
  const { getMessages, loadingMsgs } = useGetMessages();
  const lastMessageRef = useRef(null); // Reference to the last message
  const { deleteMessage } = useDeleteMessage();
  const { editMessage } = useEditMessage();

  // actively listening for new messages
  useListenNewMsgs();

  // Getting messages between the current user and the selected contact
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await getMessages();
      } catch (error) {
        toast.error("message container" + error.message);
      }
    };
    fetchMessages();
    // console.log(selectedContact);
    // eslint-disable-next-line
  }, [selectedContact, selectedGroup]);

  // Scroll to the last message when messages are updated
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup function
  useEffect(() => {
    return () => setSelectedContact(null);
  }, [setSelectedContact]);

  // Handling form submission
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!message) return;
      await sendMsg(message, "text");
      setMessage("");
    } catch (error) {
      toast.error("message container" + error.message);
    }
  };

  //handling msg delete
  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
  };
  //handling msg update
  const handleEditMessage = (messageId, newMessage) => {
    editMessage(messageId, newMessage);
  };
  return (
    <div
      className="col-9 p-0 d-flex flex-column"
      style={{ height: "100%", width: "80%" }}
    >
      {selectedContact || selectedGroup ? (
        <>
          {/* Header */}
          <div
            className="chat-header container-fluid bg-primary text-white p-2 d-flex align-items-center justify-content-center "
            style={{ height: "7%" }}
          >
            {(selectedContact || selectedGroup) && (
              <>
                <img
                  src={
                    selectedContact
                      ? selectedContact.profilePicture
                      : selectedGroup.profilePicture
                  }
                  alt={
                    selectedContact
                      ? `${selectedContact.firstName} ${selectedContact.lastName}`
                      : selectedGroup.groupName
                  }
                  className="img-fluid rounded-circle me-2"
                  style={{ height: "80%" }}
                />

                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: "1.2rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {selectedContact
                    ? `${selectedContact.firstName} ${selectedContact.lastName}`
                    : selectedGroup.groupName}
                </span>
              </>
            )}
          </div>

          {/* Body */}
          <div
            className="chat-body flex-grow-1 p-3"
            style={{
              backgroundColor: "white",
              overflowY: "auto",
              height: "86%",
            }} // Added overflowY for scrolling
          >
            {loadingMsgs ? (
              <ChatLoader />
            ) : (
              <>
                {messages.length > 0 ? (
                  messages.map((messagee) => (
                    <ChatMessage
                      key={messagee._id}
                      messagee={messagee}
                      onDelete={handleDeleteMessage}
                      onEdit={handleEditMessage}
                    />
                  ))
                ) : (
                  <>
                    <div className="text-center">
                      <p className="h2">No messages found!</p>
                    </div>
                    <div className="text-center">
                      Send a message to start Conversation
                    </div>
                  </>
                )}
              </>
            )}
            {/* Reference div to scroll to the last message */}
            <div ref={lastMessageRef} />
          </div>
          {/* Footer */}
          <form
            className="chat-footer bg-light p-2 d-flex"
            onSubmit={handleSubmit}
            style={{ height: "8%" }}
          >
            <AttachmentButton />
            <input
              type="text"
              className="form-control"
              placeholder="Send a message..."
              onChange={(event) => setMessage(event.target.value)}
              onFocus={(e) => (e.target.style.boxShadow = "none")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={message}
            />
            <button type="submit" className="btn btn-light">
              {loading ? (
                <div
                  className="spinner-border text-muted"
                  style={{ fontSize: "30px" }}
                ></div>
              ) : (
                <IoIosSend style={{ fontSize: "30px" }} />
              )}
            </button>
          </form>
        </>
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
};
