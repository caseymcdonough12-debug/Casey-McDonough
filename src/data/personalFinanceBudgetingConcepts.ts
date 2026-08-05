import { ConceptTeaching } from '../types';
import { NODE_ID } from './personalFinanceBudgeting';

export const PERSONAL_FINANCE_BUDGETING_CONCEPTS: Record<string, ConceptTeaching> = {
  'rule-50-30-20': {
    id: 'rule-50-30-20',
    trackId: 'personalFinance',
    nodeId: NODE_ID,
    skillName: '50/30/20 Rule',
    whatItDoes:
      'The 50/30/20 rule splits your take-home pay into 50% needs, 30% wants, and 20% savings or debt payoff — a simple starting budget without tracking every category.',
    depthNote:
      "You don't need a finance degree or a fancy app to start — this one rule alone puts you ahead of most people who never budget at all.",
    scenarioBoxLabel: 'IN REAL LIFE',
    jobRole: 'Your First Paycheck',
    jobScenario:
      "You just got your first real paycheck and have no idea where the money should go — the 50/30/20 split gives you an instant plan before you spend a dollar.",
    alsoAppliesLabel: 'Also matters when:',
    alsoAppliesIn: ['Moving out on your own', 'Paying off student loans', 'Getting a raise', 'Living paycheck to paycheck'],
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
    depthNote:
      "Most financial disasters aren't really about the emergency itself — they're about not having cash ready when it hits.",
    scenarioBoxLabel: 'IN REAL LIFE',
    jobRole: 'Building Your Safety Net',
    jobScenario:
      "Your car breaks down or you unexpectedly lose your job — an emergency fund is the difference between a stressful week and a full-blown financial crisis.",
    alsoAppliesLabel: 'Also matters when:',
    alsoAppliesIn: ['Losing a job', 'A surprise medical bill', 'Car or home repairs', 'Taking a career risk'],
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
    depthNote:
      "This is the whole reason people say \"start investing as early as possible\" — time does more of the work than the amount you put in.",
    scenarioBoxLabel: 'IN REAL LIFE',
    jobRole: 'Starting Early vs. Starting Late',
    jobScenario:
      "You're deciding whether to start putting money away now in your 20s or wait until you're making more later — compound growth shows exactly what that wait actually costs you.",
    alsoAppliesLabel: 'Also matters when:',
    alsoAppliesIn: ['Opening a retirement account', 'Choosing to invest vs. save', 'Planning for a big future goal', 'Deciding how much to contribute'],
    example: {
      scenarioPrompt: '$10,000 grows at 8% per year for 2 years. What is the Future Value (rounded to the nearest dollar)?',
      targetLabel: 'Future Value ($)',
      answer: '$11,664',
      resultExplanation: 'Future Value = $10,000 × (1.08)² = $10,000 × 1.1664 = $11,664.',
    },
  },
};
