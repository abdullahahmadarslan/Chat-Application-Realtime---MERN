import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import DeleteButton from "./DeleteButton";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // Import the modal component
import { useDeleteFriend } from "../hooks/useDeleteFriend";

export const Contact = ({ contact }) => {
  const {
    selectedContact,
    setSelectedContact,
    contactsArray,
    setSelectedGroup,
  } = useAuth();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(contact._id);

  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const { deleteFriend } = useDeleteFriend();

  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent
    setContactToDelete(contact);
    setShowModal(true);
  };

  const handleConfirmDelete = (friendId) => {
    deleteFriend(friendId);
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`container-fluid contact ${
          selectedContact && selectedContact?._id === contact?._id
            ? "active"
            : "not-active"
        }
        d-flex flex-column flex-sm-column flex-md-row flex-lg-row mb-4 h-auto`}
        onClick={() => {
          setSelectedContact(contact);
          setSelectedGroup(null); // Reset group selection when selecting a contact
        }}
      >
        {/* Avatar and Online Indicator */}
        <div style={{ position: "relative" }}>
          <img
            src={contactsArray ? contact.profilePicture : ""}
            alt="avatar"
            className="avatar rounded-circle"
          />
          {/* Online status indicator */}
          <div
            className="online-indicator"
            style={{
              backgroundColor: isOnline ? "#aae02c" : "gray",
            }}
          ></div>
        </div>
        <span className="ms-3">
          {`${contactsArray ? contact.firstName : ""} ${
            contactsArray ? contact.lastName : ""
          }`}
        </span>
        <DeleteButton onClick={handleDeleteClick} />
      </div>

      <ConfirmDeleteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirmDelete}
        contactName={`${contactToDelete?.firstName} ${contactToDelete?.lastName}`}
        friendId={contact._id}
      />
    </>
  );
};
