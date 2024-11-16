// src/routes/studentRoutes.js
const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentAttendance,
  addSubjectToStudent,
  getAvailableSubjects,
  enrollInSubjects,
} = require("../controllers/studentController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getStudentProfile);
router.put("/profile", authMiddleware, updateStudentProfile);
router.get("/attendance", authMiddleware, getStudentAttendance);
router.post("/linksubject", authMiddleware, addSubjectToStudent);

router.get("/available-subjects", authMiddleware, getAvailableSubjects);
router.post("/enroll", authMiddleware, enrollInSubjects);

module.exports = router;
