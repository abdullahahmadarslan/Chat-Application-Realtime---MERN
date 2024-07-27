import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/AuthContext";
import { useFriendRequest } from "../hooks/useSendFriendRequest";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useGetSentFriendRequests } from "../hooks/useGetSentFriendRequests";
import { RxCross2 } from "react-icons/rx";
import { useDeleteFriendRequest } from "../hooks/useDeleteFriendRequest";

const AddFriendsButton = () => {
  const { allUsers } = useAuth();
  const { sendFriendRequest } = useFriendRequest();
  const { cancelFriendRequest } = useDeleteFriendRequest();
  const { toSentRequestIds, setToSentRequestIds } = useAuth();
  const [searchResults, setSearchResults] = useState(allUsers);
  const [loadingIds, setLoadingIds] = useState([]);

  // fetching the friend requests sent by the logged in user
  useGetSentFriendRequests();

  // Synchronize searchResults with allUsers
  useEffect(() => {
    console.log(" i ran");
    setSearchResults(allUsers);
  }, [allUsers]);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setSearchResults(allUsers);
  };
  const handleShow = () => {
    setShow(true);
    setSearchResults(allUsers);
  };

  // real time search
  const handleSearch = (e) => {
    const query = e.target.value;
    if (query.trim() === "") {
      setSearchResults(allUsers);
      return;
    }
    const searchTerms = query.toLowerCase().split(" ");
    const filteredResults = allUsers.filter((contact) => {
      return searchTerms.every((term) => {
        const firstNameMatch = contact.firstName.toLowerCase().startsWith(term);
        const lastNameMatch = contact.lastName.toLowerCase().startsWith(term);
        return firstNameMatch || lastNameMatch;
      });
    });
    setSearchResults(filteredResults);
  };

  // handle friend request click event
  const handleSendRequest = async (userId) => {
    try {
      setLoadingIds((prev) => [...prev, userId]); //setting the button to a loading spinner of the specific user to which we sent friend request
      await sendFriendRequest(userId);
      setToSentRequestIds((prev) => [...prev, userId]); //locally updating the toSentRequestIds of the current logged in user
    } catch (error) {
      toast.error("friends button: " + error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Handle friend request cancellation
  const handleCancelRequest = async (userId) => {
    try {
      setLoadingIds((prev) => [...prev, userId]);
      await cancelFriendRequest(userId);

      setToSentRequestIds((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      toast.error("friends button: " + error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Friends
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Find Friends</Modal.Title>
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
                  {user.firstName + " " + user.lastName}
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

export default AddFriendsButton;
