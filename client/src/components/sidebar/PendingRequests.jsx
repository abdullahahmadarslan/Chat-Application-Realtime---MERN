import React, { useCallback, useState } from "react";
import { Button, ListGroup, Modal, Badge } from "react-bootstrap";
import { useGetPendingFriendReqs } from "../../hooks/useGetPendingFriendReqs";
import { useAcceptFriendReq } from "../../hooks/useAcceptFriendReq";
import { useRejectFriendRequest } from "../../hooks/useRejectFriendRequest";
import useStore from "../../stores/useStore";

const PendingRequests = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loadingIdsAccept, setLoadingIdsAccept] = useState([]);
  const [loadingIdsReject, setLoadingIdsReject] = useState([]);

  // Access Zustand store state and actions
  const { pendingRequests } = useStore((state) => ({
    pendingRequests: state.pendingRequests,
  }));

  // custom hooks call
  const { loading, acceptFriendReq } = useAcceptFriendReq();
  const { loadingRejectFr, rejectFriendReq } = useRejectFriendRequest();

  // getting all the pending friend requests of the current logged in user when the page loads for the first time
  useGetPendingFriendReqs();

  // handling the accept and reject friend requests actions
  const handleAccept = useCallback(
    async (requestId) => {
      try {
        setLoadingIdsAccept((prev) => [...prev, requestId]);
        await acceptFriendReq(requestId);
      } catch (error) {
        console.error("Error accepting friend request:", error);
      } finally {
        setLoadingIdsAccept((prev) =>
          prev.filter((id) => id.toString() !== requestId.toString())
        );
      }
    },
    [acceptFriendReq]
  );

  const handleReject = useCallback(
    async (requestId) => {
      try {
        setLoadingIdsReject((prev) => [...prev, requestId]);
        await rejectFriendReq(requestId);
      } catch (error) {
        console.error("Error rejecting friend request:", error);
      } finally {
        setLoadingIdsReject((prev) =>
          prev.filter((id) => id.toString() !== requestId.toString())
        );
      }
    },
    [rejectFriendReq]
  );

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-warning w-auto h-auto"
        onClick={handleShow}
      >
        Pending Requests
        {pendingRequests.length > 0 && (
          <Badge pill bg="danger" text="light" className="ms-2">
            {pendingRequests.length}
          </Badge>
        )}
      </button>

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
                  <div className="d-flex justify-items-center align-items-center">
                    <img
                      src={request.sender.profilePicture}
                      className="rounded-circle"
                      alt=":("
                      style={{ height: "50px", width: "50px" }}
                    />
                    <span className="ms-4" style={{ fontSize: "1.2rem" }}>
                      {request.sender.firstName + " " + request.sender.lastName}
                    </span>
                  </div>
                  <div
                    className="container-fluid d-flex align-items-center justify-content-evenly gap-2 "
                    style={{ width: "40%" }}
                  >
                    <Button
                      variant="success"
                      onClick={() => handleAccept(request._id)}
                      className="ml-2"
                      disabled={loadingIdsAccept.includes(request._id)}
                    >
                      {loading && loadingIdsAccept.includes(request._id) ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                          style={{ width: "25px", height: "25px" }}
                        />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(request._id)}
                      className="ml-2"
                      disabled={loadingIdsReject.includes(request._id)}
                    >
                      {loadingRejectFr &&
                      loadingIdsReject.includes(request._id) ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                          style={{ width: "25px", height: "25px" }}
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

export default React.memo(PendingRequests);
