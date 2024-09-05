const MsgModel = require("../models/messages.model");
const ConvModel = require("../models/conversations.model");
const { io, getSocketId } = require("../socket/socket");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create a group chat
const createGroup = async (req, res, next) => {
  try {
    const { groupName, participants, profilePicture } = req.body;
    const creator = req.user._id;

    // generating profile picture of group
    const pfpUrl = profilePicture
      ? profilePicture
      : `https://ui-avatars.com/api/?name=${groupName}&rounded=true`;

    const newGroup = new ConvModel({
      groupName,
      participants: [...participants, creator],
      isGroup: true,
      profilePicture: pfpUrl,
      creator,
    });
    await newGroup.save();

    // Emit event to participants
    participants.forEach((participantId) => {
      const socketId = getSocketId(participantId);
      if (socketId) {
        io.to(socketId).emit("groupCreated", newGroup);
      }
    });

    res.status(201).json({
      message: "Group created successfully",
      newGroup,
    });
  } catch (err) {
    console.error(`Server error while creating group: ${err} `);
    next({ errorDetails: "Internal Server Error While creating group" });
  }
};

// Send a message to a group or direct message
const sendMsg = async (req, res, next) => {
  try {
    const { message, type, isGroup, isSafe } = req.body;
    const { recipientIds } = req.params;
    const senderId = req.user._id;

    // Split recipientIds into an array if it's a comma-separated string
    const recipientArrayNew = recipientIds.split(",").map((id) => id.trim());

    // Validate and convert to ObjectId
    const objectIdArray = recipientArrayNew.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new ObjectId(id);
    });

    // Ensure senderId is not repeated in objectIdArray
    const uniqueObjectIdArray = objectIdArray.filter(
      (id) => !id.equals(senderId)
    );
    // Sort arrays for comparison
    const sortedParticipants = [senderId, ...uniqueObjectIdArray].sort();

    // Find conversation with exactly the mentioned IDs
    let conversation = await ConvModel.findOne({
      participants: {
        $size: sortedParticipants.length,
        $all: sortedParticipants,
      },
      isGroup,
    });

    // Create a new conversation if it does not exist
    if (!conversation) {
      conversation = new ConvModel({
        participants: sortedParticipants,
        isGroup,
      });
    }

    // Create a new message
    const newMessage = new MsgModel({
      receiver: uniqueObjectIdArray, // Assuming the receiver field can store an array
      sender: senderId,
      message,
      type,
      isSafe,
    });

    if (newMessage) {
      // Push the message reference ID in the conversation document's messages array
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);

      // Populate the sender field in the message before returning
      const populatedMessage = await MsgModel.findById(newMessage._id).populate(
        "sender"
      );

      // Notify all participants
      // console.log(conversation.participants);
      uniqueObjectIdArray.forEach((participantId) => {
        const receiverSocketId = getSocketId(participantId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }
      });

      res.status(201).json({
        message: "Message sent successfully",
        populatedMessage,
      });
    }
  } catch (err) {
    console.error(`Server error while sending message: ${err}`);
    next({ errorDetails: "Internal Server Error While sending message" });
  }
};
// getting all messages for a specific conversation between the logged in user and a recipient
const getMsgs = async (req, res, next) => {
  try {
    const { recipientIds } = req.params; //always a string is returned
    const senderId = req.user._id;
    const { isGroup } = req.query;
    // Split recipientIds into an array if it's a comma-separated string
    const recipientArrayNew = recipientIds.split(",").map((id) => id.trim());

    // Validate and convert to ObjectId
    const objectIdArray = recipientArrayNew.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new ObjectId(id);
    });

    // Ensure senderId is not repeated in objectIdArray
    const uniqueObjectIdArray = objectIdArray.filter(
      (id) => !id.equals(senderId)
    );
    // Sort arrays for comparison
    const sortedParticipants = [senderId, ...uniqueObjectIdArray].sort();

    // Find the conversation with exactly the mentioned IDs
    const conversation = await ConvModel.findOne({
      participants: {
        $size: sortedParticipants.length,
        $all: sortedParticipants,
      },
      isGroup,
    }).populate({
      path: "messages",
      populate: {
        path: "sender", //  populating sender within the messages
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" });
    }

    // Return the messages array of objects from the conversation
    return res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(`Server error while getting messages: ${err}`);
    next({ errorDetails: "Internal Server Error While getting messages" });
  }
};

// delete a message
const deleteMsg = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    const { receiver } = req.body; //flag to differentiate between sender and receiver deletion
    console.log(receiver);
    const message = await MsgModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the deletion is from the receiver's side
    if (receiver.isReceiver) {
      if (!message.receiver.includes(userId)) {
        return res.status(403).json({ message: "Unauthorized action" });
      }

      // Set the flag indicating the receiver has deleted the message
      message.isDeletedByReceiver = true;

      await message.save();

      return res
        .status(200)
        .json({ message: "Message deleted for receiver only" });
    }

    // Check if the deletion is from the sender's side
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    message.isDeleted = true;
    message.message = "Message deleted";

    await message.save();

    // Emit the messageDeleted event to all receivers
    message.receiver.forEach((receiverId) => {
      const receiverSocketId = getSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", message);
      }
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(`Server error while deleting message: ${err}`);
    next({ errorDetails: "Internal Server Error While deleting message" });
  }
};

// update a message
const editMsg = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const msg = await MsgModel.findById(messageId);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }
    // console.log(msg.sender);
    // console.log(userId);
    if (msg.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    msg.message = message;
    msg.isEdited = true;

    await msg.save();
    // console.log(msg);

    // Emit the messageEdited event to all receivers
    msg.receiver.forEach((receiverId) => {
      const receiverSocketId = getSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageEdited", msg);
      }
    });

    res.status(200).json({ message: "Message edited successfully" });
  } catch (err) {
    console.error(`Server error while editing message: ${err}`);
    next({ errorDetails: "Internal Server Error While editing message" });
  }
};

// exporting
module.exports = { createGroup, sendMsg, getMsgs, deleteMsg, editMsg };
