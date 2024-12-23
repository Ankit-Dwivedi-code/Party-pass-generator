import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  changePassword,
  generateSignupCode,
  validateSignupCode,
  useSignupCode,
  logoutAdmin,
  getCurrentAdmin,
} from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin Signup - Register an admin
router.post('/signup', registerAdmin);

// Admin Signin - Login an admin
router.post('/signin', loginAdmin);

// Change Admin Password - Update password
router.put('/password', verifyAdmin, changePassword);

// Generate Signup Code for a specific email
router.post('/code/generate', verifyAdmin, generateSignupCode);

// Validate Signup Code for a specific email
router.post('/code/validate', validateSignupCode);

// Mark Signup Code as Used
router.post('/code/use', useSignupCode);

// Admin Logout - Logout the current admin
router.post('/logout', verifyAdmin, logoutAdmin);

// Get Current Admin - Fetch the details of the currently logged-in admin
router.get('/me', verifyAdmin, getCurrentAdmin);

export default router;
