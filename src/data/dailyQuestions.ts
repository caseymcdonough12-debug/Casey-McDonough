import { LessonQuestion, TrackId } from '../types';
import { createRng, pick, pickN, randInt, Rng } from '../utils/seededRandom';

export const DAILY_PRACTICE_NODE_ID = 'daily-practice';
export const QUESTIONS_PER_CONCEPT = 4;

type Generator = (rng: Rng, id: string) => LessonQuestion;

interface ScenarioTemplate {
  tier: 1 | 2 | 3 | 4 | 5;
  context?: string;
  scenarioTag?: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const generateScenarioQuestion =
  (pool: ScenarioTemplate[], conceptId: string): Generator =>
  (rng, id) => {
    const item = pick(rng, pool);
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId,
      kind: 'multipleChoice',
      difficultyTier: item.tier,
      scenarioTag: item.scenarioTag,
      context: item.context,
      prompt: item.prompt,
      options: item.options,
      correctOptionId: item.correctOptionId,
      explanation: item.explanation,
    };
  };

const BUSINESS_NOUNS = ['bakery', 'design studio', 'hardware store', 'auto shop', 'gym', 'salon', 'bookstore'];

// ---------------------------------------------------------------------------
// Finance: reading a P&L / balance sheet / cash flow statement (numeric)
// ---------------------------------------------------------------------------

const generatePlReadingQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const revenue = randInt(rng, 40, 400) * 1000;
  const netIncome = randInt(rng, 5, 60) * 1000;
  const expenses = revenue - netIncome;
  const solveFor = pick(rng, ['income', 'expenses'] as const);

  if (solveFor === 'income') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'pl-reading',
      kind: 'numeric',
      difficultyTier: 1,
      scenarioTag: 'Your manager asks:',
      prompt: `Here's this month's P&L for a ${business}. Revenue is $${revenue.toLocaleString()} and Total Expenses are $${expenses.toLocaleString()}. What's Net Income?`,
      targetLabel: 'Net Income ($)',
      correctValue: netIncome,
      tolerance: 1,
      explanation: `Net Income = Revenue − Total Expenses = $${revenue.toLocaleString()} − $${expenses.toLocaleString()} = $${netIncome.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'pl-reading',
    kind: 'numeric',
    difficultyTier: 2,
    scenarioTag: 'A client asks:',
    prompt: `Our Net Income was $${netIncome.toLocaleString()} and Revenue was $${revenue.toLocaleString()} this month. What were our Total Expenses?`,
    targetLabel: 'Total Expenses ($)',
    correctValue: expenses,
    tolerance: 1,
    explanation: `Total Expenses = Revenue − Net Income = $${revenue.toLocaleString()} − $${netIncome.toLocaleString()} = $${expenses.toLocaleString()}.`,
  };
};

const generateBalanceSheetReadingQuestion: Generator = (rng, id) => {
  const liabilities = randInt(rng, 20, 200) * 1000;
  const equity = randInt(rng, 20, 300) * 1000;
  const assets = liabilities + equity;
  const solveFor = pick(rng, ['equity', 'assets'] as const);

  if (solveFor === 'equity') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'balance-sheet-reading',
      kind: 'numeric',
      difficultyTier: 3,
      scenarioTag: 'Your manager asks:',
      prompt: `Check this balance sheet — Assets are $${assets.toLocaleString()} and Liabilities are $${liabilities.toLocaleString()}. What is Equity?`,
      targetLabel: 'Equity ($)',
      correctValue: equity,
      tolerance: 1,
      explanation: `Equity = Assets − Liabilities = $${assets.toLocaleString()} − $${liabilities.toLocaleString()} = $${equity.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'balance-sheet-reading',
    kind: 'numeric',
    difficultyTier: 4,
    scenarioTag: 'An investor asks:',
    prompt: `This company reports $${equity.toLocaleString()} in Equity and $${liabilities.toLocaleString()} in Liabilities. What are total Assets?`,
    targetLabel: 'Assets ($)',
    correctValue: assets,
    tolerance: 1,
    explanation: `Assets = Liabilities + Equity = $${liabilities.toLocaleString()} + $${equity.toLocaleString()} = $${assets.toLocaleString()}.`,
  };
};

const generateCashFlowReadingQuestion: Generator = (rng, id) => {
  const beginningCash = randInt(rng, 20, 100) * 1000;
  const operating = randInt(rng, 10, 60) * 1000;
  const investing = randInt(rng, 5, 40) * 1000;
  const financing = randInt(rng, 0, 20) * 1000;
  const endingCash = beginningCash + operating - investing + financing;
  const solveFor = pick(rng, ['ending', 'investing'] as const);

  if (solveFor === 'ending') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'cash-flow-reading',
      kind: 'numeric',
      difficultyTier: 4,
      scenarioTag: 'Your CFO asks:',
      prompt: `Beginning Cash was $${beginningCash.toLocaleString()}. Operating activities added $${operating.toLocaleString()}, Investing activities used $${investing.toLocaleString()}, and Financing activities added $${financing.toLocaleString()}. What is Ending Cash?`,
      targetLabel: 'Ending Cash ($)',
      correctValue: endingCash,
      tolerance: 1,
      explanation: `Ending Cash = Beginning + Operating + Financing − Investing = $${beginningCash.toLocaleString()} + $${operating.toLocaleString()} + $${financing.toLocaleString()} − $${investing.toLocaleString()} = $${endingCash.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'cash-flow-reading',
    kind: 'numeric',
    difficultyTier: 5,
    scenarioTag: 'An auditor asks:',
    prompt: `Ending Cash came out to $${endingCash.toLocaleString()}. Beginning Cash was $${beginningCash.toLocaleString()}, Operating added $${operating.toLocaleString()}, and Financing added $${financing.toLocaleString()}. How much cash did Investing activities use?`,
    targetLabel: 'Investing Activities Used ($)',
    correctValue: investing,
    tolerance: 1,
    explanation: `Investing Used = Beginning + Operating + Financing − Ending = $${beginningCash.toLocaleString()} + $${operating.toLocaleString()} + $${financing.toLocaleString()} − $${endingCash.toLocaleString()} = $${investing.toLocaleString()}.`,
  };
};

// ---------------------------------------------------------------------------
// Personal Finance: 50/30/20 / emergency fund / compound growth (numeric)
// ---------------------------------------------------------------------------

const generate503020Question: Generator = (rng, id) => {
  const takeHome = randInt(rng, 20, 80) * 100;
  const bucket = pick(rng, ['needs', 'wants', 'savings'] as const);
  const pct = bucket === 'needs' ? 0.5 : bucket === 'wants' ? 0.3 : 0.2;
  const label = bucket === 'needs' ? 'Needs (50%)' : bucket === 'wants' ? 'Wants (30%)' : 'Savings/Debt (20%)';
  const value = Math.round(takeHome * pct);
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'rule-50-30-20',
    kind: 'numeric',
    difficultyTier: bucket === 'needs' ? 1 : 2,
    scenarioTag: 'A friend asks:',
    prompt: `I take home $${takeHome.toLocaleString()} a month — how much should go to ${bucket === 'savings' ? 'Savings/Debt Payoff' : bucket === 'needs' ? 'Needs' : 'Wants'} under the 50/30/20 rule?`,
    targetLabel: `${label} ($)`,
    correctValue: value,
    tolerance: 1,
    explanation: `${Math.round(pct * 100)}% of $${takeHome.toLocaleString()} = $${value.toLocaleString()}.`,
  };
};

const generateEmergencyFundQuestion: Generator = (rng, id) => {
  const expenses = randInt(rng, 15, 50) * 100;
  const months = randInt(rng, 3, 9);
  const fund = expenses * months;
  const solveFor = pick(rng, ['fund', 'maxExpenses'] as const);

  if (solveFor === 'fund') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'emergency-fund',
      kind: 'numeric',
      difficultyTier: 2,
      scenarioTag: 'A friend asks:',
      prompt: `My essential expenses are $${expenses.toLocaleString()}/month and I want ${months} months of coverage. How big should my emergency fund be?`,
      targetLabel: 'Emergency Fund ($)',
      correctValue: fund,
      tolerance: 1,
      explanation: `Emergency Fund = Monthly Expenses × Months = $${expenses.toLocaleString()} × ${months} = $${fund.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'emergency-fund',
    kind: 'numeric',
    difficultyTier: 3,
    scenarioTag: 'A friend asks:',
    prompt: `I have $${fund.toLocaleString()} saved and want that to cover ${months} months of expenses. What's the maximum monthly expense that covers?`,
    targetLabel: 'Max Monthly Expenses ($)',
    correctValue: expenses,
    tolerance: 1,
    explanation: `Max Monthly Expenses = Fund ÷ Months = $${fund.toLocaleString()} ÷ ${months} = $${expenses.toLocaleString()}.`,
  };
};

const generateCompoundGrowthQuestion: Generator = (rng, id) => {
  const principal = randInt(rng, 30, 150) * 100;
  const ratePct = randInt(rng, 3, 12);
  const years = randInt(rng, 2, 3);
  const futureValue = Math.round(principal * Math.pow(1 + ratePct / 100, years));
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'compound-growth',
    kind: 'numeric',
    difficultyTier: years === 2 ? 3 : 5,
    scenarioTag: 'A friend asks:',
    prompt: `$${principal.toLocaleString()} grows at ${ratePct}% per year for ${years} years. What is the Future Value (rounded to the nearest dollar)?`,
    targetLabel: 'Future Value ($)',
    correctValue: futureValue,
    tolerance: Math.max(2, Math.round(futureValue * 0.005)),
    explanation: `Future Value = $${principal.toLocaleString()} × (1.${String(ratePct).padStart(2, '0')})^${years} ≈ $${futureValue.toLocaleString()}.`,
  };
};

// ---------------------------------------------------------------------------
// Economics: supply & demand (pool) / opportunity cost (numeric) / elasticity (numeric)
// ---------------------------------------------------------------------------

const SUPPLY_DEMAND_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    scenarioTag: 'A retail buyer asks:',
    context: 'A popular toy manufacturer doubles its production capacity for the holiday season, while demand for the toy stays about the same.',
    prompt: "What happens to the toy's price?",
    options: [
      { id: 'a', text: 'Price falls' },
      { id: 'b', text: 'Price rises' },
      { id: 'c', text: 'Price stays exactly the same' },
      { id: 'd', text: 'Impossible to say' },
    ],
    correctOptionId: 'a',
    explanation: 'More supply chasing the same demand pushes price down until the market clears the extra units.',
  },
  {
    tier: 3,
    scenarioTag: 'A market analyst asks:',
    context: 'A new health study causes a sudden surge in demand for a supplement, while its supply stays fixed in the short term.',
    prompt: 'What happens to price and quantity sold?',
    options: [
      { id: 'a', text: 'Price rises, quantity sold rises' },
      { id: 'b', text: 'Price falls, quantity sold falls' },
      { id: 'c', text: 'Price rises, quantity sold falls' },
      { id: 'd', text: 'Both stay the same' },
    ],
    correctOptionId: 'a',
    explanation: 'A demand surge against fixed supply pushes price up, and the market still clears more units than before along the new equilibrium.',
  },
  {
    tier: 2,
    scenarioTag: 'A grower asks:',
    context: 'A drought sharply cuts the regional wheat harvest, while demand for bread stays the same.',
    prompt: 'What happens to the price of wheat?',
    options: [
      { id: 'a', text: 'Price rises' },
      { id: 'b', text: 'Price falls' },
      { id: 'c', text: 'Price stays exactly the same' },
      { id: 'd', text: 'Impossible to say' },
    ],
    correctOptionId: 'a',
    explanation: 'With supply down and demand unchanged, the same demand is chasing less wheat — price rises.',
  },
];

const generateOpportunityCostQuestion: Generator = (rng, id) => {
  const chosen = randInt(rng, 5, 30) * 1000;
  const nextBest = chosen - randInt(rng, 5, 25) * 100;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'opportunity-cost',
    kind: 'numeric',
    difficultyTier: 3,
    scenarioTag: 'Your CFO asks:',
    prompt: `We're deciding between Investment A (expected profit $${chosen.toLocaleString()}) and Investment B (expected profit $${nextBest.toLocaleString()}). If we pick Investment A, what's the opportunity cost of that decision?`,
    targetLabel: 'Opportunity Cost ($)',
    correctValue: nextBest,
    tolerance: 1,
    explanation: `The opportunity cost of choosing A is the value given up from the next-best alternative, B: $${nextBest.toLocaleString()}.`,
  };
};

const generateElasticityQuestion: Generator = (rng, id) => {
  const priceChangePct = randInt(rng, 2, 10);
  const elasticity = randInt(rng, 15, 35) / 10;
  const quantityChangePct = Math.round(priceChangePct * elasticity * 10) / 10;
  const solveFor = pick(rng, ['elasticity', 'quantity'] as const);

  if (solveFor === 'elasticity') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'price-elasticity',
      kind: 'numeric',
      difficultyTier: 4,
      prompt: `A ${priceChangePct}% price increase causes quantity demanded to fall by ${quantityChangePct}%. What is the price elasticity of demand?`,
      targetLabel: 'Elasticity',
      correctValue: elasticity,
      tolerance: 0.1,
      explanation: `Elasticity = %ΔQuantity ÷ %ΔPrice = ${quantityChangePct}% ÷ ${priceChangePct}% = ${elasticity}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'price-elasticity',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A product has a price elasticity of demand of ${elasticity}. If price rises by ${priceChangePct}%, what percent drop in quantity demanded would you expect?`,
    targetLabel: 'Quantity Change (%)',
    unit: '%',
    correctValue: quantityChangePct,
    tolerance: 0.2,
    explanation: `Expected %ΔQuantity = Elasticity × %ΔPrice = ${elasticity} × ${priceChangePct}% = ${quantityChangePct}%.`,
  };
};

// ---------------------------------------------------------------------------
// Accounting: debit/credit (templates) / journal entries (pool) / equation (numeric)
// ---------------------------------------------------------------------------

interface DebitCreditTemplate {
  tier: 1 | 2 | 3 | 4 | 5;
  build: (amt: number) => { context: string; prompt: string; correct: 'debit' | 'credit'; explanation: string };
}

const DEBIT_CREDIT_TEMPLATES: DebitCreditTemplate[] = [
  {
    tier: 1,
    build: (amt) => ({
      context: `A customer pays $${amt.toLocaleString()} cash for services.`,
      prompt: 'How does this affect the Cash account (an Asset)?',
      correct: 'debit',
      explanation: `Assets increase with a debit, so Cash is debited $${amt.toLocaleString()}.`,
    }),
  },
  {
    tier: 2,
    build: (amt) => ({
      context: `A company takes out a $${amt.toLocaleString()} bank loan.`,
      prompt: 'How does this affect the Loan Payable account (a Liability)?',
      correct: 'credit',
      explanation: `Liabilities increase with a credit, so Loan Payable is credited $${amt.toLocaleString()}.`,
    }),
  },
  {
    tier: 3,
    build: (amt) => ({
      context: `The company pays $${amt.toLocaleString()} cash toward an existing loan.`,
      prompt: 'How does this affect the Cash account (an Asset)?',
      correct: 'credit',
      explanation: `Cash is decreasing, and assets decrease with a credit, so Cash is credited $${amt.toLocaleString()}.`,
    }),
  },
];

const generateDebitCreditQuestion: Generator = (rng, id) => {
  const template = pick(rng, DEBIT_CREDIT_TEMPLATES);
  const amt = randInt(rng, 1, 50) * 100;
  const built = template.build(amt);
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'debit-credit',
    kind: 'multipleChoice',
    difficultyTier: template.tier,
    context: built.context,
    prompt: built.prompt,
    options: [
      { id: 'debit', text: 'Debit' },
      { id: 'credit', text: 'Credit' },
    ],
    correctOptionId: built.correct,
    explanation: built.explanation,
  };
};

const JOURNAL_ENTRY_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    scenarioTag: 'Your controller asks:',
    context: "The company pays $1,200 cash for this month's rent.",
    prompt: 'Which journal entry is correct?',
    options: [
      { id: 'a', text: 'Debit Rent Expense $1,200 / Credit Cash $1,200' },
      { id: 'b', text: 'Debit Cash $1,200 / Credit Rent Expense $1,200' },
      { id: 'c', text: 'Debit Rent Expense $1,200 / Credit Accounts Payable $1,200' },
      { id: 'd', text: 'Debit Cash $1,200 / Credit Accounts Payable $1,200' },
    ],
    correctOptionId: 'a',
    explanation: 'Rent Expense increases with a debit, and Cash (an asset) decreases with a credit since cash left the business.',
  },
  {
    tier: 4,
    scenarioTag: 'Your controller asks:',
    context: 'The company provides $5,000 of services to a client on credit (the client will pay later).',
    prompt: 'Which journal entry is correct?',
    options: [
      { id: 'a', text: 'Debit Accounts Receivable $5,000 / Credit Revenue $5,000' },
      { id: 'b', text: 'Debit Revenue $5,000 / Credit Accounts Receivable $5,000' },
      { id: 'c', text: 'Debit Cash $5,000 / Credit Revenue $5,000' },
      { id: 'd', text: 'Debit Accounts Receivable $5,000 / Credit Cash $5,000' },
    ],
    correctOptionId: 'a',
    explanation: 'No cash changed hands yet, so Accounts Receivable is debited to reflect money owed, and Revenue is credited since the service was earned.',
  },
  {
    tier: 3,
    scenarioTag: 'A bookkeeper asks:',
    context: 'The company buys $3,000 of office supplies with cash.',
    prompt: 'Which journal entry is correct?',
    options: [
      { id: 'a', text: 'Debit Office Supplies $3,000 / Credit Cash $3,000' },
      { id: 'b', text: 'Debit Cash $3,000 / Credit Office Supplies $3,000' },
      { id: 'c', text: 'Debit Office Supplies $3,000 / Credit Accounts Payable $3,000' },
      { id: 'd', text: 'Debit Accounts Payable $3,000 / Credit Cash $3,000' },
    ],
    correctOptionId: 'a',
    explanation: 'Office Supplies (an asset) increases with a debit; Cash (also an asset) decreases with a credit since it was paid in cash.',
  },
];

const generateAccountingEquationQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const liabilities = randInt(rng, 10, 200) * 1000;
  const equity = randInt(rng, 10, 300) * 1000;
  const assets = liabilities + equity;
  const solveFor = pick(rng, ['equity', 'assets'] as const);

  if (solveFor === 'equity') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'accounting-equation',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A ${business} has $${assets.toLocaleString()} in Assets and $${liabilities.toLocaleString()} in Liabilities. What is its Equity?`,
      targetLabel: 'Equity ($)',
      correctValue: equity,
      tolerance: 0.5,
      explanation: `Equity = Assets − Liabilities = $${assets.toLocaleString()} − $${liabilities.toLocaleString()} = $${equity.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'accounting-equation',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A ${business} has $${equity.toLocaleString()} in Equity and $${liabilities.toLocaleString()} in Liabilities. What are its total Assets?`,
    targetLabel: 'Assets ($)',
    correctValue: assets,
    tolerance: 0.5,
    explanation: `Assets = Liabilities + Equity = $${liabilities.toLocaleString()} + $${equity.toLocaleString()} = $${assets.toLocaleString()}.`,
  };
};

// ---------------------------------------------------------------------------
// Entrepreneurship: problem/solution (pool) / traction slide (pool) / the ask (numeric)
// ---------------------------------------------------------------------------

const PROBLEM_SOLUTION_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    scenarioTag: 'Your co-founder asks:',
    context: "You're pitching a meal-prep app for busy parents.",
    prompt: 'Which problem statement is strongest?',
    options: [
      { id: 'a', text: 'Cooking is hard for busy people' },
      { id: 'b', text: 'Parents working 50+ hour weeks spend an average of 45 minutes a day just deciding what to cook, on top of prep time' },
      { id: 'c', text: 'Nobody likes cooking after work' },
      { id: 'd', text: 'Food is expensive these days' },
    ],
    correctOptionId: 'b',
    explanation: "It's specific and quantified — a concrete, provable pain point, not a generic complaint.",
  },
  {
    tier: 3,
    scenarioTag: 'An investor asks:',
    context: "You're pitching a compliance-tracking tool for small medical clinics.",
    prompt: 'Which problem statement is strongest?',
    options: [
      { id: 'a', text: 'Compliance is important for clinics' },
      { id: 'b', text: 'Small clinics fail an average of 2.3 compliance checks per audit, risking fines that average $18,000 per violation' },
      { id: 'c', text: 'Healthcare has a lot of paperwork' },
      { id: 'd', text: 'Clinics want to avoid getting in trouble' },
    ],
    correctOptionId: 'b',
    explanation: 'It quantifies both the frequency of the problem and the financial stakes — investors can size the pain in dollars.',
  },
];

const TRACTION_SLIDE_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    scenarioTag: 'An advisor asks:',
    context: 'A B2B SaaS startup has run a 3-month paid pilot with one enterprise customer.',
    prompt: 'Which traction metric is strongest for the slide?',
    options: [
      { id: 'a', text: 'The pilot customer renewed and expanded their contract by 40% after the trial' },
      { id: 'b', text: 'The founders think the product is great' },
      { id: 'c', text: 'They have a logo on their website' },
      { id: 'd', text: 'They posted about it on social media once' },
    ],
    correctOptionId: 'a',
    explanation: 'A renewal plus expansion from a real paying customer is concrete proof the product delivers value.',
  },
  {
    tier: 4,
    scenarioTag: 'A VC asks:',
    context: 'A consumer app has been live for 6 months with 50,000 downloads but declining weekly active users.',
    prompt: 'Which traction metric should the founder lead with?',
    options: [
      { id: 'a', text: 'Total downloads (50,000)' },
      { id: 'b', text: 'Week-over-week retention rate, even though it shows a decline that needs addressing' },
      { id: 'c', text: 'Number of employees hired' },
      { id: 'd', text: 'Total dollars spent on marketing' },
    ],
    correctOptionId: 'b',
    explanation: 'Sophisticated investors care about retention, not vanity download counts.',
  },
];

const generateTheAskQuestion: Generator = (rng, id) => {
  const burn = randInt(rng, 10, 80) * 1000;
  const months = randInt(rng, 6, 24);
  const raise = burn * months;
  const solveFor = pick(rng, ['raise', 'maxBurn'] as const);

  if (solveFor === 'raise') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'the-ask',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A startup burns $${burn.toLocaleString()}/month and wants ${months} months of runway. How much should they raise?`,
      targetLabel: 'Raise Amount ($)',
      correctValue: raise,
      tolerance: 1,
      explanation: `Raise Amount = Monthly Burn × Target Runway = $${burn.toLocaleString()} × ${months} = $${raise.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'the-ask',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A startup wants to raise $${raise.toLocaleString()} to cover ${months} months of runway. What is the maximum monthly burn that supports?`,
    targetLabel: 'Max Monthly Burn ($)',
    correctValue: burn,
    tolerance: 1,
    explanation: `Max Monthly Burn = Raise Amount ÷ Target Runway = $${raise.toLocaleString()} ÷ ${months} = $${burn.toLocaleString()}.`,
  };
};

// ---------------------------------------------------------------------------
// Consulting: answer-first / MECE / hypothesis-driven (all scenario pools)
// ---------------------------------------------------------------------------

const ANSWER_FIRST_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    scenarioTag: 'Your engagement manager asks:',
    context: "You've finished analyzing why a retailer's profits declined.",
    prompt: 'Which opening line is the strongest answer-first synthesis?',
    options: [
      { id: 'a', text: 'So we looked at a lot of data over the past few weeks and found some interesting things...' },
      { id: 'b', text: 'Profit declined because online competitors cut prices 15% — we recommend matching prices on our top 20 SKUs to recover $3M in annual margin' },
      { id: 'c', text: 'Let me walk you through our full analysis before getting to conclusions' },
      { id: 'd', text: 'There are many factors that could be contributing to this issue' },
    ],
    correctOptionId: 'b',
    explanation: 'It states the cause, the recommendation, and the dollar impact immediately.',
  },
  {
    tier: 3,
    scenarioTag: 'A partner asks:',
    context: "You need to summarize a go/no-go recommendation on an acquisition to the client's board.",
    prompt: 'Which opening line is strongest?',
    options: [
      { id: 'a', text: 'We recommend proceeding with the acquisition at the proposed price — it adds $50M in annual synergies within 2 years' },
      { id: 'b', text: 'Acquisitions are complex and there are many considerations' },
      { id: 'c', text: 'We looked at synergies, risks, and valuation across several scenarios' },
      { id: 'd', text: "Let's start with some background on the target company" },
    ],
    correctOptionId: 'a',
    explanation: 'It leads with the recommendation and the key number — a board wants the decision first, details second.',
  },
];

const MECE_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    scenarioTag: 'Your team lead asks:',
    context: 'You are structuring an issue tree for "why did customer churn increase."',
    prompt: 'Which breakdown is MECE?',
    options: [
      { id: 'a', text: 'Product issues vs. Price issues vs. Service issues vs. Competitive issues (these can overlap)' },
      { id: 'b', text: "Churn from existing dissatisfaction vs. churn from a competitor's better offer vs. churn from customers whose need disappeared entirely" },
      { id: 'c', text: 'Bad customers vs. good customers' },
      { id: 'd', text: "Marketing's fault vs. product's fault" },
    ],
    correctOptionId: 'b',
    explanation: 'Each category is a distinct, non-overlapping reason a customer would leave, and together they cover essentially all reasons.',
  },
  {
    tier: 4,
    scenarioTag: 'A client asks:',
    context: 'You are structuring "how can we cut costs" for a manufacturing client.',
    prompt: 'Which breakdown is MECE?',
    options: [
      { id: 'a', text: 'Labor costs vs. Material costs vs. Overhead costs vs. Everything else' },
      { id: 'b', text: 'Fixed costs vs. Variable costs' },
      { id: 'c', text: 'Cutting people vs. cutting perks vs. cutting benefits (these overlap heavily)' },
      { id: 'd', text: 'Cost-cutting ideas from finance vs. ideas from operations' },
    ],
    correctOptionId: 'b',
    explanation: 'Every cost in a business is either fixed or variable, with no overlap — a clean MECE split.',
  },
];

const HYPOTHESIS_DRIVEN_POOL: ScenarioTemplate[] = [
  {
    tier: 3,
    scenarioTag: 'Your manager asks:',
    context: "A restaurant chain's same-store sales dropped 8% last quarter, right after a new regional competitor opened nearby.",
    prompt: 'Which is the strongest first hypothesis to test?',
    options: [
      { id: 'a', text: 'Something is generally wrong with our restaurants' },
      { id: 'b', text: 'The new competitor is pulling customers away, especially during their overlapping peak hours' },
      { id: 'c', text: "People just don't like eating out as much anymore" },
      { id: 'd', text: 'We should investigate every possible cause equally before forming any hypothesis' },
    ],
    correctOptionId: 'b',
    explanation: "It's specific, tied to a real recent change, and testable by checking whether the drop concentrates around overlapping hours/locations.",
  },
  {
    tier: 5,
    scenarioTag: 'A partner asks:',
    context: "A SaaS client's churn spiked specifically among customers on their cheapest pricing tier, right after a support-team restaffing.",
    prompt: 'Which is the strongest first hypothesis to test?',
    options: [
      { id: 'a', text: 'The cheap-tier customers were never going to stay long-term anyway' },
      { id: 'b', text: 'Support response times for the cheapest tier got worse after the restaffing, driving those specific customers to leave' },
      { id: 'c', text: 'The whole product must be declining in quality' },
      { id: 'd', text: 'We should survey every customer before hypothesizing anything' },
    ],
    correctOptionId: 'b',
    explanation: 'It links two facts that actually happened together into one specific, testable cause.',
  },
];

// ---------------------------------------------------------------------------
// Marketing: CAC / LTV / ROAS (numeric)
// ---------------------------------------------------------------------------

const generateCacQuestion: Generator = (rng, id) => {
  const customers = randInt(rng, 50, 500);
  const cac = randInt(rng, 20, 100);
  const spend = customers * cac;
  const solveFor = pick(rng, ['cac', 'customers'] as const);

  if (solveFor === 'cac') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'cac',
      kind: 'numeric',
      difficultyTier: 1,
      scenarioTag: 'Your CMO asks:',
      prompt: `We spent $${spend.toLocaleString()} on this campaign and it brought in ${customers.toLocaleString()} new customers. What's our CAC?`,
      targetLabel: 'CAC ($)',
      correctValue: cac,
      tolerance: 0.5,
      explanation: `CAC = Spend ÷ New Customers = $${spend.toLocaleString()} ÷ ${customers.toLocaleString()} = $${cac}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'cac',
    kind: 'numeric',
    difficultyTier: 2,
    scenarioTag: 'Your CMO asks:',
    prompt: `We want to keep CAC at $${cac} and have a $${spend.toLocaleString()} budget for this channel. How many new customers do we need to hit that CAC?`,
    targetLabel: 'Required New Customers',
    correctValue: customers,
    tolerance: 1,
    explanation: `Required Customers = Budget ÷ Target CAC = $${spend.toLocaleString()} ÷ $${cac} = ${customers.toLocaleString()}.`,
  };
};

const generateLtvQuestion: Generator = (rng, id) => {
  const avgPurchase = randInt(rng, 20, 150);
  const frequency = randInt(rng, 2, 6);
  const lifespan = randInt(rng, 2, 5);
  const ltv = avgPurchase * frequency * lifespan;
  const solveFor = pick(rng, ['ltv', 'avgPurchase'] as const);

  if (solveFor === 'ltv') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'ltv',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A customer spends $${avgPurchase} per purchase, buys ${frequency} times a year, and stays a customer for ${lifespan} years. What is their LTV?`,
      targetLabel: 'LTV ($)',
      correctValue: ltv,
      tolerance: 1,
      explanation: `LTV = Avg Purchase Value × Purchase Frequency × Lifespan = $${avgPurchase} × ${frequency} × ${lifespan} = $${ltv.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'ltv',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: `A product has an LTV of $${ltv.toLocaleString()}, with customers buying ${frequency} times a year for an average of ${lifespan} years. What is the average purchase value?`,
    targetLabel: 'Avg Purchase Value ($)',
    correctValue: avgPurchase,
    tolerance: 0.5,
    explanation: `Avg Purchase Value = LTV ÷ (Frequency × Lifespan) = $${ltv.toLocaleString()} ÷ (${frequency} × ${lifespan}) = $${avgPurchase}.`,
  };
};

const generateRoasQuestion: Generator = (rng, id) => {
  const adSpend = randInt(rng, 10, 100) * 100;
  const roas = randInt(rng, 2, 8);
  const revenue = adSpend * roas;
  const solveFor = pick(rng, ['roas', 'maxSpend'] as const);

  if (solveFor === 'roas') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'roas',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A campaign spent $${adSpend.toLocaleString()} on ads and generated $${revenue.toLocaleString()} in revenue. What is the ROAS?`,
      targetLabel: 'ROAS (x)',
      unit: 'x',
      correctValue: roas,
      tolerance: 0.1,
      explanation: `ROAS = Revenue ÷ Ad Spend = $${revenue.toLocaleString()} ÷ $${adSpend.toLocaleString()} = ${roas}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'roas',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A team wants a ROAS of at least ${roas} and expects $${revenue.toLocaleString()} in ad revenue. What is the maximum ad spend that still hits that ROAS?`,
    targetLabel: 'Max Ad Spend ($)',
    correctValue: adSpend,
    tolerance: 1,
    explanation: `Max Ad Spend = Revenue ÷ Target ROAS = $${revenue.toLocaleString()} ÷ ${roas} = $${adSpend.toLocaleString()}.`,
  };
};

// ---------------------------------------------------------------------------
// Operations: process sequencing (pool) / value-added (pool) / bottleneck (procedural)
// ---------------------------------------------------------------------------

const PROCESS_SEQUENCING_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    scenarioTag: 'Your ops manager asks:',
    context: 'A returned item goes through these steps, listed out of order: Restock item, Inspect item, Receive return, Issue refund.',
    prompt: 'What is the correct sequence?',
    options: [
      { id: 'a', text: 'Receive return → Inspect item → Issue refund → Restock item' },
      { id: 'b', text: 'Restock item → Receive return → Inspect item → Issue refund' },
      { id: 'c', text: 'Issue refund → Receive return → Inspect item → Restock item' },
      { id: 'd', text: 'Inspect item → Receive return → Restock item → Issue refund' },
    ],
    correctOptionId: 'a',
    explanation: "You must receive the return before inspecting it, and issue the refund before restocking.",
  },
  {
    tier: 2,
    scenarioTag: 'A new hire asks:',
    context: 'A manufacturing order goes through these steps, listed out of order: Quality check, Assemble parts, Procure raw materials, Ship to customer.',
    prompt: 'What is the correct sequence?',
    options: [
      { id: 'a', text: 'Procure raw materials → Assemble parts → Quality check → Ship to customer' },
      { id: 'b', text: 'Assemble parts → Procure raw materials → Ship to customer → Quality check' },
      { id: 'c', text: 'Quality check → Procure raw materials → Ship to customer → Assemble parts' },
      { id: 'd', text: 'Ship to customer → Assemble parts → Procure raw materials → Quality check' },
    ],
    correctOptionId: 'a',
    explanation: 'Materials must be procured before assembly, and quality checks happen after assembly but before shipping.',
  },
];

const VALUE_ADDED_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    scenarioTag: 'A Six Sigma coach asks:',
    context: "In a hospital's patient intake process, which step is non-value-added?",
    prompt: 'Which step is non-value-added?',
    options: [
      { id: 'a', text: "A nurse records the patient's symptoms and vitals" },
      { id: 'b', text: "The patient's paperwork sits in an inbox for 45 minutes before anyone processes it" },
      { id: 'c', text: 'A doctor examines the patient' },
      { id: 'd', text: 'A lab technician runs the requested test' },
    ],
    correctOptionId: 'b',
    explanation: 'Paperwork sitting untouched adds time without doing anything the patient benefits from.',
  },
  {
    tier: 3,
    scenarioTag: 'An ops director asks:',
    context: "In a software company's deployment process, which step is non-value-added?",
    prompt: 'Which step is non-value-added?',
    options: [
      { id: 'a', text: 'Automated tests run against the new code' },
      { id: 'b', text: 'Code sits waiting for a manual sign-off from someone who is on vacation for a week' },
      { id: 'c', text: 'The code is deployed to production' },
      { id: 'd', text: 'A customer-facing feature becomes available' },
    ],
    correctOptionId: 'b',
    explanation: 'Waiting on an unavailable approver is pure delay — the customer never benefits from that wait.',
  },
];

const PROCESS_STEP_POOL = ['Design', 'Print', 'Cut', 'Assemble', 'Bake', 'Mix', 'Inspect', 'Pack', 'Ship', 'Fold'];

const generateBottleneckQuestion: Generator = (rng, id) => {
  const steps = pickN(rng, PROCESS_STEP_POOL, 3);
  const capacities = steps.map(() => randInt(rng, 20, 100));
  const minIndex = capacities.indexOf(Math.min(...capacities));
  const bottleneck = steps[minIndex];
  const description = steps.map((s, i) => `${s} handles ${capacities[i]}/hour`).join(', ');

  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'bottleneck-identification',
    kind: 'multipleChoice',
    difficultyTier: 4,
    context: `A process has three steps: ${description}.`,
    prompt: 'Which step is the bottleneck?',
    options: [
      ...steps.map((s) => ({ id: s, text: s })),
      { id: 'none', text: 'There is no bottleneck' },
    ],
    correctOptionId: bottleneck,
    explanation: `${bottleneck} has the lowest capacity (${capacities[minIndex]}/hour), so it caps total output no matter how fast the other steps run.`,
  };
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

interface TrackDailyRegistry {
  conceptOrder: string[];
  generators: Record<string, Generator>;
}

const DAILY_REGISTRY: Partial<Record<TrackId, TrackDailyRegistry>> = {
  finance: {
    conceptOrder: ['pl-reading', 'balance-sheet-reading', 'cash-flow-reading'],
    generators: {
      'pl-reading': generatePlReadingQuestion,
      'balance-sheet-reading': generateBalanceSheetReadingQuestion,
      'cash-flow-reading': generateCashFlowReadingQuestion,
    },
  },
  personalFinance: {
    conceptOrder: ['rule-50-30-20', 'emergency-fund', 'compound-growth'],
    generators: {
      'rule-50-30-20': generate503020Question,
      'emergency-fund': generateEmergencyFundQuestion,
      'compound-growth': generateCompoundGrowthQuestion,
    },
  },
  economics: {
    conceptOrder: ['supply-demand', 'opportunity-cost', 'price-elasticity'],
    generators: {
      'supply-demand': generateScenarioQuestion(SUPPLY_DEMAND_POOL, 'supply-demand'),
      'opportunity-cost': generateOpportunityCostQuestion,
      'price-elasticity': generateElasticityQuestion,
    },
  },
  accounting: {
    conceptOrder: ['debit-credit', 'journal-entries', 'accounting-equation'],
    generators: {
      'debit-credit': generateDebitCreditQuestion,
      'journal-entries': generateScenarioQuestion(JOURNAL_ENTRY_POOL, 'journal-entries'),
      'accounting-equation': generateAccountingEquationQuestion,
    },
  },
  startups: {
    conceptOrder: ['problem-solution', 'traction-slide', 'the-ask'],
    generators: {
      'problem-solution': generateScenarioQuestion(PROBLEM_SOLUTION_POOL, 'problem-solution'),
      'traction-slide': generateScenarioQuestion(TRACTION_SLIDE_POOL, 'traction-slide'),
      'the-ask': generateTheAskQuestion,
    },
  },
  consulting: {
    conceptOrder: ['answer-first', 'mece', 'hypothesis-driven'],
    generators: {
      'answer-first': generateScenarioQuestion(ANSWER_FIRST_POOL, 'answer-first'),
      mece: generateScenarioQuestion(MECE_POOL, 'mece'),
      'hypothesis-driven': generateScenarioQuestion(HYPOTHESIS_DRIVEN_POOL, 'hypothesis-driven'),
    },
  },
  marketing: {
    conceptOrder: ['cac', 'ltv', 'roas'],
    generators: {
      cac: generateCacQuestion,
      ltv: generateLtvQuestion,
      roas: generateRoasQuestion,
    },
  },
  operations: {
    conceptOrder: ['process-sequencing', 'value-added-steps', 'bottleneck-identification'],
    generators: {
      'process-sequencing': generateScenarioQuestion(PROCESS_SEQUENCING_POOL, 'process-sequencing'),
      'value-added-steps': generateScenarioQuestion(VALUE_ADDED_POOL, 'value-added-steps'),
      'bottleneck-identification': generateBottleneckQuestion,
    },
  },
};

/** Number of daily-practice questions a track will produce, without generating them. */
export function getDailyQuestionCount(trackId: TrackId): number {
  const registry = DAILY_REGISTRY[trackId];
  return registry ? registry.conceptOrder.length * QUESTIONS_PER_CONCEPT : 0;
}

/** Same track + same date always yields the same set of questions; a new date yields fresh ones. */
export function generateDailyQuestions(trackId: TrackId, dateStr: string): LessonQuestion[] {
  const registry = DAILY_REGISTRY[trackId];
  if (!registry) return [];

  const questions: LessonQuestion[] = [];
  registry.conceptOrder.forEach((conceptId) => {
    const generator = registry.generators[conceptId];
    for (let i = 0; i < QUESTIONS_PER_CONCEPT; i++) {
      const seed = `${trackId}-${dateStr}-${conceptId}-${i}`;
      const rng = createRng(seed);
      questions.push(generator(rng, seed));
    }
  });
  return questions;
}
