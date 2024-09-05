const mongoose = require("mongoose");
const { Schema } = mongoose;

// schema
const MsgSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    receiver: [
      {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
      },
    ],
    message: {
      type: String,
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }, // For sender's deletion
    isDeletedByReceiver: { type: Boolean, default: false }, // For receiver's deletion
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      required: true,
    },
    isSafe: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// model
const MsgModel = mongoose.model("Message", MsgSchema);

// exporting the model
module.exports = MsgModel;
