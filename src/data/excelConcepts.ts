import { ConceptTeaching } from '../types';
import { NODE_ID } from './excelBasics';

export const EXCEL_CONCEPTS: Record<string, ConceptTeaching> = {
  sum: {
    id: 'sum',
    trackId: 'finance',
    nodeId: NODE_ID,
    title: 'SUM: adding a column of numbers',
    whatItDoes:
      'SUM adds up every number in a range of cells, so you never have to chain together a long string of + signs by hand.',
    realWorldScenario:
      "You're a retail analyst closing out the week. Instead of adding thirty daily sales figures one at a time, you write one SUM formula and get the week's total instantly. It's the single most-used formula in business spreadsheets.",
    example: {
      scenarioPrompt:
        "A coffee shop logs cups sold each day in B2:B6. Here's how you'd total the week in B7:",
      columnHeaders: ['Day', 'Cups Sold'],
      cells: [
        { row: 2, col: 1, value: 'Mon' },
        { row: 2, col: 2, value: '52' },
        { row: 3, col: 1, value: 'Tue' },
        { row: 3, col: 2, value: '61' },
        { row: 4, col: 1, value: 'Wed' },
        { row: 4, col: 2, value: '58' },
        { row: 5, col: 1, value: 'Thu' },
        { row: 5, col: 2, value: '64' },
        { row: 6, col: 1, value: 'Fri' },
        { row: 6, col: 2, value: '70' },
      ],
      targetLabel: 'B7',
      answer: '=SUM(B2:B6)',
      resultExplanation:
        'This adds 52 + 61 + 58 + 64 + 70 = 305 cups for the week in a single step. Now try the same idea on a different table.',
    },
  },
  countif: {
    id: 'countif',
    trackId: 'finance',
    nodeId: NODE_ID,
    title: 'COUNTIF: counting rows that match a condition',
    whatItDoes:
      'COUNTIF counts how many cells in a range meet a condition — it answers "how many," not "how much." No summing involved.',
    realWorldScenario:
      "You're a sales manager who wants to know how many reps hit their quota this month, not the total revenue. COUNTIF answers that directly instead of you counting rows by eye.",
    example: {
      scenarioPrompt: 'A shift log lists Drink Type for 5 orders in B2:B6. Count how many were Lattes in B7:',
      columnHeaders: ['Day', 'Drink Type'],
      cells: [
        { row: 2, col: 1, value: 'Mon' },
        { row: 2, col: 2, value: 'Latte' },
        { row: 3, col: 1, value: 'Tue' },
        { row: 3, col: 2, value: 'Drip' },
        { row: 4, col: 1, value: 'Wed' },
        { row: 4, col: 2, value: 'Latte' },
        { row: 5, col: 1, value: 'Thu' },
        { row: 5, col: 2, value: 'Drip' },
        { row: 6, col: 1, value: 'Fri' },
        { row: 6, col: 2, value: 'Latte' },
      ],
      targetLabel: 'B7',
      answer: '=COUNTIF(B2:B6,"Latte")',
      resultExplanation:
        'COUNTIF(range, criteria) checks each cell in B2:B6 against "Latte" and returns how many matched: 3. No values are added, just counted.',
    },
  },
  sumif: {
    id: 'sumif',
    trackId: 'finance',
    nodeId: NODE_ID,
    title: 'SUMIF: adding only the rows that match a condition',
    whatItDoes:
      'SUMIF works like SUM, but it only totals the rows where another column matches a condition you set — a conditional total.',
    realWorldScenario:
      "You're a sales manager who wants total revenue from just one region or one product line, without manually filtering and re-summing every time a new number comes in. SUMIF does that in one formula that updates itself automatically.",
    example: {
      scenarioPrompt:
        'The coffee shop now tracks Drink Type alongside Cups Sold. Total up just the Lattes in C7:',
      columnHeaders: ['Day', 'Drink Type', 'Cups Sold'],
      cells: [
        { row: 2, col: 1, value: 'Mon' },
        { row: 2, col: 2, value: 'Latte' },
        { row: 2, col: 3, value: '20' },
        { row: 3, col: 1, value: 'Tue' },
        { row: 3, col: 2, value: 'Drip' },
        { row: 3, col: 3, value: '25' },
        { row: 4, col: 1, value: 'Wed' },
        { row: 4, col: 2, value: 'Latte' },
        { row: 4, col: 3, value: '18' },
        { row: 5, col: 1, value: 'Thu' },
        { row: 5, col: 2, value: 'Drip' },
        { row: 5, col: 3, value: '30' },
        { row: 6, col: 1, value: 'Fri' },
        { row: 6, col: 2, value: 'Latte' },
        { row: 6, col: 3, value: '22' },
      ],
      targetLabel: 'C7',
      answer: '=SUMIF(B2:B6,"Latte",C2:C6)',
      resultExplanation:
        'SUMIF checks B2:B6 for "Latte", and only adds the matching Cups Sold values: 20 + 18 + 22 = 60 lattes sold this week.',
    },
  },
  if: {
    id: 'if',
    trackId: 'finance',
    nodeId: NODE_ID,
    title: 'IF: return one value when true, another when false',
    whatItDoes:
      'IF(condition, value_if_true, value_if_false) lets a cell show different results depending on whether a condition holds — the basic building block of conditional logic in a spreadsheet.',
    realWorldScenario:
      "You're building a commission tracker and want a column that automatically labels each rep \"Bonus\" or \"No Bonus\" depending on whether they hit their target, instead of manually reviewing every row.",
    example: {
      scenarioPrompt: "A rep's Units sold is in B2. Show \"Bonus\" in C2 if B2 is at least 50, otherwise \"No Bonus\":",
      columnHeaders: ['Rep', 'Units'],
      cells: [
        { row: 2, col: 1, value: 'Alex' },
        { row: 2, col: 2, value: '62' },
      ],
      targetLabel: 'C2',
      answer: '=IF(B2>=50,"Bonus","No Bonus")',
      resultExplanation:
        'IF checks B2>=50 first; since 62 is at least 50, it returns "Bonus". One formula replaces manually reviewing every row.',
    },
  },
  vlookup: {
    id: 'vlookup',
    trackId: 'finance',
    nodeId: NODE_ID,
    title: 'VLOOKUP: looking up a value by matching a row',
    whatItDoes:
      "VLOOKUP searches down the first column of a table for a value you give it, then returns a value from another column in that same row — like looking someone up in a directory.",
    realWorldScenario:
      "You're building a commission report and need to pull each employee's sales total from a separate table just by typing their name, instead of scrolling to find them every time. VLOOKUP does that lookup instantly, and it's the formula behind most \"pull data from another sheet\" tasks in real jobs.",
    example: {
      scenarioPrompt:
        "A small table lists employees and their sales totals. Look up Maria's total in D2:",
      columnHeaders: ['Employee', 'Sales Total'],
      cells: [
        { row: 2, col: 1, value: 'Sam' },
        { row: 2, col: 2, value: '$4,200' },
        { row: 3, col: 1, value: 'Maria' },
        { row: 3, col: 2, value: '$5,800' },
        { row: 4, col: 1, value: 'Jon' },
        { row: 4, col: 2, value: '$3,100' },
        { row: 5, col: 1, value: 'Priya' },
        { row: 5, col: 2, value: '$6,400' },
      ],
      targetLabel: 'D2',
      answer: '=VLOOKUP("Maria",A2:B5,2,FALSE)',
      resultExplanation:
        'VLOOKUP scans A2:A5 for "Maria", finds her in row 3, then returns the value from the 2nd column of that row: $5,800. FALSE means an exact match only.',
    },
  },
};
