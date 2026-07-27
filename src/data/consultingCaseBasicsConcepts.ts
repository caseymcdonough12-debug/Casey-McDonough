import { ConceptTeaching } from '../types';
import { NODE_ID } from './consultingCaseBasics';

export const CONSULTING_CASE_BASICS_CONCEPTS: Record<string, ConceptTeaching> = {
  'answer-first': {
    id: 'answer-first',
    trackId: 'consulting',
    nodeId: NODE_ID,
    skillName: 'Answer-First Synthesis',
    whatItDoes:
      'Consultants lead with the recommendation first, then support it — not build up to a conclusion at the end. Executives want the answer in the first sentence.',
    jobRole: 'Management Consultant',
    jobScenario:
      "You have 30 seconds in an elevator with the client's CEO and need to summarize your team's recommendation before the doors open.",
    alsoAppliesIn: ['Corporate Strategy Analyst', 'MBA Case Prep Coach', 'Product Strategist', 'Investment Banker'],
    example: {
      scenarioPrompt: 'Which summary is a stronger answer-first synthesis of a cost-cutting recommendation?',
      targetLabel: 'Best synthesis',
      answer: '"We recommend closing 3 underperforming stores, saving $2M annually — here\'s why."',
      resultExplanation:
        'It states the recommendation and impact immediately, then signals supporting detail follows — versus starting with background context and making the executive wait for the point.',
    },
  },
  mece: {
    id: 'mece',
    trackId: 'consulting',
    nodeId: NODE_ID,
    skillName: 'MECE',
    whatItDoes:
      "MECE means Mutually Exclusive, Collectively Exhaustive — breaking a problem into categories that don't overlap and don't miss anything, so an analysis doesn't double-count or leave gaps.",
    jobRole: 'Management Consultant',
    jobScenario:
      "You're building the first slide of an issue tree and need to check that your categories don't overlap before your team spends two weeks analyzing them.",
    alsoAppliesIn: ['Corporate Strategy Analyst', 'Product Strategist', 'MBA Case Prep Coach', 'Business Analyst'],
    example: {
      scenarioPrompt: 'Which breakdown of "reasons revenue declined" is MECE?',
      targetLabel: 'Best breakdown',
      answer: 'Price decline vs. Volume decline vs. Mix shift',
      resultExplanation:
        'These three categories don\'t overlap and together explain any change in revenue — unlike categories such as "pricing issues" and "competitive issues" which can overlap.',
    },
  },
  'hypothesis-driven': {
    id: 'hypothesis-driven',
    trackId: 'consulting',
    nodeId: NODE_ID,
    skillName: 'Hypothesis-Driven Approach',
    whatItDoes:
      'Instead of analyzing everything, consultants form a specific, testable hypothesis about the likely answer first, then gather only the data needed to prove or disprove it — saving weeks of unfocused analysis.',
    jobRole: 'Management Consultant',
    jobScenario:
      "Your team has one week to figure out why a client's plant is underperforming, and you can't analyze every possible cause — you need to pick the most likely one and test it first.",
    alsoAppliesIn: ['Corporate Strategy Analyst', 'Data Analyst', 'Product Strategist', 'MBA Case Prep Coach'],
    example: {
      scenarioPrompt: 'A client\'s online sales dropped sharply last month. Which is the strongest initial hypothesis to test first?',
      targetLabel: 'Best starting hypothesis',
      answer: '"Sales dropped because a site redesign launched last month broke the checkout flow on mobile."',
      resultExplanation:
        "It's specific, testable within a day, and tied to something that actually changed — rather than a vague guess like \"something about the website changed.\"",
    },
  },
};
