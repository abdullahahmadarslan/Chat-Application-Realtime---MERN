const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require("bcryptjs");

// schema
const authSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
  },
  { timestamps: true }
);

// middleware functions
authSchema.pre("save", async function (next) {
  try {
    const documentInstance = this;
    // console.log(documentInstance);
    // hash the password before saving
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      documentInstance.password,
      saltRounds
    );
    documentInstance.password = hashedPassword;

    //moving on to the next middleware function
    next();
  } catch (error) {
    console.error(
      "Error in pre save middleware while hashing password:",
      error.message
    );
    next(error);
  }
});

// model
const AuthModel = mongoose.model("Auth", authSchema);

// exporting
module.exports = AuthModel;
