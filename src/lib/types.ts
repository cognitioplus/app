import type { UserType } from '@/data/journeyData';
import type { PricingLine } from '@/lib/pricing';

/** Extra per-user-type profile fields collected during onboarding (step 5). */
export interface ProfileData {
  careSettings?: string[];
  communityType?: string;
  orgType?: string;
  workforce?: string;
  [key: string]: unknown;
}

/** Row shape of the public.cognitio_onboarding table (as read by the app). */
export interface OnboardingRow {
  id: string;
  created_at: string;
  updated_at: string | null;
  session_id: string;
  user_id: string | null;
  user_type: UserType | null;
  language: 'en' | 'fil' | null;
  region: string | null;
  full_name: string | null;
  email: string | null;
  organization_name: string | null;
  vulnerabilities: string[] | null;
  urbanization: string | null;
  has_external_funder: boolean | null;
  promo_code: string | null;
  promo_valid: boolean | null;
  verification_doc_name: string | null;
  verification_doc_path: string | null;
  goals: string[] | null;
  profile_data: ProfileData | null;
  base_price: number | null;
  final_price: number | null;
  discount_breakdown: PricingLine[] | null;
  completed: boolean | null;
  current_step: number | null;
  crm_consent: boolean | null;
}
