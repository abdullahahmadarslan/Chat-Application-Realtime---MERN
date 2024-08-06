import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthContext";
import { LuCrown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useDeleteGroupMember } from "../hooks/useDeleteGroupMember";
import { toast } from "react-toastify";

export const DeleteGroupMembers = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const [loadingIds, setLoadingIds] = useState([]);
  const { userAuth, currentGroupMembers, selectedGroup } = useAuth();
  const { loading, deleteGroupMember } = useDeleteGroupMember();

  // returning all members except the currently the currently logged in admin
  const toDeleteMembers = currentGroupMembers.filter((member) => {
    return member._id !== userAuth._id;
  });

  //   handling the removal the member
  const handleRemoveMember = async (userId) => {
    setLoadingIds((prev) => [...prev, userId]);
    try {
      await deleteGroupMember(userId);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={handleShow}
      >
        Remove Members
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
            {toDeleteMembers.map((member) => (
              <li
                className="list-group-item d-flex align-items-center"
                key={member._id}
              >
                <div>
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
                </div>
                <button
                  className="btn btn-danger btn-sm rounded-5 ms-auto"
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={loadingIds.includes(member._id)}
                >
                  {loading && loadingIds.includes(member._id) ? (
                    <div className="spinner-border text-light" role="status" />
                  ) : (
                    <RxCross2 style={{ fontSize: "30px" }} />
                  )}
                </button>
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
