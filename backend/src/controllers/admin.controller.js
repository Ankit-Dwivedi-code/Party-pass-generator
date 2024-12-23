import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { SignupCode } from "../models/invite.model.js";
import { v4 as uuidv4 } from 'uuid';

// Register Admin (Single Admin Only)
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  // Ensure no other admin exists
  await Admin.ensureSingleAdmin();

  // Create the admin
  const admin = new Admin({
    name,
    email,
    password,
  });

  await admin.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { id: admin._id }, "Admin registered successfully"));
});

// Admin Login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find admin by email
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save();

  // Set cookies for tokens
  const options = { httpOnly: true, secure: true };  // Adjust for your environment

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
});

// Change Admin Password
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  // Find the admin by the current user in req.admin (from middleware)
  const admin = req.admin;

  if (!(await admin.isPasswordCorrect(oldPassword))) {
    throw new ApiError(400, "Incorrect old password");
  }

  // Update the password
  admin.password = newPassword;
  await admin.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Generate Signup Code
// Generate Signup Code
export const generateSignupCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Student email is required to generate a signup code");
  }

  // Ensure only admins can generate codes
  if (req.admin.role !== "admin") {
    throw new ApiError(403, "Unauthorized to generate signup code");
  }

  // Check if a signup code already exists for this email and is not used
  const existingCode = await SignupCode.findOne({ email, used: false });
  if (existingCode) {
    throw new ApiError(400, "A valid signup code already exists for this email.");
  }

  const code = uuidv4(); // Generate a unique signup code

  // Save the new code in the database
  const newCode = new SignupCode({
    code,
    email,
    generatedBy: req.admin._id, // Admin generating the code
  });

  await newCode.save();

  return res.status(201).json(new ApiResponse(201, { code: newCode.code }, "Signup code generated successfully"));
});



//validate
// Validate Signup Code
export const validateSignupCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError(400, "Both email and code are required");
  }

  // Find the signup code by email and code
  const signupCode = await SignupCode.findOne({ email, code, used: false });
  if (!signupCode) {
    throw new ApiError(400, "Invalid or already used code");
  }

  return res.status(200).json(new ApiResponse(200, { valid: true }, "Signup code is valid"));
});


/// Mark Signup Code as Used
export const useSignupCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError(400, "Both email and code are required");
  }

  // Find the signup code by email and code
  const signupCode = await SignupCode.findOne({ email, code, used: false });
  if (!signupCode) {
    throw new ApiError(400, "Invalid or already used code");
  }

  // Mark the code as used
  signupCode.used = true;
  await signupCode.save();

  return res.status(200).json(new ApiResponse(200, {}, "Signup code marked as used successfully"));
});

// Admin Logout (Clear Tokens)
export const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "Logout successful"));
});

// Get Current Admin Details
export const getCurrentAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password -refreshToken");
  if (!admin) throw new ApiError(404, "Admin not found");

  return res.status(200).json(new ApiResponse(200, admin, "Admin details fetched"));
});
