import { LessonNode, TrackId, TrackMeta } from '../types';
import { NODE_ID as ACCOUNTING_NODE_ID } from './accountingBasics';
import { NODE_ID as CONSULTING_NODE_ID } from './consultingBasics';
import { NODE_ID as MARKETING_NODE_ID } from './marketingBasics';
import { NODE_ID as OPERATIONS_NODE_ID } from './operationsBasics';
import { NODE_ID as STARTUPS_NODE_ID } from './startupsBasics';

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
    live: true,
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    tagline: 'Positioning, channels, and growth',
    color: '#F472B6',
    icon: '📣',
    live: true,
  },
  consulting: {
    id: 'consulting',
    name: 'Consulting',
    tagline: 'Frameworks and structured problem-solving',
    color: '#818CF8',
    icon: '🧩',
    live: true,
  },
  startups: {
    id: 'startups',
    name: 'Startups & Entrepreneurship',
    tagline: 'From idea to first customers',
    color: '#FB923C',
    icon: '🚀',
    live: true,
  },
  operations: {
    id: 'operations',
    name: 'Operations',
    tagline: 'Process, logistics, and efficiency',
    color: '#38BDF8',
    icon: '⚙️',
    live: true,
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
    { id: ACCOUNTING_NODE_ID, trackId: 'accounting', title: 'Debits & Credits Basics', order: 1, live: true },
    { id: 'accounting-node-2', trackId: 'accounting', title: 'Coming soon', order: 2, live: false },
  ],
  marketing: [
    { id: MARKETING_NODE_ID, trackId: 'marketing', title: 'Positioning & Channels', order: 1, live: true },
    { id: 'marketing-node-2', trackId: 'marketing', title: 'Coming soon', order: 2, live: false },
  ],
  consulting: [
    { id: CONSULTING_NODE_ID, trackId: 'consulting', title: 'Structured Problem-Solving', order: 1, live: true },
    { id: 'consulting-node-2', trackId: 'consulting', title: 'Coming soon', order: 2, live: false },
  ],
  startups: [
    { id: STARTUPS_NODE_ID, trackId: 'startups', title: 'Unit Economics', order: 1, live: true },
    { id: 'startups-node-2', trackId: 'startups', title: 'Coming soon', order: 2, live: false },
  ],
  operations: [
    { id: OPERATIONS_NODE_ID, trackId: 'operations', title: 'Process & Bottlenecks', order: 1, live: true },
    { id: 'operations-node-2', trackId: 'operations', title: 'Coming soon', order: 2, live: false },
  ],
};
