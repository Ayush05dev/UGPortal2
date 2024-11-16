const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  }, // Add branch
  section: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
