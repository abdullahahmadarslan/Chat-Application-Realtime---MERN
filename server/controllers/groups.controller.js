const ConvModel = require("../models/conversations.model");
const { getSocketId, io } = require("../socket/socket");

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

// edit group name and profile picture
const editGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { newGroupName, newGroupAvatar } = req.body;

    // finding group and updating it
    const updatedGroup = await ConvModel.findByIdAndUpdate(
      groupId,
      {
        groupName: newGroupName,
        profilePicture: newGroupAvatar,
      },
      { new: true } //returns updated documents after updating only the mentioned fields
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "group not found" });
    }

    // emitting event to all user that group got updated
    updatedGroup.participants.forEach((id) => {
      const receiverSocketId = getSocketId(id);
      if (receiverSocketId)
        io.to(receiverSocketId).emit("groupUpdated", updatedGroup);
    });

    return res.status(200).json(updatedGroup);
  } catch (err) {
    console.error(`Server error while editing group: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While editing group",
    };
    next(error);
  }
};

// get members of the current selected group
const getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await ConvModel.findById(groupId).populate("participants");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const members = group.participants; //array of members of groups populated

    if (members.length === 0) {
      return res
        .status(404)
        .json({ message: "No members found in this group" });
    }
    res.status(200).json(members);
  } catch (err) {
    console.error(`Server error while getting group members: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While getting group members",
    };
    next(error);
  }
};

// add new member to the current group
const addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { memberId: newMemberId } = req.body;

    const currentGroup = await ConvModel.findById(groupId);
    if (!currentGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // pushing the new member to the current group
    if (!currentGroup.participants.includes(newMemberId)) {
      currentGroup.participants.push(newMemberId);
    }
    const currentUpdatedGroup = await currentGroup.save(); //without populated participants

    // populating the participants field
    const updatedGroup = await ConvModel.findById(groupId).populate(
      "participants"
    );

    // emitting event to all user that group got updated
    currentUpdatedGroup.participants.forEach((id) => {
      const receiverSocketId = getSocketId(id);
      if (receiverSocketId)
        io.to(receiverSocketId).emit("groupMemberAdded", updatedGroup); //group has populated participants field
    });

    // emitting event to the user specifically who was added
    const receiverSocketId = getSocketId(newMemberId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("addedIntoGroup", currentUpdatedGroup); //group has populated participants field

    return res.status(200).json(updatedGroup);
  } catch (err) {
    console.error(`Server error while adding group member: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While adding group member",
    };
    next(error);
  }
};

// remove member from the current group
const removeMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { memberId: removedMemberId } = req.body;

    // Use $pull operator to remove the member from the group
    const updatedGroup = await ConvModel.findByIdAndUpdate(
      groupId,
      { $pull: { participants: removedMemberId } },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // emitting event to all event users involved

    // for all the not removed participants
    updatedGroup.participants.forEach((id) => {
      const receiverSocketId = getSocketId(id);
      if (receiverSocketId)
        io.to(receiverSocketId).emit("groupMemberRemoved", removedMemberId); //filter this id of the user from the current participants of the current group
    });

    //for the removed participant
    const receiverSocketIdTBR = getSocketId(removedMemberId);
    if (receiverSocketIdTBR)
      io.to(receiverSocketIdTBR).emit("removedFromGroup", groupId); //remove this group from the removed user's end

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error(`Server error while removing group member: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While removing group member",
    };
    next(error);
  }
};

// delete group
const deleteGroup = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    // Delete the group conversation
    const deletedGroup = await ConvModel.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // emitting event to all user that group got deleted
    deletedGroup.participants.forEach((id) => {
      const receiverSocketId = getSocketId(id);
      if (receiverSocketId)
        io.to(receiverSocketId).emit("groupDeleted", groupId);
    });

    res.status(200).json(deletedGroup);
  } catch (err) {
    console.error(`Server error while deleting the group: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While deleting the group",
    };
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id; // The user who left the group is the currently logged-in user

  try {
    // Pull the userId from the participants array of the group
    const group = await ConvModel.findByIdAndUpdate(
      groupId,
      { $pull: { participants: userId } },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // emitting real time event to remove the group from the person's client side who left the group
    const receiverSocketId = getSocketId(userId);
    if (receiverSocketId) io.to(receiverSocketId).emit("leftGroup", groupId); //filter this id of the user from the current participants of the current group

    res.status(200).json({ message: "Successfully left the group" });
  } catch (err) {
    console.error(`Server error while leaving the group: ${err}`);
    const error = {
      errorDetails: "Internal Server Error While leaving the group",
    };
    next(error);
  }
};

module.exports = {
  getGroupsForSidebar,
  editGroup,
  getGroupMembers,
  addMember,
  removeMember,
  deleteGroup,
  leaveGroup,
};
