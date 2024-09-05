import React from "react";
import useStore from "../../stores/useStore";

export const Group = React.memo(({ group }) => {
  const { selectedGroup, setSelectedGroup, groupsArray, setSelectedContact } =
    useStore((state) => ({
      selectedGroup: state.selectedGroup,
      setSelectedGroup: state.setSelectedGroup,
      groupsArray: state.groupsArray,
      setSelectedContact: state.setSelectedContact,
    }));

  return (
    <>
      <div
        className={`container-fluid contact ${
          selectedGroup && selectedGroup?._id === group?._id
            ? "active"
            : "not-active"
        }
        d-flex flex-column flex-sm-column flex-md-row flex-lg-row mb-4 h-auto`}
        onClick={() => {
          setSelectedGroup(group);
          setSelectedContact(null); // we get the direct message out of focus and bring focus on group
        }}
      >
        {/* Avatar and Online Indicator */}
        <div style={{ position: "relative" }}>
          <img
            src={group.profilePicture}
            alt="avatar"
            className="avatar rounded-circle"
          />
          {/* Online status indicator */}
          {/* <div
            className="online-indicator"
            style={{
              backgroundColor: isOnline ? "#aae02c" : "gray",
            }}
          ></div> */}
        </div>
        <span className="ms-3">{`${groupsArray ? group.groupName : ""} `}</span>
      </div>
    </>
  );
});
