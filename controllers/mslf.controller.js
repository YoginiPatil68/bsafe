const Joi = require("joi");
const mslf = require("../models/mslf");
const mslfController = {
	async mslf(req, res, next) {
		const { _id } = req.user;
		const data = JSON.parse(req.body.data);
		const mslfSchema = Joi.object({
			incidenceDesc: Joi.string().required(),
			dateFrom: Joi.string().required(),
			dateTo: Joi.string().required(),
			stationName: Joi.string().required(),
			stationAddress: Joi.string().required(),
			reportFor: Joi.string().required(),
			lostLocName: Joi.string().required(),
			lostLocAddress: Joi.string().required(),
			thingDesc: Joi.string().required(),
			thingName: Joi.string().required(),
		});
		const { error } = mslfSchema.validate(data);
		if (error) {
			next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await mslf.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new mslf({
					userId: _id,
					mslf: { ...data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await mslf.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							mslf: { ...data, images: req.urls },
						},
					}
				);
			}
			var io = req.app.get("socketio");
			io.emit("statusUpdated", { success: true });
			return res.json({
				success: true,
				addComplaint,
			});
		} catch (error) {
			console.log(error);
		}
	},
	async getmslf(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await mslf.aggregate([
					{
						$match: {
							"mslf.assignTo": _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.assignTo": _id,
							"mslf.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints?.forEach((complaint) => {
						myComplaints.push(complaint.mslf);
					});
				}
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.assignTo": { $ne: _id },
							"mslf.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await mslf.aggregate([
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.stationAddress": req.station,
							"mslf.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.mslf);
					});
				}
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.stationAddress": { $ne: req.station },
							"mslf.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			}
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async mslfHistory(req, res, next) {
		const { _id, role } = req.user;
		let myComplaints;
		try {
			if (role === 5000) {
				const assignedComplaints = await mslf.aggregate([
					{
						$match: {
							"mslf.assignTo": _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.assignTo": _id,
							"mslf.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints?.forEach((complaint) => {
						myComplaints.push(complaint.mslf);
					});
				}
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.stationAddress": { $ne: req.station },
							"mslf.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await mslf.aggregate([
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.stationAddress": req.station,
							"mslf.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.mslf);
					});
				}
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.stationAddress": { $ne: req.station },
							"mslf.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mslf" },
					{
						$match: {
							"mslf.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mslf);
					});
				}
			}
			res.json({ success: true });
		} catch (error) {
			return next(error);
		}
	},
};

module.exports = mslfController;
