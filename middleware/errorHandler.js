const { DEBUG_MODE } = require("../config/index");
const { ValidationError } = require("joi");
const CustomErrorHandler = require("../services/CustomErrorHandler");

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && {
      success: false,
      originalError: err.message,
    }),
  };
  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      success: false,
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    (statusCode = err.status),
      (data = {
        success: false,
        message: err.message,
      });
  }
  return res.status(statusCode).json(data);
}

module.exports = errorHandler;
