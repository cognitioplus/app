import React from 'react';
import { STAGES, JourneyStage } from '@/data/journeyData';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

const JourneyStepper: React.FC<Props> = ({ activeId, onSelect }) => {
  const activeIdx = STAGES.findIndex((s) => s.id === activeId);

  return (
    <div className="w-full">
      {/* Progress rail */}
      <div className="relative mb-6 h-1.5 rounded-full bg-c-purple-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-cognitio-gradient transition-all duration-700 ease-out"
          style={{ width: `${((activeIdx + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      {/* Pills - horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
        {STAGES.map((stage, idx) => (
          <StagePill
            key={stage.id}
            stage={stage}
            active={stage.id === activeId}
            done={idx < activeIdx}
            onClick={() => onSelect(stage.id)}
            isLast={idx === STAGES.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

const StagePill: React.FC<{
  stage: JourneyStage;
  active: boolean;
  done: boolean;
  onClick: () => void;
  isLast: boolean;
}> = ({ stage, active, done, onClick, isLast }) => {
  const Icon = stage.icon;
  return (
    <div className="flex items-center shrink-0">
      <button
        onClick={onClick}
        className={cn(
          'group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 border',
          'min-w-[180px] text-left',
          active
            ? 'shadow-lg scale-[1.02] border-transparent text-white'
            : done
              ? 'bg-white border-c-purple-200 text-cognitio-ink hover:border-c-purple-400'
              : 'bg-white/60 border-c-purple-100 text-cognitio-ink/70 hover:bg-white hover:border-c-purple-200'
        )}
        style={active ? { backgroundColor: stage.hex } : {}}
      >
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display font-bold text-sm transition-all',
            active ? 'bg-white/20 text-white' : 'bg-c-purple-50 text-c-purple-700'
          )}
        >
          {done && !active ? <Icon className="h-4 w-4" /> : stage.number}
        </div>
        <div className="flex flex-col leading-tight">
          <span className={cn('text-[10px] uppercase tracking-wider font-semibold', active ? 'text-white/80' : 'text-cognitio-ink/50')}>
            Stage {stage.number}
          </span>
          <span className="font-display font-bold text-sm">{stage.title}</span>
        </div>
      </button>
      {!isLast && (
        <ChevronRight className="mx-1 h-4 w-4 text-c-purple-300 shrink-0" strokeWidth={2.5} />
      )}
    </div>
  );
};

export default JourneyStepper;
