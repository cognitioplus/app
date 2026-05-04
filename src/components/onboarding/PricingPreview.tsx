import React from 'react';
import { PricingResult, formatPHP } from '@/lib/pricing';
import { TrendingDown, TrendingUp, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  pricing: PricingResult;
  userTypeLabel: string;
  userTypeHex: string;
}

const PricingPreview: React.FC<Props> = ({ pricing, userTypeLabel, userTypeHex }) => {
  const { base, finalPrice, lines, effectiveDiscountPct, promoApplied } = pricing;

  return (
    <aside className="rounded-2xl bg-white border border-c-purple-100 shadow-lg overflow-hidden lg:sticky lg:top-6">
      {/* Header */}
      <div
        className="p-5 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${userTypeHex}, #b425aa)` }}
      >
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[11px] font-display font-bold uppercase tracking-wider">Live Pricing</span>
          </div>
          <div className="text-xs font-medium opacity-85 mb-1">{userTypeLabel} · monthly</div>
          <div className="flex items-baseline gap-2">
            <div className="font-display font-extrabold text-3xl">{formatPHP(finalPrice)}</div>
            {finalPrice !== base && (
              <div className="text-sm line-through opacity-60">{formatPHP(base)}</div>
            )}
          </div>
          {effectiveDiscountPct !== 0 && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-display font-bold',
                effectiveDiscountPct > 0 ? 'bg-c-green-400/30 text-white' : 'bg-c-coral-400/30 text-white'
              )}
            >
              {effectiveDiscountPct > 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {effectiveDiscountPct > 0 ? `${effectiveDiscountPct}% OFF` : `+${Math.abs(effectiveDiscountPct)}% surcharge`}
            </div>
          )}
        </div>
      </div>

      {/* Lines */}
      <div className="p-5">
        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-cognitio-ink/50 mb-3">
          Breakdown
        </div>
        <ul className="space-y-2 text-sm">
          {lines.map((line, i) => (
            <li
              key={i}
              className={cn(
                'flex items-start justify-between gap-3 py-1',
                i < lines.length - 1 && 'border-b border-c-purple-50'
              )}
            >
              <span
                className={cn(
                  'flex-1',
                  line.type === 'base'
                    ? 'font-display font-semibold text-cognitio-ink'
                    : line.type === 'promo'
                      ? 'text-c-amber-700 font-medium'
                      : line.amount < 0
                        ? 'text-c-green-700'
                        : 'text-c-coral-600'
                )}
              >
                {line.label}
              </span>
              <span
                className={cn(
                  'font-display font-bold tabular-nums shrink-0',
                  line.type === 'base'
                    ? 'text-cognitio-ink'
                    : line.amount < 0
                      ? 'text-c-green-600'
                      : 'text-c-coral-600'
                )}
              >
                {line.amount < 0 ? '−' : line.type === 'base' ? '' : '+'}
                ₱{Math.abs(line.amount).toLocaleString('en-PH')}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t-2 border-dashed border-c-purple-200 flex items-center justify-between">
          <span className="font-display font-bold text-cognitio-ink">Your monthly</span>
          <span className="font-display font-extrabold text-2xl gradient-text">
            {formatPHP(finalPrice)}
          </span>
        </div>

        {promoApplied && (
          <div className="mt-3 rounded-lg bg-c-amber-50 border border-c-amber-200 px-3 py-2 text-xs text-c-amber-800 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Promo applied successfully!
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-[11px] text-cognitio-ink/50">
          <Lock className="h-3 w-3" />
          Transparent pricing — no hidden fees. Pay-what-you-can also available.
        </div>
      </div>
    </aside>
  );
};

export default PricingPreview;
