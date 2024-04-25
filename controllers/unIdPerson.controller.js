const Joi = require("joi");
const unIdPerson = require("../models/unIdPerson");

const unIdPersonController = {
	async unIdPerson(req, res, next) {
		const { _id } = req.user;
		const data = JSON.parse(req.body.data);
		const unIdPersonSchema = Joi.object({
			incidenceDesc: Joi.string().required(),
			dateFrom: Joi.string().required(),
			dateTo: Joi.string().required(),
			height: Joi.string().required(),
			sex: Joi.string().required(),
			locName: Joi.string().required(),
			locAddress: Joi.string().required(),
			stationName: Joi.string().required(),
			stationAddress: Joi.string().required(),
			upperDressColor: Joi.string().required(),
			lowerDressColor: Joi.string().required(),
			faceCutWithColor: Joi.string().required(),
			hairCutWithColor: Joi.string().required(),
			eyes: Joi.string().required(),
			reportFor: Joi.string().required(),
			expectedAge: Joi.string().required(),
		});
		const { error } = unIdPersonSchema.validate(data);
		if (error) {
			next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await unIdPerson.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new unIdPerson({
					userId: _id,
					unIdPerson: { ...data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await unIdPerson.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							unIdPerson: { ...data, images: req.urls },
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
	async getUnIdPerson(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await unIdPerson.aggregate([
					{
						$match: {
							"unIdPerson.assignTo": _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.assignTo": _id,
							"unIdPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.unIdPerson);
					});
				}
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.assignTo": { $ne: _id },
							"unIdPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await unIdPerson.aggregate([
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.stationAddress": req.station,
							"unIdPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.unIdPerson);
					});
				}
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.stationAddress": { $ne: req.station },
							"unIdPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			}

			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async UnIdPersonHistory(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await unIdPerson.aggregate([
					{
						$match: {
							"unIdPerson.assignTo": _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.assignTo": _id,
							"unIdPerson.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.unIdPerson);
					});
				}
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.assignTo": { $ne: _id },
							"unIdPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await unIdPerson.aggregate([
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.stationAddress": req.station,
							"unIdPerson.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.unIdPerson);
					});
				}
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.stationAddress": { $ne: req.station },
							"unIdPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await unIdPerson.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$unIdPerson" },
					{
						$match: {
							"unIdPerson.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.unIdPerson);
					});
				}
			}

			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
};

module.exports = unIdPersonController;
