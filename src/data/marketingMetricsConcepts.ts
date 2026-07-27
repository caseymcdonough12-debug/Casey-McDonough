import { ConceptTeaching } from '../types';
import { NODE_ID } from './marketingMetrics';

export const MARKETING_METRICS_CONCEPTS: Record<string, ConceptTeaching> = {
  cac: {
    id: 'cac',
    trackId: 'marketing',
    nodeId: NODE_ID,
    skillName: 'CAC (Customer Acquisition Cost)',
    whatItDoes: 'CAC is how much you spend, on average, to acquire one paying customer: CAC = Total Acquisition Spend ÷ New Customers Acquired.',
    jobRole: 'Growth Marketer',
    jobScenario:
      'Your CMO wants to know if a new ad channel is worth scaling, and CAC is the first number you check before increasing budget.',
    alsoAppliesIn: ['Performance Marketing Manager', 'Startup Founder', 'Marketing Analyst', 'Growth Product Manager'],
    example: {
      scenarioPrompt: 'A campaign spent $8,000 and acquired 160 new customers. What is the CAC?',
      targetLabel: 'CAC ($)',
      answer: '$50',
      resultExplanation: 'CAC = Spend ÷ New Customers = $8,000 ÷ 160 = $50.',
    },
  },
  ltv: {
    id: 'ltv',
    trackId: 'marketing',
    nodeId: NODE_ID,
    skillName: 'LTV (Customer Lifetime Value)',
    whatItDoes:
      'LTV estimates total revenue from one customer over their whole relationship with you: LTV = Average Purchase Value × Purchase Frequency (per year) × Average Customer Lifespan (years).',
    jobRole: 'Marketing Analyst',
    jobScenario:
      'Finance is deciding how much marketing budget to approve for next year and needs LTV to know how much a new customer is actually worth.',
    alsoAppliesIn: ['Growth Marketer', 'Startup Founder', 'CFO', 'Product Manager'],
    example: {
      scenarioPrompt: 'A customer spends $50 per purchase, buys 4 times a year, and stays a customer for 3 years on average. What is their LTV?',
      targetLabel: 'LTV ($)',
      answer: '$600',
      resultExplanation: 'LTV = Avg Purchase Value × Purchase Frequency × Lifespan = $50 × 4 × 3 = $600.',
    },
  },
  roas: {
    id: 'roas',
    trackId: 'marketing',
    nodeId: NODE_ID,
    skillName: 'ROAS (Return on Ad Spend)',
    whatItDoes:
      'ROAS measures revenue generated for every dollar spent on advertising: ROAS = Revenue from Ads ÷ Ad Spend. A ROAS of 4 means $4 back for every $1 spent.',
    jobRole: 'Performance Marketing Manager',
    jobScenario:
      "You're deciding whether to increase budget on a Facebook campaign, and ROAS tells you whether it's actually profitable to scale.",
    alsoAppliesIn: ['Growth Marketer', 'E-commerce Manager', 'CFO', 'Marketing Analyst'],
    example: {
      scenarioPrompt: 'A campaign spent $4,000 on ads and generated $18,000 in revenue. What is the ROAS?',
      targetLabel: 'ROAS (x)',
      answer: '4.5x',
      resultExplanation: 'ROAS = Revenue ÷ Ad Spend = $18,000 ÷ $4,000 = 4.5.',
    },
  },
};
