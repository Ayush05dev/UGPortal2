const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student.js");
const Subject = require("../models/Subject.js");
const Attendance = require("../models/Attendance.js");
exports.registerStudent = async (req, res) => {
  try {
    const { rollNumber, name, email, password, branch, section } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }],
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const newStudent = new Student({
      rollNumber,
      name,
      email,
      password,
      branch,
      section,
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isPasswordCorrect = await student.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.userId).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.userId;

    // Fetch student details
    const student = await Student.findById(studentId).populate("subjects");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch attendance records for each subject
    const attendanceData = await Promise.all(
      student.subjects.map(async (subject) => {
        const totalClasses = await Attendance.countDocuments({
          subject: subject._id,
          section: student.section,
        });

        const attendedClasses = await Attendance.countDocuments({
          student: studentId,
          subject: subject._id,
          section: student.section,
          status: "Present",
        });

        return {
          subjectName: subject.name,
          subjectCode: subject.code,
          totalClasses,
          attendedClasses,
          attendancePercentage:
            totalClasses > 0
              ? Math.round((attendedClasses / totalClasses) * 100)
              : 0,
        };
      })
    );

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance data" });
  }
};

exports.addSubjectToStudent = async (req, res) => {
  try {
    const { rollNumber, subjectIds } = req.body;

    // Find the student by rollNumber
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure only the `subjects` field is updated, not `attendance`
    student.subjects = [...new Set([...student.subjects, ...subjectIds])];

    // Save the updated student document
    await student.save();

    // Add the student to each subject's students array
    await Subject.updateMany(
      { _id: { $in: subjectIds } },
      { $push: { students: student._id } }
    );

    res.status(200).json({
      message: "Subjects added to student successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
// studentController.js

// studentController.js

exports.getAvailableSubjects = async (req, res) => {
  try {
    const studentId = req.userId;

    // Get student details with populated subjects
    const student = await Student.findById(studentId)
      .populate("subjects")
      .select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get currently enrolled subject IDs
    const enrolledSubjectIds = student.subjects.map((sub) => sub._id);

    // Find all subjects for student's branch that they haven't enrolled in
    const availableSubjects = await Subject.find({
      branch: student.branch,
      _id: { $nin: enrolledSubjectIds },
    }).select("name code branch");

    res.status(200).json({
      currentSubjects: student.subjects,
      availableSubjects: availableSubjects,
    });
  } catch (error) {
    console.error("Error fetching available subjects:", error);
    res.status(500).json({
      message: "Failed to fetch available subjects",
      error: error.message,
    });
  }
};

exports.enrollInSubjects = async (req, res) => {
  try {
    const studentId = req.userId;
    const { subjectIds } = req.body;

    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid subject IDs" });
    }

    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Verify subjects exist and match student's branch
    const subjects = await Subject.find({
      _id: { $in: subjectIds },
      branch: student.branch,
    });

    if (subjects.length !== subjectIds.length) {
      return res.status(400).json({
        message: "Some subjects are invalid or not available for your branch",
      });
    }

    // Add subjects to student's enrolled subjects
    student.subjects = [...new Set([...student.subjects, ...subjectIds])];
    await student.save();

    // Add student to each subject's students array
    await Promise.all(
      subjects.map((subject) => {
        subject.students.push(studentId);
        return subject.save();
      })
    );

    res.status(200).json({
      message: "Successfully enrolled in subjects",
      enrolledSubjects: subjects,
    });
  } catch (error) {
    console.error("Error enrolling in subjects:", error);
    res.status(500).json({
      message: "Failed to enroll in subjects",
      error: error.message,
    });
  }
};
