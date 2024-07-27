import React, { useEffect } from "react";
import { Contact } from "./Contact";
import { CiLogout } from "react-icons/ci";
import { useLogout } from "../hooks/useLogout";
import { useGetContacts } from "../hooks/useGetContacts";
import { useGetGroups } from "../hooks/useGetGroups";
import { toast } from "react-toastify";
import SearchContact from "./SearchContact";
import { useAuth } from "../context/AuthContext";
import { Group } from "./Group";
import AddFriendsButton from "./AddFriendsButton";
import PendingRequests from "./PendingRequests";
import { useListenRequests } from "../hooks/useListenRequests";
import { useGetAllUsers } from "../hooks/useGetAllUsers";

// sidebar
export const Sidebar = () => {
  const { logout, loading } = useLogout();
  const { getContacts } = useGetContacts();
  const { getGroups } = useGetGroups();
  const { contactsArray, groupsArray } = useAuth();
  const { getAllUsers } = useGetAllUsers();

  // getting contacts from the backend when the home page loads for the first time
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        await getContacts();
        await getGroups();
      } catch (error) {
        toast.error("sidebar" + error.message);
      }
    };
    fetchContacts();
    // console.log(contactsArray);
    //eslint-disable-next-line
  }, []);

  // getting all users from the database
  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  // Listening for request actions
  useListenRequests();

  return (
    <>
      <div
        className="col-3 bg-dark text-light p-0 left"
        style={{ height: "100%", width: "20%" }}
      >
        {/* left top */}
        <SearchContact />
        {/* left bottom */}
        <div
          className="left-bottom container-fluid"
          style={{ paddingBottom: "60px" }}
        >
          {/* contacts */}
          <AddFriendsButton />
          <PendingRequests />
          <div className="contact-list" style={{ height: "50%" }}>
            <h5>Direct Messages:</h5>
            {contactsArray.length > 0 ? (
              contactsArray.map((contact) => (
                <Contact key={contact._id} contact={contact} />
              ))
            ) : (
              <p>No contacts found</p>
            )}
          </div>
          {/* groups */}
          <div className="contact-list mt-2" style={{ height: "48%" }}>
            <h5>Groups:</h5>
            {groupsArray.length > 0 ? (
              groupsArray.map((group) => (
                <Group key={group._id} group={group} />
              ))
            ) : (
              <p>No Groups Found</p>
            )}
          </div>
        </div>
        {/* Logout button */}
        <div style={{ height: "8%", display: "flex", flexDirection: "column" }}>
          <button
            className="btn btn-danger"
            onClick={logout}
            style={{
              marginTop: "auto",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "5px",
              marginBottom: "10px",
            }}
          >
            {!loading ? (
              <>
                <CiLogout style={{ fontSize: "40px" }} />
              </>
            ) : (
              <div className="spinner-border text-muted"></div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
