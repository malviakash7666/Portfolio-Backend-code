class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server Error";
  err.statuscode = err.statuscode || 500;

  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyvalue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "jsonWebTokenError") {
    const message = `Json web Token is Invalid , Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpredError") {
    const message = `Json web Token is Expired , Try again to login!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;
  return res.status(err.statuscode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
