import { ConceptTeaching } from '../types';
import { NODE_ID } from './startupsBasics';

export const STARTUPS_CONCEPTS: Record<string, ConceptTeaching> = {
  'cac-ltv': {
    id: 'cac-ltv',
    trackId: 'startups',
    nodeId: NODE_ID,
    title: 'LTV:CAC ratio — is a customer worth what it costs to get them?',
    whatItDoes:
      'Customer Lifetime Value (LTV) is how much revenue a customer generates over their relationship with you. Customer Acquisition Cost (CAC) is what you spend to win them. The LTV:CAC ratio tells you whether your growth engine actually makes money — a healthy business usually targets 3:1 or higher.',
    realWorldScenario:
      "You're raising a seed round and an investor asks for your LTV:CAC ratio. If it's below 1:1, you're losing money on every customer you acquire no matter how fast you're growing — it's one of the first numbers any investor checks.",
    example: {
      scenarioPrompt:
        'A subscription app has an LTV of $600 per customer and spends $150 to acquire each one. What is the LTV:CAC ratio?',
      targetLabel: 'LTV:CAC ratio (x)',
      answer: '4x',
      resultExplanation:
        'LTV ÷ CAC = $600 ÷ $150 = 4. A 4:1 ratio is generally considered healthy — the customer generates 4x what it cost to acquire them.',
    },
  },
  runway: {
    id: 'runway',
    trackId: 'startups',
    nodeId: NODE_ID,
    title: 'Runway: how many months until the cash runs out',
    whatItDoes:
      "Runway = Cash in the bank ÷ Monthly burn rate. It tells you exactly how many months you have before you need to raise more money or become profitable.",
    realWorldScenario:
      "You're a founder deciding whether to hire two more engineers right now. Faster hiring means faster growth, but it also shortens your runway — you need to know if that trade-off still leaves enough time to hit your next milestone.",
    example: {
      scenarioPrompt: 'A startup has $300,000 in the bank and is burning $50,000 per month. How many months of runway do they have?',
      targetLabel: 'Runway (months)',
      answer: '6 months',
      resultExplanation: 'Runway = Cash ÷ Monthly burn = $300,000 ÷ $50,000 = 6 months.',
    },
  },
};
