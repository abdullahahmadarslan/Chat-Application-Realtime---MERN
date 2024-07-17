const jwt = require("jsonwebtoken");

// generating jwt token
const generateJwtToken = async function (user, res) {
    try {
        // creating token
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // response with token
        res.cookie(
            "jwt",
            token,
            {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true, // prevent XSS attacks cross-site scripting attacks
                sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            }
        );
    } catch (error) {
        console.error(`Error generating JWT token: ${error.message}`);
    }
};

// exporting
module.exports = generateJwtToken;
