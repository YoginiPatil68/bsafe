const Joi = require("joi");
const mobiapp = require("../models/mobiapp");
const mslf = require("../models/mslf");
const mobiAppController = {
	async mobiApp(req, res, next) {
		const { _id } = req.user;
		const data = JSON.parse(req.body.data);
		const mslfSchema = Joi.object({
			incidenceDesc: Joi.string().required(),
			locationName: Joi.string().required(),
			locationAddress: Joi.string().required(),
			nearestPoliceStation: Joi.string().required(),
			nearestPoliceStationAddress: Joi.string().required(),
		});
		const { error } = mslfSchema.validate(data);
		if (error) {
			next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await mobiapp.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new mslf({
					userId: _id,
					mobi: { ...data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await mobiapp.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							mobi: { ...data, images: req.urls },
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
	async getMobiApp(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await mobi.aggregate([
					{
						$match: {
							"mobi.assignTo": _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.assignTo": _id,
							"mobi.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints?.forEach((complaint) => {
						myComplaints.push(complaint.mobi);
					});
				}
				const personalComplaint = await mobi.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.assignTo": { $ne: _id },
							"mobi.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await mslf.aggregate([
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.stationAddress": req.station,
							"mobi.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.mobi);
					});
				}
				const personalComplaint = await mslf.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.stationAddress": { $ne: req.station },
							"mobi.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await mobi.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			}
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async mobiAppHistory(req, res, next) {
		const { _id, role } = req.user;
		let myComplaints;
		try {
			if (role === 5000) {
				const assignedComplaints = await mobi.aggregate([
					{
						$match: {
							"mobi.assignTo": _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.assignTo": _id,
							"mobi.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints?.forEach((complaint) => {
						myComplaints.push(complaint.mobi);
					});
				}
				const personalComplaint = await mobi.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.stationAddress": { $ne: req.station },
							"mobi.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await mobi.aggregate([
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.stationAddress": req.station,
							"mobi.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.mobi);
					});
				}
				const personalComplaint = await mobi.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.stationAddress": { $ne: req.station },
							"mobi.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await mobi.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$mobi" },
					{
						$match: {
							"mobi.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.mobi);
					});
				}
			}
			res.json({ success: true });
		} catch (error) {
			return next(error);
		}
	},
};

module.exports = mobiAppController;
