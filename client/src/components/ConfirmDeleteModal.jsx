import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteModal = ({
  show,
  handleClose,
  handleConfirm,
  contactName,
  friendId,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>Are you sure you want to Unfriend {contactName}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleConfirm(friendId)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
