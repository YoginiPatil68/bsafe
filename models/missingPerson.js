const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const missingPersonSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  missingPerson: [
    {
      type: new Schema(
        {
          incidenceDesc: { type: String, required: true },
          dateFrom: {
            type: String,
            required: true,
          },
          dateTo: { type: String, required: true },
          name: { type: String, required: true },
          fatherName: { type: String, required: true },
          height: { type: String, required: true },
          religion: { type: String, required: true },
          sex: { type: String, required: true },
          locName: { type: String, required: true },
          locAddress: { type: String, required: true },
          stationName: { type: String, required: true },
          stationAddress: { type: String, required: true },
          status: {
            type: String,
            default: "In Queue",
          },
          age: { type: String, required: true },
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

module.exports = mongoose.model(
  "MissingPerson",
  missingPersonSchema,
  "missingPerson"
);
