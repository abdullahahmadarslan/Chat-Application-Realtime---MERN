const express = require("express");
const router = express.Router();

// requiring controllers
const { signup, login, logout } = require("../controllers/auth.controller");

// defining auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// exporting
module.exports = router;
