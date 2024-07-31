const mongoose = require("mongoose");

// schema
const { Schema } = mongoose;

const ConvSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "Auth" },
    participants: [{ type: Schema.Types.ObjectId, ref: "Auth" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: { type: String, default: "" },
    profilePicture: {
      type: String,
    },
  },

  { timestamps: true }
);

// creating model
const ConvModel = mongoose.model("Conversation", ConvSchema);

// exporting
module.exports = ConvModel;
