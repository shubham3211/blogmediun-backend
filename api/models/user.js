var mongoose = require("mongoose");
const { dbConn } = require("../../utils/dbConnections");
const { passwordCompare } = require("../services/passwordComp");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    valid: {
      type: Boolean,
      default: true
    },
    lastname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

passwordCompare(userSchema);

module.exports = dbConn.model("User", userSchema);
