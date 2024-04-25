const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  complaints: [
    {
      type: new Schema(
        {
          complaintAgainstName: {
            type: String,
            required: true,
          },
          complaintAgainst: {
            type: String,
            required: true,
          },
          reason: {
            type: String,
            required: true,
          },

          locationName: {
            type: String,
            required: true,
          },
          locationAddress: {
            type: String,
            required: true,
          },
          currentSituation: {
            type: String,
            required: true,
          },
          nearestPoliceStation: {
            type: String,
            required: true,
          },
          nearestPoliceStationAddress: {
            type: String,
            required: true,
          },
          images: [
            {
              type: String,
            },
          ],
          status: {
            type: String,
            default: "In Queue",
          },
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

module.exports = mongoose.model("Complaint", complaintSchema, "complaints");
// 1st:ourname
// 2nd:structurname
// 3rd:mongodatabasename
// name: {
//   type: String,
//   required: true,
// },
// Citizenid: {
//   from: "",
//   to: "",
//   type: String,
//   required: true,
//   unique: true,
// },
// location: {
//   type: String,
//   required: true,
// },
// reason: {
//   type: String,
//   required: true,
// },
// document: {
//   type: Number,
//   default: 2000,
// },
// type: {
//   type: Number,
//   default: 2000,
// },
// details: {
//   type: Number,
//   default: 2000,
// },
// location: {},
// policeId: {},
// },
