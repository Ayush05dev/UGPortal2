const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    default: "student",
    enum: ["student"],
  },
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],

  classesAttended: { type: Number, default: 0 },
  branch: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  cgpa: {
    type: Number,
    default: 0,
    min: [0, "CGPA cannot be negative"],
    max: [10, "CGPA cannot exceed 10"],
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

// Pre-save hook to hash password
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
