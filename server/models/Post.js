import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: [true, 'Comment author is required'],
      trim: true,
    },
    authorRole: {
      type: String,
      default: 'Builder',
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      default: null,
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    teamLogo: {
      type: String,
      default: '🚀',
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    authorRole: {
      type: String,
      default: 'Builder',
      trim: true,
    },
    tag: {
      type: String,
      enum: ['Milestone', 'Hiring', 'Prototype Update', 'Update'],
      default: 'Update',
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    commentsList: {
      type: [commentSchema],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);