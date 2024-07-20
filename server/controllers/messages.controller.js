const MsgModel = require("../models/messages.model");
const ConvModel = require("../models/conversations.model");
const { io, getSocketId } = require("../socket/socket");

// sending message to another person from the current logged in user
const sendMsg = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { recipientId } = req.params;
    const senderId = req.user._id;

    // find conversation between sender and recipient
    let conversation = await ConvModel.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      // create new conversation
      conversation = new ConvModel({
        participants: [senderId, recipientId],
      });
    }

    // create new message
    const newMessage = new MsgModel({
      receiver: recipientId,
      sender: senderId,
      message,
    });

    if (newMessage) {
      // pushing the message reference id in the conversation document's messages array
      conversation.messages.push(newMessage._id);

      // saving both the conversation and the message to the database
      await Promise.all([conversation.save(), newMessage.save()]);

      // after storing the message to the database, we sent it to the receiver in real time too at the receiver's socket id
      const receiverSocketId = getSocketId(recipientId);
      // console.log("receiver's socket id: ", receiverSocketId);
      if (receiverSocketId) {
        // emitting the new message to the receiver's socket id
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json({
        message: "Message sent successfully",
        newMessage,
      });
    }
  } catch (err) {
    console.error(`server error while sending message: ${err} `);
    const error = {
      errorDetails: "Internal Server Error While sending message",
    };
    next(error);
  }
};

// getting all messages for a specific conversation between the logged in user and a recipient
const getMsgs = async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.user._id;

    // finding the conversation between sender and recipient
    const conversation = await ConvModel.findOne({
      participants: { $all: [senderId, recipientId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" });
    }
    // returning the messages array of objects of the conversation
    return res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(`server error while getting messages: ${err} `);
    const error = {
      errorDetails: "Internal Server Error While  getting messages",
    };
    next(error);
  }
};

// delete a message
const deleteMsg = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await MsgModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    message.isDeleted = true;
    message.message = "Message deleted";

    await message.save();

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

    res.status(200).json({ message: "Message edited successfully" });
  } catch (err) {
    console.error(`Server error while editing message: ${err}`);
    next({ errorDetails: "Internal Server Error While editing message" });
  }
};

// exporting
module.exports = { sendMsg, getMsgs, deleteMsg, editMsg };
