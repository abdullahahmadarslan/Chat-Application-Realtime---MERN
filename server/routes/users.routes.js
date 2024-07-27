const express = require("express");
const { Router } = express;
const router = Router();

// controllers
const { getAllUsers, getFriends } = require("../controllers/users.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.get("/", ProtectRoute, getFriends);
router.get("/allUsers", ProtectRoute, getAllUsers);

// exporting
module.exports = router;
