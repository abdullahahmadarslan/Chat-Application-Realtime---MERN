import React, { useCallback, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io"; // Added IoMdWarning for the exclamation mark icon

export const ChatMessage = React.memo(({ messagee, onDelete, onEdit }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const fromMe = user && user._id === messagee.sender._id;
  const messageClass = fromMe ? "sent" : "received";

  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(messagee.message);
  const [showButtons, setShowButtons] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(messagee.isSafe === false);

  // useCallback to memoize handlers
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    if (messagee.message === newMessage) return;
    onEdit(messagee._id, newMessage);
    setIsEditing(false);
  }, [messagee, newMessage, onEdit]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setNewMessage(messagee.message);
  }, [messagee.message]);

  const toggleButtons = useCallback(() => {
    setShowButtons((prev) => !prev);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsBlurred(true);
  }, []);
  const toggleBlur = useCallback(() => {
    setIsBlurred((prev) => !prev);
  }, []);

  // Render different types of messages based on the message type
  const renderMessageContent = () => {
    switch (messagee.type) {
      case "image":
        return (
          <>
            <div
              className="chat-image-container"
              onClick={!messagee.isSafe ? toggleBlur : null}
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                className="chat-image"
                src={messagee?.message.toString()}
                alt="User uploaded content"
                onClick={openModal}
                style={{
                  filter: !messagee.isSafe && isBlurred ? "blur(8px)" : "none",
                  opacity: !messagee.isSafe && isBlurred ? "0.6" : "1",
                }}
              />
              {!messagee.isSafe && isBlurred && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }}
                >
                  <IoMdWarning
                    style={{
                      fontSize: "3rem",
                      color: "red",
                    }}
                  />
                </div>
              )}
            </div>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Image Modal"
            >
              <div className="container-fluid d-flex flex-column">
                <img
                  className="modal-image"
                  src={messagee?.message.toString()}
                  alt="User uploaded content"
                />
                <button
                  className="btn btn-danger modal-close-btn rounded-5"
                  type="button"
                  onClick={closeModal}
                  style={{ marginTop: "auto" }}
                >
                  <IoMdClose style={{ fontSize: "30px" }} />
                </button>
              </div>
            </Modal>
          </>
        );
      case "video":
        return (
          <video controls style={{ maxWidth: "200px", maxHeight: "180px" }}>
            <source src={messagee?.message.toString()} type="video/mp4" />
          </video>
        );
      case "audio":
        return (
          <audio controls>
            <source src={messagee?.message.toString()} type="audio/mpeg" />
          </audio>
        );
      case "file":
        return (
          <div className="d-flex align-items-center justify-items-center flex-column">
            <FaFile style={{ fontSize: "30px", marginRight: "8px" }} />
            <Link
              to={messagee?.message.toString()}
              target="_blank"
              download
              className="text-decoration-none text-primary"
            >
              {"Download File"}
            </Link>
          </div>
        );

      case "text":
        return messagee.message;
      default:
        return messagee.message;
    }
  };

  // Determine if the message should be visible
  const shouldShowMessage = fromMe
    ? !messagee.isDeleted // If sent by user and not deleted, show the message
    : !messagee.isDeletedByReceiver; // If received and not deleted by the receiver, show the message

  const messageContent =
    (fromMe && messagee.isDeleted) ||
    (!fromMe && messagee.isDeletedByReceiver) ? null : messagee.isDeleted &&
      !fromMe &&
      !messagee.isDeletedByReceiver ? (
      <span className="message-deleted">Message deleted</span>
    ) : (
      renderMessageContent()
    ); //here if the message is from us and is deleted then setting content to null doesn't matter as before this we would ve setted the shouldShowMessage to false so we won't see the message regardless

  return shouldShowMessage ? (
    <div className={`message ${messageClass}`}>
      <div
        className="text"
        onMouseEnter={() => setShowArrow(true)}
        onMouseLeave={() => {
          if (!showButtons) setShowArrow(false);

          setShowButtons(false);
        }}
      >
        {isEditing && showButtons ? (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-edit-input message-header"
              style={{
                fontSize: "1rem",
                padding: "5px",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            />
            <div className="message-footer">
              <div className="message-buttons">
                <button
                  onClick={handleSave}
                  className="message-action-btn save-btn"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="message-action-btn cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="message-header">
              {!fromMe && messagee.receiver.length > 1 && (
                <img
                  src={messagee.sender.profilePicture}
                  className="rounded-circle me-2"
                  alt=":("
                  style={{ height: "35px", width: "35px" }}
                />
              )}
              {messageContent && <span>{messageContent}</span>}
              {(fromMe || !fromMe) && !messagee.isDeleted && (
                <span
                  className={`arrow-btn ${showArrow ? "visible" : ""}`}
                  onClick={toggleButtons}
                >
                  <IoIosArrowDown />
                </span>
              )}
            </div>
            {showButtons && (
              <div className="message-footer">
                <div className="message-buttons">
                  {fromMe && messagee.type === "text" && (
                    <button
                      onClick={handleEdit}
                      className="message-action-btn edit-btn"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={
                      fromMe
                        ? () => onDelete(messagee._id, { isReceiver: false })
                        : () => onDelete(messagee._id, { isReceiver: true })
                    }
                    className="message-action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {!showButtons && (
              <span className="timestamp">
                {extractTime(messagee.createdAt)}
              </span>
            )}
            {messagee.isEdited && !messagee.isDeleted && (
              <span className="edited-text"> (edited)</span>
            )}
          </>
        )}
      </div>
    </div>
  ) : null;
});

const extractTime = (createdAt) => {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
