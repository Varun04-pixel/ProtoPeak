import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    startupName: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      required: [
        function () {
          return this.role === 'startup';
        },
        'Startup name is required for startup accounts',
      ],
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
      required: [true, 'Institution or organization is required'],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: '',
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