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
  'gross-margin': {
    id: 'gross-margin',
    trackId: 'accounting',
    nodeId: NODE_ID,
    title: 'Gross margin: how much of each sale you actually keep',
    whatItDoes:
      'Gross margin is the percentage of revenue left after subtracting the direct cost of producing what you sold (COGS). Gross Margin = (Revenue − COGS) ÷ Revenue.',
    realWorldScenario:
      "You're comparing two product lines and one has much higher revenue — but a lower gross margin means it's actually less profitable per dollar sold. Investors and lenders check this before almost anything else.",
    example: {
      scenarioPrompt: 'A furniture maker has $200,000 in Revenue and $120,000 in COGS. What is the gross margin percentage?',
      targetLabel: 'Gross Margin (%)',
      answer: '40%',
      resultExplanation:
        'Gross Margin = (Revenue − COGS) ÷ Revenue = ($200,000 − $120,000) ÷ $200,000 = 40%.',
    },
  },
  'net-income': {
    id: 'net-income',
    trackId: 'accounting',
    nodeId: NODE_ID,
    title: "Net income: what's left after every expense",
    whatItDoes:
      'Net income (the "bottom line") is Revenue minus every expense a business had — COGS, operating costs, interest, taxes, all of it. Net Income = Revenue − Total Expenses.',
    realWorldScenario:
      "A company can have a great gross margin but still lose money overall if operating expenses run too high. Net income is the number that tells you whether the business actually made money this year.",
    example: {
      scenarioPrompt: 'A consulting firm had $500,000 in Revenue and $430,000 in total expenses. What is its Net Income?',
      targetLabel: 'Net Income ($)',
      answer: '$70,000',
      resultExplanation: 'Net Income = Revenue − Total Expenses = $500,000 − $430,000 = $70,000.',
    },
  },
  'current-ratio': {
    id: 'current-ratio',
    trackId: 'accounting',
    nodeId: NODE_ID,
    title: 'Current ratio: can you cover what you owe this year?',
    whatItDoes:
      'The current ratio measures whether a company has enough short-term assets (cash, receivables, inventory) to cover what it owes in the next year. Current Ratio = Current Assets ÷ Current Liabilities.',
    realWorldScenario:
      "A lender deciding whether to extend a company a line of credit checks its current ratio first — a ratio below 1 means the company might not be able to pay its short-term bills even if it's profitable on paper.",
    example: {
      scenarioPrompt: 'A retailer has $180,000 in Current Assets and $90,000 in Current Liabilities. What is its current ratio?',
      targetLabel: 'Current Ratio (x)',
      answer: '2x',
      resultExplanation:
        'Current Ratio = Current Assets ÷ Current Liabilities = $180,000 ÷ $90,000 = 2. A ratio above 1 generally means the company can cover its near-term obligations.',
    },
  },
};
