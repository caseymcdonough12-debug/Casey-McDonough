import { ConceptTeaching } from '../types';
import { NODE_ID } from './financeStatements';

export const FINANCE_STATEMENTS_CONCEPTS: Record<string, ConceptTeaching> = {
  'pl-reading': {
    id: 'pl-reading',
    trackId: 'finance',
    nodeId: NODE_ID,
    skillName: 'Net Income',
    whatItDoes:
      'A P&L (income statement) lists Revenue, subtracts Expenses, and the bottom line is Net Income — whether the company actually made money.',
    jobRole: 'Financial Analyst',
    jobScenario:
      "You're handed a client's P&L right before a meeting and need to state their Net Income in the first thirty seconds, not calculate it live in front of them.",
    alsoAppliesIn: ['Small Business Owner', 'Loan Officer', 'Investor', 'Accountant'],
    example: {
      scenarioPrompt: "Meridian Consulting's P&L shows $80,000 in Revenue and $65,000 in Total Expenses. What is Net Income?",
      columnHeaders: ['Line Item', 'Amount'],
      cells: [
        { row: 2, col: 1, value: 'Revenue' },
        { row: 2, col: 2, value: '$80,000' },
        { row: 3, col: 1, value: 'Total Expenses' },
        { row: 3, col: 2, value: '$65,000' },
      ],
      targetLabel: 'Net Income ($)',
      answer: '$15,000',
      resultExplanation: 'Net Income = Revenue − Total Expenses = $80,000 − $65,000 = $15,000.',
    },
  },
  'balance-sheet-reading': {
    id: 'balance-sheet-reading',
    trackId: 'finance',
    nodeId: NODE_ID,
    skillName: 'Assets = Liabilities + Equity',
    whatItDoes:
      "A balance sheet lists everything a company owns (Assets) and owes (Liabilities); what's left over is Equity — and the two sides always have to balance.",
    jobRole: 'Loan Officer',
    jobScenario:
      "A business applies for a loan and you check their balance sheet to see if their assets actually cover what they owe before approving anything.",
    alsoAppliesIn: ['Investor', 'Auditor', 'Small Business Owner', 'Financial Analyst'],
    example: {
      scenarioPrompt: "Vantage Retail Group's balance sheet lists $250,000 in Assets and $90,000 in Liabilities. What is Equity?",
      columnHeaders: ['Line Item', 'Amount'],
      cells: [
        { row: 2, col: 1, value: 'Assets' },
        { row: 2, col: 2, value: '$250,000' },
        { row: 3, col: 1, value: 'Liabilities' },
        { row: 3, col: 2, value: '$90,000' },
      ],
      targetLabel: 'Equity ($)',
      answer: '$160,000',
      resultExplanation: 'Equity = Assets − Liabilities = $250,000 − $90,000 = $160,000.',
    },
  },
  'cash-flow-reading': {
    id: 'cash-flow-reading',
    trackId: 'finance',
    nodeId: NODE_ID,
    skillName: 'Ending Cash Balance',
    whatItDoes:
      'A cash flow statement starts with Beginning Cash, adds or subtracts cash from Operating, Investing, and Financing activities, and the result is Ending Cash — the number that actually matters for whether bills get paid.',
    jobRole: 'Controller',
    jobScenario:
      "A company looks profitable on paper but you check the cash flow statement to see if they'll actually have cash in the bank to make payroll next month.",
    alsoAppliesIn: ['CFO', 'Investor', 'Financial Analyst', 'Small Business Owner'],
    example: {
      scenarioPrompt:
        "Harborview Manufacturing's Beginning Cash is $40,000. Operating activities added $25,000, Investing activities used $10,000, and Financing activities added $5,000. What is Ending Cash?",
      columnHeaders: ['Line Item', 'Amount'],
      cells: [
        { row: 2, col: 1, value: 'Beginning Cash' },
        { row: 2, col: 2, value: '$40,000' },
        { row: 3, col: 1, value: 'Operating Activities' },
        { row: 3, col: 2, value: '+$25,000' },
        { row: 4, col: 1, value: 'Investing Activities' },
        { row: 4, col: 2, value: '−$10,000' },
        { row: 5, col: 1, value: 'Financing Activities' },
        { row: 5, col: 2, value: '+$5,000' },
      ],
      targetLabel: 'Ending Cash ($)',
      answer: '$60,000',
      resultExplanation:
        'Ending Cash = Beginning Cash + Operating + Financing − Investing = $40,000 + $25,000 + $5,000 − $10,000 = $60,000.',
    },
  },
};
