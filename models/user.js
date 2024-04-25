const { boolean } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
		},
		notificationToken: {
			type: String,
		},
		avatar: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			default: 2000,
		},
		status: {
			type: Boolean,
			default: false,
		},
		userDetails: {
			type: Object,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
