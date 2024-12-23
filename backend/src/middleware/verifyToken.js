import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access Denied. No Token Provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);  // Verifying the JWT
    req.student = decoded;  // Attach the decoded data to the request object (student)
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    throw new ApiError(401, 'Invalid Token');
  }
};
