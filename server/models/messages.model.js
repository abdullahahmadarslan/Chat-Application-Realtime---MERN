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
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// model
const MsgModel = mongoose.model("Message", MsgSchema);

// exporting the model
module.exports = MsgModel;
