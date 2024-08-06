import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { ImageLoader } from "./custom/ImageLoader";
import { useEditGroup } from "../hooks/useEditGroup";

export const GroupEditButton = ({ group }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group.groupName);
  const [newGroupAvatar, setNewGroupAvatar] = useState(group.profilePicture);
  const { loadingEditGroup, editGroup } = useEditGroup();
  // const [newGroupAvatar, setNewGroupAvatar] = useState(null);

  const handleClose = () => {
    setShow(false);
    setNewGroupName(group.groupName);
    setNewGroupAvatar(group.profilePicture);
  };
  const handleShow = () => {
    setShow(true);
    setNewGroupName(group.groupName);
    setNewGroupAvatar(group.profilePicture);
  };
  //handling avatar change when you upload a new avatar
  const handleAvatarChange = async (event, type) => {
    const selectedFile = event.target.files[0];

    // Now making a request to backend to upload file to Cloudinary as soon as it is selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Sending file to backend which uploads it to Cloudinary and returns the URL of the file
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/cloudinary/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Image uploaded successfully");

        // sending the file's url as a message now from senders side
        const fileUrl = response.data.url.toString();
        setNewGroupAvatar(fileUrl);
      } catch (error) {
        toast.error("Error uploading file:", error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    console.log(group._id, newGroupAvatar, newGroupName);
    editGroup(group._id, newGroupAvatar, newGroupName);
  };

  return (
    <>
      {/* edit button */}
      <button className="edit-button" onClick={handleShow}>
        <svg className="edit-svgIcon" viewBox="0 0 512 512">
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
      </button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter group name here..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <Form.Group>
              <Form.Label>Group Avatar</Form.Label>
              <div className="mb-3 d-flex align-items-center justify-content-center ">
                {loading ? (
                  <ImageLoader />
                ) : (
                  <img
                    src={newGroupAvatar}
                    alt="Group Avatar"
                    className="img-thumbnail"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center">
                {loading ? (
                  <div class="spinner-border text-dark"></div>
                ) : (
                  <Form.Control
                    type="file"
                    onChange={(e) => handleAvatarChange(e, "image")}
                    accept="image/*"
                  />
                )}
              </div>
            </Form.Group>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            {loadingEditGroup ? (
              <div class="spinner-border text-dark"></div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
