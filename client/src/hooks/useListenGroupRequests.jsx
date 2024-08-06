import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const useListenGroupRequests = () => {
  const { socket } = useSocketContext();
  const {
    // setToSentRequestIds,
    // setAllUsers,
    // setContactsArray,
    // setPendingRequests,
    setGroupsArray,
    // setSelectedContact,
    setCurrentGroupMembers,
  } = useAuth();

  useEffect(() => {
    if (!socket) return;

    // handlers
    const handleGroupUpdated = (updatedGroup) => {
      setGroupsArray((prevGroups) => {
        return prevGroups.map((group) => {
          if (group._id === updatedGroup._id) {
            return { ...group, ...updatedGroup };
          }
          return group;
        });
      });
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
    // events
    socket.on("groupUpdated", handleGroupUpdated); //to all the involved participants including senders
    socket.on("groupMemberAdded", handleGroupMemberAdded); //to all the involved participants including senders
    socket.on("addedIntoGroup", handleAddedIntoGroup); //to the added member
    socket.on("groupMemberRemoved", handleGroupMemberRemoved); //to all the involved participants including senders
    socket.on("removedFromGroup", handleRemovedFromGroup); //to the removed member

    // cleanup function to remove event listeners
    return () => {
      socket.off("groupUpdated", handleGroupUpdated);
      socket.off("groupMemberAdded", handleGroupMemberAdded);
      socket.off("addedIntoGroup", handleAddedIntoGroup);
      socket.off("groupMemberRemoved", handleGroupMemberRemoved);
      socket.off("removedFromGroup", handleRemovedFromGroup);
    };
    // eslint-disable-next-line
  }, [
    socket,
    // setToSentRequestIds,
    // setAllUsers,
    // setContactsArray,
    // setPendingRequests,
    setGroupsArray,
    setCurrentGroupMembers,
    // setSelectedContact,
  ]);
};
