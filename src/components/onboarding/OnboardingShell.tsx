import React from 'react';
import CognitioLogo from '../CognitioLogo';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  number: number;
}

interface Props {
  steps: StepDef[];
  currentIdx: number;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  isLast: boolean;
  accentHex: string;
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
  saving?: boolean;
}

const OnboardingShell: React.FC<Props> = ({
  steps, currentIdx, onBack, onNext, canProceed, isLast, accentHex, children, sidePanel, saving,
}) => {
  const navigate = useNavigate();
  const step = steps[currentIdx];
  const progress = ((currentIdx + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-cognitio-soft relative">
      <div className="absolute inset-0 dotted-pattern opacity-50 pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-c-purple-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-c-amber-200/30 blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <CognitioLogo size="md" />
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-display font-semibold text-cognitio-ink/70 hover:text-c-purple-700 transition-colors"
        >
          <X className="h-4 w-4" />
          Exit
        </button>
      </div>

      {/* Progress rail */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-cognitio-ink/50">
            Step {currentIdx + 1} of {steps.length}
          </span>
          <span className="text-xs font-display font-semibold" style={{ color: accentHex }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-c-purple-100 overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accentHex}, #D4AF37)` }}
          />
        </div>

        {/* Step pills */}
        <div className="hidden md:flex items-center gap-1.5 mt-4 overflow-x-auto scrollbar-thin pb-1">
          {steps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div
                key={s.id}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-display font-semibold whitespace-nowrap transition-all border',
                  active && 'text-white shadow-md border-transparent',
                  done && !active && 'bg-white border-c-purple-200 text-c-purple-700',
                  !active && !done && 'bg-white/50 border-c-purple-100 text-cognitio-ink/50'
                )}
                style={active ? { backgroundColor: accentHex } : {}}
              >
                <span
                  className={cn(
                    'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                    active ? 'bg-white/25 text-white' : done ? 'bg-c-purple-100 text-c-purple-700' : 'bg-c-purple-50 text-cognitio-ink/40'
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : s.number}
                </span>
                {s.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className={cn('grid gap-6', sidePanel ? 'lg:grid-cols-12' : 'grid-cols-1')}>
          <main className={cn('rounded-3xl bg-white border border-c-purple-100 shadow-lg p-6 md:p-8', sidePanel ? 'lg:col-span-8' : '')}>
            <div className="mb-6">
              <div className="text-xs font-display font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accentHex }}>
                {step.subtitle}
              </div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cognitio-ink leading-tight">
                {step.title}
              </h1>
            </div>

            <div className="animate-fade-in">{children}</div>

            {/* Footer actions */}
            <div className="mt-8 pt-6 border-t border-c-purple-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={currentIdx === 0 || saving}
                className="font-display"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                {!canProceed && (
                  <span className="text-xs text-cognitio-ink/55 italic">Complete required fields to continue</span>
                )}
                <Button
                  onClick={onNext}
                  disabled={!canProceed || saving}
                  className="font-display font-semibold text-white shadow-lg group"
                  style={{ backgroundColor: accentHex }}
                >
                  {saving ? 'Saving…' : isLast ? 'Complete & Enter Dashboard' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </main>

          {sidePanel && (
            <div className="lg:col-span-4 space-y-4">
              {sidePanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingShell;
