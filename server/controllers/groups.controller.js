const ConvModel = require("../models/conversations.model");

// Get groups where the current user is a participant
const getGroupsForSidebar = async (req, res, next) => {
  try {
    const currentUser = req.user._id;

    // Fetching all groups where the current user is a participant
    const groups = await ConvModel.find({
      isGroup: true,
      participants: currentUser,
    });

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: "No groups found" });
    }

    res.status(200).json(groups);
  } catch (err) {
    console.error(`Server error while getting groups: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While getting groups",
    };
    next(error);
  }
};

// Exporting
module.exports = { getGroupsForSidebar };
