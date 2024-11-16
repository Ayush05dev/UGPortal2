const express = require("express");
const {
  registerProfessor,
  loginProfessor,
  getProfessorProfile,
  updateProfessorProfile,
  uploadMarks,
  markAttendance,
  getDashboard,
  createSubject,
  getAttendance,
  getAllAttendance,
  modifyAttendance,
} = require("../controllers/professorController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const Student = require("../models/Student"); // Import the Student model

const router = express.Router();

router.post("/register", registerProfessor);
router.post("/login", loginProfessor);
router.get("/profile", authMiddleware, getProfessorProfile);
router.put("/profile", authMiddleware, updateProfessorProfile);
router.post("/upload-marks", authMiddleware, uploadMarks);
// Attendance route (Protected)
router.post("/mark-attendance", authMiddleware, markAttendance);
// Assuming you have a function to fetch subjects from the database
router.get("/dashboard", authMiddleware, getDashboard);

router.post("/create-subject", authMiddleware, createSubject);

// Get attendance for all students
router.get("/attendance", authMiddleware, getAttendance);

router.put("/modify-attendance", authMiddleware, modifyAttendance);
router.get("/all-attendance", authMiddleware, getAllAttendance);

module.exports = router;
