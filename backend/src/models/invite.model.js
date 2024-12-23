import mongoose from 'mongoose';

const signupCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    email: { type: String, required: true },
    used: { type: Boolean, default: false },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

const SignupCode = mongoose.model('SignupCode', signupCodeSchema);

export { SignupCode };
