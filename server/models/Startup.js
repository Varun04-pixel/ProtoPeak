import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    roleTitle: {
      type: String,
      required: [true, 'Member role title is required'],
      trim: true,
    },
    isLead: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const startupSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      unique: true,
      sparse: true, // allows seeded startups with null createdBy while enforcing 1 per user
    },
    name: {
      type: String,
      required: [true, 'Startup name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      enum: ['Cybersecurity', 'CleanTech', 'HealthTech', 'EdTech', 'FinTech'],
      default: 'Cybersecurity',
    },
    stage: {
      type: String,
      enum: ['Idea', 'Prototype', 'Early Traction'],
      default: 'Prototype',
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
      trim: true,
    },
    fundingNeed: {
      type: String,
      default: '< $10k',
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    members: {
      type: [teamMemberSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'A startup must include at least one team member',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Startup', startupSchema);