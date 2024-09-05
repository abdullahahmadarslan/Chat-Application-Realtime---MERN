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
const getFriends = async (req, res, next) => {
  try {
    const user = await AuthModel.findById(req.user._id).populate({
      path: "friends",
      select: "-password", // Exclude the password field
    });
    if (!user.friends || user.friends.length === 0)
      return res.status(404).json({ message: "No friends found" });
    return res.status(200).json(user.friends); //returning an array of objects
  } catch (err) {
    console.error(`Server error while getting the friends: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While getting the friends",
    };
    next(error);
  }
};

// editing a specific user
const editUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newUserAvatar, newUserInfo } = req.body;

    // Check if the new userName is already taken by another user
    const existingUser = await AuthModel.findOne({
      userName: newUserInfo.userName,
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Finding the user and updating the provided fields
    const updatedUser = await AuthModel.findByIdAndUpdate(
      userId,
      {
        userName: newUserInfo.userName,
        firstName: newUserInfo.firstName,
        lastName: newUserInfo.lastName,
        profilePicture: newUserAvatar,
      },
      {
        new: true,
      }
    ).select("-password"); // Exclude the password field

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser); // Returning the updated user object with the updated fields
  } catch (err) {
    console.error(`Server error while editing the user: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While editing the user",
    };
    next(error);
  }
};

// exporting
module.exports = { getAllUsers, getFriends, editUser };
