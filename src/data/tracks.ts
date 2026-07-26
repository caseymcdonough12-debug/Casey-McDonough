import { LessonNode, TrackId, TrackMeta } from '../types';

export const TRACKS: Record<TrackId, TrackMeta> = {
  finance: {
    id: 'finance',
    name: 'Finance',
    tagline: 'Spreadsheets, statements, and markets',
    color: '#10B981',
    icon: '📊',
    live: true,
  },
  accounting: {
    id: 'accounting',
    name: 'Accounting',
    tagline: 'Debits, credits, and financial statements',
    color: '#0EA5A4',
    icon: '🧮',
    live: false,
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    tagline: 'Positioning, channels, and growth',
    color: '#F472B6',
    icon: '📣',
    live: false,
  },
  consulting: {
    id: 'consulting',
    name: 'Consulting',
    tagline: 'Frameworks and structured problem-solving',
    color: '#818CF8',
    icon: '🧩',
    live: false,
  },
  startups: {
    id: 'startups',
    name: 'Startups & Entrepreneurship',
    tagline: 'From idea to first customers',
    color: '#FB923C',
    icon: '🚀',
    live: false,
  },
  operations: {
    id: 'operations',
    name: 'Operations',
    tagline: 'Process, logistics, and efficiency',
    color: '#38BDF8',
    icon: '⚙️',
    live: false,
  },
};

export const TRACK_ORDER: TrackId[] = [
  'finance',
  'accounting',
  'marketing',
  'consulting',
  'startups',
  'operations',
];

export const LESSON_NODES: Record<TrackId, LessonNode[]> = {
  finance: [
    { id: 'finance-excel-basics', trackId: 'finance', title: 'Excel Basics', order: 1, live: true },
    { id: 'finance-professional-email', trackId: 'finance', title: 'Professional Email', order: 2, live: false },
    { id: 'finance-reading-a-pl', trackId: 'finance', title: 'Reading a P&L', order: 3, live: false },
    { id: 'finance-stock-market-101', trackId: 'finance', title: 'Stock Market 101', order: 4, live: false },
    { id: 'finance-job-market-map', trackId: 'finance', title: 'Job Market Map', order: 5, live: false },
  ],
  accounting: [
    { id: 'accounting-node-1', trackId: 'accounting', title: 'Coming soon', order: 1, live: false },
  ],
  marketing: [
    { id: 'marketing-node-1', trackId: 'marketing', title: 'Coming soon', order: 1, live: false },
  ],
  consulting: [
    { id: 'consulting-node-1', trackId: 'consulting', title: 'Coming soon', order: 1, live: false },
  ],
  startups: [
    { id: 'startups-node-1', trackId: 'startups', title: 'Coming soon', order: 1, live: false },
  ],
  operations: [
    { id: 'operations-node-1', trackId: 'operations', title: 'Coming soon', order: 1, live: false },
  ],
};
