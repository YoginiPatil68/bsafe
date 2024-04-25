class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }
  static wrongCredentials(message = "Invalid email or password") {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorizedUser(message = "unAuthorized user") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message = "404 not found") {
    return new CustomErrorHandler(404, message);
  }
  static serverError(message = "server error, try after some time") {
    return new CustomErrorHandler(500, message);
  }
}

module.exports = CustomErrorHandler;
