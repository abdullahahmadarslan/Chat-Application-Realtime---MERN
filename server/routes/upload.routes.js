// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");

// Multer configuration with file size limit
const upload = multer({
  dest: "uploads/", // Save uploaded files to a local directory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// upload end point
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Automatically detect the file type
    });

    // Remove the file from the server after upload
    fs.unlinkSync(filePath);

    res.json({ url: result.secure_url });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds limit of 5MB" });
    }
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
