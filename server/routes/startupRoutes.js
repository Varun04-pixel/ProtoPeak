import express from 'express';
import Startup from '../models/Startup.js';
import { requireAuth } from './authRoutes.js';

const router = express.Router();

// GET /api/startups — List all startups
router.get('/', async (_req, res) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    return res.status(200).json(startups);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch startups.',
      error: err.message,
    });
  }
});

// GET /api/startups/:id — Fetch single startup by ID
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found.' });
    }
    return res.status(200).json(startup);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid startup ID.',
      error: err.message,
    });
  }
});

// POST /api/startups — Only authenticated 'startup' accounts can launch a startup (1 per account)
router.post('/', requireAuth, async (req, res) => {
  try {
    const role = String(req.user?.role || 'startup').trim().toLowerCase();
    if (role === 'investor' || role === 'company') {
      return res.status(403).json({
        message: 'Investor and company accounts cannot launch a startup.',
      });
    }

    const existingOwned = await Startup.findOne({ createdBy: req.user._id });
    if (existingOwned) {
      return res.status(409).json({
        message: 'Each startup account can launch only one startup.',
      });
    }

    const {
      name,
      tagline,
      description,
      sector,
      stage,
      location,
      fundingNeed,
      members,
      verified,
    } = req.body;

    const resolvedName = (
      name ||
      req.user.startupName ||
      req.user.name ||
      ''
    ).trim();

    if (!resolvedName || !tagline?.trim() || !description?.trim() || !sector?.trim()) {
      return res.status(400).json({
        message: 'Startup name, tagline, description, and sector are required.',
      });
    }

    const normalizedMembers =
      Array.isArray(members) && members.length > 0
        ? members.map((m, idx) => ({
            user: m.user || req.user._id,
            name: (m.name || resolvedName).trim(),
            roleTitle: (m.roleTitle || 'Founder').trim(),
            isLead: idx === 0 ? true : Boolean(m.isLead),
          }))
        : [
            {
              user: req.user._id,
              name: resolvedName,
              roleTitle: 'Founder',
              isLead: true,
            },
          ];

    const created = await Startup.create({
      name: resolvedName,
      tagline: tagline.trim(),
      description: description.trim(),
      sector: sector.trim(),
      stage: (stage || 'Prototype').trim(),
      location: (location || req.user.institution || 'Bengaluru, India').trim(),
      fundingNeed: (fundingNeed || 'Bootstrapped').trim(),
      members: normalizedMembers,
      verified: Boolean(verified),
      createdBy: req.user._id,
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'A startup with this name already exists.',
      });
    }
    return res.status(400).json({
      message: 'Failed to launch startup.',
      error: err.message,
    });
  }
});

// DELETE /api/startups/:id — Allow owner startup account to remove its own startup
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found.' });
    }

    if (String(startup.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this startup.' });
    }

    await startup.deleteOne();
    return res.status(200).json({ message: 'Startup deleted.' });
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to delete startup.',
      error: err.message,
    });
  }
});

export default router;