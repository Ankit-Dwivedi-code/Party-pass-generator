import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    session: {
      type: String,
      required: [true, 'Session is required'],
    },
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
    },
    code: {
      type: String,
      required: [true, 'Signup code is required'],
    },
    isPassGenerated: {
      type: Boolean,
      default: false, // Initially, the pass is not generated
    },
    pass: {
      type: String, // URL or path of the generated pass image
      default: '',
    },
    password: {  // Optionally, add a password field for student login
      type: String,
      required: [true, 'Password is required'],
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
studentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check if password is correct
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      session: this.session,
      rollNo: this.rollNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }  // Access token valid for 1 hour
  );
};

// Method to generate refresh token
studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',  // Refresh token valid for 7 days
  });
};

const Student = mongoose.model('Student', studentSchema);

export { Student };
