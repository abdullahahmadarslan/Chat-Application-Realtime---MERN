import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useAddGroupMember } from "./../../hooks/useAddGroupMember";
import useStore from "../../stores/useStore";

export const AddGroupMembers = React.memo(() => {
  //states
  const { currentGroupMembers, contactsArray } = useStore((state) => ({
    currentGroupMembers: state.currentGroupMembers,
    contactsArray: state.contactsArray,
  }));

  const [show, setShow] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);

  // custom hook
  const { loading, addGroupMember } = useAddGroupMember();

  //   people to add includes friends of the logged in user except the current group members
  const currentGroupMemberIds = currentGroupMembers.map((member) => member._id);
  const peopleToAdd =
    contactsArray.length > 0
      ? contactsArray.filter((contact) => {
          return !currentGroupMemberIds.includes(contact._id);
        })
      : [];

  // handling adding users
  const handleAddUser = useCallback(
    async (userId) => {
      setLoadingIds((prev) => [...prev, userId]);
      try {
        await addGroupMember(userId);
      } catch (error) {
        toast.error("Error adding member");
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
      }
    },
    [addGroupMember]
  );
  return (
    <>
      <button
        type="button"
        className="btn btn-outline-success"
        onClick={handleShow}
      >
        Add Members
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>
        {/* body */}
        <Modal.Body>
          <div className="list-group">
            {peopleToAdd.length > 0 ? (
              peopleToAdd.map((user) => (
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
                    ></img>
                    <span className="ms-2">
                      {user.firstName + " " + user.lastName}
                    </span>
                  </div>
                  <button
                    className="btn btn-success btn-sm rounded-5"
                    onClick={() => handleAddUser(user._id)}
                    disabled={loadingIds.includes(user._id)}
                  >
                    {loading && loadingIds.includes(user._id) ? (
                      <div
                        className="spinner-border text-light"
                        role="status"
                      />
                    ) : (
                      <IoMdAdd style={{ fontSize: "30px" }} />
                    )}
                  </button>
                </li>
              ))
            ) : (
              <p>No Friends to add available</p>
            )}
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
});
