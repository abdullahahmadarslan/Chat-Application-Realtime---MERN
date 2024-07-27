const express = require("express");
const { Router } = express;
const router = Router();

// controllers
const { getGroupsForSidebar } = require("../controllers/groups.controller");

// middleware
const { ProtectRoute } = require("../middlewares/protectRoute.middleware");

// routes
router.get("/", ProtectRoute, getGroupsForSidebar);

// exporting
module.exports = router;
