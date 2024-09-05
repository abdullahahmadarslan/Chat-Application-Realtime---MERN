const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// Multer configuration with file size limit
const upload = multer({
  dest: "uploads/", // Save uploaded files to a local directory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Utility function to copy a file
const copyFile = async (source, target) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(target);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    readStream.pipe(writeStream);
  });
};

// Utility function to safely delete a file
const safeDeleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      // console.log(`Deleted file: ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  } else {
    // console.log(`File does not exist: ${filePath}`);
  }
};

// Upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  let tempFilePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const originalFilePath = path.resolve(req.file.path);
    const fileType = req.file.mimetype.split("/")[0];
    let isSafe = true;

    // console.log(`Original file path: ${originalFilePath}`);
    if (!fs.existsSync(originalFilePath)) {
      console.error(`File not found: ${originalFilePath}`);
      return res.status(500).json({ message: "File not found after upload" });
    }

    // Create a temporary copy of the file
    tempFilePath = `${originalFilePath}_copy`;
    await copyFile(originalFilePath, tempFilePath);
    // console.log(`Temporary copy created at: ${tempFilePath}`);

    // Check if the uploaded file is an image
    if (fileType === "image") {
      // Send the image to the Flask server for verification
      const formData = new FormData();
      formData.append("image", fs.createReadStream(tempFilePath));

      const flaskResponse = await axios.post(
        "http://localhost:5001/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      const { is_safe } = flaskResponse.data;
      isSafe = is_safe;
      // console.log("Is image safe:", isSafe);
    }

    // Upload the file to Cloudinary using the original file
    const result = await cloudinary.uploader.upload(originalFilePath, {
      resource_type: "auto",
    });

    // console.log("Uploaded to Cloudinary:", result.secure_url);

    // Clean up: Remove both the original file and the temporary copy
    safeDeleteFile(originalFilePath);
    safeDeleteFile(tempFilePath);

    res.status(200).json({ url: result.secure_url, isSafe });
  } catch (error) {
    console.error("Error during file upload:", error);
    // Ensure that the temporary file is deleted if an error occurs
    safeDeleteFile(tempFilePath);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Delete route
router.delete("/delete", async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ message: "Public ID is required" });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
});

module.exports = router;
