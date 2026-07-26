import { LessonQuestion, SpreadsheetCell, TrackId } from '../types';
import { createRng, pick, pickN, randInt, Rng } from '../utils/seededRandom';

export const DAILY_PRACTICE_NODE_ID = 'daily-practice';
export const QUESTIONS_PER_CONCEPT = 5;

type Generator = (rng: Rng, id: string) => LessonQuestion;

// ---------------------------------------------------------------------------
// Finance: SUM / SUMIF / VLOOKUP over a randomized sales table
// ---------------------------------------------------------------------------

const ITEM_POOL = [
  'Notebook',
  'Backpack',
  'Water Bottle',
  'Desk Lamp',
  'Headphones',
  'Stapler',
  'Monitor Stand',
  'Coffee Mug',
  'Charger Cable',
  'Sticky Notes',
  'Whiteboard Marker',
  'Desk Organizer',
];

const REGION_POOL = ['West', 'East', 'North', 'South'];
const SALES_HEADERS = ['Item', 'Region', 'Units', 'Price', 'Revenue'];

interface SalesRow {
  row: number;
  item: string;
  region: string;
  units: number;
  price: number;
  revenue: number;
}

function buildSalesTable(rng: Rng): SalesRow[] {
  const items = pickN(rng, ITEM_POOL, 5);
  const regions = pickN(rng, REGION_POOL, 2);
  return items.map((item, i) => {
    const units = randInt(rng, 5, 80);
    const price = randInt(rng, 3, 70);
    return {
      row: i + 2,
      item,
      region: regions[i % 2 === 0 ? 0 : 1],
      units,
      price,
      revenue: units * price,
    };
  });
}

function cellsFromRows(rows: SalesRow[]): SpreadsheetCell[] {
  const cells: SpreadsheetCell[] = [];
  rows.forEach(({ row, item, region, units, price, revenue }) => {
    cells.push({ row, col: 1, value: item });
    cells.push({ row, col: 2, value: region });
    cells.push({ row, col: 3, value: String(units) });
    cells.push({ row, col: 4, value: `$${price}` });
    cells.push({ row, col: 5, value: `$${revenue}` });
  });
  return cells;
}

const generateSumQuestion: Generator = (rng, id) => {
  const rows = buildSalesTable(rng);
  const useRevenue = rng() > 0.5;
  const colLetter = useRevenue ? 'E' : 'C';
  const target = `${colLetter}7`;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'sum',
    kind: 'formula',
    difficultyTier: 1,
    prompt: `Type a formula in ${target} that totals ${useRevenue ? 'Revenue' : 'Units'} across ${colLetter}2:${colLetter}6.`,
    columnHeaders: SALES_HEADERS,
    cells: cellsFromRows(rows),
    targetCellLabel: target,
    acceptedFormulas: [`=SUM(${colLetter}2:${colLetter}6)`],
    correctFormula: `=SUM(${colLetter}2:${colLetter}6)`,
    explanation: `=SUM(${colLetter}2:${colLetter}6) adds every value in that range in one step.`,
  };
};

const generateSumifQuestion: Generator = (rng, id) => {
  const rows = buildSalesTable(rng);
  const targetRegion = rows[randInt(rng, 0, rows.length - 1)].region;
  const useRevenue = rng() > 0.5;
  const colLetter = useRevenue ? 'E' : 'C';
  const target = `${colLetter}8`;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'sumif',
    kind: 'formula',
    difficultyTier: 3,
    prompt: `Type a formula in ${target} that sums ${colLetter}2:${colLetter}6, but only where B2:B6 equals "${targetRegion}".`,
    columnHeaders: SALES_HEADERS,
    cells: cellsFromRows(rows),
    targetCellLabel: target,
    acceptedFormulas: [`=SUMIF(B2:B6,"${targetRegion.toUpperCase()}",${colLetter}2:${colLetter}6)`],
    correctFormula: `=SUMIF(B2:B6,"${targetRegion}",${colLetter}2:${colLetter}6)`,
    explanation: `=SUMIF(B2:B6,"${targetRegion}",${colLetter}2:${colLetter}6) only adds rows where the Region column reads "${targetRegion}".`,
  };
};

const generateVlookupQuestion: Generator = (rng, id) => {
  const rows = buildSalesTable(rng);
  const target = rows[randInt(rng, 0, rows.length - 1)];
  const lookupPrice = rng() > 0.5;
  const colIndex = lookupPrice ? 4 : 2;
  const rangeEnd = lookupPrice ? 'D6' : 'B6';
  const targetCell = 'H2';
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'vlookup',
    kind: 'formula',
    difficultyTier: lookupPrice ? 4 : 5,
    prompt: `Type a formula in ${targetCell} that looks up "${target.item}" in A2:A6 and returns the matching value from column ${lookupPrice ? 'D (Price, the 4th column)' : 'B (Region, the 2nd column)'} of A2:${rangeEnd}, exact match.`,
    columnHeaders: SALES_HEADERS,
    cells: cellsFromRows(rows),
    targetCellLabel: targetCell,
    acceptedFormulas: [`=VLOOKUP("${target.item.toUpperCase()}",A2:${rangeEnd},${colIndex},FALSE)`],
    correctFormula: `=VLOOKUP("${target.item}",A2:${rangeEnd},${colIndex},FALSE)`,
    explanation: `VLOOKUP finds "${target.item}" in A2:A6, then returns the value from column ${colIndex} of that same row.`,
  };
};

// ---------------------------------------------------------------------------
// Accounting: accounting equation (numeric) / debit-credit (multiple choice)
// ---------------------------------------------------------------------------

const BUSINESS_NOUNS = ['bakery', 'design studio', 'hardware store', 'auto shop', 'gym', 'salon', 'bookstore'];

const generateAccountingEquationQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const liabilities = randInt(rng, 10, 200) * 1000;
  const equity = randInt(rng, 10, 300) * 1000;
  const assets = liabilities + equity;
  const solveFor = pick(rng, ['equity', 'assets', 'liabilities'] as const);

  if (solveFor === 'equity') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'accounting-equation',
      kind: 'numeric',
      difficultyTier: 1,
      prompt: `A ${business} has $${assets.toLocaleString()} in Assets and $${liabilities.toLocaleString()} in Liabilities. What is its Equity?`,
      targetLabel: 'Equity ($)',
      correctValue: equity,
      tolerance: 0.5,
      explanation: `Equity = Assets − Liabilities = $${assets.toLocaleString()} − $${liabilities.toLocaleString()} = $${equity.toLocaleString()}.`,
    };
  }
  if (solveFor === 'assets') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'accounting-equation',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A ${business} has $${equity.toLocaleString()} in Equity and $${liabilities.toLocaleString()} in Liabilities. What are its total Assets?`,
      targetLabel: 'Assets ($)',
      correctValue: assets,
      tolerance: 0.5,
      explanation: `Assets = Liabilities + Equity = $${liabilities.toLocaleString()} + $${equity.toLocaleString()} = $${assets.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'accounting-equation',
    kind: 'numeric',
    difficultyTier: 2,
    prompt: `A ${business} has $${assets.toLocaleString()} in Assets and $${equity.toLocaleString()} in Equity. What are its total Liabilities?`,
    targetLabel: 'Liabilities ($)',
    correctValue: liabilities,
    tolerance: 0.5,
    explanation: `Liabilities = Assets − Equity = $${assets.toLocaleString()} − $${equity.toLocaleString()} = $${liabilities.toLocaleString()}.`,
  };
};

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
      context: `The owner invests an additional $${amt.toLocaleString()} cash into the business.`,
      prompt: 'How does this affect the Equity account?',
      correct: 'credit',
      explanation: `Equity increases with a credit, so Equity is credited $${amt.toLocaleString()}.`,
    }),
  },
  {
    tier: 3,
    build: (amt) => ({
      context: `A company takes out a $${amt.toLocaleString()} bank loan.`,
      prompt: 'How does this affect the Loan Payable account (a Liability)?',
      correct: 'credit',
      explanation: `Liabilities increase with a credit, so Loan Payable is credited $${amt.toLocaleString()}.`,
    }),
  },
  {
    tier: 4,
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

// ---------------------------------------------------------------------------
// Marketing: channel-fit / value-proposition (multiple choice, scenario pools)
// ---------------------------------------------------------------------------

interface ScenarioTemplate {
  tier: 1 | 2 | 3 | 4 | 5;
  context: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const CHANNEL_FIT_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    context: 'A local coffee shop wants to attract nearby college students within walking distance.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Instagram + flyers/partnerships with nearby student orgs' },
      { id: 'b', text: 'A national TV ad campaign' },
      { id: 'c', text: 'Cold-calling enterprise IT departments' },
      { id: 'd', text: 'Print ads in a national finance magazine' },
    ],
    correctOptionId: 'a',
    explanation: 'The audience is young, local, and nearby — that calls for a cheap, hyper-local, visual channel.',
  },
  {
    tier: 3,
    context: 'A boutique wedding photographer wants more bookings in her city.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Instagram/Pinterest with a strong visual portfolio' },
      { id: 'b', text: 'Cold email to Fortune 500 companies' },
      { id: 'c', text: 'Paid search ads for "best chocolate factory near me"' },
      { id: 'd', text: 'Radio ads during rush hour traffic' },
    ],
    correctOptionId: 'a',
    explanation: 'Photography is portfolio-driven — engaged couples browse Instagram/Pinterest for style before booking.',
  },
  {
    tier: 2,
    context: "A B2B SaaS company sells project-management software to mid-size companies' IT directors.",
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'LinkedIn ads/outreach targeted by job title' },
      { id: 'b', text: 'TikTok influencer campaign' },
      { id: 'c', text: 'Local flyers near a college campus' },
      { id: 'd', text: 'Daytime radio ads' },
    ],
    correctOptionId: 'a',
    explanation: 'IT directors making B2B purchase decisions are concentrated on LinkedIn, which allows precise job-title targeting.',
  },
  {
    tier: 1,
    context: 'A neighborhood gym wants more members who live or work within a few miles.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Local Facebook/Instagram ads + sponsoring a nearby community 5k' },
      { id: 'b', text: 'A national billboard campaign' },
      { id: 'c', text: 'Cold-calling enterprise procurement teams' },
      { id: 'd', text: 'Print ads in a national finance magazine' },
    ],
    correctOptionId: 'a',
    explanation: 'A hyper-local, community-visible channel matches an audience that has to be geographically close to actually show up.',
  },
  {
    tier: 4,
    context: 'An enterprise cybersecurity vendor sells six-figure contracts to Fortune 500 CISOs.',
    prompt: 'Which channel is the strongest first move?',
    options: [
      { id: 'a', text: 'Account-based outreach + industry conference sponsorships' },
      { id: 'b', text: 'Consumer Instagram ads' },
      { id: 'c', text: 'Local neighborhood flyers' },
      { id: 'd', text: 'A viral TikTok challenge' },
    ],
    correctOptionId: 'a',
    explanation: 'Six-figure enterprise deals are relationship-driven and low-volume — that calls for targeted account-based outreach, not mass consumer channels.',
  },
];

const VALUE_PROP_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    context: 'A budgeting app is choosing its homepage headline.',
    prompt: 'Which value proposition is strongest?',
    options: [
      { id: 'a', text: '"Take control of your finances today"' },
      { id: 'b', text: '"See exactly where your next paycheck is going, before you spend it"' },
      { id: 'c', text: '"The best app for your money"' },
      { id: 'd', text: '"Financial freedom starts here"' },
    ],
    correctOptionId: 'b',
    explanation: 'It names a specific benefit at a specific moment. The rest are vague slogans.',
  },
  {
    tier: 4,
    context: 'A B2B cybersecurity startup is writing its pitch-deck one-liner for enterprise IT buyers.',
    prompt: 'Which is strongest?',
    options: [
      { id: 'a', text: '"We help you stay secure"' },
      { id: 'b', text: '"Enterprise-grade security for the modern age"' },
      { id: 'c', text: '"Cut phishing-related help desk tickets by 60% in the first 90 days"' },
      { id: 'd', text: '"The future of cybersecurity is here"' },
    ],
    correctOptionId: 'c',
    explanation: "It's quantified, specific, and time-bound — a buyer can picture and measure the exact outcome.",
  },
  {
    tier: 2,
    context: 'A project-management SaaS is writing its homepage headline for team leads.',
    prompt: 'Which value proposition is strongest?',
    options: [
      { id: 'a', text: '"Work smarter, not harder"' },
      { id: 'b', text: '"The all-in-one platform for modern teams"' },
      { id: 'c', text: '"See every teammate\'s task status in one view — no more status-update meetings"' },
      { id: 'd', text: '"Built for how teams actually work"' },
    ],
    correctOptionId: 'c',
    explanation: 'It names a concrete, visible benefit (no more status meetings) instead of a generic productivity slogan.',
  },
  {
    tier: 3,
    context: 'A direct-to-consumer skincare brand is writing its product page headline.',
    prompt: 'Which value proposition is strongest?',
    options: [
      { id: 'a', text: '"Feel beautiful every day"' },
      { id: 'b', text: '"Skincare that works"' },
      { id: 'c', text: '"Clear skin in 2 weeks, dermatologist-tested, or your money back"' },
      { id: 'd', text: '"The secret to glowing skin"' },
    ],
    correctOptionId: 'c',
    explanation: 'It sets a specific timeframe, a credibility signal, and a guarantee — measurable and low-risk, unlike the vague options.',
  },
  {
    tier: 1,
    context: 'A meal-kit delivery service is writing its landing page headline.',
    prompt: 'Which value proposition is strongest?',
    options: [
      { id: 'a', text: '"Delicious food delivered fresh"' },
      { id: 'b', text: '"Chef-designed dinners, ready in 20 minutes, with zero grocery trips"' },
      { id: 'c', text: '"Eating well has never been easier"' },
      { id: 'd', text: '"Quality ingredients, every time"' },
    ],
    correctOptionId: 'b',
    explanation: 'It names the exact benefit (fast, no shopping) for a clear person, unlike the generic claims in the other options.',
  },
];

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
      context: item.context,
      prompt: item.prompt,
      options: item.options,
      correctOptionId: item.correctOptionId,
      explanation: item.explanation,
    };
  };

// ---------------------------------------------------------------------------
// Consulting: profitability framework (numeric) / framework-fit (multiple choice)
// ---------------------------------------------------------------------------

const generateProfitabilityQuestion: Generator = (rng, id) => {
  const units = randInt(rng, 20, 400) * 10;
  const price = randInt(rng, 10, 100);
  const revenue = units * price;
  const costs = Math.round(revenue * (randInt(rng, 40, 85) / 100));
  const profit = revenue - costs;
  const solveFor = pick(rng, ['profit', 'costs'] as const);

  if (solveFor === 'profit') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'profitability-framework',
      kind: 'numeric',
      difficultyTier: 1,
      prompt: `A client sells ${units.toLocaleString()} units at $${price} each. Total costs are $${costs.toLocaleString()}. What is their profit?`,
      targetLabel: 'Profit ($)',
      correctValue: profit,
      tolerance: 1,
      explanation: `Revenue = ${units.toLocaleString()} × $${price} = $${revenue.toLocaleString()}. Profit = Revenue − Costs = $${revenue.toLocaleString()} − $${costs.toLocaleString()} = $${profit.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'profitability-framework',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: `A client's profit was $${profit.toLocaleString()} last quarter selling ${units.toLocaleString()} units at $${price} each. What were their total costs?`,
    targetLabel: 'Total costs ($)',
    correctValue: costs,
    tolerance: 1,
    explanation: `Revenue = ${units.toLocaleString()} × $${price} = $${revenue.toLocaleString()}. Costs = Revenue − Profit = $${revenue.toLocaleString()} − $${profit.toLocaleString()} = $${costs.toLocaleString()}.`,
  };
};

const FRAMEWORK_FIT_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    context: 'Prompt: "A private equity client is deciding whether to acquire a mid-size logistics company."',
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework' },
      { id: 'b', text: 'Market-sizing framework' },
      { id: 'c', text: 'Investment/acquisition framework (synergies, valuation, risk)' },
      { id: 'd', text: 'Debits & credits classification' },
    ],
    correctOptionId: 'c',
    explanation: "It's a go/no-go capital decision — it needs a framework built around valuation, synergies, and risk.",
  },
  {
    tier: 4,
    context:
      'Prompt: "A beverage company wants to know how many units of a new energy drink it could sell in its first year in a new country."',
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework' },
      { id: 'b', text: 'Market-sizing framework (top-down or bottom-up)' },
      { id: 'c', text: 'SWOT analysis' },
      { id: 'd', text: 'Debits & credits classification' },
    ],
    correctOptionId: 'b',
    explanation: 'The question is purely about estimating a number in a market with no data yet — the classic use case for market sizing.',
  },
  {
    tier: 2,
    context:
      "Prompt: \"Our client's profits have declined sharply over the past 2 years even though sales volume is flat. What's going on?\"",
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework (Revenue vs. Cost breakdown)' },
      { id: 'b', text: 'Market-sizing framework' },
      { id: 'c', text: 'Investment/acquisition framework' },
      { id: 'd', text: 'Debits & credits classification' },
    ],
    correctOptionId: 'a',
    explanation: 'Since volume is flat but profit fell, the issue is pricing, cost, or mix — exactly what the profitability framework isolates.',
  },
  {
    tier: 4,
    context: 'Prompt: "A retailer wants to decide whether to expand into a new international market."',
    prompt: 'Which framework fits best?',
    options: [
      { id: 'a', text: 'Profitability framework' },
      { id: 'b', text: 'Market-entry framework (market attractiveness + capability fit)' },
      { id: 'c', text: 'Debits & credits classification' },
      { id: 'd', text: 'Bottleneck analysis' },
    ],
    correctOptionId: 'b',
    explanation: 'A go/no-go market-entry decision needs a framework weighing market attractiveness against the company\'s ability to compete there.',
  },
];

// ---------------------------------------------------------------------------
// Startups: LTV:CAC ratio / runway (numeric)
// ---------------------------------------------------------------------------

const generateCacLtvQuestion: Generator = (rng, id) => {
  const mode = pick(rng, ['ratio', 'cac-from-spend'] as const);
  if (mode === 'ratio') {
    const cac = randInt(rng, 20, 300);
    const multiple = randInt(rng, 2, 6);
    const ltv = cac * multiple;
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'cac-ltv',
      kind: 'numeric',
      difficultyTier: 1,
      prompt: `A startup has an LTV of $${ltv.toLocaleString()} per customer and a CAC of $${cac.toLocaleString()}. What is the LTV:CAC ratio?`,
      targetLabel: 'LTV:CAC ratio (x)',
      unit: 'x',
      correctValue: multiple,
      tolerance: 0.05,
      explanation: `LTV ÷ CAC = $${ltv.toLocaleString()} ÷ $${cac.toLocaleString()} = ${multiple}.`,
    };
  }
  const customers = randInt(rng, 50, 600);
  const cac = randInt(rng, 20, 200);
  const spend = customers * cac;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'cac-ltv',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: `A startup spent $${spend.toLocaleString()} on marketing last month and acquired ${customers.toLocaleString()} new customers. What is their CAC?`,
    targetLabel: 'CAC ($)',
    correctValue: cac,
    tolerance: 0.5,
    explanation: `CAC = Marketing spend ÷ New customers = $${spend.toLocaleString()} ÷ ${customers.toLocaleString()} = $${cac.toLocaleString()}.`,
  };
};

const generateRunwayQuestion: Generator = (rng, id) => {
  const mode = pick(rng, ['forward', 'backward'] as const);
  const burn = randInt(rng, 10, 80) * 1000;
  const months = randInt(rng, 4, 18);
  const cash = burn * months;

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'runway',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A startup has $${cash.toLocaleString()} in the bank and burns $${burn.toLocaleString()} per month. How many months of runway do they have?`,
      targetLabel: 'Runway (months)',
      unit: 'mo',
      correctValue: months,
      tolerance: 0.1,
      explanation: `Runway = Cash ÷ Monthly burn = $${cash.toLocaleString()} ÷ $${burn.toLocaleString()} = ${months} months.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'runway',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A founder wants at least ${months} months of runway and has $${cash.toLocaleString()} in the bank. What is the maximum monthly burn rate they can afford?`,
    targetLabel: 'Max monthly burn ($)',
    correctValue: burn,
    tolerance: 1,
    explanation: `Max burn = Cash ÷ Target runway = $${cash.toLocaleString()} ÷ ${months} = $${burn.toLocaleString()} per month.`,
  };
};

// ---------------------------------------------------------------------------
// Operations: bottleneck identification (multiple choice) / throughput (numeric)
// ---------------------------------------------------------------------------

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
    difficultyTier: 2,
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

const generateThroughputQuestion: Generator = (rng, id) => {
  const mode = pick(rng, ['forward', 'backward'] as const);
  if (mode === 'forward') {
    const cycleTime = randInt(rng, 2, 10);
    const throughput = Math.round((60 / cycleTime) * 100) / 100;
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'throughput-calc',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A worker takes ${cycleTime} minutes to complete one unit. What is their throughput in units per hour?`,
      targetLabel: 'Throughput (units/hr)',
      correctValue: throughput,
      tolerance: 0.1,
      explanation: `Throughput = 60 ÷ cycle time = 60 ÷ ${cycleTime} = ${throughput} units per hour.`,
    };
  }
  const targetThroughput = randInt(rng, 6, 40);
  const maxCycleTime = Math.round((60 / targetThroughput) * 100) / 100;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'throughput-calc',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A team needs to hit a throughput of ${targetThroughput} units per hour per worker. What is the maximum cycle time (in minutes) allowed per unit?`,
    targetLabel: 'Max cycle time (min)',
    correctValue: maxCycleTime,
    tolerance: 0.05,
    explanation: `Max cycle time = 60 ÷ target throughput = 60 ÷ ${targetThroughput} = ${maxCycleTime} minutes per unit.`,
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
    conceptOrder: ['sum', 'sumif', 'vlookup'],
    generators: { sum: generateSumQuestion, sumif: generateSumifQuestion, vlookup: generateVlookupQuestion },
  },
  accounting: {
    conceptOrder: ['accounting-equation', 'debit-credit'],
    generators: {
      'accounting-equation': generateAccountingEquationQuestion,
      'debit-credit': generateDebitCreditQuestion,
    },
  },
  marketing: {
    conceptOrder: ['channel-fit', 'value-proposition'],
    generators: {
      'channel-fit': generateScenarioQuestion(CHANNEL_FIT_POOL, 'channel-fit'),
      'value-proposition': generateScenarioQuestion(VALUE_PROP_POOL, 'value-proposition'),
    },
  },
  consulting: {
    conceptOrder: ['profitability-framework', 'framework-fit'],
    generators: {
      'profitability-framework': generateProfitabilityQuestion,
      'framework-fit': generateScenarioQuestion(FRAMEWORK_FIT_POOL, 'framework-fit'),
    },
  },
  startups: {
    conceptOrder: ['cac-ltv', 'runway'],
    generators: { 'cac-ltv': generateCacLtvQuestion, runway: generateRunwayQuestion },
  },
  operations: {
    conceptOrder: ['bottleneck-identification', 'throughput-calc'],
    generators: {
      'bottleneck-identification': generateBottleneckQuestion,
      'throughput-calc': generateThroughputQuestion,
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
