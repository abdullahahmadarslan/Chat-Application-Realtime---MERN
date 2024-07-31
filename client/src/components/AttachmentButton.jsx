import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { GrAttachment } from "react-icons/gr";
//  type="button" className="btn btn-outline-secondary
const popover = (
  <Popover id="popover-basic">
    <Popover.Body className="d-flex flex-column gap-1">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => document.getElementById("audioUpload").click()}
      >
        Upload Audio
      </button>
      <input
        type="file"
        id="audioUpload"
        style={{ display: "none" }}
        accept="audio/*"
        // onChange={(e) => handleFileUpload(e, "audio")}
      />

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => document.getElementById("videoUpload").click()}
      >
        Upload Video
      </button>
      <input
        type="file"
        id="videoUpload"
        style={{ display: "none" }}
        accept="video/*"
        // onChange={(e) => handleFileUpload(e, "video")}
      />

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload Image
      </button>
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        accept="image/*"
        // onChange={(e) => handleFileUpload(e, "image")}
      />

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => document.getElementById("otherUpload").click()}
      >
        Upload File
      </button>
      <input
        type="file"
        id="otherUpload"
        style={{ display: "none" }}
        // onChange={(e) => handleFileUpload(e, "file")}
      />
    </Popover.Body>
  </Popover>
);

export const AttachmentButton = () => (
  <OverlayTrigger trigger="click" placement="top" overlay={popover}>
    <Button variant="light">
      <GrAttachment />
    </Button>
  </OverlayTrigger>
);
