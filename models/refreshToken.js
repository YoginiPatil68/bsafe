const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    userid: {
      type: String,
      // unique: true,
      required: true,
    },
    refreshToken: {
      type: String,
      // unique: true,
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "refreshTokens"
);
