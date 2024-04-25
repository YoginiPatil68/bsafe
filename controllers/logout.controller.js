const Joi = require("joi");
const RefreshToken = require("../models/refreshToken");

const logoutController = {
  async logout(req, res, next) {
    const refreshSchema = Joi.object({
      refresh: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);
    if (!error) {
      return next(error);
    }
    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },
};
module.exports = logoutController;
