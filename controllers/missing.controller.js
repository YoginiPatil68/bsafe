const Joi = require("joi");
const missingPerson = require("../models/missingPerson");

const missingController = {
	async missingPerson(req, res, next) {
		const { _id } = req.user;
		const data = JSON.parse(req.body.data);
		const missingPersonSchema = Joi.object({
			incidenceDesc: Joi.string().required(),
			dateFrom: Joi.string().required(),
			dateTo: Joi.string().required(),
			name: Joi.string().required(),
			fatherName: Joi.string().required(),
			height: Joi.string().required(),
			religion: Joi.string().required(),
			sex: Joi.string().required(),
			locName: Joi.string().required(),
			locAddress: Joi.string().required(),
			stationName: Joi.string().required(),
			stationAddress: Joi.string().required(),
			age: Joi.string().required(),
		});
		const { error } = missingPersonSchema.validate(data);
		if (error) {
			next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await missingPerson.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new missingPerson({
					userId: _id,
					missingPerson: { ...data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await missingPerson.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							missingPerson: { ...data, images: req.urls },
						},
					}
				);
			}
		} catch (error) {
			console.log(error);
		}
		var io = req.app.get("socketio");
		io.emit("statusUpdated", { success: true });
		return res.json({
			success: true,
			addComplaint,
		});
	},
	async getmissingPerson(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await missingPerson.aggregate([
					{
						$match: {
							"missingPerson.assignTo": _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.assignTo": _id,
							"missingPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.missingPerson);
					});
				}
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.assignTo": { $ne: _id },
							"missingPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await missingPerson.aggregate([
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.stationAddress": req.station,
							"missingPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.missingPerson);
					});
				}
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.stationAddress": { $ne: req.station },
							"missingPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			}
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async missingPersonHistory(req, res, next) {
		const { _id, role } = req.user;
		let myComplaints;
		try {
			if (role === 5000) {
				const assignedComplaints = await missingPerson.aggregate([
					{
						$match: {
							"missingPerson.assignTo": _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.assignTo": _id,
							"missingPerson.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.missingPerson);
					});
				}
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.assignTo": { $ne: _id },
							"missingPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await missingPerson.aggregate([
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.stationAddress": req.station,
							"missingPerson.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.missingPerson);
					});
				}
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.stationAddress": { $ne: req.station },
							"missingPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await missingPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$missingPerson" },
					{
						$match: {
							"missingPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.missingPerson);
					});
				}
			}
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
};

module.exports = missingController;
