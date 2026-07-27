import { LessonQuestion } from '../types';

export const NODE_ID = 'operations-process-mapping';

export const OPERATIONS_PROCESS_MAPPING_QUESTIONS: LessonQuestion[] = [
  {
    id: 'operations-q1-sequencing-return',
    nodeId: NODE_ID,
    conceptId: 'process-sequencing',
    kind: 'multipleChoice',
    difficultyTier: 1,
    scenarioTag: 'Your ops manager asks:',
    context: 'A returned item goes through these steps, listed out of order: Restock item, Inspect item, Receive return, Issue refund.',
    prompt: 'What is the correct sequence?',
    options: [
      { id: 'a', text: 'Receive return → Inspect item → Issue refund → Restock item' },
      { id: 'b', text: 'Restock item → Receive return → Inspect item → Issue refund' },
      { id: 'c', text: 'Issue refund → Receive return → Inspect item → Restock item' },
      { id: 'd', text: 'Inspect item → Receive return → Restock item → Issue refund' },
    ],
    correctOptionId: 'a',
    explanation:
      'You must receive the return before inspecting it, and typically issue the refund once inspection confirms it\'s valid, before restocking.',
  },
  {
    id: 'operations-q2-sequencing-manufacturing',
    nodeId: NODE_ID,
    conceptId: 'process-sequencing',
    kind: 'multipleChoice',
    difficultyTier: 2,
    scenarioTag: 'A new hire asks:',
    context: 'A manufacturing order goes through these steps, listed out of order: Quality check, Assemble parts, Procure raw materials, Ship to customer.',
    prompt: 'What is the correct sequence?',
    options: [
      { id: 'a', text: 'Procure raw materials → Assemble parts → Quality check → Ship to customer' },
      { id: 'b', text: 'Assemble parts → Procure raw materials → Ship to customer → Quality check' },
      { id: 'c', text: 'Quality check → Procure raw materials → Ship to customer → Assemble parts' },
      { id: 'd', text: 'Ship to customer → Assemble parts → Procure raw materials → Quality check' },
    ],
    correctOptionId: 'a',
    explanation:
      'Materials must be procured before assembly, and quality checks happen after assembly but before the product ships to the customer.',
  },
  {
    id: 'operations-q3-value-added-hospital',
    nodeId: NODE_ID,
    conceptId: 'value-added-steps',
    kind: 'multipleChoice',
    difficultyTier: 2,
    scenarioTag: 'A Six Sigma coach asks:',
    context: "In a hospital's patient intake process, which step is non-value-added?",
    prompt: 'Which step is non-value-added?',
    options: [
      { id: 'a', text: "A nurse records the patient's symptoms and vitals" },
      { id: 'b', text: 'The patient\'s paperwork sits in an inbox for 45 minutes before anyone processes it' },
      { id: 'c', text: 'A doctor examines the patient' },
      { id: 'd', text: 'A lab technician runs the requested test' },
    ],
    correctOptionId: 'b',
    explanation:
      "Paperwork sitting untouched adds time without doing anything the patient benefits from — a classic non-value-added wait.",
  },
  {
    id: 'operations-q4-value-added-software',
    nodeId: NODE_ID,
    conceptId: 'value-added-steps',
    kind: 'multipleChoice',
    difficultyTier: 3,
    scenarioTag: 'An ops director asks:',
    context: "In a software company's deployment process, which step is non-value-added?",
    prompt: 'Which step is non-value-added?',
    options: [
      { id: 'a', text: 'Automated tests run against the new code' },
      { id: 'b', text: 'Code sits waiting for a manual sign-off from someone who is on vacation for a week' },
      { id: 'c', text: 'The code is deployed to production' },
      { id: 'd', text: 'A customer-facing feature becomes available' },
    ],
    correctOptionId: 'b',
    explanation:
      'Waiting on an unavailable approver is pure delay — the customer never benefits from that wait, unlike testing, deployment, or the feature itself.',
  },
  {
    id: 'operations-q5-bottleneck-tshirt',
    nodeId: NODE_ID,
    conceptId: 'bottleneck-identification',
    kind: 'multipleChoice',
    difficultyTier: 3,
    context: 'A t-shirt printing shop can design 60 shirts/hour, print 45 shirts/hour, and fold/pack 80 shirts/hour.',
    prompt: 'Which step is the bottleneck?',
    options: [
      { id: 'a', text: 'Design' },
      { id: 'b', text: 'Print' },
      { id: 'c', text: 'Fold/Pack' },
      { id: 'd', text: 'There is no bottleneck' },
    ],
    correctOptionId: 'b',
    explanation: 'Print has the lowest capacity (45/hour), so it caps total output no matter how fast the other stations run.',
  },
  {
    id: 'operations-q6-bottleneck-bakery',
    nodeId: NODE_ID,
    conceptId: 'bottleneck-identification',
    kind: 'multipleChoice',
    difficultyTier: 4,
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
];
