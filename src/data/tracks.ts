import { LessonNode, TrackId, TrackMeta } from '../types';
import { NODE_ID as ACCOUNTING_NODE_ID } from './accountingCycle';
import { NODE_ID as CONSULTING_NODE_ID } from './consultingCaseBasics';
import { NODE_ID as ECONOMICS_NODE_ID } from './economicsPrinciples';
import { NODE_ID as FINANCE_NODE_ID } from './financeStatements';
import { NODE_ID as MARKETING_NODE_ID } from './marketingMetrics';
import { NODE_ID as OPERATIONS_NODE_ID } from './operationsProcessMapping';
import { NODE_ID as PERSONAL_FINANCE_NODE_ID } from './personalFinanceBudgeting';
import { NODE_ID as STARTUPS_NODE_ID } from './entrepreneurshipPitchDeck';

export const TRACKS: Record<TrackId, TrackMeta> = {
  finance: {
    id: 'finance',
    name: 'Finance',
    tagline: 'Statements, markets, and valuation',
    color: '#10B981',
    icon: '📊',
    live: true,
  },
  personalFinance: {
    id: 'personalFinance',
    name: 'Personal Finance',
    tagline: 'Budgeting, saving, and big life decisions',
    color: '#FBBF24',
    icon: '🐷',
    live: true,
  },
  economics: {
    id: 'economics',
    name: 'Economics',
    tagline: 'How markets, policy, and prices actually work',
    color: '#C084FC',
    icon: '🏛️',
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
  startups: {
    id: 'startups',
    name: 'Entrepreneurship',
    tagline: 'From pitch deck to first customers',
    color: '#FB923C',
    icon: '🚀',
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
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    tagline: 'Positioning, channels, and growth',
    color: '#F472B6',
    icon: '📣',
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
  'personalFinance',
  'economics',
  'accounting',
  'startups',
  'consulting',
  'marketing',
  'operations',
];

export const LESSON_NODES: Record<TrackId, LessonNode[]> = {
  finance: [
    { id: FINANCE_NODE_ID, trackId: 'finance', title: 'Reading Financial Statements', order: 1, live: true },
    { id: 'finance-stock-market-101', trackId: 'finance', title: 'Stock Market 101', order: 2, live: false },
    { id: 'finance-tvm-valuation', trackId: 'finance', title: 'Time Value of Money & Valuation', order: 3, live: false },
    { id: 'finance-bonds-fixed-income', trackId: 'finance', title: 'Bonds & Fixed Income', order: 4, live: false },
    { id: 'finance-financial-ratios', trackId: 'finance', title: 'Financial Ratios', order: 5, live: false },
    { id: 'finance-capital-structure-ma', trackId: 'finance', title: 'Capital Structure & M&A Basics', order: 6, live: false },
  ],
  personalFinance: [
    { id: PERSONAL_FINANCE_NODE_ID, trackId: 'personalFinance', title: 'Budgeting & Saving', order: 1, live: true },
    { id: 'personalfinance-investing-101', trackId: 'personalFinance', title: 'Investing 101', order: 2, live: false },
    { id: 'personalfinance-insurance-healthcare', trackId: 'personalFinance', title: 'Insurance & Healthcare Basics', order: 3, live: false },
    { id: 'personalfinance-retirement-planning', trackId: 'personalFinance', title: 'Retirement Planning', order: 4, live: false },
    { id: 'personalfinance-credit-debt-taxes', trackId: 'personalFinance', title: 'Credit, Debt & Taxes', order: 5, live: false },
    { id: 'personalfinance-big-life-decisions', trackId: 'personalFinance', title: 'Big Life Decisions', order: 6, live: false },
  ],
  economics: [
    { id: ECONOMICS_NODE_ID, trackId: 'economics', title: 'Core Economic Principles', order: 1, live: true },
    { id: 'economics-inflation-policy', trackId: 'economics', title: 'Inflation, Interest Rates & Monetary/Fiscal Policy', order: 2, live: false },
    { id: 'economics-indicators', trackId: 'economics', title: 'Economic Indicators', order: 3, live: false },
    { id: 'economics-market-structures', trackId: 'economics', title: 'Market Structures', order: 4, live: false },
    { id: 'economics-trade-exchange-rates', trackId: 'economics', title: 'International Trade & Exchange Rates', order: 5, live: false },
    { id: 'economics-behavioral', trackId: 'economics', title: 'Behavioral Economics', order: 6, live: false },
  ],
  accounting: [
    { id: ACCOUNTING_NODE_ID, trackId: 'accounting', title: 'The Accounting Cycle', order: 1, live: true },
    { id: 'accounting-reading-statements', trackId: 'accounting', title: 'Reading Financial Statements', order: 2, live: false },
    { id: 'accounting-accrual-vs-cash', trackId: 'accounting', title: 'Accrual vs. Cash Accounting', order: 3, live: false },
    { id: 'accounting-budgeting-cost', trackId: 'accounting', title: 'Budgeting & Cost Accounting', order: 4, live: false },
    { id: 'accounting-payroll-payables', trackId: 'accounting', title: 'Payroll, Payables & Receivables', order: 5, live: false },
    { id: 'accounting-depreciation-auditing', trackId: 'accounting', title: 'Depreciation, Assets & Auditing Basics', order: 6, live: false },
  ],
  startups: [
    { id: STARTUPS_NODE_ID, trackId: 'startups', title: 'Pitch Deck Basics', order: 1, live: true },
    { id: 'startups-lean-pmf', trackId: 'startups', title: 'Lean Startup & Product-Market Fit', order: 2, live: false },
    { id: 'startups-fundraising-cap-tables', trackId: 'startups', title: 'Fundraising, Equity & Cap Tables', order: 3, live: false },
    { id: 'startups-business-model-unit-economics', trackId: 'startups', title: 'Business Model & Unit Economics', order: 4, live: false },
    { id: 'startups-legal-funding-paths', trackId: 'startups', title: 'Legal Basics & Funding Paths', order: 5, live: false },
    { id: 'startups-pricing-strategy', trackId: 'startups', title: 'Pricing Strategy', order: 6, live: false },
  ],
  consulting: [
    { id: CONSULTING_NODE_ID, trackId: 'consulting', title: 'Case Interview Basics', order: 1, live: true },
    { id: 'consulting-structuring-problems', trackId: 'consulting', title: 'Structuring Problems', order: 2, live: false },
    { id: 'consulting-frameworks-market-sizing', trackId: 'consulting', title: 'Frameworks & Market Sizing', order: 3, live: false },
    { id: 'consulting-client-stakeholder-comms', trackId: 'consulting', title: 'Client & Stakeholder Communication', order: 4, live: false },
    { id: 'consulting-slide-writing', trackId: 'consulting', title: 'Slide Writing & Presenting to Executives', order: 5, live: false },
    { id: 'consulting-project-scoping', trackId: 'consulting', title: 'Project Scoping', order: 6, live: false },
  ],
  marketing: [
    { id: MARKETING_NODE_ID, trackId: 'marketing', title: 'Campaign Metrics & A/B Testing', order: 1, live: true },
    { id: 'marketing-ad-copy-basics', trackId: 'marketing', title: 'Ad Copy Basics', order: 2, live: false },
    { id: 'marketing-brand-positioning-pricing', trackId: 'marketing', title: 'Brand Positioning & Pricing Strategy', order: 3, live: false },
    { id: 'marketing-content-seo-social', trackId: 'marketing', title: 'Content, SEO & Social Media Strategy', order: 4, live: false },
    { id: 'marketing-research-segmentation', trackId: 'marketing', title: 'Market Research & Customer Segmentation', order: 5, live: false },
    { id: 'marketing-funnels-email', trackId: 'marketing', title: 'Marketing Funnels & Email Marketing', order: 6, live: false },
  ],
  operations: [
    { id: OPERATIONS_NODE_ID, trackId: 'operations', title: 'Process Mapping', order: 1, live: true },
    { id: 'operations-kpi-dashboards', trackId: 'operations', title: 'KPI Dashboards', order: 2, live: false },
    { id: 'operations-supply-chain-logistics', trackId: 'operations', title: 'Supply Chain, Inventory & Logistics', order: 3, live: false },
    { id: 'operations-quality-lean-six-sigma', trackId: 'operations', title: 'Quality Control & Lean Six Sigma', order: 4, live: false },
    { id: 'operations-project-management', trackId: 'operations', title: 'Project Management', order: 5, live: false },
    { id: 'operations-resource-vendor', trackId: 'operations', title: 'Resource Allocation & Vendor Management', order: 6, live: false },
  ],
};
