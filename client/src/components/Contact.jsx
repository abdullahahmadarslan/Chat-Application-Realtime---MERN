import React from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const Contact = ({ contact }) => {
  const { selectedContact, setSelectedContact, contactsArray } = useAuth();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(contact._id);

  return (
    <>
      <div
        className={`contact ${
          selectedContact && selectedContact?._id === contact?._id
            ? "active"
            : "not-active"
        }`}
        onClick={() => {
          setSelectedContact(contact);
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
        <span>{`${contactsArray ? contact.firstName : ""} ${
          contactsArray ? contact.lastName : ""
        }`}</span>
      </div>
    </>
  );
};
