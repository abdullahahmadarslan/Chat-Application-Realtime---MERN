const express = require("express");
const { Router } = express;
const router = Router();

// controllers
const { getUsersForSiderbar } = require("../controllers/users.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.get("/", ProtectRoute, getUsersForSiderbar);

// exporting
module.exports = router;
