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
  'burn-multiple': {
    id: 'burn-multiple',
    trackId: 'startups',
    nodeId: NODE_ID,
    title: 'Burn multiple: how much cash you burn to grow',
    whatItDoes:
      'Burn Multiple measures how efficiently a startup turns cash spent into new recurring revenue. Burn Multiple = Net Burn ÷ Net New ARR. Under 1 is exceptional efficiency; under 2 is considered good.',
    realWorldScenario:
      "You're a founder raising a Series A and an investor asks how efficiently you're growing. Burn multiple answers that in one number, separate from your absolute growth rate.",
    example: {
      scenarioPrompt: 'A startup burned $2,000,000 in cash last year and added $1,000,000 in new ARR. What is its burn multiple?',
      targetLabel: 'Burn Multiple (x)',
      answer: '2x',
      resultExplanation:
        'Burn Multiple = Net Burn ÷ Net New ARR = $2,000,000 ÷ $1,000,000 = 2. It costs the company $2 of cash burn to add $1 of new recurring revenue.',
    },
  },
  dilution: {
    id: 'dilution',
    trackId: 'startups',
    nodeId: NODE_ID,
    title: 'Dilution: what a new funding round does to your ownership',
    whatItDoes:
      'When a startup raises money, it issues new shares, which shrinks everyone else\'s ownership percentage. New Ownership % = Old Ownership % × (Pre-Money ÷ Post-Money), where Post-Money = Pre-Money + Amount Raised.',
    realWorldScenario:
      "You own 10% of a startup and it raises a new round. Before signing off, you want to know exactly how much of that 10% you'll still hold afterward, since new investors' shares come from diluting existing owners.",
    example: {
      scenarioPrompt: 'A founder owns 20% of a company valued at $8,000,000 pre-money. The company raises $2,000,000. What is the founder\'s ownership after the raise?',
      targetLabel: 'New Ownership (%)',
      answer: '16%',
      resultExplanation:
        'Post-Money = $8,000,000 + $2,000,000 = $10,000,000. New Ownership = 20% × ($8,000,000 ÷ $10,000,000) = 16%.',
    },
  },
  'mrr-growth': {
    id: 'mrr-growth',
    trackId: 'startups',
    nodeId: NODE_ID,
    title: 'MRR growth rate: how fast recurring revenue is compounding',
    whatItDoes:
      'Monthly Recurring Revenue (MRR) growth rate measures how fast recurring revenue is increasing month over month. MRR Growth % = (Ending MRR − Starting MRR) ÷ Starting MRR × 100.',
    realWorldScenario:
      "Two startups might have the same MRR today, but if one is growing 3% a month and the other 15% a month, they're on completely different trajectories — growth rate is often what investors weight more than the current MRR number.",
    example: {
      scenarioPrompt: 'A startup had $50,000 in MRR last month and $56,000 this month. What is the MRR growth rate?',
      targetLabel: 'MRR Growth Rate (%)',
      answer: '12%',
      resultExplanation: 'MRR Growth % = (Ending − Starting) ÷ Starting × 100 = ($56,000 − $50,000) ÷ $50,000 × 100 = 12%.',
    },
  },
};
