const AuthModel = require("../models/auth.model");
const genJWT = require("../utils/gen-jwt");

const bcrypt = require("bcryptjs");

// signup
const signup = async (req, res, next) => {
  try {
    // logic
    const {
      firstName,
      lastName,
      userName,
      gender,
      phone,
      email,
      password,
      cpassword
    } = req.body;

    // checking passwords
    if (password !== cpassword) {
      return res.status(400).json({ message: "passwords don't match" });
    }

    // checking if user name already exists
    const existingUser = await AuthModel.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "userName already exists" });
    }

    // pfp decider
    // const boyPfp = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    // const girlPfp = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    const apiUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&rounded=true`;

    // creating user
    const user = new AuthModel({
      firstName,
      lastName,
      userName,
      gender,
      phone,
      email,
      password,
      cpassword,
      // profilePicture: gender === "female" ? girlPfp : boyPfp,
      profilePicture: apiUrl
    });

    if (user) {
      // generating token
      await genJWT(user, res);

      await user.save();

      // returning success message
      return res.status(201).json({
        message: "user created successfully",
        user
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (err) {
    console.error(`server error while signup: ${err} `);
    const error = {
      errorDetails: "Internal Server Error While signup",
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
