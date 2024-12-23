import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateQRCode } from "../utils/generateQRCode.js";  // Utility to generate QR code
import { SignupCode } from "../models/invite.model.js";



// Register Student
export const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, session, rollNo, code, password } = req.body;

  if (!name || !email || !session || !rollNo || !code || !password) {
    throw new ApiError(400, "All fields (name, email, session, rollNo, code, and password) are required");
  }

  // Validate the signup code
  const signupCode = await SignupCode.findOne({ code, email, used: false });
  if (!signupCode) {
    throw new ApiError(400, "Invalid or already used signup code");
  }

  // Check if student already exists
  const studentExists = await Student.findOne({ email });
  if (studentExists) {
    throw new ApiError(400, "Student already registered");
  }

  // Create the student
  const student = new Student({
    name,
    email,
    session,
    rollNo,
    code,
    password,
  });

  // Save the student (password will be hashed automatically due to middleware)
  await student.save();

  // Mark the code as used
  signupCode.used = true;
  await signupCode.save();

  return res.status(201).json(new ApiResponse(201, { id: student._id }, "Student registered successfully"));
});

// Student Login (Email + Roll No)
export const loginStudent = asyncHandler(async (req, res) => {
  const { email, rollNo, password } = req.body;

  if (!email || !rollNo || !password) {
    throw new ApiError(400, "Email, roll number, and password are required");
  }

  // Find student by email and roll number
  const student = await Student.findOne({ email, rollNo });
  if (!student) {
    throw new ApiError(400, "Invalid email or roll number");
  }

  // Check if the entered password matches the stored password
  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }

  // Generate JWT Token
  const token = student.generateAccessToken();

  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Student logged in successfully",
    data: { token, _id: student._id }  // Ensure student._id is sent
  });
});

// Generate Party Pass for Student (Student-specific route)
export const generatePartyPass = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Check if student exists
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (student.isPassGenerated) {
    throw new ApiError(400, "Pass already generated for this student");
  }

  // Generate QR Code with student details
  const qrCodeData = {
    name: student.name,
    email: student.email,
    session: student.session,
    rollNo: student.rollNo,
  };

  // Generate QR Code with student details
  const qrCode = await generateQRCode(qrCodeData);  // Utility will generate QR code
  const qrCodeUrl = qrCode.base64;  // Ensure generateQRCode utility supports Base64  // Example URL or base64

  // Update the pass status
  student.isPassGenerated = true;
  await student.save();

  return res.status(200).json(new ApiResponse(200, { qrCode: qrCodeUrl }, "Pass generated successfully"));
});

// Get Student Details
export const getStudentDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Find student by ID
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(new ApiResponse(200, student, "Student details fetched successfully"));
});
