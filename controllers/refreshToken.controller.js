const Joi = require("joi");
const { REFRESH_SECRET } = require("../config");
const RefreshToken = require("../models/refreshToken");
const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const JwtService = require("../services/JwtService");

const refreshTokenController = {
  async refresh(req, res, next) {
    //validation
    const refreshSchema = Joi.object({
      refresh: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    //database
    let Token;
    try {
      Token = await RefreshToken.findOne({
        refreshToken: req.body.refresh,
      });
      if (!Token) {
        return next(
          CustomErrorHandler.unAuthorizedUser("Invalid refresh token")
        );
      }
      let user_id;
      try {
        const { _id } = await JwtService.verify(
          Token.refreshToken,
          REFRESH_SECRET
        );
        user_id = _id;
      } catch (err) {
        return next(err);
      }
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return next(CustomErrorHandler.unAuthorizedUser("no user found!"));
      }
      // token
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );

      // database whitelist

      const x = await RefreshToken.findOneAndUpdate(
        { userid: user._id },
        {
          refreshToken: refresh_token,
        }
      );
      res.json({
        success: true,
        access_token,
        refresh_token,
      });
    } catch (err) {
      return next(new Error("Something went wrong" + err.message));
    }
  },
};

module.exports = refreshTokenController;
