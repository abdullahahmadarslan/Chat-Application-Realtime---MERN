const AuthModel = require("../models/auth.model");

// getting all users from the database except the current logged in user and except his friends
const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Get the current user with the friends array populated
    const currentUser = await AuthModel.findById(currentUserId).populate(
      "friends"
    );

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    // Extract friend IDs
    const friendIds = currentUser.friends.map((friend) => friend._id);

    // Find all users except the current user and their friends
    const filteredUsers = await AuthModel.find({
      _id: { $nin: [currentUserId, ...friendIds] },
    }).select("-password"); // Exclude the password field

    if (filteredUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error(`Server error while getting users: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While getting users",
    };
    next(error);
  }
};

// getting all friends of the currently logged in user
const getFriends = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.user._id).populate({
      path: "friends",
      select: "-password", // Exclude the password field
    });
    if (!user.friends || user.friends.length === 0)
      return res.status(404).json({ message: "No friends found" });
    return res.status(200).json(user.friends); //returning an array of objects
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exporting
module.exports = { getAllUsers, getFriends };
