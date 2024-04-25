const User = require("../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const { cloudinary } = require("../services/imageUpload");
const userDetailController = {
  async citizenDetails(req, res, next) {
    const { _id, role } = req.user;
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30),
      adhaarCard: Joi.string().pattern(
        new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$")
      ),
      panCard: Joi.string().pattern(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")),
      dob: Joi.date(),
      address: Joi.string().min(3).max(300),
      occupation: Joi.string().min(3).max(30),
    });
    const { error } = registerSchema.validate(req.body);
    const { name, ...details } = req.body;
    //
    if (error) {
      return next(error);
    }
    const updateDetails = await User.findByIdAndUpdate(_id, {
      name: name,
      userDetails: details,
    });
    return res.json(req.body);
  },
  async policeDetails(req, res, next) {
    const { _id, role } = req.user;
    if (role !== 3000) {
      const policeInfoSchema = Joi.object({
        adhaarCard: Joi.string()
          .pattern(new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"))
          .required(),
        panCard: Joi.string()
          .pattern(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}"))
          .required(),
        policeID: Joi.string().min(3).max(30).required(),
        postingArea: Joi.string().required(),
        policePost: Joi.string().min(3).max(30).required(),
        city: Joi.string().required(),
        dob: Joi.string().required(),
        address: Joi.string().min(3).max(500).required(),
        postingAreaAddress: Joi.string().min(10).max(500).required(),
        verificationPaper: Joi.string().required(),
      });
      const { error } = policeInfoSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      //
      const updateDetails = await User.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            userDetails: req.body,
          },
        }
      );

      return res.json({
        success: true,
        updateDetails,
      });
    }
  },
  async uploadProfile(req, res, next) {
    const { _id, role } = req.user;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${_id}_profile`,
        width: 500,
        height: 500,
        crop: "fill",
        folder: `profile/${_id}`,
      });
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { avatar: result.url },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Your profile has updated!",
        url: result.url,
      });
    } catch (error) {
      next(CustomErrorHandler.serverError());
    }
  },
};

module.exports = userDetailController;
