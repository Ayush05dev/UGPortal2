// src/models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("Subject", subjectSchema);
