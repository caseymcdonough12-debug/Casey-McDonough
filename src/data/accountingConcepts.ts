import { ConceptTeaching } from '../types';
import { NODE_ID } from './accountingBasics';

export const ACCOUNTING_CONCEPTS: Record<string, ConceptTeaching> = {
  'accounting-equation': {
    id: 'accounting-equation',
    trackId: 'accounting',
    nodeId: NODE_ID,
    title: 'The accounting equation: Assets = Liabilities + Equity',
    whatItDoes:
      "Every company's books balance around one equation: what it owns (Assets) equals what it owes (Liabilities) plus what belongs to the owners (Equity). If you know two of the three, you can always solve for the third.",
    realWorldScenario:
      "You're pitching investors and they ask what the company is worth on paper. You check that Assets minus Liabilities lines up with Equity — if it doesn't, something in the books is wrong before you even walk into the room.",
    example: {
      scenarioPrompt: 'A small bakery has $40,000 in Assets and $15,000 in Liabilities. What is its Equity?',
      targetLabel: 'Equity ($)',
      answer: '$25,000',
      resultExplanation:
        "Equity = Assets − Liabilities = $40,000 − $15,000 = $25,000. Rearrange the same equation to solve for whichever piece you're missing.",
    },
  },
  'debit-credit': {
    id: 'debit-credit',
    trackId: 'accounting',
    nodeId: NODE_ID,
    title: 'Debits & credits: which side does this account move?',
    whatItDoes:
      'Every transaction hits at least two accounts — one debit, one credit. Asset and expense accounts increase with a debit. Liability, equity, and revenue accounts increase with a credit.',
    realWorldScenario:
      'Your bookkeeping software asks whether to debit or credit each account on a transaction. Getting this backwards silently throws off every report downstream — this one rule is what keeps double-entry books consistent.',
    example: {
      scenarioPrompt: 'A customer pays $500 cash for a service. How does this affect the Cash account (an Asset)?',
      targetLabel: 'Cash account',
      answer: 'Debit (increase)',
      resultExplanation:
        'Cash is an asset account, and assets increase with a debit. The $500 debit to Cash is paired with a $500 credit to Revenue.',
    },
  },
};
