const Joi = require("joi");
const User = require("../models/user");
const Admin = require("../models/admin");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const { REFRESH_SECRET } = require("../config");
const RefreshToken = require("../models/refreshToken");

const registerController = {
  async register(req, res, next) {
    //logic
    //validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.ref("password"),
      role: Joi.number(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    //check if the user is already in the database
    try {
      const exits = await User.exists({
        email: req.body.email,
      });
      if (exits) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password, role } = req.body;
    if (![3000, 4000, 5000].includes(role)) {
      return next(
        CustomErrorHandler.wrongCredentials("Invalid Role was Found")
      );
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // prepare model
    let user;
    if (role === 3000) {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        active: true,
      });
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        active: false,
      });
    }
    const result = await user.save();
    let access_token;
    let refresh_token;
    try {
      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({
        userid: result._id,
        refreshToken: refresh_token,
      });
    } catch (err) {
      next(err);
    }
    res.json({
      success: true,
      access_token,
      refresh_token,
      result,
    });
  },
  async registerAdmin(req, res, next) {
    //logic
    //validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    //check if the user is already in the database
    try {
      const exits = await User.exists({
        email: req.body.email,
      });
      if (exits) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password } = req.body;
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // prepare model
    let user = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    const result = await user.save();
    let access_token;
    let refresh_token;
    try {
      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({
        userid: result._id,
        refreshToken: refresh_token,
      });
    } catch (err) {
      next(err);
    }
    res.json({
      success: true,
      access_token,
      refresh_token,
    });
  },
};

module.exports = registerController;
