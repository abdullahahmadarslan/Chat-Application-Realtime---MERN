import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthContext";
import { LuCrown } from "react-icons/lu";
import { useState } from "react";

export const ShowGroupMembers = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const { userAuth, currentGroupMembers, selectedGroup } = useAuth();

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-info"
        onClick={handleShow}
      >
        Show Members
      </button>
      {/* modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Group Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {currentGroupMembers.map((member) => (
              <li
                className="list-group-item d-flex align-items-center"
                key={member._id}
              >
                <img
                  src={member.profilePicture}
                  className="rounded-circle"
                  alt=":("
                  style={{ height: "50px", width: "50px" }}
                ></img>
                <span className="ms-4" style={{ fontSize: "1.2rem" }}>
                  {userAuth._id === member._id
                    ? "You"
                    : member.firstName + " " + member.lastName}
                </span>
                {member._id === selectedGroup?.creator ? (
                  <LuCrown className="ms-auto" style={{ fontSize: "25px" }} />
                ) : null}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
