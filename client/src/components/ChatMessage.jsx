import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";

export const ChatMessage = ({ messagee, onDelete, onEdit }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const fromMe = user && user._id === messagee.sender;
  const messageClass = fromMe ? "sent" : "received";

  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(messagee.message);
  const [showButtons, setShowButtons] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(messagee._id, newMessage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewMessage(messagee.message);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Render different types of messages based on the message type
  const renderMessageContent = () => {
    switch (messagee.type) {
      case "image":
        return (
          <>
            <img
              className="chat-image"
              src={messagee?.message.toString()}
              alt="User uploaded content"
              onClick={openModal}
            />
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
          <video controls style={{ maxWidth: "100%" }}>
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
        return <Link to={messagee?.message.toString()} />;

      case "text":
        return messagee.message;
      default:
        return messagee.message;
    }
  };

  // Determine if the message should be visible
  const shouldShowMessage = fromMe ? !messagee.isDeleted : true; //!messagee.isDeleted means The message should only be shown if it is not deleted.
  const messageContent =
    fromMe && messagee.isDeleted ? null : messagee.isDeleted && !fromMe ? (
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
              {messageContent && <span>{messageContent}</span>}
              {fromMe && !messagee.isDeleted && (
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
                  <button
                    onClick={handleEdit}
                    className="message-action-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(messagee._id)}
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
};

const extractTime = (createdAt) => {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
