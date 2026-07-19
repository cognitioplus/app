import { describe, it, expect } from 'vitest';
import { computePricing, formatPHP } from './pricing';

const baseInput = {
  userType: 'individual' as const,
  vulnerabilities: [] as string[],
  urbanization: 'urban',
  hasExternalFunder: false,
  promoCode: '',
};

describe('computePricing — base prices', () => {
  it.each([
    ['individual', 499],
    ['mhp', 1499],
    ['community', 2999],
    ['organization', 7999],
  ] as const)('%s starts at %d PHP', (userType, price) => {
    const r = computePricing({ ...baseInput, userType });
    expect(r.base).toBe(price);
    expect(r.finalPrice).toBe(price);
    expect(r.lines).toHaveLength(1);
    expect(r.lines[0].type).toBe('base');
  });
});

describe('computePricing — vulnerability discounts', () => {
  it('applies the full modifier for a single vulnerability', () => {
    const r = computePricing({ ...baseInput, vulnerabilities: ['low_income'] });
    // -30% of 499 = -149.7 → -150
    expect(r.lines[1]).toMatchObject({ amount: -150, type: 'discount' });
    expect(r.finalPrice).toBe(349);
  });

  it('anti-stacking: largest discount full, additional ones halved', () => {
    const r = computePricing({ ...baseInput, vulnerabilities: ['pwd', 'low_income'] });
    // low_income (-0.30) sorts first: -150; pwd halved: round(499 * -0.20 * 0.5) = -50
    expect(r.finalPrice).toBe(499 - 150 - 50);
    const stacked = r.lines.find((l) => l.label.includes('(stacked)'));
    expect(stacked?.amount).toBe(-50);
  });

  it('ignores unknown vulnerability ids', () => {
    const r = computePricing({ ...baseInput, vulnerabilities: ['not_a_thing'] });
    expect(r.finalPrice).toBe(499);
  });
});

describe('computePricing — urbanization & funder', () => {
  it('rural gives a 10% discount typed as discount', () => {
    const r = computePricing({ ...baseInput, urbanization: 'rural' });
    expect(r.lines[1]).toMatchObject({ amount: -50, type: 'discount' });
    expect(r.finalPrice).toBe(449);
  });

  it('highly urbanized city adds a 20% surcharge', () => {
    const r = computePricing({ ...baseInput, urbanization: 'huc' });
    expect(r.lines[1]).toMatchObject({ amount: 100, type: 'surcharge' });
    expect(r.finalPrice).toBe(599);
  });

  it('external funder adds a 10% cross-subsidy surcharge', () => {
    const r = computePricing({ ...baseInput, hasExternalFunder: true });
    expect(r.lines[1]).toMatchObject({ amount: 50, type: 'surcharge' });
    expect(r.totalSurcharge).toBe(50);
  });
});

describe('computePricing — promo codes', () => {
  it('applies WELCOME50 to the subtotal (applied last)', () => {
    const r = computePricing({ ...baseInput, promoCode: 'WELCOME50' });
    // subtotal 499 → promo -250 → 249
    expect(r.finalPrice).toBe(249);
    expect(r.promoApplied).toBe(true);
    expect(r.promoLabel).toContain('Welcome');
    expect(r.lines.at(-1)?.type).toBe('promo');
  });

  it('is case-insensitive and trims whitespace', () => {
    const r = computePricing({ ...baseInput, promoCode: '  welcome50 ' });
    expect(r.promoApplied).toBe(true);
  });

  it('ignores unknown promo codes', () => {
    const r = computePricing({ ...baseInput, promoCode: 'HACKER100' });
    expect(r.promoApplied).toBe(false);
    expect(r.finalPrice).toBe(499);
  });

  it('promo applies AFTER discounts (on subtotal, not base)', () => {
    const r = computePricing({ ...baseInput, vulnerabilities: ['low_income'], promoCode: 'WELCOME50' });
    // subtotal = 499 - 150 = 349 → promo = -round(349 * 0.5) = -175 → 174
    expect(r.finalPrice).toBe(174);
  });
});

describe('computePricing — invariants', () => {
  it('final price never goes below zero and discount pct stays within [0,100]', () => {
    const r = computePricing({
      ...baseInput,
      vulnerabilities: ['low_income', 'indigenous', 'pwd', 'youth_underserved', 'solo_parent', 'senior'],
      urbanization: 'rural',
      promoCode: 'WELCOME50',
    });
    expect(r.finalPrice).toBeGreaterThanOrEqual(0);
    expect(r.effectiveDiscountPct).toBeGreaterThanOrEqual(0);
    expect(r.effectiveDiscountPct).toBeLessThanOrEqual(100);
    // lines always sum to the final price
    const sum = r.lines.reduce((s, l) => s + l.amount, 0);
    expect(sum).toBe(r.finalPrice);
  });

  it('effectiveDiscountPct reflects base vs final', () => {
    const r = computePricing({ ...baseInput, promoCode: 'WELCOME50' });
    expect(r.effectiveDiscountPct).toBe(50);
  });
});

describe('formatPHP', () => {
  it('formats positive amounts with thousands separator', () => {
    expect(formatPHP(1499)).toBe('₱1,499');
    expect(formatPHP(7999)).toBe('₱7,999');
  });
  it('formats negatives with a minus sign before the peso sign', () => {
    expect(formatPHP(-250)).toBe('−₱250');
  });
  it('formats zero', () => {
    expect(formatPHP(0)).toBe('₱0');
  });
});
