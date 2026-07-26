import { ConceptTeaching } from '../types';
import { NODE_ID } from './consultingBasics';

export const CONSULTING_CONCEPTS: Record<string, ConceptTeaching> = {
  'profitability-framework': {
    id: 'profitability-framework',
    trackId: 'consulting',
    nodeId: NODE_ID,
    title: 'The profitability framework: Profit = Revenue − Cost',
    whatItDoes:
      'Most business-case questions boil down to breaking Profit into Revenue (Price × Volume) minus Costs (Fixed + Variable), then figuring out which piece moved.',
    realWorldScenario:
      "You're in a case interview and the interviewer says \"our client's profit dropped 20% last year — why?\" Before diagnosing anything, you first structure the problem into this equation so you know exactly which lever to investigate.",
    example: {
      scenarioPrompt: 'A client sells 10,000 units at $50 each. Total costs are $380,000. What is their profit?',
      targetLabel: 'Profit ($)',
      answer: '$120,000',
      resultExplanation:
        'Revenue = 10,000 × $50 = $500,000. Profit = Revenue − Costs = $500,000 − $380,000 = $120,000.',
    },
  },
  'framework-fit': {
    id: 'framework-fit',
    trackId: 'consulting',
    nodeId: NODE_ID,
    title: 'Picking the right framework to start a case',
    whatItDoes:
      'Different business problems call for different starting structures — profitability issues call for the profitability framework, "how big is this market" calls for market sizing, "should we do this" calls for a decision framework. Picking the wrong one wastes your first five minutes.',
    realWorldScenario:
      'In a real strategy engagement (or a case interview), the first move is choosing how to structure the problem before touching any numbers — pick wrong, and the whole analysis heads in the wrong direction.',
    example: {
      scenarioPrompt:
        'Prompt: "Our client\'s profits have declined sharply over the past 2 years even though sales volume is flat. What\'s going on?" Which framework fits best?',
      targetLabel: 'Best framework',
      answer: 'Profitability framework (Revenue vs. Cost breakdown)',
      resultExplanation:
        'Since volume is flat but profit fell, the issue is pricing, cost, or mix — exactly what the profitability framework is built to isolate.',
    },
  },
};
