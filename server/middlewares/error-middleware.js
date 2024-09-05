//defining a common error middleware for all internal server errors instead of separately creating error for each internal server error
const errorMiddleware = (error, req, res, next) => {
  return res.status(500).json({
    message: "Internal Server Error",
    errorDetails: error.errorDetails,
  });
};

//exporting the error middleware function and telling the express app to consider it as a middleware using app.use()
module.exports = errorMiddleware;
