const mongoose = require("mongoose");

// schema
const { Schema } = mongoose;

const ConvSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "Auth" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
  },
  { timestamps: true }
);

// creating model
const ConvModel = mongoose.model("Conversation", ConvSchema);

// exporting
module.exports = ConvModel;
