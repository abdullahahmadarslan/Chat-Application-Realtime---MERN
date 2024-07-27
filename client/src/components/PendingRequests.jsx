// PendingRequests.jsx
import React, { useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
import { useGetPendingFriendReqs } from "../hooks/useGetPendingFriendReqs";
import { useAcceptFriendReq } from "../hooks/useAcceptFriendReq";
import { useRejectFriendRequest } from "../hooks/useRejectFriendRequest";

const PendingRequests = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { pendingRequests } = useAuth();
  const { loading, acceptFriendReq } = useAcceptFriendReq();
  const { loadingRejectFr, rejectFriendReq } = useRejectFriendRequest();

  // getting all the pending friend requests of the current logged in user when the page loads for the first time
  useGetPendingFriendReqs();

  // handling the accept and reject friend requests actions
  const handleAccept = async (requestId) => {
    acceptFriendReq(requestId);
  };
  const handleReject = async (requestId) => {
    rejectFriendReq(requestId);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Pending Requests
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pending Friend Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <ListGroup.Item
                  key={request._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <p style={{ width: "60%" }}>
                    {request.sender.firstName + " " + request.sender.lastName}
                  </p>
                  <div
                    className="container-fluid d-flex align-items-center justify-content-evenly "
                    style={{ width: "40%" }}
                  >
                    <Button
                      variant="success"
                      onClick={() => handleAccept(request._id)}
                      className="ml-2"
                    >
                      {loading ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(request._id)}
                      className="ml-2"
                    >
                      {loadingRejectFr ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        />
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p>No pending requests</p>
            )}
          </ListGroup>
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

export default PendingRequests;
