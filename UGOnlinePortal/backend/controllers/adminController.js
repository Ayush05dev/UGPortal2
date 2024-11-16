const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');
const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find().select('-password');
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};