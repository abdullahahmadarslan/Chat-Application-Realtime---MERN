import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { GrAttachment } from "react-icons/gr";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSendMsg } from "../../hooks/useSendMsg";
import { MdAudiotrack } from "react-icons/md";
import { LuVideo } from "react-icons/lu";
import { FaImage } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";

export const AttachmentButton = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState(null); // Track the type of file being uploaded

  // custom hook
  const { sendMsg } = useSendMsg();

  // Handling file upload from PC
  const handleFileUpload = useCallback(
    async (event, type) => {
      const selectedFile = event.target.files[0];

      // Now making a request to backend to upload file to Cloudinary as soon as it is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Sending file to backend which uploads it to Cloudinary and returns the URL of the file
        setLoading(true);
        setUploadingType(type);
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
          // toast.success("File uploaded successfully");
          // console.log(response);

          // Sending the file's URL as a message now from the sender's side

          const fileUrl = response.data.url.toString();
          const isSafe = response.data.isSafe;
          // console.log(fileUrl);
          // console.log(isSafe);
          await sendMsg(fileUrl, type, isSafe);
        } catch (error) {
          toast.error("Error uploading file");
          console.error(error);
        } finally {
          setLoading(false);
          setUploadingType(null); // Reset the uploading type after completion
          event.target.value = null;
        }
      }
    },
    [sendMsg]
  );

  // Popover
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className="d-flex flex-column gap-1">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => document.getElementById("audioUpload").click()}
        >
          {loading && uploadingType === "audio" ? (
            <div className="spinner-border text-dark"></div>
          ) : (
            <div className="d-flex justify-items-center align-items-center">
              <MdAudiotrack style={{ fontSize: "20px" }} />
              <span className="ms-2">Upload Audio</span>
            </div>
          )}
        </button>
        <input
          type="file"
          id="audioUpload"
          style={{ display: "none" }}
          accept="audio/*"
          onChange={(e) => handleFileUpload(e, "audio")}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => document.getElementById("videoUpload").click()}
        >
          {loading && uploadingType === "video" ? (
            <div className="spinner-border text-dark "></div>
          ) : (
            <div className="d-flex justify-items-center align-items-center">
              <LuVideo style={{ fontSize: "20px" }} />
              <span className="ms-2">Upload Video</span>
            </div>
          )}
        </button>
        <input
          type="file"
          id="videoUpload"
          style={{ display: "none" }}
          accept="video/*"
          onChange={(e) => handleFileUpload(e, "video")}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => document.getElementById("imageUpload").click()}
        >
          {loading && uploadingType === "image" ? (
            <div className="spinner-border text-dark"></div>
          ) : (
            <div className="d-flex justify-items-center align-items-center">
              <FaImage style={{ fontSize: "20px" }} />
              <span className="ms-2">Upload Image</span>
            </div>
          )}
        </button>
        <input
          type="file"
          id="imageUpload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "image")}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => document.getElementById("otherUpload").click()}
        >
          {loading && uploadingType === "file" ? (
            <div className="spinner-border text-dark"></div>
          ) : (
            <div className="d-flex justify-items-center align-items-center">
              <FaRegFileAlt style={{ fontSize: "20px" }} />
              <span className="ms-2">Upload File</span>
            </div>
          )}
        </button>
        <input
          type="file"
          id="otherUpload"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e, "file")}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="click" placement="top" overlay={popover}>
        <Button variant="light">
          <GrAttachment style={{ fontSize: "25px" }} />
        </Button>
      </OverlayTrigger>
    </>
  );
});
