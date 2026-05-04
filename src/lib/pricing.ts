import { UserType } from '@/data/journeyData';
import {
  BASE_PRICE, VULNERABILITY_OPTIONS, URBANIZATION_OPTIONS, PROMO_CODES,
} from './onboardingData';

export interface PricingInput {
  userType: UserType;
  vulnerabilities: string[];
  urbanization: string;
  hasExternalFunder: boolean;
  promoCode: string;
}

export interface PricingLine {
  label: string;
  amount: number;     // signed amount in PHP (negative = discount)
  type: 'base' | 'discount' | 'surcharge' | 'promo';
}

export interface PricingResult {
  base: number;
  finalPrice: number;
  totalDiscount: number;
  totalSurcharge: number;
  lines: PricingLine[];
  effectiveDiscountPct: number;
  promoApplied: boolean;
  promoLabel?: string;
}

export function computePricing(input: PricingInput): PricingResult {
  const base = BASE_PRICE[input.userType] ?? 499;
  const lines: PricingLine[] = [{ label: `Base ${labelForType(input.userType)} plan`, amount: base, type: 'base' }];

  // Vulnerability discounts — use the LARGEST single discount + 50% of any additional ones
  // (prevents stacking abuse while still rewarding multiple contexts)
  const vulnHits = VULNERABILITY_OPTIONS
    .filter((v) => input.vulnerabilities.includes(v.id))
    .sort((a, b) => (a.modifier ?? 0) - (b.modifier ?? 0)); // most negative first

  vulnHits.forEach((v, idx) => {
    const factor = idx === 0 ? 1 : 0.5;
    const amount = Math.round(base * (v.modifier ?? 0) * factor);
    if (amount !== 0) {
      lines.push({ label: `${v.label}${idx > 0 ? ' (stacked)' : ''}`, amount, type: 'discount' });
    }
  });

  // Urbanization
  const urb = URBANIZATION_OPTIONS.find((u) => u.id === input.urbanization);
  if (urb && urb.modifier && urb.modifier !== 0) {
    const amount = Math.round(base * urb.modifier);
    lines.push({
      label: urb.label,
      amount,
      type: amount > 0 ? 'surcharge' : 'discount',
    });
  }

  // External funder surcharge (the entity has external funding, pays more for cross-subsidy)
  if (input.hasExternalFunder) {
    const amount = Math.round(base * 0.10);
    lines.push({ label: 'Has external funder (cross-subsidy)', amount, type: 'surcharge' });
  }

  // Promo code (applied last to subtotal)
  let subtotal = lines.reduce((s, l) => s + l.amount, 0);
  let promoApplied = false;
  let promoLabel: string | undefined;
  const promoEntry = PROMO_CODES[input.promoCode?.toUpperCase().trim()];
  if (promoEntry) {
    const promoAmount = -Math.round(subtotal * promoEntry.discount);
    lines.push({ label: `Promo: ${promoEntry.label}`, amount: promoAmount, type: 'promo' });
    subtotal += promoAmount;
    promoApplied = true;
    promoLabel = promoEntry.label;
  }

  const finalPrice = Math.max(0, subtotal);
  const totalDiscount = lines.filter((l) => l.amount < 0).reduce((s, l) => s + l.amount, 0);
  const totalSurcharge = lines.filter((l) => l.type === 'surcharge').reduce((s, l) => s + l.amount, 0);
  const effectiveDiscountPct = base > 0 ? Math.round(((base - finalPrice) / base) * 100) : 0;

  return {
    base,
    finalPrice,
    totalDiscount,
    totalSurcharge,
    lines,
    effectiveDiscountPct,
    promoApplied,
    promoLabel,
  };
}

export function formatPHP(n: number): string {
  const sign = n < 0 ? '−' : '';
  return `${sign}₱${Math.abs(n).toLocaleString('en-PH')}`;
}

function labelForType(t: UserType): string {
  switch (t) {
    case 'individual': return 'Individual';
    case 'mhp': return 'MHP Pro';
    case 'community': return 'Community';
    case 'organization': return 'Organization';
  }
}
