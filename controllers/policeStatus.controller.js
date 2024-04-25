const Joi = require("joi");
const User = require("../models/user");
// const CustomErrorHandler = require("../services/CustomErrorHandler");

const policeStatusController = {
	async updatePoliceStatus(req, res, next) {
		const isPolice = req.police;
		const { _id } = req.user;
		const refreshSchema = Joi.object({
			status: Joi.boolean().required(),
		});
		const { error } = refreshSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { status } = req.body;
		let workingHours;
		try {
			if (isPolice === true) {
				workingHours = await User.findByIdAndUpdate(_id, {
					status: status,
				});
				var io = req.app.get("socketio");
				return res.json({ success: true });
			}
		} catch (error) {
			next(error);
		}
	},
};
module.exports = policeStatusController;
