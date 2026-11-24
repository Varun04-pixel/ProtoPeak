import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'protopeak_dev_secret_key';
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/auth/me — Return the authenticated user's current profile including startupName
router.get('/me', requireAuth, async (req, res) => {
  const resolvedStartupName = (req.user.startupName || req.user.name || '').trim();
  res.status(200).json({
    user: {
      id: req.user._id,
      startupName: resolvedStartupName,
      email: req.user.email,
      institution: req.user.institution || req.user.organization || '',
      role: req.user.role,
    },
  });
});

// POST /api/auth/register — Register a new startup account with a unique startupName
router.post('/register', async (req, res) => {
  try {
    const { startupName, email, password, institution, role } = req.body;

    if (!startupName || !email || !password || !institution) {
      return res.status(400).json({
        message: 'Startup name, email, password, and institution are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanStartupName = startupName.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const cleanInstitution = institution.trim();

    // Reject duplicate email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    // Reject duplicate startupName (case-insensitive)
    const existingStartup = await User.findOne({
      startupName: new RegExp(`^${escapeRegex(cleanStartupName)}$`, 'i'),
    });
    if (existingStartup) {
      return res.status(409).json({
        message: `"${cleanStartupName}" is already registered. Each startup name must be unique.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      startupName: cleanStartupName,
      email: normalizedEmail,
      password: hashedPassword,
      institution: cleanInstitution,
      role: role || 'startup',
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, startupName: user.startupName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        startupName: user.startupName,
        email: user.email,
        institution: user.institution,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === 'startupName') {
        return res.status(409).json({
          message: 'This startup name is already taken. Please choose a unique startup name.',
        });
      }
      return res.status(409).json({
        message: 'An account with this email or startup name already exists.',
      });
    }
    res.status(400).json({ message: 'Registration failed.', error: err.message });
  }
});

// POST /api/auth/login — Strictly checks existing credentials (never creates or overwrites)
router.post('/login', async (req, res) => {
  try {
    const { startupName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Only reject if the user actually has a startupName stored and the entered one conflicts
    const enteredStartup = (startupName || '').trim().toLowerCase();
    const storedStartup = (user.startupName || '').trim().toLowerCase();
    if (enteredStartup && storedStartup && enteredStartup !== storedStartup) {
      return res.status(401).json({
        message: 'Startup name does not match this account.',
      });
    }

    const resolvedStartupName = (user.startupName || user.name || '').trim();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        startupName: resolvedStartupName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        startupName: resolvedStartupName,
        email: user.email,
        institution: user.institution || user.organization || '',
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

export default router;