const AuthModel = require("../models/auth.model");
const genJWT = require("../utils/gen-jwt");

const bcrypt = require("bcryptjs");

// signup
const signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      gender,
      phone,
      email,
      password,
      cpassword,
      profilePicture,
    } = req.body;

    // Checking if passwords match
    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Checking if the username already exists
    const existingUserName = await AuthModel.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Checking if the email already exists
    const existingEmail = await AuthModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Profile picture decision
    const pfpUrl = profilePicture
      ? profilePicture
      : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&rounded=true`;

    // Creating user
    const user = new AuthModel({
      firstName,
      lastName,
      userName,
      gender,
      phone,
      email,
      password,
      cpassword,
      profilePicture: pfpUrl,
    });

    if (user) {
      // Generating token
      await genJWT(user, res);

      // Saving user to the database
      await user.save();

      // Returning success message
      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (err) {
    console.error(`Server error during signup: ${err}`);
    const error = {
      errorDetails: "Internal Server Error During Signup",
    };
    next(error);
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user exists
    const user = await AuthModel.findOne({ email });

    // checking password
    const isMatch = await bcrypt.compare(password, user?.password || "");

    // if user doesn't exist or password is incorrect
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      // generating token
      await genJWT(user, res);

      return res.status(200).json({ message: "Logged in successfully", user });
    }
  } catch (err) {
    console.error(`server error while login: ${err} `);
    const error = {
      errorDetails: "Internal Server Error While login",
    };
    next(error);
  }
};

// logout controller
const logout = async (req, res, next) => {
  try {
    // Clear the cookie
    res.clearCookie("jwt", { httpOnly: true, secure: true });

    // Send a response indicating the user has been logged out
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(`Server error while logout: ${err.message}`);
    const error = {
      errorDetails: "Internal Server Error while logout",
    };
    next(error);
  }
};

// exporting
module.exports = { signup, login, logout };
