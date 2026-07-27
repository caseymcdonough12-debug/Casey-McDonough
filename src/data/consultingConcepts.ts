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
  breakeven: {
    id: 'breakeven',
    trackId: 'consulting',
    nodeId: NODE_ID,
    title: 'Breakeven analysis: how many units until you stop losing money',
    whatItDoes:
      'Breakeven point is the number of units you need to sell before revenue covers all your costs. Breakeven Units = Fixed Costs ÷ (Price − Variable Cost per unit).',
    realWorldScenario:
      "You're launching a product and need to know how many units you actually have to sell before you're not just burning cash — this is one of the first numbers any investor or founder checks before committing to a launch.",
    example: {
      scenarioPrompt: 'A product has $50,000 in Fixed Costs, sells for $25, and costs $15 to produce. How many units must be sold to break even?',
      targetLabel: 'Breakeven Units',
      answer: '5,000 units',
      resultExplanation:
        'Breakeven Units = Fixed Costs ÷ (Price − Variable Cost) = $50,000 ÷ ($25 − $15) = $50,000 ÷ $10 = 5,000 units.',
    },
  },
  prioritization: {
    id: 'prioritization',
    trackId: 'consulting',
    nodeId: NODE_ID,
    title: 'The 80/20 rule: focus on what actually moves the needle',
    whatItDoes:
      'The Pareto principle observes that roughly 80% of outcomes often come from 20% of causes. In consulting, that means finding the small number of customers, products, or issues driving most of the result — and prioritizing those first.',
    realWorldScenario:
      'A client has 200 customer complaints and limited time to address them. Before assigning a team to fix all 200, you check whether a handful of root causes are actually driving most of the complaints — fixing those first has outsized impact.',
    example: {
      scenarioPrompt: "A retailer finds that 4 of its 50 stores generate 65% of total profit. What should the client prioritize?",
      targetLabel: 'Best prioritization',
      answer: "Study and replicate what's working at those 4 stores before spreading resources evenly across all 50",
      resultExplanation:
        "A small number of stores are driving most of the profit — understanding and replicating that advantage has far more leverage than spreading attention evenly across all 50.",
    },
  },
  'market-sizing': {
    id: 'market-sizing',
    trackId: 'consulting',
    nodeId: NODE_ID,
    title: 'Market sizing: estimating a number nobody has measured yet',
    whatItDoes:
      'Top-down market sizing estimates a market by starting from a big known number (population, total spend) and narrowing down with reasonable assumptions: Market Size = Population × Adoption % × Average Spend.',
    realWorldScenario:
      "A client wants to know how big the market is for a new product in a country with no existing sales data. You can't look it up, so you build a reasonable estimate from population and behavior assumptions instead.",
    example: {
      scenarioPrompt: 'A city has 2,000,000 people. Assume 5% would realistically buy a $40 product per year. What is the market size?',
      targetLabel: 'Market Size ($)',
      answer: '$4,000,000',
      resultExplanation: 'Market Size = Population × Adoption % × Price = 2,000,000 × 0.05 × $40 = $4,000,000.',
    },
  },
};
