const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const userController = {
	async me(req, res, next) {
		try {
			const user = await User.findOne({ _id: req.user._id }).select(
				"-password -updatedAt -__v"
			);
			if (!user) {
				return next(CustomErrorHandler.notFound());
			}
			res.json({ success: true, user: user });
		} catch (err) {
			return next(err);
		}
	},
	async allUsers(req, res, next) {
		try {
			const user = await User.find().select(
				"-password -updatedAt -__v -email -active -role -userDetails -createdAt -updatedAt"
			);
			if (!user) {
				return next(CustomErrorHandler.notFound());
			}
			res.json(user);
			console.log(user);
		} catch (err) {
			return next(err);
		}
	},
	async getAllPolice(req, res, next) {
		try {
			const user = await User.find({
				role: 5000,
				"userDetails:": { $exists: true, $ne: null },
			}).select("-password -updatedAt -__v -role -createdAt");
			if (!user) {
				return next(CustomErrorHandler.notFound());
			}
			res.json({ success: true, user });
		} catch (err) {
			return next(err);
		}
	},
	async getStationPolice(req, res, next) {
		try {
			// const user = await User.find({
			//   role: 5000,
			//   "userDetails.postingAreaAddress": req.station,
			// });
			const user = await User.find({
				$and: [
					{ active: true },
					{ status: true },
					{ role: 5000 },
					{
						"userDetails.postingAreaAddress": req.station,
					},
				],
			}).select("-password -updatedAt -__v -email -active -role -createdAt");
			if (!user) {
				return next(CustomErrorHandler.notFound());
			}
			res.json({ success: true, user });
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = userController;
