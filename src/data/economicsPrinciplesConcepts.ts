import { ConceptTeaching } from '../types';
import { NODE_ID } from './economicsPrinciples';

export const ECONOMICS_PRINCIPLES_CONCEPTS: Record<string, ConceptTeaching> = {
  'supply-demand': {
    id: 'supply-demand',
    trackId: 'economics',
    nodeId: NODE_ID,
    skillName: 'Supply & Demand',
    whatItDoes:
      'When demand for a good increases while supply stays the same, price rises; when supply increases while demand stays the same, price falls — prices are the market\'s way of balancing the two.',
    jobRole: 'Retail Pricing Analyst',
    jobScenario:
      'A supplier shortage hits one of your products and you need to predict what happens to price and quantity sold before deciding whether to raise prices.',
    alsoAppliesIn: ['Product Manager', 'Policy Analyst', 'Small Business Owner', 'Real Estate Agent'],
    example: {
      scenarioPrompt:
        "A hurricane destroys part of the region's orange crop, sharply cutting the supply of oranges while demand stays the same. What happens to the price of oranges?",
      targetLabel: 'Most likely outcome',
      answer: 'Price rises',
      resultExplanation:
        'With supply down and demand unchanged, the same demand is chasing fewer oranges — price rises until the market reaches a new equilibrium.',
    },
  },
  'opportunity-cost': {
    id: 'opportunity-cost',
    trackId: 'economics',
    nodeId: NODE_ID,
    skillName: 'Opportunity Cost',
    whatItDoes:
      'Opportunity cost is the value of the next-best alternative you give up when you make a choice — every decision has a hidden cost beyond the sticker price.',
    jobRole: 'Business Owner',
    jobScenario:
      "You're deciding whether to use $50,000 in savings to expand your shop or leave it invested elsewhere, and you need to weigh what you're giving up either way.",
    alsoAppliesIn: ['Product Manager', 'Policy Analyst', 'Personal Finance Coach', 'Investor'],
    example: {
      scenarioPrompt:
        'You can invest $20,000 in your business for an expected $3,000 profit, or leave it in an index fund expected to return $2,200. What is the opportunity cost of expanding the business?',
      targetLabel: 'Opportunity Cost ($)',
      answer: '$2,200',
      resultExplanation:
        'Opportunity cost is the value of the next-best alternative given up — here, the $2,200 you would have earned from the index fund.',
    },
  },
  'price-elasticity': {
    id: 'price-elasticity',
    trackId: 'economics',
    nodeId: NODE_ID,
    skillName: 'Price Elasticity of Demand',
    whatItDoes:
      'Price elasticity measures how much quantity demanded changes when price changes: Elasticity = %Change in Quantity ÷ %Change in Price. Above 1 means demand is sensitive to price; below 1 means it isn\'t.',
    jobRole: 'Pricing Strategist',
    jobScenario:
      "You're deciding whether to raise prices 10% and need to know whether customers will cut back enough to hurt total revenue.",
    alsoAppliesIn: ['Product Manager', 'Retail Analyst', 'Economist', 'Revenue Manager'],
    example: {
      scenarioPrompt: 'A 10% price increase causes quantity demanded to fall by 20%. What is the price elasticity of demand (as a positive number)?',
      targetLabel: 'Elasticity',
      answer: '2',
      resultExplanation:
        'Elasticity = %ΔQuantity ÷ %ΔPrice = 20% ÷ 10% = 2. Since it\'s above 1, demand is elastic — quantity is quite sensitive to price.',
    },
  },
};
