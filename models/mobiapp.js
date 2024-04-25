const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mobiAppSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	mobi: [
		{
			type: new Schema(
				{
					incidenceDesc: { type: String, required: true },
					locationName: { type: String, required: true },
					locationAddress: { type: String, required: true },
					nearestPoliceStation: { type: String, required: true },
					nearestPoliceStationAddress: { type: String, required: true },
					status: {
						type: String,
						default: "In Queue",
					},
					images: [
						{
							type: String,
						},
					],
					assignTo: {
						type: String,
					},
					assignName: {
						type: String,
					},
				},
				{ timestamps: true }
			),
			required: true,
			unique: true,
		},
	],
});

module.exports = mongoose.model("mobiApp", mobiAppSchema, "mobiApp");
