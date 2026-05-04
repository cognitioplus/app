import React, { useState, useRef, useEffect } from 'react';
import { STAGES, UserType } from '@/data/journeyData';
import JourneyStepper from './JourneyStepper';
import StageDetails from './StageDetails';
import UserTypeSwitcher from './UserTypeSwitcher';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JourneyExplorer: React.FC<{ defaultUserType?: UserType }> = ({ defaultUserType = 'individual' }) => {
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const [userType, setUserType] = useState<UserType>(defaultUserType);
  const detailsRef = useRef<HTMLDivElement>(null);

  const activeIdx = STAGES.findIndex((s) => s.id === activeId);
  const activeStage = STAGES[activeIdx];

  useEffect(() => {
    // smooth scroll to details when stage changes (but not on first render)
  }, [activeId]);

  const next = () => setActiveId(STAGES[Math.min(activeIdx + 1, STAGES.length - 1)].id);
  const prev = () => setActiveId(STAGES[Math.max(activeIdx - 1, 0)].id);

  return (
    <section id="journey" className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
      {/* Section header */}
      <div className="text-center mb-8">
        <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-purple-600">
          Interactive User Flow
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-cognitio-ink mt-2 mb-3 text-balance">
          Cognitio+ User Flow:{' '}
          <span className="gradient-text">Complete Journey from Landing to Retention</span>
        </h2>
        <p className="text-cognitio-ink/65 max-w-2xl mx-auto">
          Click any stage to expand. Switch user type to see how the experience adapts —
          color-coded by journey phase.
        </p>
      </div>

      {/* User type switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-display font-bold uppercase tracking-wider text-cognitio-ink/50 mb-2">
            Viewing as
          </div>
          <UserTypeSwitcher value={userType} onChange={setUserType} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prev} disabled={activeIdx === 0} className="rounded-full">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button size="sm" onClick={next} disabled={activeIdx === STAGES.length - 1} className="rounded-full bg-c-purple-600 hover:bg-c-purple-700">
            Next stage
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-3xl bg-white/70 backdrop-blur border border-c-purple-100 p-5 md:p-6 shadow-sm mb-8">
        <JourneyStepper activeId={activeId} onSelect={setActiveId} />
      </div>

      {/* Details */}
      <div ref={detailsRef}>
        <StageDetails stage={activeStage} userType={userType} />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden mt-8 flex justify-between gap-3">
        <Button variant="outline" onClick={prev} disabled={activeIdx === 0} className="flex-1 rounded-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <Button onClick={next} disabled={activeIdx === STAGES.length - 1} className="flex-1 rounded-full bg-c-purple-600 hover:bg-c-purple-700">
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default JourneyExplorer;
