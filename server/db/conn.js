const mongoose = require("mongoose");

// Connect to MongoDB
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // exit process with failure status
        process.exit(1);
    }
};

// exporting the dbConnection function
module.exports = dbConnection;
