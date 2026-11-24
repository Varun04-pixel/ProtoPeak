import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    startupName: {
      type: String,
      required: [true, 'Startup name is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['startup', 'investor', 'company', 'student'],
      default: 'startup',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);