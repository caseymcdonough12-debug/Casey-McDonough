import { LessonQuestion } from '../types';

export const NODE_ID = 'operations-process-bottlenecks';

export const OPERATIONS_QUESTIONS: LessonQuestion[] = [
  {
    id: 'operations-q1-bottleneck-tshirt',
    nodeId: NODE_ID,
    conceptId: 'bottleneck-identification',
    kind: 'multipleChoice',
    difficultyTier: 1,
    context: 'A t-shirt printing shop can design 60 shirts/hour, print 45 shirts/hour, and fold/pack 80 shirts/hour.',
    prompt: 'Which step is the bottleneck?',
    options: [
      { id: 'a', text: 'Design' },
      { id: 'b', text: 'Print' },
      { id: 'c', text: 'Fold/Pack' },
      { id: 'd', text: 'There is no bottleneck' },
    ],
    correctOptionId: 'b',
    explanation:
      'Print has the lowest capacity (45/hour), so it caps total output no matter how fast the other stations run.',
  },
  {
    id: 'operations-q2-bottleneck-bakery',
    nodeId: NODE_ID,
    conceptId: 'bottleneck-identification',
    kind: 'multipleChoice',
    difficultyTier: 3,
    context:
      "A bakery's dough-mixing station handles 100 loaves/hour, baking handles 40 loaves/hour, and packaging handles 90 loaves/hour. The owner doubles mixing capacity to 200 loaves/hour.",
    prompt: 'What happens to total output?',
    options: [
      { id: 'a', text: 'Output doubles' },
      { id: 'b', text: 'Output stays capped at 40 loaves/hour — baking is still the bottleneck' },
      { id: 'c', text: 'Output increases to 90 loaves/hour' },
      { id: 'd', text: 'Output becomes unlimited' },
    ],
    correctOptionId: 'b',
    explanation:
      "Mixing was never the bottleneck — baking was, at 40/hour. Adding capacity anywhere except the bottleneck itself doesn't raise total output.",
  },
  {
    id: 'operations-q3-throughput-basic',
    nodeId: NODE_ID,
    conceptId: 'throughput-calc',
    kind: 'numeric',
    difficultyTier: 2,
    prompt: 'A worker takes 4 minutes to assemble one unit. What is their throughput in units per hour?',
    targetLabel: 'Throughput (units/hr)',
    correctValue: 15,
    tolerance: 0.1,
    explanation: 'Throughput = 60 ÷ cycle time = 60 ÷ 4 = 15 units per hour.',
  },
  {
    id: 'operations-q4-throughput-backward',
    nodeId: NODE_ID,
    conceptId: 'throughput-calc',
    kind: 'numeric',
    difficultyTier: 4,
    prompt:
      'A team needs to hit a throughput of 24 units per hour per worker. What is the maximum cycle time (in minutes) allowed per unit?',
    targetLabel: 'Max cycle time (min)',
    correctValue: 2.5,
    tolerance: 0.05,
    explanation: 'Max cycle time = 60 ÷ target throughput = 60 ÷ 24 = 2.5 minutes per unit.',
  },
];
