import React from 'react';
import { JourneyStage, USER_TYPES, UserType, DetailCard } from '@/data/journeyData';
import { cn } from '@/lib/utils';
import { ArrowRight, Lock } from 'lucide-react';

interface Props {
  stage: JourneyStage;
  userType: UserType;
}

const StageDetails: React.FC<Props> = ({ stage, userType }) => {
  const Icon = stage.icon;
  const userMeta = USER_TYPES.find((u) => u.id === userType)!;

  // Decide which cards to show
  const cards: { sectionLabel?: string; sectionColor?: string; items: DetailCard[] }[] = [];
  if (stage.byUserType) {
    // Show selected user type's cards prominently, plus collapsed strip showing others
    cards.push({
      sectionLabel: `For ${userMeta.label}`,
      sectionColor: userMeta.hex,
      items: stage.byUserType[userType],
    });
  } else {
    cards.push({ items: stage.cards });
  }

  return (
    <div key={stage.id} className="animate-slide-up">
      {/* Header */}
      <div
        className={cn('rounded-3xl p-6 md:p-8 border-2 mb-6 relative overflow-hidden', stage.ramp.border)}
        style={{ background: `linear-gradient(135deg, ${stage.hex}10 0%, ${stage.hex}05 60%, transparent 100%)` }}
      >
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10 dotted-pattern" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shrink-0"
            style={{ backgroundColor: stage.hex }}
          >
            <Icon className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={cn('text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', stage.ramp.chip, stage.ramp.text)}
              >
                Stage {stage.number}
              </span>
              <span className={cn('text-xs italic font-medium', stage.ramp.text)}>— {stage.tagline}</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-cognitio-ink mb-1">
              {stage.title}
            </h3>
            <p className="text-cognitio-ink/70 text-sm md:text-base max-w-3xl">{stage.summary}</p>
          </div>
        </div>
      </div>

      {/* Section label for user-type-specific stages */}
      {stage.byUserType && (
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 rounded-full" style={{ backgroundColor: userMeta.hex }} />
          <span className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: userMeta.hex }}>
            Tailored for {userMeta.label}
          </span>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards[0].items.map((card, i) => (
          <DetailCardItem key={i} card={card} accentHex={stage.byUserType ? userMeta.hex : stage.hex} index={i} />
        ))}
      </div>

      {/* Cross-type peek */}
      {stage.byUserType && (
        <div className="mt-8 rounded-2xl border border-dashed border-c-purple-200 bg-white/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display font-bold text-cognitio-ink text-sm">Other user types at this stage</h4>
              <p className="text-xs text-cognitio-ink/60">Switch the user type above to expand any of these.</p>
            </div>
            <Lock className="h-4 w-4 text-cognitio-ink/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {USER_TYPES.filter((u) => u.id !== userType).map((u) => {
              const items = stage.byUserType![u.id];
              const UIcon = u.icon;
              return (
                <div key={u.id} className="rounded-xl bg-white border border-c-purple-100 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${u.hex}15`, color: u.hex }}>
                      <UIcon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <span className="text-xs font-display font-bold" style={{ color: u.hex }}>{u.shortLabel}</span>
                  </div>
                  <ul className="space-y-1">
                    {items.slice(0, 3).map((it, idx) => (
                      <li key={idx} className="text-xs text-cognitio-ink/70 flex gap-1.5">
                        <span className="text-cognitio-ink/30">·</span>
                        <span className="truncate">{it.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCardItem: React.FC<{ card: DetailCard; accentHex: string; index: number }> = ({
  card, accentHex, index,
}) => {
  return (
    <div
      className="group relative rounded-2xl border border-c-purple-100 bg-white p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="absolute top-0 left-0 h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: accentHex }}
      />
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0"
          style={{ backgroundColor: `${accentHex}15`, color: accentHex }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-cognitio-ink mb-1.5 leading-snug">{card.title}</h4>
          <p className="text-sm text-cognitio-ink/65 leading-relaxed">{card.body}</p>
        </div>
      </div>
      <ArrowRight
        className="absolute bottom-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: accentHex }}
      />
    </div>
  );
};

export default StageDetails;
