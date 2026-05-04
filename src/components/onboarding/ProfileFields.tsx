import React from 'react';
import { UserType } from '@/data/journeyData';
import OptionGrid from './OptionGrid';
import {
  GOALS_BY_TYPE, MHP_CARE_SETTINGS, COMMUNITY_TYPES, ORG_TYPES, WORKFORCE_SIZES,
} from '@/lib/onboardingData';

interface Props {
  userType: UserType;
  goals: string[];
  setGoals: (g: string[]) => void;
  profile: Record<string, any>;
  setProfile: (p: Record<string, any>) => void;
  accentHex: string;
}

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean; sub?: string }> = ({ children, required, sub }) => (
  <div className="mb-2.5">
    <label className="font-display font-bold text-sm text-cognitio-ink">
      {children}{required && <span className="text-c-coral-500 ml-1">*</span>}
    </label>
    {sub && <div className="text-xs text-cognitio-ink/55 mt-0.5">{sub}</div>}
  </div>
);

const TextInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({
  value, onChange, placeholder, type = 'text',
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400 focus:border-transparent"
  />
);

const TextArea: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }> = ({
  value, onChange, placeholder, rows = 3,
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400 resize-none"
  />
);

const ProfileFields: React.FC<Props> = ({ userType, goals, setGoals, profile, setProfile, accentHex }) => {
  const update = (key: string, value: any) => setProfile({ ...profile, [key]: value });

  return (
    <div className="space-y-7">
      {/* Goals (all types) */}
      <div>
        <FieldLabel required sub="Select at least one — we'll personalize your dashboard around these.">
          {userType === 'mhp' ? 'Clinical Focus Areas' :
           userType === 'community' ? 'Strategic Priorities' :
           userType === 'organization' ? 'Policy Objectives' :
           'Personal Goals'}
        </FieldLabel>
        <OptionGrid
          options={GOALS_BY_TYPE[userType]}
          selected={goals}
          onChange={(v) => setGoals(v as string[])}
          accentHex={accentHex}
          columns={4}
        />
        <div className="mt-2 text-xs text-cognitio-ink/55">
          {goals.length} goal{goals.length === 1 ? '' : 's'} selected
        </div>
      </div>

      {/* Type-specific fields */}
      {userType === 'individual' && (
        <>
          <div>
            <FieldLabel sub="Optional — helps calibrate tool recommendations.">Self-reported context</FieldLabel>
            <TextArea
              value={profile.mhContext || ''}
              onChange={(v) => update('mhContext', v)}
              placeholder="Anxiety, burnout, trauma, or any context you'd like us to know."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel sub="Wellness baseline">Current stress level (1–10)</FieldLabel>
              <input
                type="range" min={1} max={10}
                value={profile.stressLevel || 5}
                onChange={(e) => update('stressLevel', Number(e.target.value))}
                className="w-full accent-c-purple-500"
              />
              <div className="text-sm font-display font-bold text-c-purple-600">
                {profile.stressLevel || 5} / 10
              </div>
            </div>
            <div>
              <FieldLabel sub="Wellness baseline">Sleep quality (1–10)</FieldLabel>
              <input
                type="range" min={1} max={10}
                value={profile.sleepQuality || 5}
                onChange={(e) => update('sleepQuality', Number(e.target.value))}
                className="w-full accent-c-purple-500"
              />
              <div className="text-sm font-display font-bold text-c-purple-600">
                {profile.sleepQuality || 5} / 10
              </div>
            </div>
          </div>
        </>
      )}

      {userType === 'mhp' && (
        <>
          <div>
            <FieldLabel required>Care setting</FieldLabel>
            <OptionGrid
              options={MHP_CARE_SETTINGS}
              selected={profile.careSettings || []}
              onChange={(v) => update('careSettings', v)}
              accentHex={accentHex}
              columns={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Estimated active caseload</FieldLabel>
              <TextInput type="number" value={profile.caseload || ''} onChange={(v) => update('caseload', v)} placeholder="e.g. 25" />
            </div>
            <div>
              <FieldLabel>Years of practice</FieldLabel>
              <TextInput type="number" value={profile.yearsPractice || ''} onChange={(v) => update('yearsPractice', v)} placeholder="e.g. 8" />
            </div>
          </div>
          <div>
            <FieldLabel>Primary client age range</FieldLabel>
            <TextInput value={profile.clientAge || ''} onChange={(v) => update('clientAge', v)} placeholder="e.g. 18–35" />
          </div>
        </>
      )}

      {userType === 'community' && (
        <>
          <div>
            <FieldLabel required>Community type</FieldLabel>
            <OptionGrid
              options={COMMUNITY_TYPES}
              selected={profile.communityType || ''}
              multi={false}
              onChange={(v) => update('communityType', v)}
              accentHex={accentHex}
              columns={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Population served</FieldLabel>
              <TextInput type="number" value={profile.population || ''} onChange={(v) => update('population', v)} placeholder="e.g. 5000" />
            </div>
            <div>
              <FieldLabel>Geographic scope</FieldLabel>
              <TextInput value={profile.scope || ''} onChange={(v) => update('scope', v)} placeholder="e.g. Quezon City, District 2" />
            </div>
          </div>
          <div>
            <FieldLabel>Existing funders / partners</FieldLabel>
            <TextArea
              value={profile.partners || ''}
              onChange={(v) => update('partners', v)}
              placeholder="LGU, DSWD, civil society, foundations — separate by commas."
              rows={2}
            />
          </div>
        </>
      )}

      {userType === 'organization' && (
        <>
          <div>
            <FieldLabel required>Organization type</FieldLabel>
            <OptionGrid
              options={ORG_TYPES}
              selected={profile.orgType || ''}
              multi={false}
              onChange={(v) => update('orgType', v)}
              accentHex={accentHex}
              columns={3}
            />
          </div>
          <div>
            <FieldLabel required>Workforce size</FieldLabel>
            <OptionGrid
              options={WORKFORCE_SIZES}
              selected={profile.workforce || ''}
              multi={false}
              onChange={(v) => update('workforce', v)}
              accentHex={accentHex}
              columns={3}
            />
          </div>
          <div>
            <FieldLabel sub="RA 11036, DOLE, accreditation, etc.">Compliance needs</FieldLabel>
            <TextArea
              value={profile.compliance || ''}
              onChange={(v) => update('compliance', v)}
              placeholder="What workplace mental health requirements are you addressing?"
              rows={2}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileFields;
