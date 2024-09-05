import React, { useEffect, useCallback, useState } from "react";
import { Contact } from "./Contact";
import { useLogout } from "../../hooks/useLogout";
import { useGetContacts } from "../../hooks/useGetContacts";
import { useGetGroups } from "../../hooks/useGetGroups";
import { toast } from "react-toastify";
import SearchContact from "./SearchContact";
import { Group } from "./Group";
import AddFriendsButton from "./AddFriendsButton";
import PendingRequests from "./PendingRequests";
import { useListenRequests } from "../../hooks/useListenRequests";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";
import CreateGroupButton from "./CreateGroupButton";
import { useListenGroupRequests } from "../../hooks/useListenGroupRequests";
import { IoHome } from "react-icons/io5";
import useStore from "../../stores/useStore";
import Nav from "react-bootstrap/Nav";
import Logout from "../custom/Logout";

// sidebar
const Sidebar = () => {
  const { logout, loading } = useLogout();
  const { getContacts } = useGetContacts();
  const { getGroups } = useGetGroups();
  const { getAllUsers } = useGetAllUsers();

  const {
    contactsArray,
    groupsArray,
    selectedContact,
    selectedGroup,
    setSelectedContact,
    setSelectedGroup,
  } = useStore((state) => ({
    contactsArray: state.contactsArray,
    groupsArray: state.groupsArray,
    selectedContact: state.selectedContact,
    selectedGroup: state.selectedGroup,
    setSelectedContact: state.setSelectedContact,
    setSelectedGroup: state.setSelectedGroup,
  }));

  const [activeTab, setActiveTab] = useState("contacts");

  // Memoize the function to prevent re-creation on every render
  const handleHomeClick = useCallback(() => {
    if (selectedContact) setSelectedContact(null);
    if (selectedGroup) setSelectedGroup(null);
  }, [selectedContact, selectedGroup, setSelectedContact, setSelectedGroup]);

  // getting contacts from the backend when the home page loads for the first time
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        await getContacts();
        await getGroups();
      } catch (error) {
        console.error("sidebar" + error.message);
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

  // listening for group events
  useListenGroupRequests();

  return (
    <>
      <div
        className="col-3 bg-dark text-light p-1 left w-25 "
        style={{ height: "100%", width: "35%" }}
      >
        {/* left top */}
        <SearchContact />

        {/* friends buttons */}
        <div
          className="container-fluid sidebar-btns d-flex justify-items-center align-items-center overflow-y-auto "
          style={{ height: "8%", width: "100%" }}
        >
          <button
            type="button"
            className="btn home-btn"
            onClick={handleHomeClick}
          >
            <IoHome style={{ color: "white", fontSize: "30px" }} />
          </button>
          <AddFriendsButton />
          <PendingRequests />
        </div>

        {/* navs */}
        <div className="navs container-fluid">
          <Nav
            className="custom-nav d-flex justify-content-center align-items-center  "
            variant="underline"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            style={{ height: "5%" }}
          >
            <Nav.Item>
              <Nav.Link eventKey="contacts">Contacts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="groups">Groups</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        {/* left bottom */}
        <div
          className="left-bottom container-fluid mt-1"
          style={{ paddingBottom: "60px", height: "55%" }}
        >
          <div className="content">
            {/* contacts tab */}
            {activeTab === "contacts" && (
              <div
                className="contacts-tab contact-list "
                style={{ height: "100%", overflowY: "auto" }}
              >
                {contactsArray.length > 0 ? (
                  contactsArray.map((contact) => (
                    <Contact key={contact._id} contact={contact} />
                  ))
                ) : (
                  <p>No contacts found</p>
                )}
              </div>
            )}
            {/* groups tab */}
            {activeTab === "groups" && (
              <div
                className="groups-tab contact-list mt-2"
                style={{ height: "100%", overflowY: "auto" }}
              >
                <div className="container-fluid d-flex  mb-2 justify-content-center align-items-center  ">
                  <CreateGroupButton />
                </div>
                {groupsArray.length > 0 ? (
                  groupsArray.map((group) => (
                    <Group key={group._id} group={group} />
                  ))
                ) : (
                  <p>No Groups Found</p>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Logout button */}
        <div style={{ height: "8%", display: "flex", flexDirection: "column" }}>
          {!loading ? (
            <Logout onClick={logout} />
          ) : (
            <div
              class="spinner-border text-danger"
              style={{ marginTop: "auto", marginLeft: "15px" }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Sidebar);
