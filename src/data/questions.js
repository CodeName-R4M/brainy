// Question generators replicating the semantics of the original app:
// - mixed +/- are evaluated strictly left-to-right
// - division questions carry a quotient + remainder
// - column-style questions (add/sub/mixed/decimal) expose a `numbers` array

export const OPERATION_LABELS = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  mixed_multiplication: 'Mixed Multiplication',
  mixed_operations: 'Mixed Operations',
  decimal_addition: 'Decimal Addition',
  decimal_subtraction: 'Decimal Subtraction',
  decimal_mixed: 'Decimal Mixed',
  tables: 'Times Tables'
};

export const OPERATION_EMOJI = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
  mixed_multiplication: '✖️',
  mixed_operations: '🔀',
  decimal_addition: '🔢',
  decimal_subtraction: '🔢',
  decimal_mixed: '🔀',
  tables: '📊'
};

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const round2 = (n) => Math.round(n * 100) / 100;

function addition(numRows = 3, max = 20) {
  const numbers = Array.from({ length: numRows }, () => rand(1, max));
  const answer = numbers.reduce((a, b) => a + b, 0);
  return { type: 'addition', numbers, operator: '+', answer, isDivision: false, isMixedOps: false, questionText: numbers.join(' + ') };
}

function subtraction(numRows = 3, max = 20) {
  const rest = Array.from({ length: numRows - 1 }, () => rand(1, 9));
  const first = rest.reduce((a, b) => a + b, 0) + rand(1, max);
  const numbers = [first, ...rest];
  return { type: 'subtraction', numbers, operator: '-', answer: first - rest.reduce((a, b) => a + b, 0), isDivision: false, isMixedOps: false, questionText: `${first} - ${rest.join(' - ')}` };
}

function multiplication(variation = '2x1') {
  let a, b;
  switch (variation) {
    case '2x1': a = rand(10, 99); b = rand(2, 9); break;
    case '2x2': a = rand(10, 99); b = rand(10, 99); break;
    case '3x1': a = rand(100, 999); b = rand(2, 9); break;
    case '3x2': a = rand(100, 999); b = rand(10, 99); break;
    default: a = rand(10, 99); b = rand(2, 9);
  }
  return { type: 'multiplication', multiplicand: a, multiplier: b, answer: a * b, isDivision: false, isMixedOps: false, questionText: `${a} × ${b}` };
}

function mixedMultiplication() {
  const a = rand(1, 9), b = rand(1, 9);
  return { type: 'mixed_multiplication', multiplicand: a, multiplier: b, answer: a * b, isDivision: false, isMixedOps: false, questionText: `${a} × ${b}` };
}

function division(variation = '3d1') {
  let divisor, quotient;
  switch (variation) {
    case '2d1': divisor = rand(2, 9); quotient = rand(5, 15); break;
    case '3d1': divisor = rand(2, 9); quotient = rand(50, 150); break;
    default: divisor = rand(2, 9); quotient = rand(2, 15);
  }
  const remainder = rand(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return {
    type: 'division', dividend, divisor, answer: quotient,
    divisionAnswer: { quotient, remainder }, isDivision: true, isMixedOps: false,
    questionText: `${dividend} ÷ ${divisor}`
  };
}

function mixedOperations(numRows = 3, max = 9) {
  const numbers = [rand(3, max)];
  const operators = [];
  let acc = numbers[0];
  for (let i = 1; i < numRows; i++) {
    const op = Math.random() < 0.6 || acc <= 1 ? '+' : '-';
    const n = rand(1, max);
    if (op === '-' && acc - n < 0) { operators.push('+'); acc += n; } else { operators.push(op); acc = op === '+' ? acc + n : acc - n; }
    numbers.push(n);
  }
  if (!operators.includes('-') && operators.length) { operators[operators.length - 1] = '-'; acc = numbers.reduce((a, n, i) => (i === 0 ? n : operators[i - 1] === '+' ? a + n : a - n), 0); }
  const parts = [String(numbers[0])];
  operators.forEach((op, i) => parts.push(`${op} ${numbers[i + 1]}`));
  return { type: 'mixed_operations', numbers, operators, operator: '+', answer: acc, isDivision: false, isMixedOps: true, questionText: parts.join(' ') };
}

function decimalAddition(numRows = 3) {
  const numbers = Array.from({ length: numRows }, () => round2(parseFloat(`${rand(10, 99)}.${rand(1, 99)}`)));
  const answer = round2(numbers.reduce((a, b) => a + b, 0));
  return { type: 'decimal_addition', numbers, operator: '+', answer, isDivision: false, isMixedOps: false, questionText: numbers.map((n) => n.toFixed(2)).join(' + ') };
}

function decimalSubtraction(numRows = 3) {
  const rest = Array.from({ length: numRows - 1 }, () => round2(parseFloat(`${rand(10, 30)}.${rand(1, 99)}`)));
  const first = round2(rest.reduce((a, b) => a + b, 0) + rand(1, 20));
  const numbers = [first, ...rest];
  const answer = Math.max(0, round2(first - rest.reduce((a, b) => a + b, 0)));
  return { type: 'decimal_subtraction', numbers, operator: '-', answer, isDivision: false, isMixedOps: false, questionText: `${first.toFixed(2)} - ${rest.map((n) => n.toFixed(2)).join(' - ')}` };
}

function decimalMixed(numRows = 3) {
  const numbers = [round2(parseFloat(`${rand(10, 30)}.${rand(1, 99)}`))];
  const operators = [];
  let acc = numbers[0];
  for (let i = 1; i < numRows; i++) {
    const n = round2(parseFloat(`${rand(10, 30)}.${rand(1, 99)}`));
    const op = acc - n >= 0 && Math.random() < 0.5 ? '-' : '+';
    operators.push(op); acc = round2(op === '-' ? acc - n : acc + n); numbers.push(n);
  }
  const parts = [numbers[0].toFixed(2)];
  operators.forEach((op, i) => parts.push(`${op} ${numbers[i + 1].toFixed(2)}`));
  return { type: 'decimal_mixed', numbers, operators, operator: '+', answer: round2(acc), isDivision: false, isMixedOps: true, questionText: parts.join(' ') };
}

export function makeTableQuestion(table, mult) {
  return { type: 'tables', multiplier: table, multiplicand: mult, answer: table * mult, isDivision: false, isMixedOps: false, questionText: `${table} × ${mult}` };
}

const VARIATION_BY_LEVEL = {
  junior: '2x1', 1: '2x1', 2: '2x1', 3: '3x1', 4: '3x1', 5: '3x2', 6: '3x2', 7: '2x2', 8: '3x2'
};

export function generateQuestion(operation, level = 'junior') {
  const numRows = typeof level === 'number' && level >= 5 ? 4 : 3;
  switch (operation) {
    case 'addition': return addition(numRows, 9 * (typeof level === 'number' ? level + 1 : 2));
    case 'subtraction': return subtraction(numRows, 9);
    case 'multiplication': return multiplication(VARIATION_BY_LEVEL[level] || '2x1');
    case 'mixed_multiplication': return mixedMultiplication();
    case 'division': return division(VARIATION_BY_LEVEL[level] === '3x2' ? '3d1' : '3d1');
    case 'mixed_operations': return mixedOperations(numRows, 9);
    case 'decimal_addition': return decimalAddition(Math.min(numRows, 3));
    case 'decimal_subtraction': return decimalSubtraction(Math.min(numRows, 3));
    case 'decimal_mixed': return decimalMixed(Math.min(numRows, 3));
    case 'tables': return makeTableQuestion(rand(2, 9), rand(2, 12));
    default: return addition(numRows, 20);
  }
}

export function generateSet(operation, count, level = 'junior') {
  const seen = new Set();
  const out = [];
  let guard = 0;
  while (out.length < count && guard < count * 8) {
    guard++;
    const q = generateQuestion(operation, level);
    if (seen.has(q.questionText)) continue;
    seen.add(q.questionText);
    out.push(q);
  }
  return out;
}

export const LEVELS = ['junior', '1', '2', '3', '4', '5', '6', '7', '8'];
export const levelLabel = (l) => (l === 'junior' ? 'Junior' : `Level ${l}`);
export const levelValue = (l) => (l === 'junior' ? 0 : parseInt(l, 10));
