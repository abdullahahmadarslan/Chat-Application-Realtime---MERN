const FriendRequest = require("../models/friendRequest.model");
const AuthModel = require("../models/auth.model");
const { io, getSocketId } = require("../socket/socket");

// send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    if (friendRequest) await friendRequest.save();

    // real time friend req received on the receiver's end

    const friendRequestPopulated = await FriendRequest.findOne({
      _id: friendRequest._id,
      status: "pending",
    }).populate("sender");

    // console.log(friendRequestPopulated);

    if (friendRequestPopulated) {
      const receiverSocketId = getSocketId(receiverId);
      io.to(receiverSocketId).emit(
        "receivedFriendRequest",
        friendRequestPopulated
      );
    }

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// accept a friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (friendRequest && friendRequest.status === "pending") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      // Add friends to both users
      await AuthModel.findByIdAndUpdate(friendRequest.sender, {
        $push: { friends: friendRequest.receiver },
      });
      await AuthModel.findByIdAndUpdate(friendRequest.receiver, {
        $push: { friends: friendRequest.sender },
      });

      // real time events on friend request acceptance
      const sender = await AuthModel.findOne({ _id: friendRequest.sender });
      const receiver = await AuthModel.findOne({ _id: friendRequest.receiver });

      const senderSocketId = getSocketId(friendRequest.sender);
      const receiverSocketId = getSocketId(friendRequest.receiver);

      io.to(senderSocketId).emit(
        "friendRequestAccepted",
        friendRequest.receiver
      ); //sending the sender of the friend request to remove the reciever id from the toSentRequestIds array

      io.to(receiverSocketId).emit("receiverFriendRequestAccepted", sender);
      io.to(senderSocketId).emit("SenderFriendRequestAccepted", receiver);

      // console.log("friend req accepted");

      res.status(200).json(friendRequest);
    } else {
      res
        .status(404)
        .json({ error: "Friend request not found or already processed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getting the pending friend requests of the currently logged in user
const getFriendRequests = async (req, res) => {
  try {
    const recieverId = req.user._id;
    const requests = await FriendRequest.find({
      receiver: recieverId,
      status: "pending",
    }).populate("sender");

    // if no requests found
    if (!requests)
      req.status(404).json({ error: "no pending friend requests" });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getting the sent friend requests by the current logged in user
const getSentFriendRequests = async (req, res) => {
  try {
    const senderId = req.user._id;
    const requests = await FriendRequest.find({
      sender: senderId,
      status: "pending",
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// deleteing a sent friend request
const deleteFriendRequest = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user._id; // Assuming you're using middleware to set req.user

  try {
    // Find and delete the friend request
    const result = await FriendRequest.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed." });
    }

    // realtime event handling on friend req receiver side to cancel remove the request from pending section
    const receiverSocketId = getSocketId(receiverId);
    io.to(receiverSocketId).emit("cancelFriendRequestBySender", senderId);

    res.status(200).json({ message: "Friend request deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// rejecting a friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (friendRequest && friendRequest.status === "pending") {
      friendRequest.status = "declined";
      await friendRequest.save();

      // Real-time events on friend request rejection
      const senderSocketId = getSocketId(friendRequest.sender);
      const receiverSocketId = getSocketId(friendRequest.receiver);

      io.to(senderSocketId).emit(
        "senderFriendRequestRejected",
        friendRequest.receiver
      ); // Notifying the sender of the rejection

      io.to(receiverSocketId).emit(
        "receiverFriendRequestRejected",
        friendRequest.sender
      ); // Notifying the receiver of the rejection

      res.status(200).json(friendRequest);
    } else {
      res
        .status(404)
        .json({ error: "Friend request not found or already processed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exporting
module.exports = {
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  getSentFriendRequests,
  deleteFriendRequest,
  rejectFriendRequest,
};
