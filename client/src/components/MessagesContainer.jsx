import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { IoIosSend } from "react-icons/io";
import { useSendMsg } from "../hooks/useSendMsg";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useGetMessages } from "../hooks/useGetMessages";
import { useListenNewMsgs } from "../hooks/useListenNewMsgs";

const MessagesLoader = () => {
  return <div className="text-center">Loading messages...</div>;
};

export const MessagesContainer = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMsg } = useSendMsg();
  const { selectedContact, setSelectedContact, messages } = useAuth();
  const { getMessages, loadingMsgs } = useGetMessages();
  const lastMessageRef = useRef(null); // Reference to the last message

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
  }, [selectedContact]);

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
      await sendMsg(message);
      setMessage("");
    } catch (error) {
      toast.error("message container" + error.message);
    }
  };

  return (
    <div
      className="col-9 p-0 d-flex flex-column"
      style={{ height: "100%", width: "80%" }}
    >
      {selectedContact ? (
        <>
          {/* Header */}
          <div className="chat-header bg-primary text-white p-2">
            <strong>To:</strong>
            <input
              type="text"
              placeholder="Send Message To..."
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                borderRadius: "5px",
                height: "auto",
                padding: "3px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "none")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={
                selectedContact
                  ? `${selectedContact.firstName} ${selectedContact.lastName}`
                  : ""
              }
              onChange={() => {}}
            />
          </div>
          {/* Body */}
          <div
            className="chat-body flex-grow-1 p-3"
            style={{ backgroundColor: "white", overflowY: "auto" }} // Added overflowY for scrolling
          >
            {loadingMsgs ? (
              <MessagesLoader />
            ) : (
              <>
                {messages.length > 0 ? (
                  messages.map((messagee) => (
                    <ChatMessage key={messagee._id} messagee={messagee} />
                  ))
                ) : (
                  <>
                    <div className="text-center">No messages found</div>
                    <div className="text-center">
                      Send A message to start Conversation
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
          >
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

const WelcomeScreen = () => {
  return (
    <div
      className="chat-body flex-grow-1 p-3"
      style={{ backgroundColor: "white" }}
    >
      <h1>Welcome!</h1>
    </div>
  );
};
