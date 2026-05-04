import { UserType } from '@/data/journeyData';

export interface OptionItem {
  id: string;
  label: string;
  description?: string;
  // pricing modifier (multiplicative discount or surcharge applied to base)
  modifier?: number; // e.g. -0.30 for 30% off, +0.20 for 20% surcharge
}

// Philippine regions (high-level)
export const PH_REGIONS: OptionItem[] = [
  { id: 'ncr', label: 'National Capital Region (NCR)' },
  { id: 'car', label: 'Cordillera Administrative Region (CAR)' },
  { id: 'r1', label: 'Region I — Ilocos' },
  { id: 'r2', label: 'Region II — Cagayan Valley' },
  { id: 'r3', label: 'Region III — Central Luzon' },
  { id: 'r4a', label: 'Region IV-A — CALABARZON' },
  { id: 'mimaropa', label: 'Region IV-B — MIMAROPA' },
  { id: 'r5', label: 'Region V — Bicol' },
  { id: 'r6', label: 'Region VI — Western Visayas' },
  { id: 'r7', label: 'Region VII — Central Visayas' },
  { id: 'r8', label: 'Region VIII — Eastern Visayas' },
  { id: 'r9', label: 'Region IX — Zamboanga Peninsula' },
  { id: 'r10', label: 'Region X — Northern Mindanao' },
  { id: 'r11', label: 'Region XI — Davao' },
  { id: 'r12', label: 'Region XII — SOCCSKSARGEN' },
  { id: 'r13', label: 'Region XIII — Caraga' },
  { id: 'barmm', label: 'BARMM' },
];

export const VULNERABILITY_OPTIONS: OptionItem[] = [
  { id: 'low_income', label: 'Low-income household', description: 'Below regional poverty threshold', modifier: -0.30 },
  { id: 'indigenous', label: 'Indigenous community', description: 'Member of an IP community', modifier: -0.25 },
  { id: 'pwd', label: 'Person with disability (PWD)', description: 'Recognized PWD status', modifier: -0.20 },
  { id: 'youth_underserved', label: 'Youth in underserved areas', description: 'Aged 15–24 in priority barangay', modifier: -0.20 },
  { id: 'solo_parent', label: 'Solo parent', description: 'RA 11861 recognized', modifier: -0.15 },
  { id: 'senior', label: 'Senior citizen (60+)', description: 'RA 9994 benefits applicable', modifier: -0.15 },
];

export const URBANIZATION_OPTIONS: OptionItem[] = [
  { id: 'rural', label: 'Rural / 4th–6th class municipality', modifier: -0.10 },
  { id: 'urban', label: 'Urban / 1st–3rd class municipality', modifier: 0 },
  { id: 'huc', label: 'Highly Urbanized City', description: 'Manila, Cebu, Davao, etc.', modifier: 0.20 },
];

// Goals per user type
export const GOALS_BY_TYPE: Record<UserType, OptionItem[]> = {
  individual: [
    { id: 'reduce_stress', label: 'Reduce stress' },
    { id: 'improve_sleep', label: 'Improve sleep' },
    { id: 'build_resilience', label: 'Build resilience' },
    { id: 'manage_emotions', label: 'Manage emotions' },
    { id: 'positive_habits', label: 'Develop positive habits' },
    { id: 'cope_grief', label: 'Cope with grief or loss' },
    { id: 'reduce_substance', label: 'Reduce substance use' },
    { id: 'connect_community', label: 'Connect with community' },
  ],
  mhp: [
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'trauma', label: 'Trauma & PTSD' },
    { id: 'substance', label: 'Substance use' },
    { id: 'youth_mh', label: 'Youth mental health' },
    { id: 'crisis', label: 'Crisis response' },
    { id: 'family', label: 'Family therapy' },
    { id: 'workplace', label: 'Workplace mental health' },
  ],
  community: [
    { id: 'resilience_building', label: 'Resilience building' },
    { id: 'trauma_recovery', label: 'Trauma recovery' },
    { id: 'substance_prevention', label: 'Substance abuse prevention' },
    { id: 'carer_support', label: 'Carer support (C4C)' },
    { id: 'youth_programs', label: 'Youth programs' },
    { id: 'indigenous_wellness', label: 'Indigenous wellness' },
    { id: 'pfa_training', label: 'PFA training' },
    { id: 'peer_groups', label: 'Peer support groups' },
  ],
  organization: [
    { id: 'workforce_wellness', label: 'Workforce wellness program' },
    { id: 'pfa_certification', label: 'PFA certification for staff' },
    { id: 'burnout_prevention', label: 'Burnout prevention' },
    { id: 'mh_policy', label: 'Mental health policy co-design' },
    { id: 'compliance', label: 'RA 11036 compliance' },
    { id: 'leadership_training', label: 'Leadership MH training' },
    { id: 'research', label: 'Research & impact assessment' },
    { id: 'cultural_competence', label: 'Cultural competence training' },
  ],
};

// Verification doc requirements
export const VERIFICATION_REQS: Record<UserType, { required: boolean; label: string; description: string }> = {
  individual: { required: false, label: 'No documents required', description: 'Optional means-testing for subsidy programs.' },
  mhp: { required: true, label: 'Professional license', description: 'PRC license for psychologists, psychiatrists, or mental health practitioners.' },
  community: { required: true, label: 'Authorization letter', description: 'LGU / school / CSO authorization confirming your community role.' },
  organization: { required: true, label: 'Registration documents', description: 'SEC / DTI / DOLE / accreditation certificate for your organization.' },
};

// Base monthly prices in PHP
export const BASE_PRICE: Record<UserType, number> = {
  individual: 499,
  mhp: 1499,
  community: 2999,
  organization: 7999,
};

// Promo codes registry (mock — real validation would be server-side)
export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  WELCOME50: { discount: 0.50, label: '50% Welcome' },
  KAPWA25: { discount: 0.25, label: '25% Kapwa Partner' },
  YOUTH40: { discount: 0.40, label: '40% Youth Initiative' },
  LGU30: { discount: 0.30, label: '30% LGU Subsidy' },
};

// MHP-specific profile fields
export const MHP_CARE_SETTINGS: OptionItem[] = [
  { id: 'private_clinic', label: 'Private clinic' },
  { id: 'hospital', label: 'Hospital / medical center' },
  { id: 'community', label: 'Community-based' },
  { id: 'school', label: 'School / university' },
  { id: 'workplace', label: 'Workplace' },
  { id: 'tele', label: 'Telehealth only' },
];

// Community profile types
export const COMMUNITY_TYPES: OptionItem[] = [
  { id: 'lgu', label: 'LGU (Local Government Unit)' },
  { id: 'school', label: 'School / educational institution' },
  { id: 'cso', label: 'CSO / NGO' },
  { id: 'indigenous', label: 'Indigenous community' },
  { id: 'religious', label: 'Faith-based group' },
  { id: 'health', label: 'Barangay health' },
];

// Organization types
export const ORG_TYPES: OptionItem[] = [
  { id: 'company', label: 'Private company' },
  { id: 'ngo', label: 'NGO / non-profit' },
  { id: 'gov', label: 'Government agency' },
  { id: 'academic', label: 'Academic institution' },
  { id: 'startup', label: 'Startup' },
];

export const WORKFORCE_SIZES: OptionItem[] = [
  { id: 'tier1', label: '1–25 employees' },
  { id: 'tier2', label: '26–100 employees' },
  { id: 'tier3', label: '101–500 employees' },
  { id: 'tier4', label: '501–2,000 employees' },
  { id: 'tier5', label: '2,000+ employees' },
];
