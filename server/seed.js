import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Startup from './models/Startup.js';
import Post from './models/Post.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/protopeak';

const SEED_STARTUPS = [
  {
    name: 'QueryGuard',
    tagline: 'Automated static & runtime SQL injection defense for student & SMB web apps',
    description:
      'QueryGuard inspects incoming query patterns and source code ASTs to detect unparameterized SQL execution paths before deployment, offering drop-in middleware protection.',
    sector: 'Cybersecurity',
    stage: 'Prototype',
    location: 'Bengaluru, India',
    fundingNeed: '$10k - $25k',
    verified: true,
    members: [
      { name: 'Varun Shinde', roleTitle: 'Team Lead & Security', isLead: true },
      { name: 'Rohan Desai', roleTitle: 'Backend & AST Engine', isLead: false },
      { name: 'Sneha Patil', roleTitle: 'Frontend & Dashboard', isLead: false },
    ],
  },
  {
    name: 'EcoTrace',
    tagline: 'Low-cost IoT telemetry nodes for campus microgrid and water-leak monitoring',
    description:
      'Battery-backed ESP32 sensor nodes paired with an anomaly detection dashboard that flags abnormal water flow and energy spikes across hostels and labs in real time.',
    sector: 'CleanTech',
    stage: 'Early Traction',
    location: 'Bengaluru, India',
    fundingNeed: '$25k - $50k',
    verified: false,
    members: [
      { name: 'Aarav Kulkarni', roleTitle: 'Hardware & IoT Lead', isLead: true },
      { name: 'Meera Joshi', roleTitle: 'Cloud & Telemetry API', isLead: false },
    ],
  },
  {
    name: 'MediPulse AI',
    tagline: 'Offline-first symptom triage assistant for rural primary health centers',
    description:
      'Lightweight edge-quantized clinical intake assistant supporting Kannada and Hindi voice prompts to help community health workers prioritize high-risk referrals.',
    sector: 'HealthTech',
    stage: 'Prototype',
    location: 'Belagavi, India',
    fundingNeed: '$15k - $30k',
    verified: true,
    members: [
      { name: 'Ananya Rao', roleTitle: 'ML & Product Lead', isLead: true },
      { name: 'Karthik Hegde', roleTitle: 'Mobile & Offline Sync', isLead: false },
      { name: 'Divya Nair', roleTitle: 'Clinical Workflow Research', isLead: false },
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Startup.deleteMany({});
    await Post.deleteMany({});

    const createdStartups = await Startup.insertMany(SEED_STARTUPS);
    console.log(`Inserted ${createdStartups.length} startups`);

    const byName = Object.fromEntries(createdStartups.map((s) => [s.name, s]));

    const SEED_POSTS = [
      {
        startup: byName['QueryGuard']?._id || null,
        teamName: 'QueryGuard',
        teamLogo: '🛡️',
        authorName: 'Varun Shinde',
        authorRole: 'Team Lead & Security',
        tag: 'Milestone',
        content:
          'Completed our static analysis engine integration! QueryGuard now flags SQL injection vectors in under 120ms during automated local testing.',
        likes: 24,
        comments: 5,
        verified: true,
      },
      {
        startup: byName['EcoTrace']?._id || null,
        teamName: 'EcoTrace',
        teamLogo: '🌱',
        authorName: 'Aarav Kulkarni',
        authorRole: 'Hardware & IoT Lead',
        tag: 'Hiring',
        content:
          'Looking for a teammate experienced with MQTT brokers and time-series dashboards to help scale our campus sensor fleet.',
        likes: 18,
        comments: 8,
        verified: false,
      },
      {
        startup: byName['MediPulse AI']?._id || null,
        teamName: 'MediPulse AI',
        teamLogo: '🩺',
        authorName: 'Ananya Rao',
        authorRole: 'ML & Product Lead',
        tag: 'Prototype Update',
        content:
          'Refined our offline bilingual intake flow for rural clinic workers. Check out our profile on Discover to see our current pilot goals.',
        likes: 42,
        comments: 12,
        verified: true,
      },
    ];

    const createdPosts = await Post.insertMany(SEED_POSTS);
    console.log(`Inserted ${createdPosts.length} posts`);

    await mongoose.disconnect();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();