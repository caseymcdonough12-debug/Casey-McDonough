import { ConceptTeaching } from '../types';
import { NODE_ID } from './personalFinanceBudgeting';

export const PERSONAL_FINANCE_BUDGETING_CONCEPTS: Record<string, ConceptTeaching> = {
  'rule-50-30-20': {
    id: 'rule-50-30-20',
    trackId: 'personalFinance',
    nodeId: NODE_ID,
    skillName: '50/30/20 Rule',
    whatItDoes:
      'The 50/30/20 rule splits take-home pay into 50% needs, 30% wants, and 20% savings/debt payoff, giving you a simple starting budget without tracking every category.',
    jobRole: 'Financial Wellness Coach',
    jobScenario:
      "A new hire asks how to budget their first paycheck, and you walk them through the 50/30/20 split before recommending anything more complex.",
    alsoAppliesIn: ['HR Benefits Counselor', 'New Grad', 'Credit Counselor', 'Financial Planner'],
    example: {
      scenarioPrompt: 'Someone takes home $4,000 per month. How much should go to Savings/Debt Payoff under the 50/30/20 rule?',
      targetLabel: 'Savings/Debt (20%) ($)',
      answer: '$800',
      resultExplanation: '20% of $4,000 = $800 toward savings or debt payoff.',
    },
  },
  'emergency-fund': {
    id: 'emergency-fund',
    trackId: 'personalFinance',
    nodeId: NODE_ID,
    skillName: 'Emergency Fund Size',
    whatItDoes:
      'An emergency fund should cover a set number of months of essential expenses: Emergency Fund = Monthly Essential Expenses × Months of Coverage — so a job loss doesn\'t turn into a financial crisis.',
    jobRole: 'Financial Planner',
    jobScenario:
      "A client just got a raise and asks how big their emergency fund should actually be before investing the extra money.",
    alsoAppliesIn: ['Credit Counselor', 'HR Benefits Counselor', 'New Grad', 'Financial Wellness Coach'],
    example: {
      scenarioPrompt: "Someone's essential monthly expenses are $3,000 and they want 6 months of coverage. How big should their emergency fund be?",
      targetLabel: 'Emergency Fund ($)',
      answer: '$18,000',
      resultExplanation: 'Emergency Fund = Monthly Expenses × Months = $3,000 × 6 = $18,000.',
    },
  },
  'compound-growth': {
    id: 'compound-growth',
    trackId: 'personalFinance',
    nodeId: NODE_ID,
    skillName: 'Compound Growth',
    whatItDoes:
      'Money growing at a fixed annual rate compounds: Future Value = Principal × (1 + rate) ^ years — meaning growth accelerates the longer money stays invested.',
    jobRole: 'Financial Planner',
    jobScenario:
      "A 25-year-old asks whether starting to save now versus in five years actually matters, and you run the compound growth math to show them why it does.",
    alsoAppliesIn: ['Investment Advisor', 'New Grad', 'HR Benefits Counselor', 'Retirement Counselor'],
    example: {
      scenarioPrompt: '$10,000 grows at 8% per year for 2 years. What is the Future Value (rounded to the nearest dollar)?',
      targetLabel: 'Future Value ($)',
      answer: '$11,664',
      resultExplanation: 'Future Value = $10,000 × (1.08)² = $10,000 × 1.1664 = $11,664.',
    },
  },
};
