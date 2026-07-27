import { ConceptTeaching } from '../types';
import { NODE_ID } from './accountingCycle';

export const ACCOUNTING_CYCLE_CONCEPTS: Record<string, ConceptTeaching> = {
  'debit-credit': {
    id: 'debit-credit',
    trackId: 'accounting',
    nodeId: NODE_ID,
    skillName: 'Debits & Credits',
    whatItDoes:
      'Every transaction hits at least two accounts — one debit, one credit. Asset and expense accounts increase with a debit; liability, equity, and revenue accounts increase with a credit.',
    jobRole: 'Bookkeeper',
    jobScenario:
      'Your bookkeeping software asks whether to debit or credit each account on a transaction — get this backwards and it silently throws off every report downstream.',
    alsoAppliesIn: ['Staff Accountant', 'Small Business Owner', 'Auditor', 'Controller'],
    example: {
      scenarioPrompt: "Luxe Cuts, a hair salon, gets paid $500 in cash by a customer for a haircut. How does this affect Luxe Cuts's Cash account (an Asset)?",
      targetLabel: 'Cash account',
      answer: 'Debit (increase)',
      resultExplanation:
        'Cash is an asset account, and assets increase with a debit. The $500 debit to Cash is paired with a $500 credit to Revenue.',
    },
  },
  'journal-entries': {
    id: 'journal-entries',
    trackId: 'accounting',
    nodeId: NODE_ID,
    skillName: 'Journal Entry',
    whatItDoes:
      'A journal entry records a transaction by debiting one account and crediting another for the same amount — the two sides must always balance.',
    jobRole: 'Staff Accountant',
    jobScenario:
      "A new invoice comes in and you have to record it correctly in the books before month-end close, or every report after it will be wrong.",
    alsoAppliesIn: ['Bookkeeper', 'Auditor', 'Small Business Owner', 'Controller'],
    example: {
      scenarioPrompt: 'Bright Bakery buys $3,000 of office supplies with cash. Which journal entry is correct for Bright Bakery?',
      targetLabel: 'Correct entry',
      answer: 'Debit Office Supplies $3,000 / Credit Cash $3,000',
      resultExplanation:
        'Office Supplies (an asset) increases with a debit; Cash (also an asset) decreases with a credit — both sides of the entry are $3,000.',
    },
  },
  'accounting-equation': {
    id: 'accounting-equation',
    trackId: 'accounting',
    nodeId: NODE_ID,
    skillName: 'Assets = Liabilities + Equity',
    whatItDoes:
      "Every company's books balance around one equation: what it owns (Assets) equals what it owes (Liabilities) plus what belongs to the owners (Equity). If you know two of the three, you can always solve for the third.",
    jobRole: 'Controller',
    jobScenario:
      "You're pitching investors and they ask what the company is worth on paper. You check that Assets minus Liabilities lines up with Equity before you even walk into the room.",
    alsoAppliesIn: ['Auditor', 'Small Business Owner', 'Investor', 'Financial Analyst'],
    example: {
      scenarioPrompt: "Sunrise Bakery has $40,000 in Assets and $15,000 in Liabilities. What is Sunrise Bakery's Equity?",
      targetLabel: 'Equity ($)',
      answer: '$25,000',
      resultExplanation:
        "Equity = Assets − Liabilities = $40,000 − $15,000 = $25,000. Rearrange the same equation to solve for whichever piece you're missing.",
    },
  },
};
