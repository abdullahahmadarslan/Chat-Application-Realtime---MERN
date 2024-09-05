import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useDeleteGroup from "../../hooks/useDeleteGroup";

const GroupDeleteButton = () => {
  // custom hook
  const { deleteGroup, loading } = useDeleteGroup();

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      await deleteGroup();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-items-center align-items-center mt-3">
        <button
          type="button"
          className="btn btn-outline-danger rounded-5 mx-auto"
          onClick={handleShowModal}
        >
          Delete Group
        </button>
      </div>

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this group? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {loading ? (
              <div
                class="spinner-border text-dark"
                style={{ fontSize: "25px" }}
              ></div>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default React.memo(GroupDeleteButton);
