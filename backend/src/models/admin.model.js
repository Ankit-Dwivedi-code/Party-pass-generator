import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin", // As only admin exists, we set default to admin
    },
    isActive: {
      type: Boolean,
      default: true, // Admin is active by default
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct
AdminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
AdminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

// Method to generate refresh token
AdminSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Static method to ensure there's only one admin
AdminSchema.statics.ensureSingleAdmin = async function () {
  const adminCount = await this.countDocuments();
  if (adminCount > 0) {
    throw new Error("An admin already exists");
  }
};

const Admin = mongoose.model("Admin", AdminSchema);

export { Admin };
