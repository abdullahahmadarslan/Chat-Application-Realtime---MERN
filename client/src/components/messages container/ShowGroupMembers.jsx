import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { LuCrown } from "react-icons/lu";
import React, { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useStore from "../../stores/useStore";
import { useSocketContext } from "../../context/SocketContext";
import { LoadingAnimation } from "../custom/LoadingAnimation";

export const ShowGroupMembers = React.memo(() => {
  //states
  const { loading, userAuth } = useAuth();
  const { currentGroupMembers, selectedGroup } = useStore((state) => ({
    currentGroupMembers: state.currentGroupMembers,
    selectedGroup: state.selectedGroup,
  }));
  const { onlineUsers } = useSocketContext();

  const [show, setShow] = useState(false);
  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);

  if (loading) {
    return <LoadingAnimation />;
  }

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
            {currentGroupMembers.map((member) => {
              const isOnline = onlineUsers.includes(member._id);
              return (
                <li
                  className="list-group-item d-flex align-items-center"
                  key={member._id}
                >
                  <img
                    src={member.profilePicture}
                    className="rounded-circle"
                    alt=":("
                    style={{ height: "50px", width: "50px" }}
                  />
                  <span className="ms-4" style={{ fontSize: "1.2rem" }}>
                    {userAuth._id === member._id
                      ? "You"
                      : member.firstName + " " + member.lastName}
                  </span>
                  <div className="ms-auto d-flex justify-items-center align-items center gap-2">
                    {member._id === selectedGroup?.creator ? (
                      <LuCrown style={{ fontSize: "25px" }} />
                    ) : null}
                    <div
                      style={{
                        height: "10px",
                        width: "10px",
                        backgroundColor: isOnline ? "limegreen" : "gray",
                        borderRadius: "50%",
                        display: "inline-block",
                        margin: "7px 5px",
                        boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
                      }}
                    ></div>
                  </div>
                </li>
              );
            })}
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
});
