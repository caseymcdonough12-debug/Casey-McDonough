import { LessonQuestion } from '../types';

export const NODE_ID = 'consulting-structured-problem-solving';

export const CONSULTING_QUESTIONS: LessonQuestion[] = [
  {
    id: 'consulting-q1-profit-forward',
    nodeId: NODE_ID,
    conceptId: 'profitability-framework',
    kind: 'numeric',
    difficultyTier: 1,
    prompt: 'A client sells 4,000 units at $25 each. Total costs are $70,000. What is their profit?',
    targetLabel: 'Profit ($)',
    correctValue: 30000,
    tolerance: 1,
    explanation:
      'Revenue = 4,000 × $25 = $100,000. Profit = Revenue − Costs = $100,000 − $70,000 = $30,000.',
  },
  {
    id: 'consulting-q2-profit-backward',
    nodeId: NODE_ID,
    conceptId: 'profitability-framework',
    kind: 'numeric',
    difficultyTier: 3,
    prompt:
      "A client's profit was $45,000 last quarter selling 3,000 units at $40 each. What were their total costs?",
    targetLabel: 'Total costs ($)',
    correctValue: 75000,
    tolerance: 1,
    explanation:
      'Revenue = 3,000 × $40 = $120,000. Costs = Revenue − Profit = $120,000 − $45,000 = $75,000.',
  },
  {
    id: 'consulting-q3-framework-acquisition',
    nodeId: NODE_ID,
    conceptId: 'framework-fit',
    kind: 'multipleChoice',
    difficultyTier: 2,
    context: 'Prompt: "A private equity client is deciding whether to acquire a mid-size logistics company."',
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework' },
      { id: 'b', text: 'Market-sizing framework' },
      { id: 'c', text: 'Investment/acquisition framework (synergies, valuation, risk)' },
      { id: 'd', text: 'Debits & credits classification' },
    ],
    correctOptionId: 'c',
    explanation:
      "It's a go/no-go capital decision, not a profit diagnostic or a sizing question — it needs a framework built around valuation, synergies, and risk.",
  },
  {
    id: 'consulting-q4-framework-market-sizing',
    nodeId: NODE_ID,
    conceptId: 'framework-fit',
    kind: 'multipleChoice',
    difficultyTier: 4,
    context:
      'Prompt: "A beverage company wants to know how many units of a new energy drink it could sell in its first year in a new country."',
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework' },
      { id: 'b', text: 'Market-sizing framework (top-down or bottom-up)' },
      { id: 'c', text: 'SWOT analysis' },
      { id: 'd', text: 'Debits & credits classification' },
    ],
    correctOptionId: 'b',
    explanation:
      "The question is purely about estimating a number in a market with no data yet — the classic use case for market sizing, top-down from population or bottom-up from segments.",
  },
];
