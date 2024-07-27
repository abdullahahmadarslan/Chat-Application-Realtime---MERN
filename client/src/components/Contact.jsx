import React from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const Contact = ({ contact }) => {
  const {
    selectedContact,
    setSelectedContact,
    contactsArray,
    setSelectedGroup,
  } = useAuth();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(contact._id);

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
      </div>
    </>
  );
};
