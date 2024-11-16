// src/routes/adminRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getAllStudents, getAllProfessors } = require('../controllers/adminController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/students', authMiddleware, adminMiddleware, getAllStudents);
router.get('/professors', authMiddleware, adminMiddleware, getAllProfessors);

module.exports = router;