import { LessonQuestion } from '../types';

export const NODE_ID = 'startups-unit-economics';

export const STARTUPS_QUESTIONS: LessonQuestion[] = [
  {
    id: 'startups-q1-ltv-cac-ratio',
    nodeId: NODE_ID,
    conceptId: 'cac-ltv',
    kind: 'numeric',
    difficultyTier: 1,
    prompt: 'A meal-kit startup has an LTV of $300 per customer and a CAC of $100. What is the LTV:CAC ratio?',
    targetLabel: 'LTV:CAC ratio (x)',
    unit: 'x',
    correctValue: 3,
    tolerance: 0.05,
    explanation: 'LTV ÷ CAC = $300 ÷ $100 = 3. A 3:1 ratio is often used as the baseline for a healthy business.',
  },
  {
    id: 'startups-q2-cac-from-spend',
    nodeId: NODE_ID,
    conceptId: 'cac-ltv',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: 'A startup spent $24,000 on marketing last month and acquired 300 new customers. What is their CAC?',
    targetLabel: 'CAC ($)',
    correctValue: 80,
    tolerance: 0.5,
    explanation: 'CAC = Marketing spend ÷ New customers = $24,000 ÷ 300 = $80 per customer.',
  },
  {
    id: 'startups-q3-runway-basic',
    nodeId: NODE_ID,
    conceptId: 'runway',
    kind: 'numeric',
    difficultyTier: 2,
    prompt: 'A startup has $180,000 in the bank and burns $30,000 per month. How many months of runway do they have?',
    targetLabel: 'Runway (months)',
    unit: 'mo',
    correctValue: 6,
    tolerance: 0.1,
    explanation: 'Runway = Cash ÷ Monthly burn = $180,000 ÷ $30,000 = 6 months.',
  },
  {
    id: 'startups-q4-runway-backward',
    nodeId: NODE_ID,
    conceptId: 'runway',
    kind: 'numeric',
    difficultyTier: 4,
    prompt:
      'A founder wants at least 9 months of runway and has $270,000 in the bank. What is the maximum monthly burn rate they can afford?',
    targetLabel: 'Max monthly burn ($)',
    correctValue: 30000,
    tolerance: 1,
    explanation: 'Max burn = Cash ÷ Target runway = $270,000 ÷ 9 = $30,000 per month.',
  },
];
