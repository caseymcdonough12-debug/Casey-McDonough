import { LessonQuestion, SpreadsheetCell } from '../types';

export const NODE_ID = 'finance-excel-basics';

const SALES_HEADERS = ['Item', 'Region', 'Units', 'Price', 'Revenue'];

const salesRows = [
  { row: 2, item: 'Notebook', region: 'West', units: 40, price: 4, revenue: 160 },
  { row: 3, item: 'Backpack', region: 'East', units: 12, price: 35, revenue: 420 },
  { row: 4, item: 'Water Bottle', region: 'West', units: 60, price: 8, revenue: 480 },
  { row: 5, item: 'Desk Lamp', region: 'East', units: 15, price: 22, revenue: 330 },
  { row: 6, item: 'Headphones', region: 'West', units: 9, price: 60, revenue: 540 },
];

function salesCells() {
  const cells: SpreadsheetCell[] = [];
  salesRows.forEach(({ row, item, region, units, price, revenue }) => {
    cells.push({ row, col: 1, value: item });
    cells.push({ row, col: 2, value: region });
    cells.push({ row, col: 3, value: String(units) });
    cells.push({ row, col: 4, value: `$${price}` });
    cells.push({ row, col: 5, value: `$${revenue}` });
  });
  return cells;
}

export const EXCEL_BASICS_QUESTIONS: LessonQuestion[] = [
  {
    id: 'excel-q1-sum-units',
    nodeId: NODE_ID,
    conceptId: 'sum',
    kind: 'formula',
    difficultyTier: 1,
    prompt:
      'Your manager wants the total number of units sold across all five rows. Type a formula in C7 that adds up C2 through C6.',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'C7',
    acceptedFormulas: ['=SUM(C2:C6)'],
    correctFormula: '=SUM(C2:C6)',
    explanation:
      'SUM(range) adds every number in the range. =SUM(C2:C6) adds C2, C3, C4, C5, and C6 in one shot instead of typing =C2+C3+C4+C5+C6.',
  },
  {
    id: 'excel-q2-sum-revenue',
    nodeId: NODE_ID,
    conceptId: 'sum',
    kind: 'formula',
    difficultyTier: 1,
    prompt:
      'Now total the Revenue column so you can see overall sales. Type a formula in E7 that sums E2 through E6.',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'E7',
    acceptedFormulas: ['=SUM(E2:E6)'],
    correctFormula: '=SUM(E2:E6)',
    explanation:
      'Same idea as before, just a different column: =SUM(E2:E6) totals every revenue value in that range.',
  },
  {
    id: 'excel-q3-sumif-west-units',
    nodeId: NODE_ID,
    conceptId: 'sumif',
    kind: 'formula',
    difficultyTier: 3,
    prompt:
      'You only want units sold in the West region. Type a formula in C8 that sums C2:C6, but only where B2:B6 equals "West".',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'C8',
    acceptedFormulas: ['=SUMIF(B2:B6,"WEST",C2:C6)'],
    correctFormula: '=SUMIF(B2:B6,"West",C2:C6)',
    explanation:
      'SUMIF(range, criteria, sum_range) checks each cell in B2:B6 against "West", and only adds the matching rows from C2:C6. It\'s a conditional SUM.',
  },
  {
    id: 'excel-q4-sumif-east-revenue',
    nodeId: NODE_ID,
    conceptId: 'sumif',
    kind: 'formula',
    difficultyTier: 3,
    prompt:
      'Now find total Revenue for the East region only. Type a formula in E8 using SUMIF on B2:B6 / E2:E6.',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'E8',
    acceptedFormulas: ['=SUMIF(B2:B6,"EAST",E2:E6)'],
    correctFormula: '=SUMIF(B2:B6,"East",E2:E6)',
    explanation:
      '=SUMIF(B2:B6,"East",E2:E6) sums E2:E6 only for the rows where the Region column reads "East".',
  },
  {
    id: 'excel-q5-vlookup-price',
    nodeId: NODE_ID,
    conceptId: 'vlookup',
    kind: 'formula',
    difficultyTier: 4,
    prompt:
      'You need to look up the Price for "Desk Lamp" without scrolling the table yourself. Type a formula in H2 that looks up "Desk Lamp" in A2:A6 and returns the matching value from column D (the 4th column of A2:D6), using an exact match.',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'H2',
    acceptedFormulas: ['=VLOOKUP("DESK LAMP",A2:D6,4,FALSE)'],
    correctFormula: '=VLOOKUP("Desk Lamp",A2:D6,4,FALSE)',
    explanation:
      'VLOOKUP(value, table, col_index, exact_match) searches the first column of the table for "Desk Lamp", then returns the value from the 4th column of that same row (Price). FALSE forces an exact match instead of an approximate one.',
  },
  {
    id: 'excel-q6-vlookup-region',
    nodeId: NODE_ID,
    conceptId: 'vlookup',
    kind: 'formula',
    difficultyTier: 5,
    prompt:
      'Now look up which Region "Headphones" belongs to. Type a formula in H3 that looks up "Headphones" in A2:A6 and returns the matching value from column B (the 2nd column of A2:B6), exact match.',
    columnHeaders: SALES_HEADERS,
    cells: salesCells(),
    targetCellLabel: 'H3',
    acceptedFormulas: ['=VLOOKUP("HEADPHONES",A2:B6,2,FALSE)'],
    correctFormula: '=VLOOKUP("Headphones",A2:B6,2,FALSE)',
    explanation:
      'Same VLOOKUP pattern, smaller table: A2:B6 only spans Item and Region, so column index 2 returns the Region for the matched Item.',
  },
];
