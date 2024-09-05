import React, { useCallback, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCreateGroup } from "../../hooks/useCreateGroup";
import useStore from "../../stores/useStore";
import CreateGroupBtn from "../custom/CreateGroupBtn";
import { ImageLoader } from "../custom/ImageLoader";
import default_avatar from "../../assets/default_avatar.png";
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";

const CreateGroupButton = () => {
  const {
    contactsArray,
    groupName,
    setGroupName,
    participants,
    setParticipants,
  } = useStore((state) => ({
    contactsArray: state.contactsArray,
    groupName: state.groupName,
    setGroupName: state.setGroupName,
    participants: state.participants,
    setParticipants: state.setParticipants,
  }));

  // custom hook
  const { loading, createGroup } = useCreateGroup();

  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState(default_avatar); // Set default avatar image
  const [newPfp, setNewPfp] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [loadingAvatarUpload, setLoadingAvatarUpload] = useState(false);
  const [loadingRemoveImg, setLoadingRemoveImg] = useState(false);
  const [publicId, setPublicId] = useState("");
  const fileInputRef = useRef(null); // Ref for the file input

  const handleClose = useCallback(() => {
    setShow(false);
    setGroupName("");
    setParticipants([]);
    setAvatar(default_avatar); // Reset to default avatar
    setIsFileSelected(false);
    setNewPfp("");
  }, [setShow, setGroupName, setParticipants]);

  const handleShow = useCallback(() => {
    setShow(true);
    setGroupName("");
    setParticipants([]);
  }, [setShow, setGroupName, setParticipants]);

  // when group is created
  const handleCreateGroup = useCallback(async () => {
    if (participants.length < 2) {
      toast.error("Please select at least two participants.");
      return;
    }
    if (!groupName) {
      toast.error("Please type a group name.");
      return;
    }

    if (avatar.toString() === default_avatar.toString()) {
      console.log(default_avatar);
      // console.log(avatar);
      setNewPfp("");
    } else {
      setNewPfp(avatar);
    }
    await createGroup(avatar);
    handleClose();
  }, [participants, groupName, createGroup, avatar, handleClose, newPfp]);

  //setting the participants array on form check/uncheck
  const handleParticipantChange = useCallback(
    (contactId) => {
      setParticipants((prev) => {
        const newParticipants = prev.includes(contactId)
          ? prev.filter((id) => id !== contactId)
          : [...prev, contactId];
        console.log(newParticipants);
        return newParticipants;
      });
    },
    [setParticipants]
  );

  // handling avatar upload
  const handleAvatarChange = useCallback(async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];

      if (!acceptedImageTypes.includes(fileType)) {
        toast.error(
          "Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed."
        );
        event.target.value = null; // Reset the file input
        return; // Exit the function early if the file is not an accepted image type
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      setLoadingAvatarUpload(true);
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
        const fileUrl = response.data.url.toString();
        setAvatar(fileUrl);
        setIsFileSelected(true);
        const publicId = extractPublicId(response.data.url);
        setPublicId(publicId);
      } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
      } finally {
        setLoadingAvatarUpload(false);
      }
    }
  }, []);

  // removing image that got selected
  const handleRemoveFile = useCallback(async () => {
    if (publicId) {
      setLoadingRemoveImg(true);
      try {
        await axios.delete("http://localhost:5000/cloudinary/delete", {
          data: { publicId }, // Send the public ID in the request body
        });
      } catch (error) {
        toast.error("Error removing image: " + error.message);
        console.error(error);
      } finally {
        setLoadingRemoveImg(false);
      }
    }

    setAvatar(default_avatar);
    setIsFileSelected(false);
    setPublicId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  }, [publicId]);

  return (
    <>
      <CreateGroupBtn onClick={handleShow} />
      <Modal show={show} onHide={handleClose}>
        {/* header */}
        <Modal.Header closeButton>
          <Modal.Title>Create Group...</Modal.Title>
        </Modal.Header>
        {/* body */}
        <Modal.Body>
          <form>
            <div className="mb-3">
              <div>
                <label className="form-label">Group Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter group name here..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div>
                <Form.Group className="mt-1">
                  <Form.Label>Group Avatar:</Form.Label>
                  <div className="mb-3 d-flex align-items-center justify-content-center ">
                    {loadingAvatarUpload ? (
                      <ImageLoader />
                    ) : (
                      <div
                        className="avatar-preview d-flex justify-content-center align-items-center"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={avatar}
                          alt="Group Avatar"
                          className="img-thumbnail rounded-circle"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <Form.Control
                      type="file"
                      onChange={handleAvatarChange}
                      accept="image/*"
                      ref={fileInputRef}
                    />

                    {!isFileSelected ? null : (
                      <button
                        type="button"
                        className="remove-file-button"
                        onClick={handleRemoveFile}
                      >
                        {loadingRemoveImg ? (
                          <div
                            className="spinner-border text-secondary ms-2 mt-1"
                            role="status"
                          ></div>
                        ) : (
                          "✖"
                        )}
                      </button>
                    )}
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Participants:</label>
              <div className="form-check" style={{ overflowY: "auto" }}>
                <ul className="list-group over">
                  {contactsArray.map((contact) => (
                    <li className="list-group-item" key={contact._id}>
                      <div className="d-flex ">
                        <div
                          className="d-flex justify-items-center align-items-center "
                          style={{ width: "50%" }}
                        >
                          <img
                            src={contact.profilePicture}
                            className="rounded-circle"
                            alt=":("
                            style={{ height: "40px", width: "40px" }}
                          />
                          <label
                            className="form-check-label ms-4"
                            htmlFor={`contact-${contact._id}`}
                          >
                            {`${contact.firstName} ${contact.lastName}`}
                          </label>
                        </div>
                        <label className="container" style={{ width: "50%" }}>
                          <input
                            type="checkbox"
                            value={contact._id}
                            id={`contact-${contact._id}`}
                            onChange={() =>
                              handleParticipantChange(contact._id)
                            }
                          />
                          <div
                            className="checkmark"
                            style={{ marginLeft: "auto", marginTop: "10px" }}
                          ></div>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            {loading ? (
              <div className="spinner-border text-light" role="status" />
            ) : (
              "Create Group"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default React.memo(CreateGroupButton);
