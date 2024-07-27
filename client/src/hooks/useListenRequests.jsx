import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export const useListenRequests = () => {
  const { socket } = useSocketContext();
  const {
    setToSentRequestIds,
    setAllUsers,
    setContactsArray,
    setPendingRequests,
  } = useAuth();

  useEffect(() => {
    if (!socket) return;

    // handlers
    const handleFriendReqAccepted = (receiverId) => {
      setAllUsers((users) => {
        return users.filter((user) => {
          return user._id.toString() !== receiverId.toString();
        });
      });
      setToSentRequestIds((prevIds) =>
        prevIds.filter((id) => id !== receiverId)
      );
    };

    const handleSenderFriendRequestAccepted = (receiver) => {
      setContactsArray((users) => [...users, receiver]);
      // setAllUsers((users) => users.filter((user) => user._id !== receiver._id));
    };

    const handleReceivedFriendRequest = (friendRequestPopulated) => {
      setPendingRequests((prev) => [...prev, friendRequestPopulated]); //pending request have sender populated
    };
    const handleReceiverFriendRequestAccepted = (sender) => {
      setContactsArray((users) => [...users, sender]);
      setPendingRequests((prev) =>
        prev.filter((req) => req.sender._id !== sender._id)
      );
    };
    const handleCancelFriendRequest = (senderId) => {
      setPendingRequests((prev) =>
        prev.filter((req) => senderId !== req.sender._id)
      );
    };
    const handleSenderFriendRequestRejected = (receiverId) => {
      setToSentRequestIds((prevIds) =>
        prevIds.filter((id) => id !== receiverId)
      );
    };
    const handleReceiverFriendRequestRejected = (senderId) => {
      setPendingRequests((prev) =>
        prev.filter((req) => req.sender._id !== senderId)
      );
    };

    // events
    socket.on("friendRequestAccepted", handleFriendReqAccepted); //sender side

    socket.on("SenderFriendRequestAccepted", handleSenderFriendRequestAccepted); //sender side

    socket.on("receivedFriendRequest", handleReceivedFriendRequest); //receiver side

    socket.on(
      "receiverFriendRequestAccepted",
      handleReceiverFriendRequestAccepted
    ); //receiver side
    socket.on("cancelFriendRequestBySender", handleCancelFriendRequest); //on receiever side

    socket.on("senderFriendRequestRejected", handleSenderFriendRequestRejected); //sender side

    socket.on(
      "receiverFriendRequestRejected",
      handleReceiverFriendRequestRejected
    ); //on receiever side

    // cleanup function to remove event listeners
    return () => {
      socket.off("friendRequestAccepted", handleFriendReqAccepted);
      socket.off(
        "receiverFriendRequestAccepted",
        handleReceiverFriendRequestAccepted
      );
      socket.off(
        "SenderFriendRequestAccepted",
        handleSenderFriendRequestAccepted
      );
      socket.off("receivedFriendRequest", handleReceivedFriendRequest);
      socket.off("cancelFriendRequestBySender", handleCancelFriendRequest);
      socket.off(
        "senderFriendRequestRejected",
        handleSenderFriendRequestRejected
      );
      socket.off(
        "receiverFriendRequestRejected",
        handleReceiverFriendRequestRejected
      );
    };
    // eslint-disable-next-line
  }, [
    socket,
    setToSentRequestIds,
    setAllUsers,
    setContactsArray,
    setPendingRequests,
  ]);
};
