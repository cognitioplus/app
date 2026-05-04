import {
  Compass, UserCheck, Target, LayoutDashboard, Sparkles, Users, Trophy,
  Heart, Brain, Stethoscope, Building2, User as UserIcon
} from 'lucide-react';

export type UserType = 'individual' | 'mhp' | 'community' | 'organization';

export interface UserTypeMeta {
  id: UserType;
  label: string;
  shortLabel: string;
  icon: any;
  color: string;        // tailwind color name e.g. 'c-purple'
  hex: string;
  ring: string;
  description: string;
}

export const USER_TYPES: UserTypeMeta[] = [
  {
    id: 'individual',
    label: 'Individual',
    shortLabel: 'Individual',
    icon: UserIcon,
    color: 'c-purple',
    hex: '#b425aa',
    ring: 'ring-c-purple-400',
    description: 'AI tools and digital resilience for personal wellness journey',
  },
  {
    id: 'mhp',
    label: 'Mental Health Professional',
    shortLabel: 'MHP',
    icon: Stethoscope,
    color: 'c-teal',
    hex: '#14A299',
    ring: 'ring-c-teal-400',
    description: 'Clinical tools, assessments, and case management',
  },
  {
    id: 'community',
    label: 'Community Leader',
    shortLabel: 'Community',
    icon: Users,
    color: 'c-green',
    hex: '#2F9C45',
    ring: 'ring-c-green-400',
    description: 'Community programs and resilience initiatives',
  },
  {
    id: 'organization',
    label: 'Organization',
    shortLabel: 'Org',
    icon: Building2,
    color: 'c-amber',
    hex: '#D4AF37',
    ring: 'ring-c-amber-400',
    description: 'Trainings, consultancy, and research',
  },
];

export interface DetailCard {
  title: string;
  body: string;
  userTypes?: UserType[]; // if undefined, applies to all
}

export interface JourneyStage {
  id: string;
  number: number;
  title: string;
  tagline: string;
  summary: string;
  icon: any;
  color: string;
  hex: string;
  ramp: { bg: string; chip: string; text: string; border: string };
  cards: DetailCard[];
  // optional per-user-type breakdown
  byUserType?: Record<UserType, DetailCard[]>;
}

export const STAGES: JourneyStage[] = [
  {
    id: 'landing',
    number: 1,
    title: 'Landing Page',
    tagline: 'Discover & explore',
    summary: 'First touchpoint — communicates mission, builds trust, and converts visitors to sign-ups.',
    icon: Compass,
    color: 'c-purple',
    hex: '#b425aa',
    ramp: { bg: 'bg-c-purple-50', chip: 'bg-c-purple-100', text: 'text-c-purple-700', border: 'border-c-purple-200' },
    cards: [
      { title: 'Hero Banner', body: 'Integrated Cognitive & Health Tracking — dual CTAs: Begin Journey (gold) + Explore Features (outline).' },
      { title: 'Pillars of Wellness', body: 'Partner in Resilience · Rooted in Culture · Powered by Awareness · Enhanced by Technology.' },
      { title: 'Stats Infographic', body: '1 in 5 adults affected · 60% go untreated · 4× resilience improvement with regular practice.' },
      { title: 'Feature Showcase', body: '6 core capabilities: Analytics · Learning · Security · Resilience Navigator · Habit Studio · Well-Be.' },
      { title: 'Dashboard Note', body: 'Wellness tools relocate into your personalized dashboard — accessible after login.' },
      { title: 'Final CTA', body: 'Start for Free → triggers sign-up. Header Login / Sign Up for returning users.' },
    ],
  },
  {
    id: 'onboarding',
    number: 2,
    title: 'Auth & Onboarding',
    tagline: 'Identify & classify',
    summary: 'Step 1 of service flow: User identification & context capture for accurate classification and pricing.',
    icon: UserCheck,
    color: 'c-coral',
    hex: '#EE6048',
    ramp: { bg: 'bg-c-coral-50', chip: 'bg-c-coral-100', text: 'text-c-coral-700', border: 'border-c-coral-200' },
    cards: [
      { title: 'User Type Selection', body: 'Individual · Mental Health Professional · Community Leader · Organization (LGU / NGO / Company).' },
      { title: 'Language & Region', body: 'English / Filipino toggle · Region selection for localization and context-aware pricing.' },
      { title: 'Vulnerability Mapping', body: 'Subtle options: Low-income · Indigenous · PWD · Youth in underserved areas → unlocks discounts.' },
      { title: 'Urbanization Context', body: 'Highly Urbanized City (+20%) · Has External Funder (+10%) — for transparent pricing.' },
      { title: 'Verification Documents', body: 'MHP: professional license · Organization: registration docs · LGU: authorization letter.' },
      { title: 'Promo Code', body: 'Optional field for partner vouchers, referral campaigns, and subsidy programs.' },
    ],
  },
  {
    id: 'goals',
    number: 3,
    title: 'Goals & Profile',
    tagline: 'Align & personalize',
    summary: 'Steps 2–3: Needs & Goal Selection + Vulnerability & Context Mapping — minimum 1 goal required.',
    icon: Target,
    color: 'c-amber',
    hex: '#D4AF37',
    ramp: { bg: 'bg-c-amber-50', chip: 'bg-c-amber-100', text: 'text-c-amber-700', border: 'border-c-amber-200' },
    cards: [],
    byUserType: {
      individual: [
        { title: 'Personal Goals', body: 'Reduce stress · Improve sleep · Build resilience · Manage emotions · Develop positive habits.' },
        { title: 'Mental Health Context', body: 'Optional self-reported history (anxiety, burnout, trauma) to calibrate tool recommendations.' },
        { title: 'Wellness Baseline', body: 'Quick 5-question check-in to set starting metrics and track progress over time.' },
        { title: 'Pricing Preview', body: 'Dynamic estimate: base rate adjusted by vulnerability status, urbanization, and promo code.' },
      ],
      mhp: [
        { title: 'Clinical Focus Areas', body: 'Anxiety · Depression · Trauma · Substance use · Youth mental health · Crisis response.' },
        { title: 'Client Population', body: 'Age range, care setting (clinic / community / school), and estimated caseload size.' },
        { title: 'Tool Preferences', body: 'Assessment instruments, session note formats, referral workflow and discharge protocols.' },
        { title: 'Certification Upload', body: 'Professional license verification for PsychAssess Pro access and client management.' },
      ],
      community: [
        { title: 'Community Profile', body: 'LGU / School / CSO / Indigenous community — geographic scope, population, urban/rural.' },
        { title: 'Target Beneficiaries', body: 'At-risk groups, existing programs, community leaders and peer facilitators.' },
        { title: 'Strategic Priorities', body: 'Resilience building · Trauma recovery · Substance abuse prevention · Carer support (C4C).' },
        { title: 'Funding & Partners', body: 'Existing funders, LGU co-design partners, civil society collaborators, referral networks.' },
      ],
      organization: [
        { title: 'Organization Type', body: 'Company · NGO · Government agency · Academic institution — determines service tier.' },
        { title: 'Workforce Size', body: 'Headcount for training package sizing and per-seat pricing calculation.' },
        { title: 'Compliance Needs', body: 'RA 11036 (PH Mental Health Act) · DOLE workplace wellness · Accreditation requirements.' },
        { title: 'Policy Objectives', body: 'Mental health policy co-design, data governance preferences, and reporting requirements.' },
      ],
    },
  },
  {
    id: 'dashboard',
    number: 4,
    title: 'Dashboard',
    tagline: 'Personalized home base',
    summary: 'Each user type gets a fully customized dashboard — role-specific metrics, tools, and workflows.',
    icon: LayoutDashboard,
    color: 'c-purple',
    hex: '#b425aa',
    ramp: { bg: 'bg-c-purple-50', chip: 'bg-c-purple-100', text: 'text-c-purple-700', border: 'border-c-purple-200' },
    cards: [],
    byUserType: {
      individual: [
        { title: 'Wellness Metrics', body: 'Resilience Score · Mindfulness Streak · Well-Be Status · Emotion Trend — updated daily.' },
        { title: '5 AI Resilience Tools', body: 'Resilience Navigator · Habit Studio · Well-Be Monitor · SMART Emotion Tracker · Oasis.' },
        { title: 'Gamification Panel', body: 'Level (Beginner → Intermediate → Advanced) · XP · Badges earned · Next milestone.' },
        { title: 'Recommended Actions', body: 'AI-personalized daily nudges based on check-ins, tool usage, and streak history.' },
      ],
      mhp: [
        { title: 'Client Overview', body: 'Active clients · Upcoming sessions · Assessment flags · Notes queue · Risk alerts.' },
        { title: 'PsychAssess Pro', body: 'PHQ-9, GAD-7, DASS-21 — automated scoring, report generation, and history tracking.' },
        { title: 'Session Calendar', body: 'Teletherapy scheduling, integrated session notes, follow-up reminders, billing summary.' },
        { title: 'Case Management', body: 'Referral pathways · Inter-agency coordination logs · Treatment planning templates.' },
      ],
      community: [
        { title: 'Program Tracker', body: 'Active programs, enrollment counts, participant milestone tracking and outcome flags.' },
        { title: 'Participant Management', body: 'Community member profiles, attendance logs, progress notes, and risk indicators.' },
        { title: 'GROWTH Tribe Hub', body: 'Peer support circles, discussion threads, curated resource library for participants.' },
        { title: 'Reporting Dashboard', body: 'Engagement metrics and outcome data formatted for funder and LGU compliance reporting.' },
      ],
      organization: [
        { title: 'Training Catalog', body: 'Active and scheduled trainings, enrollment status, facilitator assignment, completion rates.' },
        { title: 'Compliance Tracker', body: 'Mental health policy adherence, certification status, renewal dates and alerts.' },
        { title: 'Analytics Dashboard', body: 'Workforce wellness trends, engagement rates, return-on-investment indicators.' },
        { title: 'Research Modules', body: 'Data collection tools, psychosocial risk mapping, behavioral segmentation by demographics.' },
      ],
    },
  },
  {
    id: 'services',
    number: 5,
    title: 'Solutions & Services',
    tagline: 'Access & engage',
    summary: 'Seven service categories mapped to four user types — dynamic pricing with vulnerability and engagement discounts.',
    icon: Sparkles,
    color: 'c-teal',
    hex: '#14A299',
    ramp: { bg: 'bg-c-teal-50', chip: 'bg-c-teal-100', text: 'text-c-teal-700', border: 'border-c-teal-200' },
    cards: [],
    byUserType: {
      individual: [
        { title: 'Online & Individual', body: 'AI-powered assessments · Teletherapy & e-counseling · Self-help psychoeducation · Gamified modules.' },
        { title: 'AI Resilience Tools', body: 'Resilience Navigator (CASE) · Habit Studio (B=MAP) · Well-Be (HRV) · Emotion Tracker · Oasis.' },
        { title: 'Subscription Plans', body: 'Free tier → Individual Plus → Premium — tiered access with vulnerability-adjusted pricing.' },
        { title: 'Book a Service', body: 'Schedule therapy · Request subsidy · Upload means-testing docs · Choose payment plan or invoice.' },
      ],
      mhp: [
        { title: 'Tele-therapy Platform', body: 'Secure video sessions, intake forms, session notes, outcome tracking, and client portal.' },
        { title: 'PsychAssess Pro', body: 'PHQ-9, GAD-7, DASS-21, trauma screens — automated scoring, PDF reports, and full history.' },
        { title: 'Psycho-education Library', body: 'Client-facing resources, handouts, guided exercises, culturally adapted materials.' },
        { title: 'Referral & Case Mgmt', body: 'Structured referrals · Inter-agency coordination · Treatment planning · Progress notes.' },
      ],
      community: [
        { title: 'Community-Based Programs', body: 'Caring for Carers (C4C) · CareTalk Circles · Indigenous Wellness Dialogues · Substance Abuse Support.' },
        { title: 'Community Resilience', body: 'Katatagan Framework Workshops · Peer-Led Support Groups · Psychological First Aid Training.' },
        { title: 'PFA Certification', body: 'Accredited Psychological First Aid with digital certificate — schools, LGUs, CSO settings.' },
        { title: 'Program Analytics', body: 'Participant data, outcome metrics, attendance tracking, funder-ready compliance reports.' },
      ],
      organization: [
        { title: 'Organizational Trainings', body: 'PFA Certification · Mental Health First Response · MHPSS Integration · Burnout Prevention.' },
        { title: 'Consultancy Services', body: 'Policy co-design · Cultural competence training · Case mgmt system design · Compliance support.' },
        { title: 'Research & Analytics', body: 'Data collection · Psychosocial risk mapping · Behavioral segmentation · Impact assessment.' },
        { title: 'Policy Advisory', body: 'Systems audits · Data-driven planning · Cognitio+ Insights Dashboard for decision-makers.' },
      ],
    },
  },
  {
    id: 'community',
    number: 6,
    title: 'Community',
    tagline: 'Connect & grow',
    summary: 'Cross-type features that build belonging, shared knowledge, and peer accountability across all user groups.',
    icon: Users,
    color: 'c-green',
    hex: '#2F9C45',
    ramp: { bg: 'bg-c-green-50', chip: 'bg-c-green-100', text: 'text-c-green-700', border: 'border-c-green-200' },
    cards: [
      { title: 'GROWTH Tribe', body: 'Knowledge & practice hub — Personal Growth · Resilience · Well-Being · Transformation · Mind-Body-Soul harmony.' },
      { title: 'CareTalk Circles', body: 'Structured peer support groups facilitated by trained community leaders — open to all user types.' },
      { title: 'Discussion Forums', body: 'Topic-based threads — anonymized, moderated, with trauma-informed community guidelines.' },
      { title: 'Webinars & Events', body: 'Live sessions with MHPs, guest speakers, and community leaders — bookable via dashboard.' },
      { title: 'Resource Sharing', body: 'Users share articles and earn the Knowledge Advocate badge for community contributions.' },
      { title: 'Leaderboard (opt-in)', body: 'Anonymized engagement rankings — no personal data exposed, fully optional participation.' },
    ],
  },
  {
    id: 'retention',
    number: 7,
    title: 'Retention',
    tagline: 'Reward & sustain',
    summary: 'Step 8: Follow-up & Feedback Loop — ensures continuity, rewards engagement, and drives long-term wellness.',
    icon: Trophy,
    color: 'c-amber',
    hex: '#D4AF37',
    ramp: { bg: 'bg-c-amber-50', chip: 'bg-c-amber-100', text: 'text-c-amber-700', border: 'border-c-amber-200' },
    cards: [
      { title: 'Gamification Engine', body: 'XP per action · Badge every 3 check-ins · Beginner (0–1) → Intermediate (2–4) → Advanced (5+).' },
      { title: 'Badge Categories', body: 'Daily Engagement · Resilience Building · Community Participation · Learning · Streaks.' },
      { title: 'Rewards & Unlocks', body: 'Promo codes · Free therapy sessions · Early feature access · Scholarship eligibility · Certificates.' },
      { title: 'Streak Tracking', body: 'Daily check-ins · Tool usage streaks · 7-Day Streak badge · Mindful Month badge (30 days).' },
      { title: 'Feedback Loop', body: 'Follow-up within 7 days of service completion — feeds Cognitio+ Insights Dashboard.' },
      { title: 'Loyalty Discounts', body: '10+ badges → loyalty pricing · Pay-what-you-can weeks · Cross-subsidy model.' },
    ],
  },
];

export const PILLARS = [
  { title: 'Partner in Resilience', body: 'Walking alongside Filipinos through every wellness milestone.', icon: Heart, color: '#b425aa' },
  { title: 'Rooted in Culture', body: 'Honoring kapwa, bayanihan, and indigenous frameworks of healing.', icon: Sparkles, color: '#D4AF37' },
  { title: 'Powered by Awareness', body: 'Evidence-based screening, education, and self-knowledge.', icon: Brain, color: '#14A299' },
  { title: 'Enhanced by Technology', body: 'AI tools, secure data, and human-centered design throughout.', icon: Compass, color: '#2F9C45' },
];

export const STATS = [
  { value: '1 in 5', label: 'Adults affected by mental health concerns', sub: 'Across the Philippines' },
  { value: '60%', label: 'Go untreated due to stigma & access barriers', sub: 'WHO regional data' },
  { value: '4×', label: 'Resilience improvement with regular practice', sub: 'After 90 days on Cognitio+' },
];
