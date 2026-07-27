import { LessonQuestion, SpreadsheetCell, TrackId } from '../types';
import { createRng, pick, pickN, randInt, Rng } from '../utils/seededRandom';

export const DAILY_PRACTICE_NODE_ID = 'daily-practice';
export const QUESTIONS_PER_CONCEPT = 4;

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

const generateCountifQuestion: Generator = (rng, id) => {
  const rows = buildSalesTable(rng);
  const mode = pick(rng, ['region', 'units'] as const);
  if (mode === 'region') {
    const targetRegion = rows[randInt(rng, 0, rows.length - 1)].region;
    const target = 'C8';
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'countif',
      kind: 'formula',
      difficultyTier: 2,
      prompt: `Type a formula in ${target} that counts how many rows in B2:B6 have Region equal to "${targetRegion}".`,
      columnHeaders: SALES_HEADERS,
      cells: cellsFromRows(rows),
      targetCellLabel: target,
      acceptedFormulas: [`=COUNTIF(B2:B6,"${targetRegion.toUpperCase()}")`],
      correctFormula: `=COUNTIF(B2:B6,"${targetRegion}")`,
      explanation: `=COUNTIF(B2:B6,"${targetRegion}") counts how many cells in B2:B6 match "${targetRegion}" — no summing, just counting.`,
    };
  }
  const threshold = randInt(rng, 15, 50);
  const target = 'C9';
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'countif',
    kind: 'formula',
    difficultyTier: 2,
    prompt: `Type a formula in ${target} that counts how many rows in C2:C6 have Units greater than ${threshold}.`,
    columnHeaders: SALES_HEADERS,
    cells: cellsFromRows(rows),
    targetCellLabel: target,
    acceptedFormulas: [`=COUNTIF(C2:C6,">${threshold}")`],
    correctFormula: `=COUNTIF(C2:C6,">${threshold}")`,
    explanation: `=COUNTIF(C2:C6,">${threshold}") counts every cell in C2:C6 whose value is greater than ${threshold}.`,
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

const generateIfQuestion: Generator = (rng, id) => {
  const rows = buildSalesTable(rng);
  const mode = pick(rng, ['units', 'revenue'] as const);
  if (mode === 'units') {
    const threshold = randInt(rng, 15, 50);
    const target = 'F2';
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'if',
      kind: 'formula',
      difficultyTier: 4,
      prompt: `Type a formula in ${target} that shows "Restock" if C2 (Units) is less than ${threshold}, otherwise shows "OK".`,
      columnHeaders: SALES_HEADERS,
      cells: cellsFromRows(rows),
      targetCellLabel: target,
      acceptedFormulas: [`=IF(C2<${threshold},"RESTOCK","OK")`],
      correctFormula: `=IF(C2<${threshold},"Restock","OK")`,
      explanation: `=IF(C2<${threshold},"Restock","OK") checks C2 against ${threshold} first, then returns one label or the other.`,
    };
  }
  const threshold = randInt(rng, 100, 500);
  const target = 'F3';
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'if',
    kind: 'formula',
    difficultyTier: 4,
    prompt: `Type a formula in ${target} that shows "High Value" if E2 (Revenue) is greater than ${threshold}, otherwise shows "Standard".`,
    columnHeaders: SALES_HEADERS,
    cells: cellsFromRows(rows),
    targetCellLabel: target,
    acceptedFormulas: [`=IF(E2>${threshold},"HIGH VALUE","STANDARD")`],
    correctFormula: `=IF(E2>${threshold},"High Value","Standard")`,
    explanation: `=IF(E2>${threshold},"High Value","Standard") checks E2 against ${threshold} first, then returns one label or the other.`,
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

const generateGrossMarginQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const revenue = randInt(rng, 20, 400) * 1000;
  const marginPct = randInt(rng, 15, 65);
  const cogs = Math.round(revenue * (1 - marginPct / 100));
  const solveFor = pick(rng, ['margin', 'cogs'] as const);

  if (solveFor === 'margin') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'gross-margin',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A ${business} has $${revenue.toLocaleString()} in Revenue and $${cogs.toLocaleString()} in COGS. What is its gross margin percentage?`,
      targetLabel: 'Gross Margin (%)',
      unit: '%',
      correctValue: Math.round(((revenue - cogs) / revenue) * 1000) / 10,
      tolerance: 0.5,
      explanation: `Gross Margin = (Revenue − COGS) ÷ Revenue = ($${revenue.toLocaleString()} − $${cogs.toLocaleString()}) ÷ $${revenue.toLocaleString()} ≈ ${Math.round(((revenue - cogs) / revenue) * 100)}%.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'gross-margin',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: `A ${business} has $${revenue.toLocaleString()} in Revenue and a ${marginPct}% gross margin. What is its COGS?`,
    targetLabel: 'COGS ($)',
    correctValue: cogs,
    tolerance: 1,
    explanation: `COGS = Revenue × (1 − Gross Margin) = $${revenue.toLocaleString()} × ${(1 - marginPct / 100).toFixed(2)} = $${cogs.toLocaleString()}.`,
  };
};

const generateNetIncomeQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const revenue = randInt(rng, 50, 600) * 1000;
  const netIncome = randInt(rng, 5, 80) * 1000;
  const expenses = revenue - netIncome;
  const solveFor = pick(rng, ['income', 'expenses'] as const);

  if (solveFor === 'income') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'net-income',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A ${business} had $${revenue.toLocaleString()} in Revenue and $${expenses.toLocaleString()} in total expenses. What is its Net Income?`,
      targetLabel: 'Net Income ($)',
      correctValue: netIncome,
      tolerance: 1,
      explanation: `Net Income = Revenue − Total Expenses = $${revenue.toLocaleString()} − $${expenses.toLocaleString()} = $${netIncome.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'net-income',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A ${business} had $${revenue.toLocaleString()} in Revenue and a Net Income of $${netIncome.toLocaleString()}. What were its total expenses?`,
    targetLabel: 'Total Expenses ($)',
    correctValue: expenses,
    tolerance: 1,
    explanation: `Total Expenses = Revenue − Net Income = $${revenue.toLocaleString()} − $${netIncome.toLocaleString()} = $${expenses.toLocaleString()}.`,
  };
};

const generateCurrentRatioQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const liabilities = randInt(rng, 20, 150) * 1000;
  const ratio = randInt(rng, 12, 30) / 10;
  const assets = Math.round(liabilities * ratio);
  const solveFor = pick(rng, ['ratio', 'minAssets'] as const);

  if (solveFor === 'ratio') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'current-ratio',
      kind: 'numeric',
      difficultyTier: 4,
      prompt: `A ${business} has $${assets.toLocaleString()} in Current Assets and $${liabilities.toLocaleString()} in Current Liabilities. What is its current ratio?`,
      targetLabel: 'Current Ratio (x)',
      unit: 'x',
      correctValue: Math.round((assets / liabilities) * 100) / 100,
      tolerance: 0.05,
      explanation: `Current Ratio = Current Assets ÷ Current Liabilities = $${assets.toLocaleString()} ÷ $${liabilities.toLocaleString()} ≈ ${(assets / liabilities).toFixed(2)}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'current-ratio',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A ${business} wants a current ratio of at least ${ratio} and has $${liabilities.toLocaleString()} in Current Liabilities. What is the minimum Current Assets it needs?`,
    targetLabel: 'Min Current Assets ($)',
    correctValue: assets,
    tolerance: 1,
    explanation: `Minimum Current Assets = Target Ratio × Current Liabilities = ${ratio} × $${liabilities.toLocaleString()} = $${assets.toLocaleString()}.`,
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

const SEGMENTATION_POOL: ScenarioTemplate[] = [
  {
    tier: 1,
    context: 'A skincare brand sells to teenagers dealing with acne, and adults over 50 focused on anti-aging.',
    prompt: 'Which headline fits the teen-acne segment?',
    options: [
      { id: 'a', text: 'Clear skin, fast — dermatologist-tested for breakouts' },
      { id: 'b', text: 'Turn back the clock on fine lines and wrinkles' },
      { id: 'c', text: 'Luxurious hydration for mature skin' },
      { id: 'd', text: 'The secret to youthful-looking skin' },
    ],
    correctOptionId: 'a',
    explanation: 'It names the exact problem that segment faces — breakouts — not the anti-aging concerns of the other segment.',
  },
  {
    tier: 2,
    context:
      'A meal-delivery service serves busy young professionals (want speed) and health-conscious retirees (want portion control and nutrition info).',
    prompt: 'Which tagline fits the retiree segment?',
    options: [
      { id: 'a', text: 'Dinner in 10 minutes, zero cleanup' },
      { id: 'b', text: 'Chef-portioned meals with full nutrition breakdowns, delivered weekly' },
      { id: 'c', text: 'Perfect for your next happy hour' },
      { id: 'd', text: 'Built for your busiest week yet' },
    ],
    correctOptionId: 'b',
    explanation: 'It speaks to what that group cares about — portion control and nutrition info — not speed and convenience.',
  },
  {
    tier: 3,
    context: 'A fitness app serves competitive athletes chasing PRs, and beginners just trying to build a habit.',
    prompt: 'Which push notification fits the beginner segment?',
    options: [
      { id: 'a', text: 'New PR alert: you just beat your fastest 5k!' },
      { id: 'b', text: "You showed up 3 days in a row — that's the hard part done" },
      { id: 'c', text: 'Your VO2 max percentile just increased' },
      { id: 'd', text: 'Compare your splits to elite marathoners' },
    ],
    correctOptionId: 'b',
    explanation: 'It reinforces habit-building and consistency, which is what a beginner segment needs, not performance metrics aimed at competitive athletes.',
  },
  {
    tier: 2,
    context: 'A laptop brand sells to students on tight budgets and to creative professionals who need high performance.',
    prompt: 'Which headline fits the student segment?',
    options: [
      { id: 'a', text: 'Studio-grade rendering power for professional creators' },
      { id: 'b', text: 'Reliable, affordable, and built to survive four years of class' },
      { id: 'c', text: 'Color-accurate displays for demanding editing work' },
      { id: 'd', text: 'The choice of award-winning studios' },
    ],
    correctOptionId: 'b',
    explanation: "It speaks to a student's actual priorities — price and durability — not the performance specs that matter to creative professionals.",
  },
];

const FUNNEL_STAGE_POOL: ScenarioTemplate[] = [
  {
    tier: 2,
    context: "A new budgeting app runs a podcast ad introducing itself to listeners who've never heard of it.",
    prompt: 'Which funnel stage does this tactic target?',
    options: [
      { id: 'a', text: 'Awareness' },
      { id: 'b', text: 'Consideration' },
      { id: 'c', text: 'Decision' },
      { id: 'd', text: 'None of these' },
    ],
    correctOptionId: 'a',
    explanation: "The audience doesn't know the product exists yet — a broad-reach ad that introduces the brand is an Awareness-stage tactic.",
  },
  {
    tier: 3,
    context: "An e-commerce store sends a 10%-off code to someone who added an item to their cart but didn't check out.",
    prompt: 'Which funnel stage does this tactic target?',
    options: [
      { id: 'a', text: 'Awareness' },
      { id: 'b', text: 'Consideration' },
      { id: 'c', text: 'Decision' },
      { id: 'd', text: 'None of these' },
    ],
    correctOptionId: 'c',
    explanation: "They've already chosen the product and are on the verge of buying — a final incentive to convert is a Decision-stage tactic.",
  },
  {
    tier: 3,
    context: 'A SaaS company sends a "Us vs. Competitor X" case study to people who visited its pricing page twice.',
    prompt: 'Which funnel stage does this tactic target?',
    options: [
      { id: 'a', text: 'Awareness' },
      { id: 'b', text: 'Consideration' },
      { id: 'c', text: 'Decision' },
      { id: 'd', text: 'None of these' },
    ],
    correctOptionId: 'b',
    explanation: 'They already know the product exists and are actively comparing it to alternatives — that\'s the Consideration stage.',
  },
  {
    tier: 4,
    context: 'A car brand runs a TV ad during a major sporting event, showing dramatic footage of the vehicle with no pricing or offer.',
    prompt: 'Which funnel stage does this tactic target?',
    options: [
      { id: 'a', text: 'Awareness' },
      { id: 'b', text: 'Consideration' },
      { id: 'c', text: 'Decision' },
      { id: 'd', text: 'None of these' },
    ],
    correctOptionId: 'a',
    explanation: 'No pricing or offer means it isn\'t asking for a decision — it\'s building broad brand recognition, which is an Awareness-stage goal.',
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

const generateConversionRateQuestion: Generator = (rng, id) => {
  const solveFor = pick(rng, ['rate', 'conversions'] as const);
  if (solveFor === 'rate') {
    const visitors = randInt(rng, 20, 800) * 10;
    const ratePct = randInt(rng, 1, 15);
    const conversions = Math.round(visitors * (ratePct / 100));
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'conversion-rate',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A landing page got ${visitors.toLocaleString()} visitors and ${conversions.toLocaleString()} signups. What is the conversion rate?`,
      targetLabel: 'Conversion Rate (%)',
      unit: '%',
      correctValue: Math.round((conversions / visitors) * 1000) / 10,
      tolerance: 0.1,
      explanation: `Conversion Rate = Conversions ÷ Visitors × 100 = ${conversions.toLocaleString()} ÷ ${visitors.toLocaleString()} × 100 ≈ ${Math.round((conversions / visitors) * 100)}%.`,
    };
  }
  const visitors = randInt(rng, 100, 1000) * 10;
  const ratePct = randInt(rng, 1, 15);
  const conversions = Math.round(visitors * (ratePct / 100));
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'conversion-rate',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A store wants a ${ratePct}% conversion rate and expects ${visitors.toLocaleString()} visitors this month. How many conversions is that?`,
    targetLabel: 'Conversions',
    correctValue: conversions,
    tolerance: 1,
    explanation: `Conversions = Conversion Rate × Visitors = ${(ratePct / 100).toFixed(2)} × ${visitors.toLocaleString()} = ${conversions.toLocaleString()}.`,
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

const generateBreakevenQuestion: Generator = (rng, id) => {
  const fixedCosts = randInt(rng, 10, 100) * 1000;
  const price = randInt(rng, 20, 100);
  const variableCost = Math.round(price * (randInt(rng, 30, 70) / 100));
  const breakevenUnits = Math.round(fixedCosts / (price - variableCost));
  const solveFor = pick(rng, ['units', 'price'] as const);

  if (solveFor === 'units') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'breakeven',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A product has $${fixedCosts.toLocaleString()} in Fixed Costs, sells for $${price}, and costs $${variableCost} to produce. How many units must be sold to break even?`,
      targetLabel: 'Breakeven Units',
      correctValue: breakevenUnits,
      tolerance: 1,
      explanation: `Breakeven Units = Fixed Costs ÷ (Price − Variable Cost) = $${fixedCosts.toLocaleString()} ÷ ($${price} − $${variableCost}) = ${breakevenUnits.toLocaleString()} units.`,
    };
  }
  const requiredPrice = Math.round(fixedCosts / breakevenUnits + variableCost);
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'breakeven',
    kind: 'numeric',
    difficultyTier: 3,
    prompt: `A company wants to break even at ${breakevenUnits.toLocaleString()} units. Fixed Costs are $${fixedCosts.toLocaleString()} and the Variable Cost per unit is $${variableCost}. What price must they charge?`,
    targetLabel: 'Price ($)',
    correctValue: requiredPrice,
    tolerance: 0.5,
    explanation: `Price = (Fixed Costs ÷ Breakeven Units) + Variable Cost = ($${fixedCosts.toLocaleString()} ÷ ${breakevenUnits.toLocaleString()}) + $${variableCost} = $${requiredPrice.toLocaleString()}.`,
  };
};

const PRIORITIZATION_POOL: ScenarioTemplate[] = [
  {
    tier: 3,
    context: 'A SaaS company finds that 15% of its customers generate 70% of total revenue.',
    prompt: 'What should the client prioritize first?',
    options: [
      { id: 'a', text: 'Deeply understand and retain that top 15% of customers before anything else' },
      { id: 'b', text: 'Spend equal marketing budget across all customer segments' },
      { id: 'c', text: 'Discontinue the product entirely' },
      { id: 'd', text: 'Raise prices for every customer equally' },
    ],
    correctOptionId: 'a',
    explanation: 'With a small group driving most of the revenue, retaining and understanding them is the highest-leverage move.',
  },
  {
    tier: 4,
    context: 'A factory finds that 3 of its 40 machines account for 80% of unplanned downtime.',
    prompt: 'What should the client prioritize first?',
    options: [
      { id: 'a', text: 'Replace or repair those 3 machines before scheduling maintenance across the other 37' },
      { id: 'b', text: 'Increase maintenance evenly across all 40 machines' },
      { id: 'c', text: 'Shut down the entire factory for a full audit' },
      { id: 'd', text: 'Hire more machine operators' },
    ],
    correctOptionId: 'a',
    explanation: 'A small number of machines are driving most of the downtime — fixing those first delivers the most impact for the least effort.',
  },
  {
    tier: 2,
    context: 'A call center finds that 3 of its 25 issue categories account for 75% of all support tickets.',
    prompt: 'What should the client prioritize first?',
    options: [
      { id: 'a', text: 'Fix the root cause behind those 3 issue categories first' },
      { id: 'b', text: 'Hire more support agents to answer tickets faster' },
      { id: 'c', text: 'Reduce support hours to cut costs' },
      { id: 'd', text: 'Randomly reassign tickets between categories' },
    ],
    correctOptionId: 'a',
    explanation: 'Eliminating the root cause behind the highest-volume categories reduces far more ticket volume than simply staffing up to handle it.',
  },
];

const generateMarketSizingQuestion: Generator = (rng, id) => {
  const population = randInt(rng, 100, 3000) * 1000;
  const adoptionPct = randInt(rng, 2, 15);
  const price = randInt(rng, 10, 300);
  const marketSize = Math.round(population * (adoptionPct / 100) * price);
  const solveFor = pick(rng, ['size', 'adoption'] as const);

  if (solveFor === 'size') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'market-sizing',
      kind: 'numeric',
      difficultyTier: 4,
      prompt: `A market has ${population.toLocaleString()} potential customers. Assume ${adoptionPct}% would realistically buy a $${price} product this year. What is the market size?`,
      targetLabel: 'Market Size ($)',
      correctValue: marketSize,
      tolerance: 1,
      explanation: `Market Size = Potential Customers × Adoption % × Price = ${population.toLocaleString()} × ${adoptionPct}% × $${price} = $${marketSize.toLocaleString()}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'market-sizing',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A company wants to hit $${marketSize.toLocaleString()} in sales this year. There are ${population.toLocaleString()} potential customers and the product sells for $${price}. What adoption percentage do they need?`,
    targetLabel: 'Required Adoption (%)',
    unit: '%',
    correctValue: adoptionPct,
    tolerance: 0.5,
    explanation: `Adoption % = Target Sales ÷ (Potential Customers × Price) = $${marketSize.toLocaleString()} ÷ $${(population * price).toLocaleString()} = ${adoptionPct}%.`,
  };
};

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

const generateBurnMultipleQuestion: Generator = (rng, id) => {
  const netNewArr = randInt(rng, 5, 50) * 10000;
  const multiple = randInt(rng, 10, 30) / 10;
  const netBurn = Math.round(netNewArr * multiple);
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'burn-multiple',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A startup burned $${netBurn.toLocaleString()} in cash last year and added $${netNewArr.toLocaleString()} in new ARR. What is its burn multiple?`,
      targetLabel: 'Burn Multiple (x)',
      unit: 'x',
      correctValue: multiple,
      tolerance: 0.05,
      explanation: `Burn Multiple = Net Burn ÷ Net New ARR = $${netBurn.toLocaleString()} ÷ $${netNewArr.toLocaleString()} = ${multiple}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'burn-multiple',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A startup wants a burn multiple of ${multiple} and expects to add $${netNewArr.toLocaleString()} in new ARR next year. What is the maximum cash burn they can afford?`,
    targetLabel: 'Max Burn ($)',
    correctValue: netBurn,
    tolerance: 1,
    explanation: `Max Burn = Target Burn Multiple × Net New ARR = ${multiple} × $${netNewArr.toLocaleString()} = $${netBurn.toLocaleString()}.`,
  };
};

const generateDilutionQuestion: Generator = (rng, id) => {
  const preMoney = randInt(rng, 2, 30) * 1_000_000;
  const oldOwnership = randInt(rng, 5, 30);
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    const raise = randInt(rng, 1, 10) * 500_000;
    const postMoney = preMoney + raise;
    const newOwnership = Math.round(oldOwnership * (preMoney / postMoney) * 10) / 10;
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'dilution',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `An early employee owns ${oldOwnership}% of a company valued at $${preMoney.toLocaleString()} pre-money. The company raises $${raise.toLocaleString()}. What is their ownership after the raise?`,
      targetLabel: 'New Ownership (%)',
      unit: '%',
      correctValue: newOwnership,
      tolerance: 0.1,
      explanation: `Post-Money = $${preMoney.toLocaleString()} + $${raise.toLocaleString()} = $${postMoney.toLocaleString()}. New Ownership = ${oldOwnership}% × ($${preMoney.toLocaleString()} ÷ $${postMoney.toLocaleString()}) = ${newOwnership}%.`,
    };
  }
  const newOwnership = oldOwnership - randInt(rng, 2, 8);
  const raise = Math.round(preMoney * (oldOwnership / newOwnership) - preMoney);
  const postMoney = preMoney + raise;
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'dilution',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A founder owns ${oldOwnership}% of a company valued at $${preMoney.toLocaleString()} pre-money. After a raise, their ownership drops to ${newOwnership}%. How much money was raised?`,
    targetLabel: 'Amount Raised ($)',
    correctValue: raise,
    tolerance: Math.max(1000, Math.round(raise * 0.01)),
    explanation: `Post-Money = Pre-Money × (Old% ÷ New%) = $${preMoney.toLocaleString()} × (${oldOwnership} ÷ ${newOwnership}) = $${postMoney.toLocaleString()}. Amount Raised = $${postMoney.toLocaleString()} − $${preMoney.toLocaleString()} = $${raise.toLocaleString()}.`,
  };
};

const generateMrrGrowthQuestion: Generator = (rng, id) => {
  const starting = randInt(rng, 20, 200) * 1000;
  const growthPct = randInt(rng, 5, 30);
  const ending = Math.round(starting * (1 + growthPct / 100));
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'mrr-growth',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A startup had $${starting.toLocaleString()} in MRR last month and $${ending.toLocaleString()} this month. What is the MRR growth rate?`,
      targetLabel: 'MRR Growth Rate (%)',
      unit: '%',
      correctValue: growthPct,
      tolerance: 0.5,
      explanation: `MRR Growth % = (Ending − Starting) ÷ Starting × 100 = ($${ending.toLocaleString()} − $${starting.toLocaleString()}) ÷ $${starting.toLocaleString()} × 100 = ${growthPct}%.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'mrr-growth',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A startup has $${ending.toLocaleString()} in MRR this month, up from last month at a ${growthPct}% growth rate. What was last month's MRR?`,
    targetLabel: "Last Month's MRR ($)",
    correctValue: starting,
    tolerance: Math.max(10, Math.round(starting * 0.01)),
    explanation: `Last Month's MRR = This Month's MRR ÷ (1 + Growth Rate) = $${ending.toLocaleString()} ÷ ${(1 + growthPct / 100).toFixed(2)} = $${starting.toLocaleString()}.`,
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

const generateInventoryTurnoverQuestion: Generator = (rng, id) => {
  const business = pick(rng, BUSINESS_NOUNS);
  const turnover = randInt(rng, 3, 15);
  const avgInventory = randInt(rng, 10, 100) * 1000;
  const cogs = turnover * avgInventory;
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'inventory-turnover',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A ${business} has $${cogs.toLocaleString()} in COGS this year and an Average Inventory of $${avgInventory.toLocaleString()}. What is its inventory turnover?`,
      targetLabel: 'Inventory Turnover (x)',
      unit: 'x',
      correctValue: turnover,
      tolerance: 0.1,
      explanation: `Inventory Turnover = COGS ÷ Average Inventory = $${cogs.toLocaleString()} ÷ $${avgInventory.toLocaleString()} = ${turnover}.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'inventory-turnover',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A ${business} wants an inventory turnover of ${turnover} and has $${cogs.toLocaleString()} in COGS this year. What Average Inventory does that require?`,
    targetLabel: 'Average Inventory ($)',
    correctValue: avgInventory,
    tolerance: 1,
    explanation: `Average Inventory = COGS ÷ Target Turnover = $${cogs.toLocaleString()} ÷ ${turnover} = $${avgInventory.toLocaleString()}.`,
  };
};

const generateOnTimeRateQuestion: Generator = (rng, id) => {
  const totalOrders = randInt(rng, 50, 500) * 10;
  const ratePct = randInt(rng, 85, 99);
  const onTimeOrders = Math.round(totalOrders * (ratePct / 100));
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'on-time-rate',
      kind: 'numeric',
      difficultyTier: 2,
      prompt: `A warehouse shipped ${totalOrders.toLocaleString()} orders last month, and ${onTimeOrders.toLocaleString()} arrived on time. What is the on-time delivery rate?`,
      targetLabel: 'On-Time Rate (%)',
      unit: '%',
      correctValue: Math.round((onTimeOrders / totalOrders) * 1000) / 10,
      tolerance: 0.5,
      explanation: `On-Time Rate = On-Time Orders ÷ Total Orders × 100 = ${onTimeOrders.toLocaleString()} ÷ ${totalOrders.toLocaleString()} × 100 ≈ ${Math.round((onTimeOrders / totalOrders) * 100)}%.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'on-time-rate',
    kind: 'numeric',
    difficultyTier: 4,
    prompt: `A logistics team wants a ${ratePct}% on-time rate out of ${totalOrders.toLocaleString()} orders this month. How many orders must arrive on time?`,
    targetLabel: 'On-Time Orders',
    correctValue: onTimeOrders,
    tolerance: 1,
    explanation: `On-Time Orders = Target Rate × Total Orders = ${(ratePct / 100).toFixed(2)} × ${totalOrders.toLocaleString()} = ${onTimeOrders.toLocaleString()}.`,
  };
};

const generateTaktTimeQuestion: Generator = (rng, id) => {
  const taktTime = randInt(rng, 2, 8);
  const demand = randInt(rng, 20, 200);
  const availableTime = taktTime * demand;
  const mode = pick(rng, ['forward', 'backward'] as const);

  if (mode === 'forward') {
    return {
      id,
      nodeId: DAILY_PRACTICE_NODE_ID,
      conceptId: 'takt-time',
      kind: 'numeric',
      difficultyTier: 3,
      prompt: `A factory has ${availableTime.toLocaleString()} minutes of production time per day and customers demand ${demand.toLocaleString()} units per day. What is the takt time?`,
      targetLabel: 'Takt Time (min/unit)',
      correctValue: taktTime,
      tolerance: 0.05,
      explanation: `Takt Time = Available Time ÷ Demand = ${availableTime.toLocaleString()} minutes ÷ ${demand.toLocaleString()} units = ${taktTime} minutes per unit.`,
    };
  }
  return {
    id,
    nodeId: DAILY_PRACTICE_NODE_ID,
    conceptId: 'takt-time',
    kind: 'numeric',
    difficultyTier: 5,
    prompt: `A line has a takt time of ${taktTime} minutes per unit and ${availableTime.toLocaleString()} minutes of production time per day. How many units of demand does that correspond to?`,
    targetLabel: 'Daily Demand (units)',
    correctValue: demand,
    tolerance: 1,
    explanation: `Demand = Available Time ÷ Takt Time = ${availableTime.toLocaleString()} minutes ÷ ${taktTime} minutes per unit = ${demand.toLocaleString()} units.`,
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
    conceptOrder: ['sum', 'countif', 'sumif', 'if', 'vlookup'],
    generators: {
      sum: generateSumQuestion,
      countif: generateCountifQuestion,
      sumif: generateSumifQuestion,
      if: generateIfQuestion,
      vlookup: generateVlookupQuestion,
    },
  },
  accounting: {
    conceptOrder: ['accounting-equation', 'debit-credit', 'gross-margin', 'net-income', 'current-ratio'],
    generators: {
      'accounting-equation': generateAccountingEquationQuestion,
      'debit-credit': generateDebitCreditQuestion,
      'gross-margin': generateGrossMarginQuestion,
      'net-income': generateNetIncomeQuestion,
      'current-ratio': generateCurrentRatioQuestion,
    },
  },
  marketing: {
    conceptOrder: ['channel-fit', 'segmentation', 'value-proposition', 'funnel-stage', 'conversion-rate'],
    generators: {
      'channel-fit': generateScenarioQuestion(CHANNEL_FIT_POOL, 'channel-fit'),
      segmentation: generateScenarioQuestion(SEGMENTATION_POOL, 'segmentation'),
      'value-proposition': generateScenarioQuestion(VALUE_PROP_POOL, 'value-proposition'),
      'funnel-stage': generateScenarioQuestion(FUNNEL_STAGE_POOL, 'funnel-stage'),
      'conversion-rate': generateConversionRateQuestion,
    },
  },
  consulting: {
    conceptOrder: ['profitability-framework', 'breakeven', 'framework-fit', 'prioritization', 'market-sizing'],
    generators: {
      'profitability-framework': generateProfitabilityQuestion,
      breakeven: generateBreakevenQuestion,
      'framework-fit': generateScenarioQuestion(FRAMEWORK_FIT_POOL, 'framework-fit'),
      prioritization: generateScenarioQuestion(PRIORITIZATION_POOL, 'prioritization'),
      'market-sizing': generateMarketSizingQuestion,
    },
  },
  startups: {
    conceptOrder: ['cac-ltv', 'burn-multiple', 'runway', 'dilution', 'mrr-growth'],
    generators: {
      'cac-ltv': generateCacLtvQuestion,
      'burn-multiple': generateBurnMultipleQuestion,
      runway: generateRunwayQuestion,
      dilution: generateDilutionQuestion,
      'mrr-growth': generateMrrGrowthQuestion,
    },
  },
  operations: {
    conceptOrder: [
      'bottleneck-identification',
      'inventory-turnover',
      'throughput-calc',
      'on-time-rate',
      'takt-time',
    ],
    generators: {
      'bottleneck-identification': generateBottleneckQuestion,
      'inventory-turnover': generateInventoryTurnoverQuestion,
      'throughput-calc': generateThroughputQuestion,
      'on-time-rate': generateOnTimeRateQuestion,
      'takt-time': generateTaktTimeQuestion,
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
