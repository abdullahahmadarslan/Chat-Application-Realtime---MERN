import React, { useCallback, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import DeleteButton from "./DeleteButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal"; // Import the modal component
import { useDeleteFriend } from "../../hooks/useDeleteFriend";
import useStore from "../../stores/useStore";

export const Contact = React.memo(({ contact }) => {
  //states
  const {
    selectedContact,
    setSelectedContact,
    contactsArray,
    setSelectedGroup,
  } = useStore((state) => ({
    selectedContact: state.selectedContact,
    setSelectedContact: state.setSelectedContact,
    contactsArray: state.contactsArray,
    setSelectedGroup: state.setSelectedGroup,
  }));
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(contact._id);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // custom hook
  const { deleteFriend } = useDeleteFriend();

  // Memoize the delete click handler
  const handleDeleteClick = useCallback(
    (event) => {
      event.stopPropagation();
      setContactToDelete(contact);
      setShowModal(true);
    },
    [contact]
  );

  // Memoize the confirm delete handler
  const handleConfirmDelete = useCallback(
    (friendId) => {
      deleteFriend(friendId);
      setShowModal(false);
    },
    [deleteFriend]
  );

  // Memoize the contact selection handler
  const handleSelectContact = useCallback(() => {
    setSelectedContact(contact);
    setSelectedGroup(null); // Reset group selection when selecting a contact
  }, [contact, setSelectedContact, setSelectedGroup]);

  return (
    <>
      <div
        className={`container-fluid contact ${
          selectedContact && selectedContact?._id === contact?._id
            ? "active"
            : "not-active"
        }
        d-flex flex-column flex-sm-column flex-md-column flex-lg-row mb-4 h-auto`}
        onClick={handleSelectContact}
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
              backgroundColor: isOnline ? "limegreen" : "gray",
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
});
