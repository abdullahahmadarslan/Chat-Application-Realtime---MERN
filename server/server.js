//requiring .env file at the top
require("dotenv").config();

// creating express app
const cookieParser = require("cookie-parser");
const express = require("express");
const { app, server } = require("./socket/socket.js");

const PORT = process.env.PORT;

// requiring database connection
const dbConnection = require("./db/conn.js");

// importing routers
const authRouter = require("./routes/auth.routes");
const messageRouter = require("./routes/messages.router");
const userRouter = require("./routes/users.routes");
const groupRouter = require("./routes/groups.routes.js");
const friendRequestRouter = require("./routes/friendRequest.routes.js");
const uploadRouter = require("./routes/upload.routes.js");
// importing middlewares
const errorMiddleware = require("./middlewares/error-middleware");

//requiring cors
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:3000",
  methods: "POST,GET,PUT,PATCH,DELETE",
  origin: true,
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use("/friend-request", friendRequestRouter);
app.use("/cloudinary", uploadRouter);

// error handling middleware
app.use(errorMiddleware);

// server listening on a port
server.listen(PORT, () => {
  dbConnection().then(() => console.log(`Server is running on port ${PORT}`));
});
