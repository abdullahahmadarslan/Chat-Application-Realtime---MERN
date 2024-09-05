import React, { useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFriendRequest } from "../../hooks/useSendFriendRequest";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useGetSentFriendRequests } from "../../hooks/useGetSentFriendRequests";
import { RxCross2 } from "react-icons/rx";
import { useDeleteFriendRequest } from "../../hooks/useDeleteFriendRequest";
import useStore from "../../stores/useStore";
import { IoPersonAddOutline } from "react-icons/io5";

const AddFriendsButton = () => {
  const { sendFriendRequest } = useFriendRequest();
  const { cancelFriendRequest } = useDeleteFriendRequest();

  // states
  const { allUsers, toSentRequestIds, setToSentRequestIds } = useStore(
    (state) => ({
      allUsers: state.allUsers,
      toSentRequestIds: state.toSentRequestIds,
      setToSentRequestIds: state.setToSentRequestIds,
    })
  );

  const [searchResults, setSearchResults] = useState(allUsers);
  const [loadingIds, setLoadingIds] = useState([]);
  const [show, setShow] = useState(false);

  // fetching the friend requests sent by the logged in user
  useGetSentFriendRequests();

  // Synchronize searchResults with allUsers
  useEffect(() => {
    setSearchResults(allUsers);
  }, [allUsers]);

  const handleClose = useCallback(() => {
    setShow(false);
    setSearchResults(allUsers);
  }, [allUsers]);

  const handleShow = useCallback(() => {
    setShow(true);
    setSearchResults(allUsers);
  }, [allUsers]);

  // real-time search
  const handleSearch = useCallback(
    (e) => {
      const query = e.target.value;
      if (query.trim() === "") {
        setSearchResults(allUsers);
        return;
      }
      const searchTerms = query.toLowerCase().split(" ");
      const filteredResults = allUsers.filter((contact) => {
        return searchTerms.every((term) => {
          const firstNameMatch = contact.firstName
            .toLowerCase()
            .startsWith(term);
          const lastNameMatch = contact.lastName.toLowerCase().startsWith(term);
          return firstNameMatch || lastNameMatch;
        });
      });
      setSearchResults(filteredResults);
    },
    [allUsers]
  );

  // handle friend request click event
  const handleSendRequest = useCallback(
    async (userId) => {
      try {
        setLoadingIds((prev) => [...prev, userId]); //setting the button to a loading spinner of the specific user to which we sent friend request
        await sendFriendRequest(userId);
        setToSentRequestIds((prev) => [...prev, userId]); //locally updating the toSentRequestIds of the current logged in user
      } catch (error) {
        toast.error("friends button: " + error.message);
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
      }
    },
    [sendFriendRequest, setToSentRequestIds]
  );

  // Handle friend request cancellation
  const handleCancelRequest = useCallback(
    async (userId) => {
      try {
        setLoadingIds((prev) => [...prev, userId]);
        await cancelFriendRequest(userId);

        setToSentRequestIds((prev) => prev.filter((id) => id !== userId));
      } catch (error) {
        toast.error("friends button: " + error.message);
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
      }
    },
    [cancelFriendRequest, setToSentRequestIds]
  );

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={handleShow}
        style={{ color: "white", fontSize: "30px", marginBottom: "6px" }}
      >
        <IoPersonAddOutline className="friends-btn-anim" />
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Friends...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search users..."
            onChange={handleSearch}
            className="mb-3"
          />
          <div className="list-group">
            {allUsers &&
              searchResults.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <img
                      src={user.profilePicture}
                      className="rounded-circle"
                      alt=":("
                      style={{ height: "50px", width: "50px" }}
                    />
                    <span className="ms-4" style={{ fontSize: "1.2rem" }}>
                      {user.firstName + " " + user.lastName}
                    </span>
                  </div>
                  {toSentRequestIds.includes(user._id) ? (
                    <button
                      className="btn btn-danger btn-sm rounded-5"
                      onClick={() => handleCancelRequest(user._id)}
                      disabled={loadingIds.includes(user._id)}
                    >
                      {loadingIds.includes(user._id) ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        />
                      ) : (
                        <RxCross2 style={{ fontSize: "30px" }} />
                      )}
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm rounded-5"
                      onClick={() => handleSendRequest(user._id)}
                      disabled={loadingIds.includes(user._id)}
                    >
                      {loadingIds.includes(user._id) ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        />
                      ) : (
                        <IoMdAdd style={{ fontSize: "30px" }} />
                      )}
                    </button>
                  )}
                </li>
              ))}
          </div>
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

export default React.memo(AddFriendsButton);
