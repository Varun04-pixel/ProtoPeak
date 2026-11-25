import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'protopeak_dev_secret_change_in_prod';
const ALLOWED_ROLES = new Set(['startup', 'investor', 'company']);

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeRole(role) {
  const clean = String(role || 'startup').trim().toLowerCase();
  return ALLOWED_ROLES.has(clean) ? clean : 'startup';
}

function serializeUser(user) {
  const role = normalizeRole(user.role);
  const cleanName = (user.startupName || user.name || '').trim();
  return {
    id: user._id,
    name: cleanName,
    startupName: role === 'startup' ? cleanName : (user.startupName || '').trim(),
    email: user.email,
    institution: user.institution || user.organization || '',
    organization: user.organization || user.institution || '',
    role,
  };
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Account not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// POST /api/auth/register — Register a Startup (org), Investor (individual), or Company (org)
router.post('/register', async (req, res) => {
  try {
    const {
      startupName,
      name,
      email,
      password,
      institution,
      organization,
      role,
    } = req.body;

    const resolvedRole = normalizeRole(role);
    const displayName = (startupName || name || '').trim();
    const orgOrInstitution = (institution || organization || '').trim();

    if (!displayName || !email || !password || !orgOrInstitution) {
      return res.status(400).json({
        message:
          resolvedRole === 'startup'
            ? 'Startup name, email, password, and institution are required.'
            : 'Name, email, password, and organization/institution are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    if (resolvedRole === 'startup') {
      const existingStartup = await User.findOne({
        role: 'startup',
        startupName: new RegExp(`^${escapeRegex(displayName)}$`, 'i'),
      });
      if (existingStartup) {
        return res.status(409).json({
          message: `"${displayName}" is already registered. Each startup name must be unique.`,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: displayName,
      startupName: resolvedRole === 'startup' ? displayName : undefined,
      email: normalizedEmail,
      password: hashedPassword,
      institution: orgOrInstitution,
      organization: orgOrInstitution,
      role: resolvedRole,
    });

    const serialized = serializeUser(user);

    const token = jwt.sign(
      {
        id: user._id,
        role: serialized.role,
        startupName: serialized.startupName,
        name: serialized.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: serialized,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email or startup name already exists.',
      });
    }
    return res.status(400).json({
      message: 'Registration failed.',
      error: err.message,
    });
  }
});

// POST /api/auth/login — Authenticate existing startup, investor, or company account
router.post('/login', async (req, res) => {
  try {
    const { startupName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: 'No account found with this email.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const enteredName = (startupName || '').trim().toLowerCase();
    const storedName = (user.startupName || user.name || '').trim().toLowerCase();
    if (enteredName && storedName && enteredName !== storedName) {
      return res.status(401).json({
        message: 'Account name does not match this user.',
      });
    }

    const serialized = serializeUser(user);

    const token = jwt.sign(
      {
        id: user._id,
        role: serialized.role,
        startupName: serialized.startupName,
        name: serialized.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: serialized,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Login failed.',
      error: err.message,
    });
  }
});

// GET /api/auth/me — Return current authenticated user profile
router.get('/me', requireAuth, async (req, res) => {
  return res.status(200).json({
    user: serializeUser(req.user),
  });
});

export default router;