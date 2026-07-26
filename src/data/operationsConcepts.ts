import { ConceptTeaching } from '../types';
import { NODE_ID } from './operationsBasics';

export const OPERATIONS_CONCEPTS: Record<string, ConceptTeaching> = {
  'bottleneck-identification': {
    id: 'bottleneck-identification',
    trackId: 'operations',
    nodeId: NODE_ID,
    title: 'Finding the bottleneck in a process',
    whatItDoes:
      'In any multi-step process, the slowest step — the one with the least capacity — caps how much the whole process can produce, no matter how fast the other steps run. That slowest step is the bottleneck.',
    realWorldScenario:
      "You're running a small print shop with printing, cutting, and packaging stations, and customers are complaining about slow turnaround. Before buying a faster printer, you need to know whether printing is actually what's slowing everything down, or if it's cutting or packaging instead.",
    example: {
      scenarioPrompt: "A sandwich shop's line can prep 40 sandwiches/hour, toast 30/hour, and wrap 50/hour. What is the bottleneck?",
      targetLabel: 'Bottleneck step',
      answer: 'Toasting (30/hour)',
      resultExplanation:
        'The whole line can only move as fast as its slowest station. Toasting caps output at 30 sandwiches/hour even though prep and wrapping could go faster.',
    },
  },
  'throughput-calc': {
    id: 'throughput-calc',
    trackId: 'operations',
    nodeId: NODE_ID,
    title: 'Calculating throughput from cycle time',
    whatItDoes:
      'Throughput (units per hour) = 60 ÷ cycle time in minutes, where cycle time is how long one unit takes to complete at a given station. A faster cycle time per unit means more units per hour.',
    realWorldScenario:
      "You're staffing a fulfillment center and need to know how many packages one worker can pack per hour, so you can figure out how many workers you need to hit a daily shipping target.",
    example: {
      scenarioPrompt: 'A worker takes 3 minutes to pack one order. What is their throughput in orders per hour?',
      targetLabel: 'Throughput (orders/hr)',
      answer: '20 orders/hour',
      resultExplanation: 'Throughput = 60 ÷ cycle time = 60 ÷ 3 = 20 orders per hour.',
    },
  },
};
