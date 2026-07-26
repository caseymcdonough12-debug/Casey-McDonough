import { LessonQuestion } from '../types';

export const NODE_ID = 'accounting-debits-credits';

export const ACCOUNTING_QUESTIONS: LessonQuestion[] = [
  {
    id: 'accounting-q1-equation-equity',
    nodeId: NODE_ID,
    conceptId: 'accounting-equation',
    kind: 'numeric',
    difficultyTier: 1,
    prompt:
      'A design studio has $120,000 in Assets and $45,000 in Liabilities. What is its Equity?',
    targetLabel: 'Equity ($)',
    correctValue: 75000,
    tolerance: 0.5,
    explanation:
      'Equity = Assets − Liabilities = $120,000 − $45,000 = $75,000. This is the accounting equation rearranged to solve for the missing piece.',
  },
  {
    id: 'accounting-q2-equation-assets',
    nodeId: NODE_ID,
    conceptId: 'accounting-equation',
    kind: 'numeric',
    difficultyTier: 2,
    prompt:
      "A food truck business has $30,000 in Equity and $18,000 in Liabilities. What are its total Assets?",
    targetLabel: 'Assets ($)',
    correctValue: 48000,
    tolerance: 0.5,
    explanation:
      'Assets = Liabilities + Equity = $18,000 + $30,000 = $48,000. Same equation, just solving for a different unknown.',
  },
  {
    id: 'accounting-q3-debit-credit-loan',
    nodeId: NODE_ID,
    conceptId: 'debit-credit',
    kind: 'multipleChoice',
    difficultyTier: 3,
    context: 'A company takes out a $10,000 bank loan.',
    prompt: 'How does this affect the Loan Payable account (a Liability)?',
    options: [
      { id: 'debit', text: 'Debit (the account goes up)' },
      { id: 'credit', text: 'Credit (the account goes up)' },
    ],
    correctOptionId: 'credit',
    explanation:
      'Liabilities increase with a credit. The company now owes more, so Loan Payable is credited for $10,000 (paired with a debit to Cash, since an asset went up).',
  },
  {
    id: 'accounting-q4-debit-credit-cash-paydown',
    nodeId: NODE_ID,
    conceptId: 'debit-credit',
    kind: 'multipleChoice',
    difficultyTier: 4,
    context: 'The company later pays $2,000 cash toward that loan.',
    prompt: 'How does this affect the Cash account (an Asset)?',
    options: [
      { id: 'debit', text: 'Debit (the account goes up)' },
      { id: 'credit', text: 'Credit (the account goes down)' },
    ],
    correctOptionId: 'credit',
    explanation:
      'Cash is going down, and assets decrease with a credit. Paying cash credits the Cash account (paired with a debit to Loan Payable, which decreases the liability).',
  },
];
