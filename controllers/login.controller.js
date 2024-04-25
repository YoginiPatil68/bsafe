const Joi = require("joi");
const User = require("../models/user");
const Admin = require("../models/admin");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const { REFRESH_SECRET } = require("../config");
const RefreshToken = require("../models/refreshToken");

const loginController = {
  async login(req, res, next) {
    // validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.number().required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      if (user.role !== req.body.role) {
        return next(
          CustomErrorHandler.wrongCredentials(
            "Trying Sign In to Incorrect Role"
          )
        );
      }
      const tokens = await RefreshToken.findOne({
        userid: user._id,
      });
      //organize it
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
      if (!tokens) {
        await RefreshToken.create({
          userid: user._id,
          refreshToken: refresh_token,
        });
        return res.json({
          success: true,
          access_token,
          refresh_token,
        });
      }
      await RefreshToken.findOneAndUpdate(
        { userid: user._id },
        {
          refreshToken: refresh_token,
        }
      );
      return res.json({
        success: true,
        access_token,
        refresh_token,
        result: user,
      });
    } catch (err) {
      return next(err);
    }
  },
  async adminlogin(req, res, next) {
    // validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await Admin.findOne({
        email: req.body.email,
      });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      const tokens = await RefreshToken.findOne({
        userid: user._id,
      });
      //organize it
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
      if (!tokens) {
        await RefreshToken.create({
          userid: user._id,
          refreshToken: refresh_token,
        });
        return res.json({
          success: true,
          access_token,
          refresh_token,
        });
      }
      await RefreshToken.findOneAndUpdate(
        { userid: user._id },
        {
          refreshToken: refresh_token,
        }
      );
      res.cookie("access_token", access_token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.cookie("refresh_token", refresh_token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.json({
        success: true,
        access_token,
        refresh_token,
      });
    } catch (err) {
      return next(err);
    }
  },
  async resetPassword(req, res, next) {
    // validation
    const { _id } = req.user;
    const loginSchema = Joi.object({
      password: Joi.string().required(),
      newPass: Joi.string().required(),
      confirmPass: Joi.ref("newPass"),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findById(_id);
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials(
            "Password must match the current password"
          )
        );
      }
      const tokens = await RefreshToken.findOne({
        userid: user._id,
      });
      //organize it
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      const hashedPassword = await bcrypt.hash(req.body.newPass, 10);
      // database whitelist
      const reset = await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });
      if (!tokens) {
        await RefreshToken.create({
          userid: user._id,
          refreshToken: refresh_token,
        });

        return res.json({
          success: true,
          access_token,
          refresh_token,
        });
      }
      await RefreshToken.findOneAndUpdate(
        { userid: user._id },
        {
          refreshToken: refresh_token,
        }
      );
      return res.json({
        success: true,
        access_token,
        refresh_token,
        result: user,
      });
    } catch (err) {
      return next(err);
    }
  },
  async forgotPassword(req, res, next) {
    // validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      newPass: Joi.string().required(),
      confirmPass: Joi.ref("newPass"),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const tokens = await RefreshToken.findOne({
        userid: user._id,
      });
      //organize it
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      const hashedPassword = await bcrypt.hash(req.body.newPass, 10);
      // database whitelist
      const reset = await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });
      if (!tokens) {
        await RefreshToken.create({
          userid: user._id,
          refreshToken: refresh_token,
        });
        return res.json({
          success: true,
          access_token,
          refresh_token,
        });
      }
      await RefreshToken.findOneAndUpdate(
        { userid: user._id },
        {
          refreshToken: refresh_token,
        }
      );
      return res.json({
        success: true,
        access_token,
        refresh_token,
        result: user,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = loginController;
