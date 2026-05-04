import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import PillarsAndStats from './PillarsAndStats';
import FeatureShowcase from './FeatureShowcase';
import UserTypeShowcase from './UserTypeShowcase';
import JourneyExplorer from './JourneyExplorer';
import GrowthPointsSection from './GrowthPointsSection';
import CommunityCallout from './CommunityCallout';
import Footer from './Footer';
import { UserType } from '@/data/journeyData';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [defaultUserType, setDefaultUserType] = useState<UserType>('individual');
  const journeyRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePickUserType = (u: UserType) => {
    setDefaultUserType(u);
    scrollTo(journeyRef);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero
        onBegin={() => navigate('/onboarding')}
        onExplore={() => scrollTo(featuresRef)}
        language={language}
        setLanguage={setLanguage}
      />
      <PillarsAndStats />
      <div ref={featuresRef}>
        <FeatureShowcase />
      </div>
      <UserTypeShowcase onPick={handlePickUserType} />
      <div ref={journeyRef}>
        <JourneyExplorer key={defaultUserType} defaultUserType={defaultUserType} />
      </div>
      <GrowthPointsSection />
      <CommunityCallout />
      <Footer />
    </div>
  );
};

export default AppLayout;
