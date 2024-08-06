const express = require("express");
const { Router } = express;
const router = Router();

// controllers
const {
  getGroupsForSidebar,
  editGroup,
  getGroupMembers,
  addMember,
  removeMember,
} = require("../controllers/groups.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.get("/", ProtectRoute, getGroupsForSidebar);
router.get("/getGroupMembers/:groupId", ProtectRoute, getGroupMembers);
router.patch("/editGroup/:groupId", ProtectRoute, editGroup);
router.patch("/:groupId/addMember", ProtectRoute, addMember);
router.delete("/:groupId/removeMember", ProtectRoute, removeMember);

// exporting
module.exports = router;
