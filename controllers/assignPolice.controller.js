const Joi = require("joi");
const Complaint = require("../models/complaints");
const missingPerson = require("../models/missingPerson");
const mslf = require("../models/mslf");
const unIdPerson = require("../models/unIdPerson");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const User = require("../models/user");
const { mobiApp } = require("./mobiapp.controller");

const AssignPoliceController = {
	async assignReportPolice(req, res, next) {
		const { role } = req.user;
		const assignSchema = Joi.object({
			assignName: Joi.string().required(),
			assignTo: Joi.string().required(),
			_id: Joi.string().required(),
		});
		const { error } = assignSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { assignName, _id, assignTo } = req.body;
		const assignedComplaints = await Complaint.find({
			"complaints._id": _id,
		});
		let myComplaints;
		try {
			if (
				!assignedComplaints[0].complaints?.some(
					(complaint) =>
						complaint._id.toString() === _id && complaint.assignTo === assignTo
				)
			) {
				if (role === 4000) {
					myComplaints = await Complaint.updateOne(
						{ "complaints._id": _id },
						{
							$set: {
								"complaints.$.assignTo": assignTo,
								"complaints.$.assignName": assignName,
							},
						}
					);
					const user = await User.findById(assignTo);
					if (!user) {
						return next(CustomErrorHandler.wrongCredentials("User Not Found"));
					}
					if (user.role === 5000) {
						let updateCaseCount;
						try {
							if (user?.userDetails?.caseCount) {
								updateCaseCount = await User.updateOne(
									{ _id: assignTo },
									{
										$set: {
											"userDetails.caseCount": user?.userDetails?.caseCount + 1,
										},
									}
								);
							} else {
								updateCaseCount = await User.findByIdAndUpdate(assignTo, {
									$set: {
										userDetails: { caseCount: 1 },
									},
								});
							}
						} catch (error) {
							next(error);
						}
					}
				}
			}
			var io = req.app.get("socketio");
			io.emit("statusUpdated", { success: true });
			return res.json(myComplaints);
		} catch (error) {
			next(error);
		}
	},
	async assignMissing(req, res, next) {
		const { role } = req.user;
		const assignSchema = Joi.object({
			assignName: Joi.string().required(),
			assignTo: Joi.string().required(),
			_id: Joi.string().required(),
		});
		const { error } = assignSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { assignName, _id, assignTo } = req.body;

		const assignedComplaints = await missingPerson.find({
			"missingPerson._id": _id,
		});

		let myComplaints;
		try {
			if (
				!assignedComplaints[0].missingPerson?.some(
					(complaint) =>
						complaint._id.toString() === _id && complaint.assignTo === assignTo
				)
			) {
				if (role === 4000) {
					myComplaints = await missingPerson.updateOne(
						{ "missingPerson._id": _id },
						{
							$set: {
								"missingPerson.$.assignTo": assignTo,
								"missingPerson.$.assignName": assignName,
							},
						}
					);
					const user = await User.findById(assignTo);
					if (!user) {
						return next(CustomErrorHandler.wrongCredentials("User Not Found"));
					}
					if (user.role === 5000) {
						let updateCaseCount;
						try {
							if (user?.userDetails?.caseCount) {
								updateCaseCount = await User.updateOne(
									{ _id: assignTo },
									{
										$set: {
											"userDetails.caseCount": user?.userDetails?.caseCount + 1,
										},
									}
								);
							} else {
								updateCaseCount = await User.findByIdAndUpdate(assignTo, {
									$set: {
										userDetails: { caseCount: 1 },
									},
								});
							}
						} catch (error) {
							next(error);
						}
					}
				}
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async assignMobiApp(req, res, next) {
		const { role } = req.user;
		const assignSchema = Joi.object({
			assignName: Joi.string().required(),
			assignTo: Joi.string().required(),
			_id: Joi.string().required(),
		});
		const { error } = assignSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { assignName, _id, assignTo } = req.body;

		const assignedComplaints = await mobiAppp.find({
			"missingPerson._id": _id,
		});

		let myComplaints;
		try {
			if (
				!assignedComplaints[0].mobiApp?.some(
					(complaint) =>
						complaint._id.toString() === _id && complaint.assignTo === assignTo
				)
			) {
				if (role === 4000) {
					myComplaints = await mobiApp.updateOne(
						{ "mobiApp._id": _id },
						{
							$set: {
								"mobiApp.$.assignTo": assignTo,
								"mobiApp.$.assignName": assignName,
							},
						}
					);
					const user = await User.findById(assignTo);
					if (!user) {
						return next(CustomErrorHandler.wrongCredentials("User Not Found"));
					}
					if (user.role === 5000) {
						let updateCaseCount;
						try {
							if (user?.userDetails?.caseCount) {
								updateCaseCount = await User.updateOne(
									{ _id: assignTo },
									{
										$set: {
											"userDetails.caseCount": user?.userDetails?.caseCount + 1,
										},
									}
								);
							} else {
								updateCaseCount = await User.findByIdAndUpdate(assignTo, {
									$set: {
										userDetails: { caseCount: 1 },
									},
								});
							}
						} catch (error) {
							next(error);
						}
					}
				}
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async assignMslf(req, res, next) {
		const { role } = req.user;
		const assignSchema = Joi.object({
			assignName: Joi.string().required(),
			assignTo: Joi.string().required(),
			_id: Joi.string().required(),
		});
		const { error } = assignSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { assignName, _id, assignTo } = req.body;

		const assignedComplaints = await mslf.find({
			"mslf._id": _id,
		});

		let myComplaints;
		try {
			if (
				!assignedComplaints[0].mslf?.some(
					(complaint) =>
						complaint._id.toString() === _id && complaint.assignTo === assignTo
				)
			) {
				if (role === 4000) {
					myComplaints = await mslf.updateOne(
						{ "mslf._id": _id },
						{
							$set: {
								"mslf.$.assignTo": assignTo,
								"mslf.$.assignName": assignName,
							},
						}
					);
					const user = await User.findById(assignTo);
					if (!user) {
						return next(CustomErrorHandler.wrongCredentials("User Not Found"));
					}
					if (user.role === 5000) {
						let updateCaseCount;
						try {
							if (user?.userDetails?.caseCount) {
								updateCaseCount = await User.updateOne(
									{ _id: assignTo },
									{
										$set: {
											"userDetails.caseCount": user?.userDetails?.caseCount + 1,
										},
									}
								);
							} else {
								updateCaseCount = await User.findByIdAndUpdate(assignTo, {
									$set: {
										userDetails: { caseCount: 1 },
									},
								});
							}
						} catch (error) {
							next(error);
						}
					}
				}
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async assignUnIdPerson(req, res, next) {
		const { role } = req.user;
		const assignSchema = Joi.object({
			assignName: Joi.string().required(),
			assignTo: Joi.string().required(),
			_id: Joi.string().required(),
		});
		const { error } = assignSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { assignName, _id, assignTo } = req.body;
		const assignedComplaints = await mslf.find({
			"mslf._id": _id,
		});
		let myComplaints;
		try {
			if (
				!assignedComplaints[0].mslf?.some(
					(complaint) =>
						complaint._id.toString() === _id && complaint.assignTo === assignTo
				)
			) {
				if (role === 4000) {
					myComplaints = await unIdPerson.updateOne(
						{ "unIdPerson._id": _id },
						{
							$set: {
								"unIdPerson.$.assignTo": assignTo,
								"unIdPerson.$.assignName": assignName,
							},
						}
					);
					const user = await User.findById(assignTo);
					if (!user) {
						return next(CustomErrorHandler.wrongCredentials("User Not Found"));
					}
					if (user.role === 5000) {
						let updateCaseCount;
						try {
							if (user?.userDetails?.caseCount) {
								updateCaseCount = await User.updateOne(
									{ _id: assignTo },
									{
										$set: {
											"userDetails.caseCount": user?.userDetails?.caseCount + 1,
										},
									}
								);
							} else {
								updateCaseCount = await User.findByIdAndUpdate(assignTo, {
									$set: {
										userDetails: { caseCount: 1 },
									},
								});
							}
						} catch (error) {
							next(error);
						}
					}
				}
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
};
module.exports = AssignPoliceController;
