import { ConceptTeaching } from '../types';
import { NODE_ID } from './marketingBasics';

export const MARKETING_CONCEPTS: Record<string, ConceptTeaching> = {
  'channel-fit': {
    id: 'channel-fit',
    trackId: 'marketing',
    nodeId: NODE_ID,
    title: 'Matching a channel to your audience',
    whatItDoes:
      'Different marketing channels reach different audiences at different costs. Picking the channel that matches where your specific customer already pays attention beats spreading a small budget thin across everything.',
    realWorldScenario:
      "You have a limited budget to launch a product and have to decide where to spend it first — a B2B software founder chasing enterprise IT buyers on TikTok is a bad match, even though TikTok has huge reach overall.",
    example: {
      scenarioPrompt:
        "A B2B SaaS company sells project-management software to mid-size companies' IT directors. Which channel is the strongest first move?",
      targetLabel: 'Best channel',
      answer: 'LinkedIn ads / outreach',
      resultExplanation:
        'IT directors making B2B purchase decisions are concentrated on LinkedIn, where you can target by job title and company size directly — a much tighter match than a broad consumer platform.',
    },
  },
  'value-proposition': {
    id: 'value-proposition',
    trackId: 'marketing',
    nodeId: NODE_ID,
    title: "Writing a value proposition that's actually specific",
    whatItDoes:
      "A value proposition tells a specific customer the specific benefit they get and why it beats the alternative. Vague lines like \"quality you can trust\" don't tell anyone why to choose you over a competitor.",
    realWorldScenario:
      "You're writing the headline on a landing page or the first line of a pitch, and you have about three seconds to make someone understand why your product matters to them specifically.",
    example: {
      scenarioPrompt: 'Which is the stronger value proposition for a meal-kit delivery service?',
      targetLabel: 'Best value proposition',
      answer: '"Chef-designed dinners, ready in 20 minutes, with zero grocery trips."',
      resultExplanation:
        'It\'s specific: it names the benefit (fast, no shopping) for a clear person (someone who wants to cook but is short on time) — unlike "Delicious food delivered fresh," which could describe any restaurant or grocery delivery service.',
    },
  },
};
