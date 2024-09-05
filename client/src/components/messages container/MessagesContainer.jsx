import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { IoIosSend } from "react-icons/io";
import { useSendMsg } from "../../hooks/useSendMsg";
import { toast } from "react-toastify";
import { useGetMessages } from "../../hooks/useGetMessages";
import { useListenNewMsgs } from "../../hooks/useListenNewMsgs";
import ChatLoader from "../../skeletons/ChatLoader";
import WelcomeScreen from "../WelcomeScreen";
import { useDeleteMessage } from "../../hooks/useDeleteMessage";
import { useEditMessage } from "../../hooks/useEditMessage";
import { AttachmentButton } from "./AttachmentButton";
import { GroupEditButton } from "./GroupEditButton";
import { GroupMembersButton } from "./GroupMembersButton";
import useStore from "../../stores/useStore";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import ExitGroupButton from "./ExitGroupButton";

export const MessagesContainer = React.memo(() => {
  //states
  const userAuth = JSON.parse(localStorage.getItem("user"));
  const { selectedContact, setSelectedContact, messages, selectedGroup } =
    useStore((state) => ({
      selectedContact: state.selectedContact,
      setSelectedContact: state.setSelectedContact,
      messages: state.messages,
      selectedGroup: state.selectedGroup,
    }));
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef(null); // Reference to the last message
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker visibility

  // custom hooks
  const { getMessages, loadingMsgs } = useGetMessages();
  const { loading, sendMsg } = useSendMsg();
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
    const timer = setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100); // Adjust delay if necessary

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [messages]);

  // Cleanup function
  useEffect(() => {
    return () => setSelectedContact(null);
  }, [setSelectedContact]);

  // Handling form submission
  const handleSubmit = useCallback(
    async (event) => {
      try {
        event.preventDefault();

        if (!message) return;
        // console.log(message);
        await sendMsg(message, "text");
        setMessage("");
      } catch (error) {
        toast.error("message container: " + error.message);
      }
    },
    [message, sendMsg]
  );

  //handling msg delete
  const handleDeleteMessage = useCallback(
    (messageId, receiver) => {
      // console.log(receiver);
      deleteMessage(messageId, receiver);
    },
    [deleteMessage]
  );

  //handling msg update
  const handleEditMessage = useCallback(
    (messageId, newMessage) => {
      editMessage(messageId, newMessage);
    },
    [editMessage]
  );

  // handling emoji selection
  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className="col-9 p-0 d-flex flex-column w-75 "
      style={{ height: "100%", width: "65%" }}
    >
      {selectedContact || selectedGroup ? (
        <>
          {/* Header */}
          <div
            className="chat-header container-fluid bg-primary text-white p-2 d-flex align-items-center justify-content-center  "
            style={{ height: "7%" }}
          >
            {(selectedContact || selectedGroup) && (
              <>
                {selectedGroup &&
                  userAuth._id.toString() !== selectedGroup?.creator && (
                    <ExitGroupButton />
                  )}
                {selectedGroup && <GroupMembersButton />}
                <div className="container-fluid d-flex justify-content-center align-items-center h-100 ">
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
                    className="rounded-circle me-2"
                    style={{ height: "50px", width: "50px" }}
                    key={
                      selectedGroup?.profilePicture ||
                      selectedContact?.profilePicture
                    }
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
                </div>
                {selectedGroup &&
                selectedGroup?.creator?.toString() === userAuth._id ? (
                  <GroupEditButton group={selectedGroup} />
                ) : null}
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
            <div ref={lastMessageRef}></div>
          </div>

          {/* Footer */}
          <form
            className="chat-footer bg-light p-2 d-flex"
            onSubmit={handleSubmit}
            style={{ height: "8%" }}
          >
            {/* attachments button */}
            <AttachmentButton />

            {/* emojis button */}
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setShowEmojiPicker((val) => !val)}
            >
              <BsEmojiSmile style={{ fontSize: "25px" }} />
            </button>
            {showEmojiPicker && (
              <div
                style={{ position: "absolute", bottom: "60px", left: "80px" }}
              >
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}

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
});
