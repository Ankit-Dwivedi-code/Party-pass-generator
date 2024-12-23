import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/apiError.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(verifiedToken._id).select("-password -refreshToken");
    if (!admin) {
      throw new ApiError(401, "Invalid access token");
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized request");
  }
};


export const verifyStudent = async (req, _, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        throw new ApiError(401, 'Unauthorized request');
      }
  
      const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const student = await Student.findById(verifiedToken._id).select("-signupCode");
  
      if (!student) {
        throw new ApiError(401, 'Invalid access token');
      }
  
      req.student = student;
  
      next();
    } catch (error) {
      throw new ApiError(400, error?.message || 'Invalid access token');
    }
  };