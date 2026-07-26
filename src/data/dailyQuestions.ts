import { LessonQuestion, TrackId } from '../types';
import { createRng, pickN, randInt, Rng } from '../utils/seededRandom';

export const DAILY_PRACTICE_NODE_ID = 'daily-practice';
export const QUESTIONS_PER_CONCEPT = 5;

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

function cellsFromRows(rows: SalesRow[]): LessonQuestion['cells'] {
  const cells: LessonQuestion['cells'] = [];
  rows.forEach(({ row, item, region, units, price, revenue }) => {
    cells.push({ row, col: 1, value: item });
    cells.push({ row, col: 2, value: region });
    cells.push({ row, col: 3, value: String(units) });
    cells.push({ row, col: 4, value: `$${price}` });
    cells.push({ row, col: 5, value: `$${revenue}` });
  });
  return cells;
}

function generateSumQuestion(rng: Rng, id: string): LessonQuestion {
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
}

function generateSumifQuestion(rng: Rng, id: string): LessonQuestion {
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
}

function generateVlookupQuestion(rng: Rng, id: string): LessonQuestion {
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
}

const GENERATORS: Record<string, (rng: Rng, id: string) => LessonQuestion> = {
  sum: generateSumQuestion,
  sumif: generateSumifQuestion,
  vlookup: generateVlookupQuestion,
};

const CONCEPT_ORDER = ['sum', 'sumif', 'vlookup'];

/** Same track + same date always yields the same set of questions; a new date yields fresh ones. */
export function generateDailyQuestions(trackId: TrackId, dateStr: string): LessonQuestion[] {
  if (trackId !== 'finance') return [];

  const questions: LessonQuestion[] = [];
  CONCEPT_ORDER.forEach((conceptId) => {
    const generator = GENERATORS[conceptId];
    for (let i = 0; i < QUESTIONS_PER_CONCEPT; i++) {
      const seed = `${trackId}-${dateStr}-${conceptId}-${i}`;
      const rng = createRng(seed);
      questions.push(generator(rng, seed));
    }
  });
  return questions;
}
