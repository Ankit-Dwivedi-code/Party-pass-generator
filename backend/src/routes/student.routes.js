import express from 'express';
import { registerStudent, loginStudent, generatePartyPass, getStudentDetails } from '../controllers/student.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';  // To authenticate using JWT

const router = express.Router();

// Register a new student
router.post('/register', registerStudent);

// Login a student
router.post('/login', loginStudent);

// Generate party pass (protected route, requires token)
router.post('/party-pass/:studentId', verifyToken, generatePartyPass);

// Get student details (protected route, requires token)
router.get('/details/:studentId', verifyToken, getStudentDetails);

export default router;
