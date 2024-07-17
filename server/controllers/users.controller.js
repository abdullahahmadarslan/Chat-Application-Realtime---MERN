const AuthModel = require("../models/auth.model");

// getting users for sidebar
const getUsersForSiderbar = async (req, res, next) => {
  try {
    const currentUser = req.user._id;

    //getting all users excluding the current user
    const filteredUsers = await AuthModel.find({
      _id: { $ne: currentUser },
    }).select("-password"); // excluding password field;

    if (!filteredUsers) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error(`server error while getting users: ${err} `);
    const error = {
      errorDetails: "Internal Server Error While  getting users",
    };
    next(error);
  }
};

// exporting
module.exports = { getUsersForSiderbar };
