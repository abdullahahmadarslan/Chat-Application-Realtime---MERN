import { FaUserFriends } from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useGetGroupMembers } from "../hooks/useGetGroupMembers";
import { ShowGroupMembers } from "./ShowGroupMembers";
import { AddGroupMembers } from "./AddGroupMembers";
import { DeleteGroupMembers } from "./DeletegGroupMembers";
import { useAuth } from "../context/AuthContext";

export const GroupMembersButton = () => {
  const { userAuth, selectedGroup } = useAuth();

  // getting current group members everytime someone clicks on a new Group
  useGetGroupMembers();

  // popover
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className="d-flex flex-column gap-3 colo">
        <ShowGroupMembers />
        {selectedGroup &&
        selectedGroup?.creator?.toString() === userAuth._id ? (
          <>
            <AddGroupMembers />
            <DeleteGroupMembers />
          </>
        ) : null}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <button type="button" className="btn">
          <FaUserFriends
            className="group-members-button"
            style={{ color: "white", fontSize: "25px" }}
          />
        </button>
      </OverlayTrigger>
    </>
  );
};
