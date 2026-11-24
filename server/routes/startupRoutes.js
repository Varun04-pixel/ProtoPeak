import express from 'express';
import Startup from '../models/Startup.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/startups — Fetch all startups (supports ?sector=&stage=&search=)
router.get('/', async (req, res) => {
  try {
    const { sector, stage, search } = req.query;
    const filter = {};

    if (sector && sector !== 'All') {
      filter.sector = sector;
    }
    if (stage && stage !== 'All') {
      filter.stage = stage;
    }
    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { name: regex },
        { tagline: regex },
        { description: regex },
        { location: regex },
        { 'members.name': regex },
      ];
    }

    const startups = await Startup.find(filter).sort({ createdAt: -1 });
    res.status(200).json(startups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch startups', error: err.message });
  }
});

// GET /api/startups/:id — Fetch a single startup profile
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(200).json(startup);
  } catch (err) {
    res.status(400).json({ message: 'Invalid startup ID', error: err.message });
  }
});

// POST /api/startups — Publish a single startup for the authenticated startup account
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const existingStartup = await Startup.findOne({ createdBy: userId });
    if (existingStartup) {
      return res.status(409).json({
        message: `This account has already published "${existingStartup.name}". Each startup account can publish only 1 startup.`,
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
    } = req.body;

    const finalName = (name && name.trim()) || (req.user.startupName && req.user.startupName.trim());

    if (!finalName || !tagline || !description) {
      return res.status(400).json({
        message: 'Startup name, tagline, and description are required.',
      });
    }

    const rawMembers = Array.isArray(members) && members.length > 0
      ? members
      : [{ name: finalName, roleTitle: 'Startup Lead', isLead: true }];

    const normalizedMembers = rawMembers
      .filter((m) => m && ((m.name && m.name.trim()) || finalName))
      .map((m, index) => ({
        user: index === 0 ? userId : m.user || null,
        name: (m.name && m.name.trim()) || finalName,
        roleTitle: (m.roleTitle && m.roleTitle.trim()) || (index === 0 ? 'Startup Lead' : 'Builder'),
        isLead: Boolean(m.isLead),
      }));

    if (normalizedMembers.length === 0) {
      return res.status(400).json({
        message: 'At least one team member is required.',
      });
    }

    if (!normalizedMembers.some((m) => m.isLead)) {
      normalizedMembers[0].isLead = true;
    }

    const startup = await Startup.create({
      createdBy: userId,
      name: finalName,
      tagline: tagline.trim(),
      description: description.trim(),
      sector: sector || 'Cybersecurity',
      stage: stage || 'Prototype',
      location:
        (location && location.trim()) ||
        (req.user.institution && req.user.institution.trim()) ||
        'Bengaluru, India',
      fundingNeed: (fundingNeed && fundingNeed.trim()) || '< $10k',
      members: normalizedMembers,
    });

    res.status(201).json(startup);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Each startup account can publish only 1 startup.',
      });
    }
    res.status(400).json({ message: 'Failed to create startup', error: err.message });
  }
});

export default router;