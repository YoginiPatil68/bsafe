const Joi = require("joi");
const Complaint = require("../models/complaints");
const missingPerson = require("../models/missingPerson");
const mslf = require("../models/mslf");
const unIdPerson = require("../models/unIdPerson");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const { mobiApp } = require("./mobiapp.controller");

const ComplaintStatusController = {
	async updateReportStatus(req, res, next) {
		const { role } = req.user;
		const { status, _id } = req.body;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await Complaint.updateOne(
					{ "complaints._id": _id },
					{
						$set: {
							"complaints.$.status": status,
						},
					}
				);
				console.log(myComplaints);
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async updateMobiAppStatus(req, res, next) {
		const { role } = req.user;
		const { status, _id } = req.body;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await mobiApp.updateOne(
					{ "mobiApp._id": _id },
					{
						$set: {
							"mobiApp.$.status": status,
						},
					}
				);
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async updateMissingStatus(req, res, next) {
		const { role } = req.user;
		const { status, _id } = req.body;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await missingPerson.updateOne(
					{ "missingPerson._id": _id },
					{
						$set: {
							"missingPerson.$.status": status,
						},
					}
				);
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async updateMslfStatus(req, res, next) {
		const { role } = req.user;
		const { status, _id } = req.body;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await mslf.updateOne(
					{ "mslf._id": _id },
					{
						$set: {
							"mslf.$.status": status,
						},
					}
				);
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
	async updateUnidPersonStatus(req, res, next) {
		const { role } = req.user;
		const { status, _id } = req.body;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await unIdPerson.updateOne(
					{ "unIdPerson._id": _id },
					{
						$set: {
							"unIdPerson.$.status": status,
						},
					}
				);
				var io = req.app.get("socketio");
				io.emit("statusUpdated", { success: true });
				return res.json(myComplaints);
			}
		} catch (error) {
			next(error);
		}
	},
};
module.exports = ComplaintStatusController;
