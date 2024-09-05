import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useStore from "../stores/useStore";

export const useListenGroupRequests = () => {
  const { socket } = useSocketContext();
  const {
    setGroupsArray,
    setCurrentGroupMembers,
    setSelectedGroup,
    selectedGroup,
    currentGroupMembers,
  } = useStore((state) => ({
    setGroupsArray: state.setGroupsArray,
    setCurrentGroupMembers: state.setCurrentGroupMembers,
    setSelectedGroup: state.setSelectedGroup,
    selectedGroup: state.selectedGroup,
    currentGroupMembers: state.currentGroupMembers,
  }));

  useEffect(() => {
    if (!socket) return;

    // handlers
    const handleGroupUpdated = (updatedGroup) => {
      setGroupsArray((prevGroups) => {
        return prevGroups.map((group) => {
          if (group._id === updatedGroup._id) {
            return {
              ...group,
              ...updatedGroup,
            };
          }
          return group;
        });
      });

      if (selectedGroup._id.toString() === updatedGroup._id.toString()) {
        setSelectedGroup(updatedGroup);
      }
    };

    const handleGroupMemberAdded = (updatedGroup) => {
      setCurrentGroupMembers(updatedGroup.participants);
    };

    const handleGroupMemberRemoved = (removedMemberId) => {
      setCurrentGroupMembers((prevMembers) =>
        prevMembers.filter(
          (member) => member._id.toString() !== removedMemberId.toString()
        )
      );
    };

    const handleRemovedFromGroup = (groupId) => {
      setGroupsArray((prevGroups) =>
        prevGroups.filter(
          (group) => group._id.toString() !== groupId.toString() //removing the group from the groups array of the specific user
        )
      );
    };

    const handleAddedIntoGroup = (updatedGroup) => {
      setGroupsArray((prev) => {
        return [...prev, updatedGroup]; //adding the new group to the groups array of the specific user
      });
    };

    const handleGroupDeleted = (groupId) => {
      if (selectedGroup?._id?.toString() === groupId.toString()) {
        setSelectedGroup(null);
      }
      setGroupsArray((prevGroups) =>
        prevGroups.filter(
          (group) => group._id.toString() !== groupId.toString()
        )
      );
    };

    const handleLeftGroup = (groupId) => {
      if (selectedGroup?._id?.toString() === groupId.toString()) {
        setSelectedGroup(null);
      }
      setGroupsArray((prevGroups) =>
        prevGroups.filter(
          (group) => group._id.toString() !== groupId.toString()
        )
      );
    };
    // events
    socket.on("groupUpdated", handleGroupUpdated); //to all the involved participants including senders
    socket.on("groupMemberAdded", handleGroupMemberAdded); //to all the involved participants including senders
    socket.on("addedIntoGroup", handleAddedIntoGroup); //to the added member
    socket.on("groupMemberRemoved", handleGroupMemberRemoved); //to all the involved participants including senders
    socket.on("removedFromGroup", handleRemovedFromGroup); //to the removed member
    socket.on("groupDeleted", handleGroupDeleted); //to all the involved users
    socket.on("leftGroup", handleLeftGroup); //to the person who left the group

    // cleanup function to remove event listeners
    return () => {
      socket.off("groupUpdated", handleGroupUpdated);
      socket.off("groupMemberAdded", handleGroupMemberAdded);
      socket.off("addedIntoGroup", handleAddedIntoGroup);
      socket.off("groupMemberRemoved", handleGroupMemberRemoved);
      socket.off("removedFromGroup", handleRemovedFromGroup);
      socket.off("groupDeleted", handleGroupDeleted);
      socket.off("leftGroup", handleLeftGroup);
    };
    // eslint-disable-next-line
  }, [
    socket,
    setGroupsArray,
    setCurrentGroupMembers,
    setSelectedGroup,
    selectedGroup,
    currentGroupMembers,
  ]);
};
