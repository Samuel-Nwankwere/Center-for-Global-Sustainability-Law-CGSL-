import type { NavItem } from './types';

export const site = {
  name: 'Center for Global Sustainability Law',
  shortName: 'CGSL',
  tagline: 'Law at the Heart of Global Sustainability',
  description:
    'CGSL is a nonprofit initiative working at the intersection of law and sustainability. We advance legal research, policy development, and collaborative action to support a just, resilient, and sustainable global transition.',
  founded: '2025-06-02',
  email: 'info@cgsul.org',
  phone: '+1-646-883-6428',
  phoneHref: 'tel:+16468836428',
  location: 'New York, United States',
  // Only LinkedIn has a real profile URL on the current site; add others here
  // (e.g. x: 'https://x.com/<handle>') and they render automatically.
  social: {
    linkedin: 'https://www.linkedin.com/company/center-for-global-sustainability-law-cgsl-2025/',
  } as Partial<Record<'linkedin' | 'x' | 'instagram' | 'facebook', string>>,
} as const;

export const mainNav: NavItem[] = [
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'Overview', to: '/about', description: 'Who we are, our vision, mission and values' },
      { label: 'Our History', to: '/about/history', description: 'From Emergence to our Propulsive phase' },
      { label: 'Sustainability at CGSL', to: '/about/sustainability-at-cgsl', description: 'How we live our principles' },
      { label: 'Annual Reports', to: '/about/annual-reports', description: 'Our year in review' },
      { label: 'Financials', to: '/about/financials', description: 'Transparency and accountability' },
    ],
  },
  {
    label: 'What We Do',
    to: '/domains',
    children: [
      { label: 'Sustainability Domains', to: '/domains', description: '33 areas where law drives sustainability' },
      { label: 'Lex Commons', to: '/lex-commons', description: 'Our sustainability legal infrastructure' },
      { label: 'Programs & Initiatives', to: '/programs', description: 'Flagship research programmes' },
      { label: 'Advisory Services', to: '/advisory', description: 'Strategic legal guidance for organisations' },
      { label: 'Training', to: '/training', description: 'Capacity building for leaders and practitioners' },
    ],
  },
  {
    label: 'Publications',
    to: '/publications',
    children: [
      { label: 'LeGsus Digest', to: '/publications/digest', description: 'Long-form research articles' },
      { label: 'LeGsus Trove', to: '/publications/trove', description: 'Briefings on legal developments' },
      { label: 'LeGsus Review', to: '/publications/review', description: 'Legal frameworks by subject' },
      { label: 'Case Studies', to: '/publications/case-studies', description: 'Law applied in the real world' },
      { label: 'White Papers', to: '/publications/white-papers', description: 'Policy-oriented thought leadership' },
      { label: 'Proposals', to: '/publications/proposals', description: 'Informed proposals for legal reform' },
    ],
  },
  { label: 'People', to: '/people' },
  {
    label: 'Get Involved',
    to: '/get-involved/volunteer',
    children: [
      { label: 'Volunteer with Us', to: '/get-involved/volunteer', description: 'Lend your skills to the mission' },
      { label: 'Engagements & Collaborations', to: '/get-involved/partner', description: 'Partner with CGSL' },
      { label: 'Donate', to: '/donate', description: 'Support the legal foundation of sustainability' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Organisation',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our History', to: '/about/history' },
      { label: 'Our People', to: '/people' },
      { label: 'Annual Reports', to: '/about/annual-reports' },
      { label: 'Financials', to: '/about/financials' },
    ],
  },
  {
    title: 'Our Work',
    links: [
      { label: 'Sustainability Domains', to: '/domains' },
      { label: 'Lex Commons', to: '/lex-commons' },
      { label: 'Programs', to: '/programs' },
      { label: 'Advisory Services', to: '/advisory' },
      { label: 'Training', to: '/training' },
    ],
  },
  {
    title: 'Publications',
    links: [
      { label: 'LeGsus Digest', to: '/publications/digest' },
      { label: 'LeGsus Trove', to: '/publications/trove' },
      { label: 'LeGsus Review', to: '/publications/review' },
      { label: 'White Papers', to: '/publications/white-papers' },
      { label: 'Case Studies', to: '/publications/case-studies' },
    ],
  },
];
