const Joi = require("joi");
const Complaint = require("../models/complaints");

const complaintsController = {
	async getComplaints(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await Complaint.aggregate([
					{
						$match: {
							"complaints.assignTo": _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.assignTo": _id,
							"complaints.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.complaints);
					});
				}
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.assignTo": { $ne: _id },
							"complaints.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await Complaint.aggregate([
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.nearestPoliceStationAddress": req.station,
							"complaints.status": { $ne: "Solved" },
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.complaints);
					});
				}
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.nearestPoliceStationAddress": req.station,
							"complaints.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.status": { $ne: "Solved" },
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			}
			if (!myComplaints) {
				return res.json({
					success: true,
					myComplaints: [],
				});
			}
			return res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async ComplaintsHistory(req, res, next) {
		const { _id, role } = req.user;
		const myComplaints = [];
		try {
			if (role === 5000) {
				const assignedComplaints = await Complaint.aggregate([
					{
						$match: {
							"complaints.assignTo": _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.assignTo": _id,
							"complaints.status": "Solved",
						},
					},
				]);
				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.complaints);
					});
				}
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.assignTo": { $ne: _id },
							"complaints.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			} else if (role === 4000) {
				const assignedComplaints = await Complaint.aggregate([
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.nearestPoliceStationAddress": req.station,
							"complaints.status": "Solved",
						},
					},
				]);

				if (assignedComplaints.length > 0) {
					assignedComplaints.forEach((complaint) => {
						myComplaints.push(complaint.complaints);
					});
				}
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.nearestPoliceStationAddress": { $ne: req.station },
							"complaints.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			} else if (role === 3000) {
				const personalComplaint = await Complaint.aggregate([
					{
						$match: {
							userId: _id,
						},
					},
					{ $unwind: "$complaints" },
					{
						$match: {
							"complaints.status": "Solved",
						},
					},
				]);
				if (personalComplaint.length > 0) {
					personalComplaint.forEach((element) => {
						myComplaints.push(element.complaints);
					});
				}
			}
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async postComplaints(req, res, next) {
		const Data = JSON.parse(req.body.data);
		const { _id, role } = req.user;
		const complaintSchema = Joi.object({
			complaintAgainstName: Joi.string().max(3).max(250).required(),
			complaintAgainst: Joi.string().max(3).max(250).required(),
			reason: Joi.string().min(3).required(),
			locationName: Joi.string().required(),
			locationAddress: Joi.string().required(),
			currentSituation: Joi.string().required(),
			nearestPoliceStation: Joi.string().required(),
			nearestPoliceStationAddress: Joi.string().required(),
		});
		const { error } = complaintSchema.validate(Data);
		if (error) {
			return next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await Complaint.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new Complaint({
					userId: _id,
					complaints: { ...Data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await Complaint.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							complaints: { ...Data, images: req.urls },
						},
					}
				);
			}
		} catch (err) {
			return next(err);
		}
		var io = req.app.get("socketio");
		io.emit("statusUpdated", { success: true });
		return res.json({
			success: true,
			addComplaint,
		});
	},
};

module.exports = complaintsController;
