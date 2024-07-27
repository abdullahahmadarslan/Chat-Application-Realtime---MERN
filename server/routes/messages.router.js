const express = require("express");
const { Router } = express;

const router = Router();

// controllers
const {
  createGroup,
  sendMsg,
  getMsgs,
  deleteMsg,
  editMsg,
} = require("../controllers/messages.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.post("/sendMsg/:recipientIds", ProtectRoute, sendMsg);
router.get("/:recipientIds", ProtectRoute, getMsgs);
router.delete("/:messageId", ProtectRoute, deleteMsg);
router.put("/:messageId", ProtectRoute, editMsg);

// Group chat routes
router.post("/group/createGroup", ProtectRoute, createGroup);
router.post("/group/sndMsg/:recipientIds", ProtectRoute, sendMsg);
router.get("/group/:recipientIds/messages", ProtectRoute, getMsgs);

// exporting
module.exports = router;
