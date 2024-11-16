const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Professor = require("../models/Professor.js");
const Mark = require("../models/Mark.js");
const Student = require("../models/Student.js");
const Subject = require("../models/Subject.js");
const Attendance = require("../models/Attendance.js");
const mongoose = require("mongoose");

const getTotalClasses = async (subject, section) => {
  return await Attendance.countDocuments({
    subject,
    section: section.toUpperCase(),
  });
};

const getStudentAttendance = async (studentId, subject, section) => {
  return await Attendance.countDocuments({
    student: studentId,
    subject,
    section: section.toUpperCase(),
    status: "Present",
  });
};
exports.registerProfessor = async (req, res) => {
  try {
    const { name, email, password, branches, sections } = req.body;

    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(400).json({ message: "Professor already exists" });
    }

    const newProfessor = new Professor({
      name,
      email,
      password,
      branches,
      sections,
    });

    await newProfessor.save();

    res.status(201).json({ message: "Professor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.loginProfessor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    const isPasswordCorrect = await professor.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: professor._id, role: "professor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getProfessorProfile = async (req, res) => {
  try {
    const professor = await Professor.findById(req.userId).select("-password");
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    res.status(200).json(professor);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateProfessorProfile = async (req, res) => {
  try {
    const { name, email, branches, sections } = req.body;

    const updatedProfessor = await Professor.findByIdAndUpdate(
      req.userId,
      { name, email, branches, sections },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedProfessor);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.uploadMarks = async (req, res) => {
  try {
    const { studentId, subjectId, marks, type } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newMark = new Mark({
      student: studentId,
      subject: subjectId,
      marks,
      type,
    });

    await newMark.save();

    res.status(201).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const professorId = req.userId;
    const professor = await Professor.findById(professorId).populate(
      "subjects"
    );

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    // Return professor data even if no subjects are assigned
    const subjects = professor.subjects || [];

    return res.status(200).json({
      professor: {
        name: professor.name,
        email: professor.email,
        branches: professor.branches,
        sections: professor.sections,
      },
      subjects,
      hasSubjects: subjects.length > 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch professor data",
      error: error.message,
    });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, branch } = req.body;
    const professorId = req.userId; // Assuming the professor's ID is in the JWT payload

    // Check if the professor exists
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    // Create a new subject and link it to the professor
    const newSubject = new Subject({
      name,
      code,
      branch,
      professor: professorId,
    });

    await newSubject.save();

    // Update the professor document to include this new subject in their subjects array
    professor.subjects.push(newSubject._id);
    await professor.save();

    res.status(201).json({
      message: "Subject created and assigned successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create and assign subject" });
  }
};
// In professorController.js
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, section, branch, attendanceData } = req.body;
    const professorId = req.userId;

    // Validate required fields
    if (!subjectId || !section || !branch || !attendanceData) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = attendanceData.map((student) => ({
      student: student.studentId,
      status: student.status,
      subject: subjectId,
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
      date: today,
    }));

    // Use bulkWrite for better performance
    await Attendance.bulkWrite(
      attendanceRecords.map((record) => ({
        updateOne: {
          filter: {
            student: record.student,
            subject: record.subject,
            section: record.section,
            date: record.date,
          },
          update: { $set: record },
          upsert: true, // Create if doesn't exist
        },
      }))
    );

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

// Update getAttendance to properly calculate attendance percentage
// exports.getAttendance = async (req, res) => {
//   try {
//     const { subject, section, branch } = req.query;

//     // ... existing validation code ...

//     const enrolledStudents = await Student.find({
//       section: section.toUpperCase(),
//       branch: branch.toUpperCase(),
//       subjects: { $in: [subject] },
//     }).select("_id name rollNumber");

//     if (!enrolledStudents.length) {
//       return res.status(404).json({
//         message: "No enrolled students found",
//       });
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendancePromises = enrolledStudents.map(async (student) => {
//       // Get total classes conducted
//       const totalClasses = await Attendance.distinct("date", {
//         subject,
//         section: section.toUpperCase(),
//         branch: branch.toUpperCase(),
//       }).count();

//       // Get classes attended by student
//       const attendedClasses = await Attendance.countDocuments({
//         student: student._id,
//         subject,
//         section: section.toUpperCase(),
//         branch: branch.toUpperCase(),
//         status: "Present",
//       });

//       // Get today's attendance
//       const todayAttendance = await Attendance.findOne({
//         student: student._id,
//         subject,
//         section: section.toUpperCase(),
//         branch: branch.toUpperCase(),
//         date: today,
//       });

//       return {
//         studentId: student._id,
//         name: student.name,
//         rollNumber: student.rollNumber,
//         classesAttended: attendedClasses,
//         totalClasses,
//         attendancePercentage:
//           totalClasses > 0
//             ? Math.round((attendedClasses / totalClasses) * 100)
//             : 0,
//         attendance: todayAttendance ? todayAttendance.status : "Absent",
//       };
//     });

//     const attendanceRecords = await Promise.all(attendancePromises);
//     res.status(200).json(attendanceRecords);
//   } catch (error) {
//     console.error("Error in getAttendance:", error);
//     res.status(500).json({
//       message: "Error fetching attendance data",
//     });
//   }
// };

exports.getAttendance = async (req, res) => {
  try {
    const { subject, section, branch } = req.query;

    // 1. Validate input parameters
    if (!subject || !section || !branch) {
      return res.status(400).json({
        message: "Subject, section and branch are required",
      });
    }

    // 2. First verify if the section exists and has enrolled students
    const sectionExists = await Student.exists({
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
    });

    if (!sectionExists) {
      return res.status(404).json({
        message: `No students found in section ${section} of ${branch} branch`,
      });
    }

    // 3. Get only students enrolled in this subject
    const enrolledStudents = await Student.find({
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
      subjects: { $in: [subject] }, // Use $in operator to check subject enrollment
    }).select("_id name rollNumber");

    if (!enrolledStudents.length) {
      return res.status(404).json({
        message:
          "No students enrolled in this subject for the selected section",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 4. Get attendance for enrolled students
    const attendancePromises = enrolledStudents.map(async (student) => {
      try {
        // Get total classes for this subject
        const totalClasses = await Attendance.countDocuments({
          subject,
          section: section.toUpperCase(),
          branch: branch.toUpperCase(),
        });

        // Get attended classes for this student
        const attendedClasses = await Attendance.countDocuments({
          student: student._id,
          subject,
          section: section.toUpperCase(),
          branch: branch.toUpperCase(),
          status: "Present",
        });

        // Get today's attendance status
        const todayAttendance = await Attendance.findOne({
          student: student._id,
          subject,
          section: section.toUpperCase(),
          branch: branch.toUpperCase(),
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        });

        return {
          studentId: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          attendance: todayAttendance ? todayAttendance.status : "Absent",
          classesAttended: attendedClasses,
          attendancePercentage:
            totalClasses > 0
              ? Math.round((attendedClasses / totalClasses) * 100)
              : 0,
        };
      } catch (error) {
        console.error(`Error processing student ${student._id}:`, error);
        return null;
      }
    });

    const attendanceRecords = (await Promise.all(attendancePromises)).filter(
      Boolean
    );

    if (!attendanceRecords.length) {
      return res.status(404).json({
        message: "No attendance records found",
      });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error in getAttendance:", error);
    res.status(500).json({
      message: "Error fetching attendance data",
      error: error.message,
    });
  }
};
exports.modifyAttendance = async (req, res) => {
  try {
    const { recordId, status } = req.body;

    // Validate required fields
    if (!recordId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find and update the attendance record
    const attendanceRecord = await Attendance.findById(recordId);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    attendanceRecord.status = status;
    await attendanceRecord.save();

    res.status(200).json({ message: "Attendance modified successfully" });
  } catch (error) {
    console.error("Error modifying attendance:", error);
    res
      .status(500)
      .json({ message: "Failed to modify attendance", error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { subject, section, branch } = req.query;

    // 1. Validate input parameters
    if (!subject || !section || !branch) {
      return res.status(400).json({
        message: "Subject, section and branch are required",
      });
    }

    // 2. First verify if the section exists and has enrolled students
    const sectionExists = await Student.exists({
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
    });

    if (!sectionExists) {
      return res.status(404).json({
        message: `No students found in section ${section} of ${branch} branch`,
      });
    }

    // 3. Get only students enrolled in this subject
    const enrolledStudents = await Student.find({
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
      subjects: { $in: [subject] },
    }).select("_id name rollNumber");

    if (!enrolledStudents.length) {
      return res.status(404).json({
        message:
          "No students enrolled in this subject for the selected section",
      });
    }

    // 4. Get attendance records for enrolled students
    const attendanceRecords = await Attendance.find({
      subject,
      section: section.toUpperCase(),
      branch: branch.toUpperCase(),
      student: { $in: enrolledStudents.map((s) => s._id) },
    }).populate("student", "name rollNumber");

    if (!attendanceRecords.length) {
      return res.status(404).json({
        message: "No attendance records found for enrolled students",
      });
    }

    res.status(200).json(
      attendanceRecords.map((record) => ({
        _id: record._id,
        rollNumber: record.student.rollNumber,
        name: record.student.name,
        date: record.date,
        status: record.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({
      message: "Failed to fetch attendance records",
      error: error.message,
    });
  }
};
