import express from 'express';
import Post from '../models/Post.js';
import { requireAuth } from './authRoutes.js';

const router = express.Router();

function formatRoleLabel(role) {
  const clean = String(role || 'startup').trim().toLowerCase();
  if (clean === 'investor') return 'Investor';
  if (clean === 'company') return 'Company';
  return 'Startup';
}

// GET /api/posts — Fetch all feed posts newest first
router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch posts.',
      error: err.message,
    });
  }
});

// POST /api/posts — Only authenticated 'startup' accounts can publish feed posts
router.post('/', requireAuth, async (req, res) => {
  try {
    const role = String(req.user?.role || 'startup').trim().toLowerCase();
    if (role === 'investor' || role === 'company') {
      return res.status(403).json({
        message:
          'Investor and company accounts can like and comment on posts, but cannot create feed posts.',
      });
    }

    const { startup, teamLogo, tag, content, verified } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: 'Post content is required.',
      });
    }

    const startupName = (
      req.user.startupName ||
      req.user.name ||
      'Startup'
    ).trim();

    const created = await Post.create({
      startup: startup || null,
      author: req.user._id,
      teamName: startupName,
      teamLogo: (teamLogo || '🚀').trim(),
      authorName: startupName,
      authorRole: 'Startup',
      tag: (tag || 'Milestone').trim(),
      content: content.trim(),
      likes: 0,
      comments: 0,
      commentsList: [],
      verified: Boolean(verified),
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to create post.',
      error: err.message,
    });
  }
});

// PATCH /api/posts/:id/like — Authenticated startup, investor, or company accounts can like/unlike
router.patch('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const liked = Boolean(req.body?.liked);
    post.likes = Math.max(0, (post.likes || 0) + (liked ? 1 : -1));
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to update like.',
      error: err.message,
    });
  }
});

// POST /api/posts/:id/comments — Authenticated startup, investor, or company accounts can comment
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const text = String(req.body?.text || '').trim();
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const role = String(req.user?.role || 'startup').trim().toLowerCase();
    const actorName = (
      role === 'startup'
        ? req.user.startupName || req.user.name
        : req.user.name || req.user.startupName
    )?.trim() || req.user.email;

    if (!Array.isArray(post.commentsList)) {
      post.commentsList = [];
    }

    post.commentsList.push({
      author: req.user._id,
      authorName: actorName,
      authorRole: formatRoleLabel(role),
      text,
      createdAt: new Date(),
    });

    post.comments = post.commentsList.length;
    await post.save();

    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to add comment.',
      error: err.message,
    });
  }
});

export default router;