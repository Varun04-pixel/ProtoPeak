export const INITIAL_STARTUPS = [
  {
    id: 1,
    name: 'QueryGuard',
    tagline: 'Automated vulnerability detection for enterprise web apps.',
    description:
      'QueryGuard uses real-time static code analysis and dynamic payload inspection to automatically detect SQL injection and database vulnerabilities during local CI/CD pipelines.',
    sector: 'Cybersecurity',
    stage: 'Prototype',
    location: 'Bengaluru, India',
    fundingNeed: '$10k - $25k',
    verified: true,
    members: [
      {
        userId: 'usr_101',
        name: 'Varun Shinde',
        roleTitle: 'Team Lead & Security',
        isLead: true,
      },
      {
        userId: 'usr_102',
        name: 'Syed Zaki',
        roleTitle: 'Full-Stack & APIs',
        isLead: false,
      },
      {
        userId: 'usr_103',
        name: 'Shrusti',
        roleTitle: 'Frontend & UX',
        isLead: false,
      },
      {
        userId: 'usr_104',
        name: 'Sadhana',
        roleTitle: 'Testing & Research',
        isLead: false,
      },
    ],
  },
  {
    id: 2,
    name: 'EcoTrace',
    tagline: 'IoT supply chain carbon tracking for manufacturing SME teams.',
    description:
      'Hardware sensors connected to microcontrollers that continuously record micro-emissions and aggregate telemetry data onto an accessible cloud dashboard.',
    sector: 'CleanTech',
    stage: 'Early Traction',
    location: 'Mumbai, India',
    fundingNeed: '$25k - $50k',
    verified: false,
    members: [
      {
        userId: 'usr_201',
        name: 'Aarav Kulkarni',
        roleTitle: 'Hardware & IoT Lead',
        isLead: true,
      },
      {
        userId: 'usr_202',
        name: 'Neha Deshmukh',
        roleTitle: 'Cloud & Analytics',
        isLead: false,
      },
      {
        userId: 'usr_203',
        name: 'Rohan Nair',
        roleTitle: 'Pilot Partnerships',
        isLead: false,
      },
    ],
  },
  {
    id: 3,
    name: 'MediPulse AI',
    tagline: 'AI-assisted preliminary diagnostic triage for rural clinics.',
    description:
      'Lightweight web tool allowing community healthcare workers to input symptoms and vital metrics to generate immediate referral guidance.',
    sector: 'HealthTech',
    stage: 'Idea',
    location: 'Hyderabad, India',
    fundingNeed: '< $10k',
    verified: true,
    members: [
      {
        userId: 'usr_301',
        name: 'Ananya Rao',
        roleTitle: 'ML & Product Lead',
        isLead: true,
      },
      {
        userId: 'usr_302',
        name: 'Karthik Reddy',
        roleTitle: 'Clinical Research',
        isLead: false,
      },
    ],
  },
];