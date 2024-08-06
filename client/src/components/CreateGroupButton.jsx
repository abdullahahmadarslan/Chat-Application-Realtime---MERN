import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useCreateGroup } from "../hooks/useCreateGroup";

const CreateGroupButton = () => {
  const [show, setShow] = useState(false);
  const {
    contactsArray,
    groupName,
    setGroupName,
    participants,
    setParticipants,
  } = useAuth();
  const { loading, createGroup } = useCreateGroup();

  const handleClose = () => {
    setShow(false);
    setGroupName("");
    setParticipants([]);
    return;
  };
  const handleShow = () => {
    setShow(true);
    setGroupName("");
    setParticipants([]);
    return;
  };

  // when group is created
  const handleCreateGroup = () => {
    if (participants.length < 2) {
      toast.error("Please select at least two participants.");
      return;
    }
    if (!groupName) {
      toast.error("Please type a group name.");
      return;
    }
    createGroup();
  };

  //setting the participants array on form check/uncheck
  const handleParticipantChange = (contactId) => {
    setParticipants((prev) => {
      const newParticipants = prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId];
      console.log(newParticipants);
      return newParticipants;
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Group
      </Button>
      <Modal show={show} onHide={handleClose}>
        {/* header */}
        <Modal.Header closeButton>
          <Modal.Title>Create Group...</Modal.Title>
        </Modal.Header>
        {/* body */}
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter group name here..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Select Participants</label>
              <div className="form-check" style={{ overflowY: "auto" }}>
                {contactsArray.map((contact) => (
                  <div
                    key={contact._id}
                    className="container-fluid d-flex "
                    style={{ border: "1px solid white", height: "40px" }}
                  >
                    <label
                      className="form-check-label"
                      htmlFor={`contact-${contact._id}`}
                    >
                      {`${contact.firstName} ${contact.lastName}`}
                    </label>
                    <input
                      className="form-check-input ms-auto"
                      type="checkbox"
                      value={contact._id}
                      id={`contact-${contact._id}`}
                      onChange={() => handleParticipantChange(contact._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            {loading ? (
              <div className="spinner-border text-light" role="status" />
            ) : (
              "Create Group"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateGroupButton;
