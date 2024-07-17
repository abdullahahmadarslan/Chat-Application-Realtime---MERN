const AuthModel = require("../models/auth.model");
const jasonwebtoken = require("jsonwebtoken");

// middleware
const ProtectRoute = async (req, res, next) => {
  // middleware to protect routes with JWT token
  try {
    const jwt = req.cookies.jwt;
    // console.log(jwt)
    if (!jwt) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });
    }

    // verifying token
    jasonwebtoken.verify(
      jwt,
      process.env.JWT_SECRET,
      async (err, decodedPayload) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Unauthorized - invalid token" });
        } else {
          //   console.log(decodedPayload);
          const user = await AuthModel.findById(decodedPayload.id);
          //if no user found
          if (!user) {
            return res
              .status(404)
              .json({ message: "Unauthorized - user not found" });
          }

          //   assigned user to request
          req.user = user;
          //moving on
          next();
        }
      }
    );
  } catch (error) {
    console.error(`Error protecting route: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// exporting
module.exports = { ProtectRoute };
