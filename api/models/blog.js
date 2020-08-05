var mongoose = require("mongoose");
const { dbConn } = require("../../utils/dbConnections");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  body: {
    type: String,
    required: true
  },
  tags: [{ type: String }],
  read: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  clap: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = dbConn.model("Blog", blogSchema);
