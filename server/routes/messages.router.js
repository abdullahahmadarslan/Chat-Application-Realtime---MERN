const express = require("express");
const { Router } = express;

const router = Router();

// controllers
const {
  sendMsg,
  getMsgs,
  deleteMsg,
  editMsg,
} = require("../controllers/messages.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.post("/sendMsg/:recipientId", ProtectRoute, sendMsg);
router.get("/:recipientId", ProtectRoute, getMsgs);
router.delete("/:messageId", ProtectRoute, deleteMsg);
router.put("/:messageId", ProtectRoute, editMsg);

// exporting
module.exports = router;
