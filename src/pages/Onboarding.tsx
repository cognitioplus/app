import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, getSessionId } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { uploadVerificationDoc } from '@/lib/verification';
import type { ProfileData } from '@/lib/types';
import { USER_TYPES, UserType } from '@/data/journeyData';
import {
  PH_REGIONS, VULNERABILITY_OPTIONS, URBANIZATION_OPTIONS, VERIFICATION_REQS, PROMO_CODES,
} from '@/lib/onboardingData';
import { computePricing, formatPHP } from '@/lib/pricing';
import OnboardingShell, { StepDef } from '@/components/onboarding/OnboardingShell';
import OptionGrid from '@/components/onboarding/OptionGrid';
import PricingPreview from '@/components/onboarding/PricingPreview';
import { UserTypeCards } from '@/components/onboarding/StepCards';
import ProfileFields from '@/components/onboarding/ProfileFields';
import { Upload, FileCheck2, Check, X, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STEPS: StepDef[] = [
  { id: 'usertype', title: 'Tell us who you are', subtitle: 'Step 1 — Identification', number: 1 },
  { id: 'language', title: 'Language & region', subtitle: 'Step 2 — Localization', number: 2 },
  { id: 'context', title: 'Your context', subtitle: 'Step 3 — Vulnerability mapping', number: 3 },
  { id: 'verify', title: 'Verification & promo', subtitle: 'Step 4 — Documents', number: 4 },
  { id: 'goals', title: 'Goals & profile', subtitle: 'Step 5 — Personalization', number: 5 },
  { id: 'review', title: 'Review & launch', subtitle: 'Step 6 — Confirm', number: 6 },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = useMemo(() => getSessionId(), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  // form state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [region, setRegion] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([]);
  const [urbanization, setUrbanization] = useState<string>('urban');
  const [hasFunder, setHasFunder] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData>({});
  // Explicit opt-in: contact details are shared with the CRM only when ticked.
  const [crmConsent, setCrmConsent] = useState(false);
  // Auth + uploaded verification document state
  const { user } = useAuth();
  const [docPath, setDocPath] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const userMeta = userType ? USER_TYPES.find((u) => u.id === userType)! : USER_TYPES[0];
  const accentHex = userMeta.hex;

  const pricing = useMemo(() => {
    return computePricing({
      userType: userType ?? 'individual',
      vulnerabilities,
      urbanization,
      hasExternalFunder: hasFunder,
      promoCode,
    });
  }, [userType, vulnerabilities, urbanization, hasFunder, promoCode]);

  const promoEntry = PROMO_CODES[promoCode?.toUpperCase().trim()];

  // Load any existing draft on mount
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cognitio_onboarding')
          .select('*')
          .eq('session_id', sessionId)
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setUserType(data.user_type);
          setLanguage(data.language || 'en');
          setRegion(data.region || '');
          setFullName(data.full_name || '');
          setEmail(data.email || '');
          setOrganizationName(data.organization_name || '');
          setVulnerabilities(data.vulnerabilities || []);
          setUrbanization(data.urbanization || 'urban');
          setHasFunder(!!data.has_external_funder);
          setPromoCode(data.promo_code || '');
          setGoals(data.goals || []);
          setProfile(data.profile_data || {});
          setCrmConsent(!!data.crm_consent);
          if (data.verification_doc_path) {
            setDocPath(data.verification_doc_path);
            setDocName(data.verification_doc_name || 'Uploaded document');
          }
          if (typeof data.current_step === 'number') {
            setCurrentIdx(Math.min(Math.max(0, data.current_step - 1), STEPS.length - 1));
          }
        }
      } catch (err) {
        console.error('Could not load onboarding draft:', err);
        toast.error('Could not restore your saved progress — starting fresh.');
      }
    })();
  }, [sessionId]);

  // Validation per step
  const canProceed = (() => {
    switch (STEPS[currentIdx].id) {
      case 'usertype': return !!userType && fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(email);
      case 'language': return !!region;
      case 'context': return !!urbanization;
      case 'verify': {
        if (!userType) return false;
        const req = VERIFICATION_REQS[userType];
        if (!req.required) return true;
        // Required documents need a signed-in user (private Storage) and
        // either a freshly selected file or one already uploaded.
        return !!user && (!!verificationDoc || !!docPath);
      }
      case 'goals': {
        if (!userType) return false;
        if (goals.length < 1) return false;
        if (userType === 'mhp' && !(profile.careSettings || []).length) return false;
        if (userType === 'community' && !profile.communityType) return false;
        if (userType === 'organization' && (!profile.orgType || !profile.workforce)) return false;
        return true;
      }
      case 'review': return true;
      default: return true;
    }
  })();

  const isLast = currentIdx === STEPS.length - 1;

  // Save draft to DB on each navigation (atomic upsert keyed by session_id)
  const persistDraft = async (
    markComplete = false,
    docOverride?: { path: string; name: string }
  ): Promise<boolean> => {
    if (!userType) return false;
    setSaving(true);
    try {
      const payload = {
        session_id: sessionId,
        user_id: user?.id ?? null,
        user_type: userType,
        language,
        region,
        full_name: fullName,
        email,
        organization_name: organizationName,
        vulnerabilities,
        urbanization,
        has_external_funder: hasFunder,
        promo_code: promoCode,
        promo_valid: !!promoEntry,
        verification_doc_name: docOverride?.name ?? docName ?? verificationDoc?.name ?? null,
        verification_doc_path: docOverride?.path ?? docPath,
        goals,
        profile_data: profile,
        base_price: pricing.base,
        final_price: pricing.finalPrice,
        discount_breakdown: pricing.lines,
        completed: markComplete,
        current_step: currentIdx + 1,
        crm_consent: crmConsent,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('cognitio_onboarding')
        .upsert(payload, { onConflict: 'session_id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
      toast.error('Could not save your progress. Continuing locally.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed) return;
    if (isLast) {
      // 1) Upload the verification document (private Storage) if a new file
      //    was selected and none has been uploaded yet.
      let uploaded: { path: string; name: string } | undefined;
      if (verificationDoc && !docPath && user) {
        setUploading(true);
        try {
          uploaded = await uploadVerificationDoc(verificationDoc, user.id, sessionId);
          setDocPath(uploaded.path);
          setDocName(uploaded.name);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Document upload failed. Please try again.';
          console.error('Verification upload failed:', message);
          toast.error(message);
          setUploading(false);
          return; // never complete onboarding without the required document
        } finally {
          setUploading(false);
        }
      }
      // 2) Mark complete, then optionally subscribe to updates (consent-gated).
      await persistDraft(true, uploaded);
      if (crmConsent && email) {
        try {
          const res = await fetch('https://famous.ai/api/crm/69f85b6d28284c19361b5c25/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name: fullName,
              source: 'onboarding-complete',
              tags: ['cognitio-plus', `user-type:${userType}`, 'onboarded'],
            }),
          });
          if (!res.ok) throw new Error(`CRM subscribe failed (${res.status})`);
        } catch (err) {
          console.error('CRM subscribe error:', err);
          toast.error('We could not subscribe you to updates — but your dashboard is ready.');
        }
      }
      toast.success('Welcome to Cognitio+! Your dashboard is ready.');
      navigate(`/dashboard/${userType}`);
      return;
    }
    await persistDraft(false);
    setCurrentIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  // Show pricing panel from step 3 onward
  const showPricing = userType && currentIdx >= 2;

  return (
    <OnboardingShell
      steps={STEPS}
      currentIdx={currentIdx}
      onBack={handleBack}
      onNext={handleNext}
      canProceed={canProceed}
      isLast={isLast}
      accentHex={accentHex}
      saving={saving || uploading}
      sidePanel={
        showPricing ? (
          <PricingPreview pricing={pricing} userTypeLabel={userMeta.label} userTypeHex={accentHex} />
        ) : undefined
      }
    >
      {STEPS[currentIdx].id === 'usertype' && (
        <div className="space-y-7">
          <UserTypeCards value={userType} onChange={setUserType} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-display font-bold text-sm text-cognitio-ink mb-2 block">Full name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
              />
            </div>
            <div>
              <label className="font-display font-bold text-sm text-cognitio-ink mb-2 block">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
              />
            </div>
            {(userType === 'community' || userType === 'organization' || userType === 'mhp') && (
              <div className="sm:col-span-2">
                <label className="font-display font-bold text-sm text-cognitio-ink mb-2 block">
                  {userType === 'mhp' ? 'Practice / clinic name' : 'Organization name'}
                </label>
                <input
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder={userType === 'mhp' ? 'e.g. Dr. Cruz Wellness Clinic' : 'e.g. Bayanihan Wellness Foundation'}
                  className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {STEPS[currentIdx].id === 'language' && (
        <div className="space-y-7">
          <div>
            <label className="font-display font-bold text-sm text-cognitio-ink mb-2.5 block">Preferred language</label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { id: 'en', label: 'English', sub: 'Standard interface' },
                { id: 'fil', label: 'Filipino', sub: 'Tagalog-first interface' },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id as 'en' | 'fil')}
                  className={cn(
                    'rounded-xl border-2 p-4 text-left transition-all',
                    language === l.id ? 'shadow-md' : 'border-c-purple-100 bg-white hover:border-c-purple-300'
                  )}
                  style={language === l.id ? { borderColor: accentHex, backgroundColor: `${accentHex}08` } : {}}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Globe className="h-4 w-4" style={{ color: accentHex }} />
                    <span className="font-display font-bold text-cognitio-ink">{l.label}</span>
                  </div>
                  <span className="text-xs text-cognitio-ink/60">{l.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-display font-bold text-sm text-cognitio-ink mb-2.5 block">Region *</label>
            <p className="text-xs text-cognitio-ink/55 mb-3">Used for localization and context-aware pricing.</p>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full md:max-w-md rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
            >
              <option value="">Select your region</option>
              {PH_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {STEPS[currentIdx].id === 'context' && (
        <div className="space-y-7">
          <div>
            <div className="font-display font-bold text-sm text-cognitio-ink mb-1">Vulnerability mapping</div>
            <p className="text-xs text-cognitio-ink/55 mb-3">
              Optional — these unlock our subsidy programs. We treat this information with care.
            </p>
            <OptionGrid
              options={VULNERABILITY_OPTIONS}
              selected={vulnerabilities}
              onChange={(v) => setVulnerabilities(v as string[])}
              accentHex={accentHex}
              columns={3}
              showModifier
            />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-cognitio-ink mb-1">Urbanization context</div>
            <p className="text-xs text-cognitio-ink/55 mb-3">
              We use a sliding scale to keep services accessible — HUC residents help cross-subsidize rural users.
            </p>
            <OptionGrid
              options={URBANIZATION_OPTIONS}
              selected={urbanization}
              multi={false}
              onChange={(v) => setUrbanization(v as string)}
              accentHex={accentHex}
              columns={3}
              showModifier
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => setHasFunder(!hasFunder)}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 p-4 transition-all w-full text-left',
                hasFunder ? 'shadow-md' : 'border-c-purple-100 bg-white hover:border-c-purple-300'
              )}
              style={hasFunder ? { borderColor: accentHex, backgroundColor: `${accentHex}08` } : {}}
            >
              <div
                className={cn('h-5 w-5 rounded-md flex items-center justify-center border-2 shrink-0', hasFunder ? 'text-white' : 'border-c-purple-200 bg-white')}
                style={hasFunder ? { backgroundColor: accentHex, borderColor: accentHex } : {}}
              >
                {hasFunder && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold text-sm text-cognitio-ink">Has external funder</div>
                <div className="text-xs text-cognitio-ink/60 mt-0.5">
                  Toggle on if your enrollment is sponsored. Adds a 10% cross-subsidy for the platform community.
                </div>
              </div>
              <span className="text-[10px] font-display font-bold rounded-md px-1.5 py-0.5 bg-c-coral-100 text-c-coral-700 shrink-0">
                +10%
              </span>
            </button>
          </div>
        </div>
      )}

      {STEPS[currentIdx].id === 'verify' && userType && (
        <div className="space-y-7">
          <div>
            <div className="font-display font-bold text-sm text-cognitio-ink mb-1">
              {VERIFICATION_REQS[userType].label}
              {VERIFICATION_REQS[userType].required && <span className="text-c-coral-500 ml-1">*</span>}
            </div>
            <p className="text-xs text-cognitio-ink/55 mb-3">
              {VERIFICATION_REQS[userType].description}
            </p>

            {/* Required documents live in private Storage — sign-in is mandatory */}
            {VERIFICATION_REQS[userType].required && !user && (
              <div className="rounded-2xl border-2 border-c-amber-300 bg-c-amber-50 p-5 mb-4">
                <div className="font-display font-bold text-sm text-cognitio-ink mb-1">
                  Sign in to upload your document
                </div>
                <p className="text-xs text-cognitio-ink/65 leading-relaxed mb-3">
                  Verification documents are stored privately and are only ever accessible
                  via secure, short-lived links. For your protection, uploading requires a
                  signed-in account — your progress so far carries over automatically.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate('/auth?redirect=/onboarding')}
                  className="rounded-full bg-c-purple-600 hover:bg-c-purple-700 font-display"
                  size="sm"
                >
                  Sign in with a magic link
                </Button>
              </div>
            )}

            {(!VERIFICATION_REQS[userType].required || !!user) && (
            <label
              className={cn(
                'block rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all hover:bg-c-purple-50/50',
                (verificationDoc || docPath) ? 'border-c-green-400 bg-c-green-50/40' : 'border-c-purple-200 bg-white'
              )}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setVerificationDoc(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-col items-center text-center">
                {verificationDoc ? (
                  <>
                    <FileCheck2 className="h-10 w-10 text-c-green-600 mb-2" />
                    <div className="font-display font-bold text-sm text-cognitio-ink">{verificationDoc.name}</div>
                    <div className="text-xs text-cognitio-ink/55 mt-1">
                      {(verificationDoc.size / 1024).toFixed(1)} KB · Click to replace
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setVerificationDoc(null); }}
                      className="mt-3 text-xs font-display font-semibold text-c-coral-600 hover:text-c-coral-700 inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </>
                ) : docPath ? (
                  <>
                    <FileCheck2 className="h-10 w-10 text-c-green-600 mb-2" />
                    <div className="font-display font-bold text-sm text-cognitio-ink">{docName || 'Document uploaded'}</div>
                    <div className="text-xs text-cognitio-ink/55 mt-1">
                      Securely stored · Click to replace
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-c-purple-500 mb-2" />
                    <div className="font-display font-bold text-sm text-cognitio-ink">Click to upload or drag a file</div>
                    <div className="text-xs text-cognitio-ink/55 mt-1">PDF, PNG, JPG · Max 10MB</div>
                  </>
                )}
              </div>
            </label>
            )}
            {!VERIFICATION_REQS[userType].required && (
              <div className="mt-2 text-xs text-cognitio-ink/55 italic">
                Documents not required for individuals — you can skip this.
              </div>
            )}
          </div>

          <div>
            <div className="font-display font-bold text-sm text-cognitio-ink mb-1">Promo or partner code</div>
            <p className="text-xs text-cognitio-ink/55 mb-3">
              Got a referral code, LGU subsidy, or partner voucher? Apply it here.
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME50"
                className="flex-1 rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm uppercase tracking-wider font-display font-semibold focus:outline-none focus:ring-2 focus:ring-c-purple-400"
              />
              {promoEntry && (
                <div className="flex items-center gap-1 rounded-lg bg-c-amber-100 border border-c-amber-300 px-3 text-xs font-display font-bold text-c-amber-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  {promoEntry.label}
                </div>
              )}
            </div>
            {promoCode && !promoEntry && (
              <div className="mt-2 text-xs text-c-coral-600">Code not recognized — check spelling.</div>
            )}
            <div className="mt-3 text-[11px] text-cognitio-ink/45">
              Try: <span className="font-display font-bold">WELCOME50</span> · <span className="font-display font-bold">KAPWA25</span> · <span className="font-display font-bold">YOUTH40</span>
            </div>
          </div>
        </div>
      )}

      {STEPS[currentIdx].id === 'goals' && userType && (
        <ProfileFields
          userType={userType}
          goals={goals}
          setGoals={setGoals}
          profile={profile}
          setProfile={setProfile}
          accentHex={accentHex}
        />
      )}

      {STEPS[currentIdx].id === 'review' && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-c-purple-50 border border-c-purple-100 p-5">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-c-purple-700 mb-3">
              Identity
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <ReviewRow label="User type" value={userMeta.label} />
              <ReviewRow label="Name" value={fullName} />
              <ReviewRow label="Email" value={email} />
              <ReviewRow label="Language" value={language === 'fil' ? 'Filipino' : 'English'} />
              <ReviewRow label="Region" value={PH_REGIONS.find((r) => r.id === region)?.label || '—'} />
              {organizationName && <ReviewRow label="Organization" value={organizationName} />}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-c-purple-100 p-5">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-cognitio-ink/60 mb-3">
              Context
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <ReviewRow
                label="Vulnerabilities"
                value={vulnerabilities.length ? vulnerabilities.map((v) => VULNERABILITY_OPTIONS.find((x) => x.id === v)?.label).join(' · ') : 'None'}
              />
              <ReviewRow label="Urbanization" value={URBANIZATION_OPTIONS.find((u) => u.id === urbanization)?.label || '—'} />
              <ReviewRow label="External funder" value={hasFunder ? 'Yes' : 'No'} />
              {promoEntry && <ReviewRow label="Promo" value={promoEntry.label} />}
              <ReviewRow label="Goals" value={`${goals.length} selected`} />
              {(verificationDoc || docName) && <ReviewRow label="Verification" value={verificationDoc?.name ?? docName ?? ''} />}
            </div>
          </div>

          {/* Consent — required before any contact details leave the platform */}
          <div className="rounded-2xl bg-white border border-c-purple-100 p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={crmConsent}
                onChange={(e) => setCrmConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-c-purple-300 accent-c-purple-600"
              />
              <span className="text-sm text-cognitio-ink/80 leading-relaxed">
                <span className="font-display font-bold text-cognitio-ink">Keep me posted</span> —
                I agree that Cognitio+ may email my onboarding summary and program updates to the
                address above. Optional — your dashboard works either way, and you can unsubscribe anytime.
              </span>
            </label>
          </div>

          <div
            className="rounded-2xl border-2 p-5"
            style={{ borderColor: accentHex, background: `${accentHex}08` }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 mt-0.5" style={{ color: accentHex }} />
              <div>
                <div className="font-display font-bold text-cognitio-ink">You're all set!</div>
                <p className="text-sm text-cognitio-ink/70 mt-1">
                  Your monthly plan: <span className="font-display font-bold" style={{ color: accentHex }}>{formatPHP(pricing.finalPrice)}</span>
                  {' '}— with{' '}
                  <span className="font-display font-bold text-c-green-700">{pricing.effectiveDiscountPct}% off</span> applied. Click the button below to enter your personalized {userMeta.label} dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </OnboardingShell>
  );
};

const ReviewRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-cognitio-ink/45">{label}</span>
    <span className="font-display font-semibold text-cognitio-ink mt-0.5 break-words">{value || '—'}</span>
  </div>
);

export default Onboarding;
