const Joi = require("joi");
const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const { createMessages, sendMessages } = require("../services/notification");

const notificationController = {
  async saveExpoToken(req, res, next) {
    //logic
    //validation
    const { _id } = req.user;
    const registerSchema = Joi.object({
      notificationToken: Joi.string().required(),
    });
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      // const notificationToken = await User.findOne({
      //   notificationToken: req.body.notificationToken,
      // });
      // if (notificationToken) {
      //   return next(
      //     CustomErrorHandler.alreadyExist("The Token Already Exists")
      //   );
      // }
      const setNotification = await User.findByIdAndUpdate(_id, {
        notificationToken: req.body.notificationToken,
      });
      return res.json({
        success: true,
        setNotification,
      });
    } catch (error) {
      return next(error);
    }
  },
  async sendPostNotifications(req, res, next) {
    const { _id } = req.user;
    const sendPostNotificationsSchema = Joi.object({
      // toMessage: Joi.string().required(),
      userMessage: Joi.string().required(),
      // notiTokens: Joi.string().required(),
    });
    const { error } = sendPostNotificationsSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { userMessage } = req.body;

    try {
      // const push_tokens = await User.find({
      //   notificationToken: {
      //     $in: notiTokens.split(","),
      //   },
      // }).select(
      //   "-password -updatedAt -__v -email -active -role -userDetails -createdAt -updatedAt -avatar -_id"
      // );
      // let body = toMessage;
      // let messages = createMessages(
      //   body,
      //   {
      //     body,
      //   },
      //   push_tokens
      // );
      // let tickets = await sendMessages(messages);
      // console.log(tickets);
      const { notificationToken } = await User.findById(_id);
      console.log(notificationToken);
      if (!notificationToken) {
        return next(CustomErrorHandler.serverError);
      }
      const userNoti = await sendMessages(
        createMessages(userMessage, { userMessage }, [notificationToken])
      );

      res.json({
        success: true,
        userNoti,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = notificationController;
