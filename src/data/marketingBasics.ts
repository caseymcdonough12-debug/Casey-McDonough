import { LessonQuestion } from '../types';

export const NODE_ID = 'marketing-positioning-channels';

export const MARKETING_QUESTIONS: LessonQuestion[] = [
  {
    id: 'marketing-q1-channel-coffee-shop',
    nodeId: NODE_ID,
    conceptId: 'channel-fit',
    kind: 'multipleChoice',
    difficultyTier: 1,
    context: 'A local coffee shop wants to attract nearby college students within walking distance.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Instagram + flyers/partnerships with nearby student orgs' },
      { id: 'b', text: 'A national TV ad campaign' },
      { id: 'c', text: 'Cold-calling enterprise IT departments' },
      { id: 'd', text: 'Print ads in a national finance magazine' },
    ],
    correctOptionId: 'a',
    explanation:
      'The audience is young, local, and nearby — that calls for a cheap, hyper-local, visual channel, not a national or enterprise-focused one.',
  },
  {
    id: 'marketing-q2-channel-photographer',
    nodeId: NODE_ID,
    conceptId: 'channel-fit',
    kind: 'multipleChoice',
    difficultyTier: 3,
    context: 'A boutique wedding photographer wants more bookings in her city.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Instagram/Pinterest with a strong visual portfolio' },
      { id: 'b', text: 'Cold email to Fortune 500 companies' },
      { id: 'c', text: 'Paid search ads for "best chocolate factory near me"' },
      { id: 'd', text: 'Radio ads during rush hour traffic' },
    ],
    correctOptionId: 'a',
    explanation:
      'Photography is a highly visual, portfolio-driven purchase — engaged couples browse Instagram/Pinterest for style before booking. The other options target the wrong audience entirely.',
  },
  {
    id: 'marketing-q3-value-prop-budgeting-app',
    nodeId: NODE_ID,
    conceptId: 'value-proposition',
    kind: 'multipleChoice',
    difficultyTier: 2,
    context: 'A budgeting app is choosing its homepage headline.',
    prompt: 'Which value proposition is strongest?',
    options: [
      { id: 'a', text: '"Take control of your finances today"' },
      { id: 'b', text: '"See exactly where your next paycheck is going, before you spend it"' },
      { id: 'c', text: '"The best app for your money"' },
      { id: 'd', text: '"Financial freedom starts here"' },
    ],
    correctOptionId: 'b',
    explanation:
      'It names a specific benefit (visibility) at a specific moment (before you spend). The rest are vague slogans that could describe almost any finance product.',
  },
  {
    id: 'marketing-q4-value-prop-cybersecurity',
    nodeId: NODE_ID,
    conceptId: 'value-proposition',
    kind: 'multipleChoice',
    difficultyTier: 4,
    context: 'A B2B cybersecurity startup is writing the one-liner for its pitch deck, aimed at enterprise IT buyers.',
    prompt: 'Which is strongest?',
    options: [
      { id: 'a', text: '"We help you stay secure"' },
      { id: 'b', text: '"Enterprise-grade security for the modern age"' },
      { id: 'c', text: '"Cut phishing-related help desk tickets by 60% in the first 90 days"' },
      { id: 'd', text: '"The future of cybersecurity is here"' },
    ],
    correctOptionId: 'c',
    explanation:
      "It's quantified, specific, and time-bound — a buyer can picture the exact outcome and measure it, unlike the generic claims in the other options.",
  },
];
