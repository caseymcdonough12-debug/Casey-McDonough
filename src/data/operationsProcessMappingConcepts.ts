import { ConceptTeaching } from '../types';
import { NODE_ID } from './operationsProcessMapping';

export const OPERATIONS_PROCESS_MAPPING_CONCEPTS: Record<string, ConceptTeaching> = {
  'process-sequencing': {
    id: 'process-sequencing',
    trackId: 'operations',
    nodeId: NODE_ID,
    skillName: 'Process Sequencing',
    whatItDoes:
      "Mapping a process means laying out every step in the actual order work happens — skipping this before improving anything means you might fix a step that isn't even the real problem.",
    jobRole: 'Process Improvement Analyst',
    jobScenario:
      "You're documenting how an order actually moves through the warehouse before proposing any changes, since the official process and the real one rarely match.",
    alsoAppliesIn: ['Operations Manager', 'Manufacturing Supervisor', 'Business Analyst', 'Six Sigma Green Belt'],
    example: {
      scenarioPrompt: 'A customer order goes through, listed out of order: Pick items, Pack items, Receive order, Ship order. What is the correct sequence?',
      targetLabel: 'Correct sequence',
      answer: 'Receive order → Pick items → Pack items → Ship order',
      resultExplanation:
        "Mapping the real order of steps matters — you can't pick or pack an order before it's received, and you can't ship before packing.",
    },
  },
  'value-added-steps': {
    id: 'value-added-steps',
    trackId: 'operations',
    nodeId: NODE_ID,
    skillName: 'Value-Added vs. Non-Value-Added',
    whatItDoes:
      "A value-added step is one the customer would actually pay for; a non-value-added step (waiting, rework, unnecessary movement) adds time and cost without adding anything the customer cares about.",
    jobRole: 'Operations Manager',
    jobScenario:
      "You're mapping a process to find what to cut first, and separating the steps that create real value from the ones that just create delay tells you where to focus.",
    alsoAppliesIn: ['Six Sigma Black Belt', 'Process Improvement Analyst', 'Manufacturing Supervisor', 'Lean Consultant'],
    example: {
      scenarioPrompt: 'In an order fulfillment process, which step is non-value-added?',
      targetLabel: 'Non-value-added step',
      answer: "The order sits in a queue for 2 days waiting for a manager's manual approval",
      resultExplanation:
        "The customer doesn't benefit from the order waiting in an approval queue — it's pure delay. Picking, packing, and shipping are all value-added, since the customer is directly paying for those outcomes.",
    },
  },
  'bottleneck-identification': {
    id: 'bottleneck-identification',
    trackId: 'operations',
    nodeId: NODE_ID,
    skillName: 'Finding the Bottleneck',
    whatItDoes:
      'In any multi-step process, the slowest step — the one with the least capacity — caps how much the whole process can produce, no matter how fast the other steps run. That slowest step is the bottleneck.',
    jobRole: 'Operations Manager',
    jobScenario:
      "You're running a small print shop with printing, cutting, and packaging stations, and customers are complaining about slow turnaround. Before buying a faster printer, you need to know whether printing is actually what's slowing everything down.",
    alsoAppliesIn: ['Manufacturing Supervisor', 'Process Improvement Analyst', 'Six Sigma Green Belt', 'Supply Chain Manager'],
    example: {
      scenarioPrompt: "A sandwich shop's line can prep 40 sandwiches/hour, toast 30/hour, and wrap 50/hour. What is the bottleneck?",
      targetLabel: 'Bottleneck step',
      answer: 'Toasting (30/hour)',
      resultExplanation:
        'The whole line can only move as fast as its slowest station. Toasting caps output at 30 sandwiches/hour even though prep and wrapping could go faster.',
    },
  },
};
