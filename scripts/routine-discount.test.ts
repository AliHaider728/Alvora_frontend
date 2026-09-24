import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { calculateRoutineDiscount, DEFAULT_ROUTINE_DISCOUNT, validateRoutineSettings } from '../src/lib/routineDiscount';

const lines = (quantities: number[]) => quantities.map((quantity, i) => ({ productId: `product-${i}`, quantity, unitPrice: 1000 }));

for (const scenario of [
  { quantities: [1, 1], percent: 10, subtotal: 2000, savings: 200, total: 1800 },
  { quantities: [1, 1, 1], percent: 15, subtotal: 3000, savings: 450, total: 2550 },
  { quantities: [2, 1], percent: 15, subtotal: 3000, savings: 450, total: 2550 },
  { quantities: [3, 1, 1], percent: 20, subtotal: 5000, savings: 1000, total: 4000 },
  { quantities: [1], percent: 0, subtotal: 1000, savings: 0, total: 1000 },
]) {
  test(`routine quantities ${scenario.quantities}: ${scenario.percent}% and Rs. ${scenario.total}`, () => {
    const result = calculateRoutineDiscount(lines(scenario.quantities));
    for (const key of ['percent', 'subtotal', 'savings', 'total'] as const) assert.equal(result[key], scenario[key]);
  });
}

test('quantity bonus is flat, disappears on decrement, and requires distinct products', () => {
  assert.equal(calculateRoutineDiscount(lines([5, 1, 1])).percent, 20);
  assert.equal(calculateRoutineDiscount(lines([1, 1, 1])).percent, 15);
  assert.equal(calculateRoutineDiscount(lines([9])).percent, 0);
  assert.equal(calculateRoutineDiscount([]).percent, 0);
});

test('split lines/variants count by product ID, not cart rows', () => {
  const items = [{ productId: 'a', quantity: 1, unitPrice: 1000 }, { productId: 'a', quantity: 2, unitPrice: 2000 }];
  assert.equal(calculateRoutineDiscount(items).percent, 0);
  const result = calculateRoutineDiscount([...items, { productId: 'b', quantity: 1, unitPrice: 1000 }]);
  assert.equal(result.distinctCount, 2);
  assert.equal(result.percent, 15);
  assert.equal(result.savings, 900);
});

test('custom tiers, minimum and disabled bonus are respected', () => {
  const custom = validateRoutineSettings({ minimumDistinctProducts: 3, tiers: [{ minProducts: 5, discountPercent: 25 }, { minProducts: 3, discountPercent: 12 }, { minProducts: 4, discountPercent: 18 }], quantityBonusEnabled: true, quantityBonusPercent: 7 });
  assert.equal(calculateRoutineDiscount(lines([3, 1]), custom).percent, 0);
  assert.equal(calculateRoutineDiscount(lines([1, 1, 1]), custom).percent, 12);
  assert.equal(calculateRoutineDiscount(lines([2, 1, 1, 1]), custom).percent, 25);
  assert.equal(calculateRoutineDiscount(lines([2, 1, 1, 1, 1]), custom).percent, 32);
  assert.equal(calculateRoutineDiscount(lines([2, 1, 1, 1, 1]), { ...custom, quantityBonusEnabled: false }).percent, 25);
});

test('settings reject duplicate thresholds and discounts exceeding 100%', () => {
  assert.throws(() => validateRoutineSettings({ ...DEFAULT_ROUTINE_DISCOUNT, tiers: [{ minProducts: 2, discountPercent: 10 }, { minProducts: 2, discountPercent: 15 }] }));
  assert.throws(() => validateRoutineSettings({ ...DEFAULT_ROUTINE_DISCOUNT, quantityBonusPercent: 90 }));
  assert.throws(() => validateRoutineSettings({ ...DEFAULT_ROUTINE_DISCOUNT, minimumDistinctProducts: 1.5 }));
  assert.throws(() => validateRoutineSettings({ ...DEFAULT_ROUTINE_DISCOUNT, tiers: [] }));
});

test('frontend and backend calculators stay identical across independent deployments', () => {
  assert.equal(readFileSync(new URL('../src/lib/routineDiscount.ts', import.meta.url), 'utf8'), readFileSync(new URL('../../backend/src/lib/routineDiscount.ts', import.meta.url), 'utf8'));
});

test('whole PKR display stays consistent when the percentage creates half a rupee', () => {
  const result = calculateRoutineDiscount([1450, 1600, 1400].map((unitPrice, i) => ({ productId: String(i), quantity: 1, unitPrice })));
  assert.equal(result.subtotal, 4450);
  assert.equal(result.savings, 668);
  assert.equal(result.total, 3782);
});
