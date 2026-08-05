import { ConceptTeaching } from '../types';
import { NODE_ID } from './entrepreneurshipPitchDeck';

export const ENTREPRENEURSHIP_PITCH_DECK_CONCEPTS: Record<string, ConceptTeaching> = {
  'problem-solution': {
    id: 'problem-solution',
    trackId: 'startups',
    nodeId: NODE_ID,
    skillName: 'Problem/Solution Framing',
    whatItDoes:
      'A strong pitch names a specific, painful problem for a specific customer before presenting the solution — a vague problem makes investors doubt the solution matters.',
    depthNote:
      "Investors fund problems worth solving, not products they think are cool — if you can't state the pain in one sentence, they'll assume it isn't that painful.",
    scenarioBoxLabel: 'AS A FOUNDER',
    jobRole: 'Pitching for the First Time',
    jobScenario:
      "You're rewriting your pitch deck's second slide the night before a demo day and need the problem statement to land in one sentence.",
    alsoAppliesLabel: 'Also comes up when:',
    alsoAppliesIn: ['Writing your website homepage', 'Talking to your first customers', 'Applying to an accelerator', 'Recruiting a co-founder'],
    example: {
      scenarioPrompt: 'Which problem statement is investor-ready for a scheduling app aimed at freelance hair stylists?',
      targetLabel: 'Best problem statement',
      answer: '"Independent stylists lose an average of 5 hours a week to no-shows and phone-tag scheduling, with no easy way to collect a deposit up front."',
      resultExplanation:
        'It\'s specific (freelance stylists), quantified (5 hours/week), and names the exact pain — unlike a vague claim like "scheduling is hard for small businesses."',
    },
  },
  'traction-slide': {
    id: 'traction-slide',
    trackId: 'startups',
    nodeId: NODE_ID,
    skillName: 'Traction Slide',
    whatItDoes:
      "A traction slide should show the metric that best proves real demand for THIS stage of the company — pre-launch traction looks different from traction after a year of revenue.",
    depthNote:
      "Every stage of a startup has a different kind of proof — the trick is picking the one you actually have, not the one you wish you had.",
    scenarioBoxLabel: 'AS A FOUNDER',
    jobRole: 'Proving It Works',
    jobScenario:
      'You have no revenue yet and need to pick which early signal (waitlist size, pilot results, letters of intent) actually convinces investors you\'re onto something.',
    alsoAppliesLabel: 'Also comes up when:',
    alsoAppliesIn: ['Applying to an accelerator', 'Sending investor updates', 'Deciding what to measure first', 'Convincing a co-founder to join'],
    example: {
      scenarioPrompt: 'A pre-launch startup with no paying customers yet is building its traction slide. Which metric is the strongest choice?',
      targetLabel: 'Best traction metric',
      answer: 'A 4,000-person waitlist built organically in 3 weeks, with 30% opening every product update email',
      resultExplanation:
        'Without revenue yet, an engaged waitlist (size + organic growth + high open rate) is the clearest proof of real demand — stronger than a vague claim like "lots of interest."',
    },
  },
  'the-ask': {
    id: 'the-ask',
    trackId: 'startups',
    nodeId: NODE_ID,
    skillName: 'The Ask',
    whatItDoes:
      'The ask slide states how much you\'re raising, sized to cover a target runway: Raise Amount ≈ Monthly Burn × Target Runway Months.',
    depthNote:
      "Raise too little and you're back asking for money in six months; raise too much and you give away more of your company than you needed to.",
    scenarioBoxLabel: 'AS A FOUNDER',
    jobRole: 'Setting Your Raise',
    jobScenario:
      "You're finalizing your fundraising target and need a number that gives you enough runway to hit your next milestone without raising again too soon.",
    alsoAppliesLabel: 'Also comes up when:',
    alsoAppliesIn: ['Negotiating your valuation', 'Planning your hiring budget', 'Deciding when to raise again', 'Talking to a co-founder about spending'],
    example: {
      scenarioPrompt: 'A startup burns $40,000/month and wants 18 months of runway. How much should they raise?',
      targetLabel: 'Raise Amount ($)',
      answer: '$720,000',
      resultExplanation: 'Raise Amount = Monthly Burn × Target Runway = $40,000 × 18 = $720,000.',
    },
  },
};
