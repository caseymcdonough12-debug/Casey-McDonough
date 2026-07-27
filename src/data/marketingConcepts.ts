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
  segmentation: {
    id: 'segmentation',
    trackId: 'marketing',
    nodeId: NODE_ID,
    title: 'Segmentation: who exactly are you targeting?',
    whatItDoes:
      "Segmentation splits a broad market into groups that share a trait — age, behavior, need — so you can tailor a message instead of speaking to everyone the same way. A message aimed at \"everyone\" usually resonates with no one.",
    realWorldScenario:
      "You're launching a product that could technically be used by anyone, but your ad budget is small. Segmentation forces you to pick which group to go after first, so your message actually lands instead of getting lost.",
    example: {
      scenarioPrompt:
        'A running-shoe brand has two customer groups: competitive marathoners chasing a faster time, and casual walkers who care about comfort. Which message fits the marathoner segment?',
      targetLabel: 'Best message',
      answer: '"Engineered for a faster split time, mile after mile."',
      resultExplanation:
        'It speaks directly to what that segment optimizes for — performance and time — not comfort. A single generic message would undersell both groups.',
    },
  },
  'funnel-stage': {
    id: 'funnel-stage',
    trackId: 'marketing',
    nodeId: NODE_ID,
    title: 'Funnel stage: awareness, consideration, or decision?',
    whatItDoes:
      "Buyers move through stages before they purchase: Awareness (they don't know you exist yet), Consideration (comparing you to alternatives), and Decision (ready to buy, just need a final push). Different tactics work at different stages.",
    realWorldScenario:
      "You're planning a campaign and have to choose between a broad brand-awareness video ad or a targeted discount code — using a decision-stage tactic on an awareness-stage audience wastes the budget.",
    example: {
      scenarioPrompt:
        "A new budgeting app runs a podcast ad introducing itself to listeners who've never heard of it. Which funnel stage is this tactic for?",
      targetLabel: 'Funnel stage',
      answer: 'Awareness',
      resultExplanation:
        "The audience doesn't know the product exists yet — a broad-reach ad that simply introduces the brand is squarely an Awareness-stage tactic.",
    },
  },
  'conversion-rate': {
    id: 'conversion-rate',
    trackId: 'marketing',
    nodeId: NODE_ID,
    title: 'Conversion rate: what share of visitors actually take action',
    whatItDoes:
      'Conversion rate is the percentage of people who take a desired action — buy, sign up, click — out of everyone who had the chance to. Conversion Rate = Conversions ÷ Total Visitors × 100.',
    realWorldScenario:
      "You're comparing two landing pages that got wildly different traffic. Raw signup counts don't tell you which page is actually more persuasive — conversion rate does.",
    example: {
      scenarioPrompt: 'A landing page got 2,000 visitors and 80 signups. What is the conversion rate?',
      targetLabel: 'Conversion Rate (%)',
      answer: '4%',
      resultExplanation: 'Conversion Rate = Conversions ÷ Visitors × 100 = 80 ÷ 2,000 × 100 = 4%.',
    },
  },
};
