import express from 'express';
import Post from '../models/Post.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/posts — Fetch feed posts (supports ?tag=Milestone)
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = tag && tag !== 'All' ? { tag } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
});

// POST /api/posts — Create a new feed update
// POST /api/posts — Only the authenticated startup can publish under its own fixed startupName
router.post('/', requireAuth, async (req, res) => {
  try {
    const fixedStartupName = (req.user.startupName || '').trim();
    if (!fixedStartupName) {
      return res.status(403).json({
        message: 'Only startup accounts with a registered startup name can create posts.',
      });
    }

    const { tag, content, teamLogo } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required.' });
    }

    // Find the startup owned by this user (or matching their fixed startupName)
    const ownedStartup = await Startup.findOne({
      $or: [
        { createdBy: req.user._id },
        { name: new RegExp(`^${fixedStartupName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      ],
    });

    const post = await Post.create({
      startup: ownedStartup ? ownedStartup._id : null,
      teamName: fixedStartupName,
      teamLogo: (teamLogo && teamLogo.trim()) || '🚀',
      authorName: fixedStartupName,
      authorRole: 'Startup Account',
      tag: tag || 'Milestone',
      content: content.trim(),
      verified: Boolean(ownedStartup?.verified),
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create post', error: err.message });
  }
});

// POST /api/posts/:id/comments — Append a reply attributed to the logged-in startup account
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const replyAuthor =
      (req.user.startupName && req.user.startupName.trim()) ||
      (req.user.name && req.user.name.trim()) ||
      req.user.email;

    post.commentsList.push({
      authorName: replyAuthor,
      authorRole: 'Startup Account',
      text: text.trim(),
    });
    post.comments = post.commentsList.length;

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add comment', error: err.message });
  }
});

// PATCH /api/posts/:id/like — Increment or decrement likes
router.patch('/:id/like', requireAuth, async (req, res) => {
  try {
    const { liked } = req.body; // true to increment, false to decrement
    const delta = liked ? 1 : -1;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: delta } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes < 0) {
      post.likes = 0;
      await post.save();
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update like', error: err.message });
  }
});

export default router;