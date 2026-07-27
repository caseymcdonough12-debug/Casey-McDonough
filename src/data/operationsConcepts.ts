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
  'inventory-turnover': {
    id: 'inventory-turnover',
    trackId: 'operations',
    nodeId: NODE_ID,
    title: 'Inventory turnover: how fast you sell through stock',
    whatItDoes:
      'Inventory turnover measures how many times a company sells and replaces its inventory over a period. Inventory Turnover = COGS ÷ Average Inventory. Higher turnover generally means less cash tied up sitting on shelves.',
    realWorldScenario:
      "You're comparing two retailers with similar revenue — one turns over inventory 12 times a year, the other only 3 times. The slower one has a lot more cash trapped in unsold stock, even if the top-line numbers look similar.",
    example: {
      scenarioPrompt: 'A retailer has $600,000 in COGS this year and an Average Inventory of $100,000. What is its inventory turnover?',
      targetLabel: 'Inventory Turnover (x)',
      answer: '6x',
      resultExplanation:
        'Inventory Turnover = COGS ÷ Average Inventory = $600,000 ÷ $100,000 = 6. The company sells through its entire inventory about 6 times a year.',
    },
  },
  'on-time-rate': {
    id: 'on-time-rate',
    trackId: 'operations',
    nodeId: NODE_ID,
    title: 'On-time delivery rate: are you keeping your promises?',
    whatItDoes:
      "On-Time Delivery Rate measures the percentage of orders that arrive by the promised date. On-Time Rate = On-Time Orders ÷ Total Orders × 100 — one of the most-watched metrics in any fulfillment operation.",
    realWorldScenario:
      "A retail partner deciding whether to keep working with your warehouse asks for your on-time delivery rate — one missed-deadline story matters far less than this single number across the whole quarter.",
    example: {
      scenarioPrompt: 'A warehouse shipped 2,000 orders last month, and 1,900 arrived on time. What is the on-time delivery rate?',
      targetLabel: 'On-Time Rate (%)',
      answer: '95%',
      resultExplanation: 'On-Time Rate = On-Time Orders ÷ Total Orders × 100 = 1,900 ÷ 2,000 × 100 = 95%.',
    },
  },
  'takt-time': {
    id: 'takt-time',
    trackId: 'operations',
    nodeId: NODE_ID,
    title: 'Takt time: the pace you must produce at to keep up with demand',
    whatItDoes:
      'Takt time is the maximum time allowed to produce one unit in order to keep up with customer demand. Takt Time = Available Production Time ÷ Customer Demand. Running slower than takt time means falling behind demand.',
    realWorldScenario:
      "You're planning a production line for the holiday season and need to know exactly how fast each station must work to avoid stockouts — takt time tells you the pace demand requires, independent of how fast you're currently running.",
    example: {
      scenarioPrompt: 'A factory has 480 minutes of production time per day and customers demand 240 units per day. What is the takt time?',
      targetLabel: 'Takt Time (min/unit)',
      answer: '2 min/unit',
      resultExplanation:
        'Takt Time = Available Time ÷ Demand = 480 minutes ÷ 240 units = 2 minutes per unit. Producing any slower than this and the line falls behind demand.',
    },
  },
};
