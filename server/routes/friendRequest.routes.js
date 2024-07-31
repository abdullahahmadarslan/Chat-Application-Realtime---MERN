const express = require("express");
const { Router } = express;

const router = Router();

// controllers
const {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  deleteFriendRequest,
  rejectFriendRequest,
  deleteFriend,
} = require("../controllers/friendRequest.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// Friend request routes
router.post("/", ProtectRoute, sendFriendRequest);
router.get("/friend-requests", ProtectRoute, getFriendRequests); //pending requests of the logged in user
router.get("/getSentFriendRequests", ProtectRoute, getSentFriendRequests); //sent requests by the logged in user
router.delete(
  "/deleteFriendRequest/:receiverId",
  ProtectRoute,
  deleteFriendRequest
);
router.delete("/deleteFriend/:friendId", ProtectRoute, deleteFriend);
router.put("/:requestId/accept", ProtectRoute, acceptFriendRequest);
router.patch("/:requestId/reject", rejectFriendRequest);

// exporting
module.exports = router;
