const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mslfSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  mslf: [
    {
      type: new Schema(
        {
          incidenceDesc: { type: String, required: true },
          dateFrom: {
            type: String,
            required: true,
          },
          dateTo: { type: String, required: true },
          reportFor: { type: String, required: true },
          lostLocName: { type: String, required: true },
          lostLocAddress: { type: String, required: true },
          thingDesc: { type: String, required: true },
          thingName: { type: String, required: true },
          stationName: { type: String, required: true },
          stationAddress: { type: String, required: true },
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

module.exports = mongoose.model("mslf", mslfSchema, "mslf");
