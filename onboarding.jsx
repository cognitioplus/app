import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronRight, Star, Shield, User, Building, 
  Users, ArrowRight, Award, Gift, BookOpen, 
  Target, Zap, DollarSign, FileText, PlayCircle
} from 'lucide-react';

// --- 1. Onboarding Data Configuration (Derived from your Document) ---

const USER_TYPES = [
  { id: 'individual', label: 'Individual', icon: User, desc: 'Personal growth & resilience.' },
  { id: 'mhp', label: 'Mental Health Pro', icon: Shield, desc: 'Practice management & referrals.' },
  { id: 'org', label: 'Organization', icon: Building, desc: 'Employee wellness & compliance.' },
  { id: 'cl', label: 'Community Leader', icon: Users, desc: 'Civic mobilization & support.' },
];

const ONBOARDING_DATA = {
  individual: {
    steps: [
      { title: "Identity", target: "Profile Starter", incentive: "Basic Access", task: "Self-identification" },
      { title: "Needs", target: "Goal Setter", incentive: "Priority Suggestions", task: "Select 1+ Personal Goal" },
      { title: "Explore", target: "Curious Mind", incentive: "10% Discount Coupon", task: "Save 3 services to Wishlist" },
      { title: "Context", target: "Support Eligibility", incentive: "Subsidized Rates", task: "Vulnerability Assessment" },
      { title: "Simulate", target: "Ready", incentive: "5-Star Readiness", task: "Complete Ethics Tutorial" },
      { title: "Pricing", target: "Informed", incentive: "Free Workshop", task: "View Subsidy Breakdown" },
      { title: "Value", target: "Community Contributor", incentive: "Referral Bonus", task: "Join Research Study" },
      { title: "Summary", target: "Service Access Granted", incentive: "Welcome Badge", task: "Sign Terms & Conditions" },
    ]
  },
  mhp: {
    steps: [
      { title: "Credentials", target: "Verified Partner", incentive: "Network Listing", task: "Upload License" },
      { title: "Goals", target: "Practice Builder", incentive: "Premium Trial (1 Mo)", task: "Select Professional Goals" },
      { title: "Tools", target: "Tech Savvy", incentive: "Boosted Profile", task: "Select EHR & supplementary tool" },
      { title: "Capacity", target: "Pro Bono Hero", incentive: "Priority Referral Status", task: "Commit 5hrs/mo Pro Bono" },
      { title: "Intake Sim", target: "System Expert", incentive: "Readiness Rating", task: "Complete Intake Simulation" },
      { title: "Terms", target: "Partner", incentive: "Commission Reduced", task: "Agree to Fee Structure" },
      { title: "Collab", target: "Content Creator", incentive: "Fee Reduction", task: "Propose a Webinar" },
      { title: "Contract", target: "Certified Practitioner", incentive: "Digital Seal", task: "E-Sign Service Agreement" },
    ]
  },
  org: {
    steps: [
      { title: "Profile", target: "Org Initiator", incentive: "Dashboard Access", task: "Assign Champion" },
      { title: "Strategy", target: "Strategist", incentive: "Tier 1 Pricing Preview", task: "Define 3 Strategic Goals" },
      { title: "Services", target: "Planner", incentive: "Dedicated Account Manager", task: "Select Data & Content Services" },
      { title: "Demographics", target: "Data Driven", incentive: "Curated Reports", task: "Provide Target Group Data" },
      { title: "Admin Sim", target: "Admin Pro", incentive: "Enrollment Cap Waived", task: "Invite 5 Test Users" },
      { title: "Quote", target: "Budgeter", incentive: "Extra Training Session", task: "Generate Dynamic Quote" },
      { title: "Partnership", target: "Sponsor", incentive: "Co-branded Report", task: "Select Sponsorship Option" },
      { title: "Agreement", target: "Strategic Partner", incentive: "Integration Kickoff", task: "Sign MoA" },
    ]
  },
  cl: {
    steps: [
      { title: "Verification", target: "Community Anchor", incentive: "Resource Hub", task: "Verify Role" },
      { title: "Priorities", target: "Voice of People", incentive: "Template Library", task: "Identify 3 Community Needs" },
      { title: "Frameworks", target: "Mobilizer", incentive: "Summit Invitation", task: "Select Outreach Frameworks" },
      { title: "Mapping", target: "Surveyor", incentive: "Event Promotion", task: "Map Vulnerable Areas" },
      { title: "Resource Sim", target: "Connector", incentive: "Leadership Training", task: "Map 3 Community Assets" },
      { title: "Funding", target: "Resourceful", incentive: "Co-branded Materials", task: "Identify Funding Source" },
      { title: "Joint Action", target: "Impact Maker", incentive: "Policy Feedback Loop", task: "Formalize Joint Campaign" },
      { title: "Launch", target: "Impact Catalyst", incentive: "Project Kickoff", task: "Sign MoA" },
    ]
  }
};

// --- 2. UI Components for Onboarding ---

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
    <div 
      className="bg-[#b425aa] h-2.5 rounded-full transition-all duration-500 ease-out" 
      style={{ width: `${(current / total) * 100}%` }}
    ></div>
  </div>
);

const GamificationHUD = ({ badges, nextIncentive }: { badges: string[], nextIncentive: string }) => (
  <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm animate-fadeIn">
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
      {badges.length === 0 && <span className="text-xs text-gray-400 italic">Badges appear here...</span>}
      {badges.map((badge, i) => (
        <span key={i} className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold animate-fadeIn whitespace-nowrap">
          <Award size={12} /> {badge}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-2 text-right">
       <div className="text-xs">
          <p className="text-gray-500 uppercase tracking-wider font-bold">Next Reward</p>
          <p className="text-[#b425aa] font-bold">{nextIncentive}</p>
       </div>
       <div className="bg-purple-100 p-2 rounded-full text-[#b425aa]">
          <Gift size={16} />
       </div>
    </div>
  </div>
);

// --- 3. The Dynamic Wizard Component ---

export const OnboardingWizard = ({ onComplete }: { onComplete: (user: any) => void }) => {
  const [step, setStep] = useState(0); // 0 = Type Selection, 1-8 = Data Steps
  const [userType, setUserType] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false); // For Step 5
  const [formData, setFormData] = useState<any>({});

  // Helper to get current step data
  const stepData = userType && step > 0 ? ONBOARDING_DATA[userType as keyof typeof ONBOARDING_DATA].steps[step - 1] : null;

  const handleNext = () => {
    // Gamification Trigger: Unlock Badge for the step just completed
    if (stepData) {
      setBadges([...badges, stepData.target]);
      // Trigger Toast (Mock)
      // console.log(`Unlocked: ${stepData.incentive}`); 
    }

    if (step === 8) {
      // Finish
      onComplete({
        name: "New User",
        type: userType,
        badges: badges,
        onboardingCompleted: true
      });
    } else {
      setStep(step + 1);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2500); // Simulate a 2.5s interaction
  };

  // --- VIEW 0: User Type Selection ---
  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        

[Image of user onboarding flow diagram]

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 brand-font">Welcome to Cognitio+</h1>
          <p className="text-xl text-gray-500">Select your role to begin your personalized journey.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {USER_TYPES.map((type) => (
            <button 
              key={type.id}
              onClick={() => { setUserType(type.id); setStep(1); }}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-transparent hover:border-[#b425aa] hover:shadow-xl transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-[#b425aa] group-hover:bg-[#b425aa] group-hover:text-white transition-colors">
                <type.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{type.label}</h3>
                <p className="text-gray-500 mt-1">{type.desc}</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300 group-hover:text-[#b425aa]" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEWS 1-8: Dynamic Steps ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GamificationHUD badges={badges} nextIncentive={stepData?.incentive || "Completion"} />
      
      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
           <span className="uppercase tracking-widest">{USER_TYPES.find(u => u.id === userType)?.label} Route</span>
           <span>•</span>
           <span>Step {step} of 8</span>
        </div>
        
        <ProgressBar current={step} total={8} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex-1 animate-fadeIn relative overflow-hidden">
            
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 brand-font mb-2">{stepData?.title}</h2>
                <p className="text-gray-500">Target: <span className="font-bold text-[#b425aa]">{stepData?.task}</span></p>
            </div>

            {/* Dynamic Body Content based on Step Number */}
            <div className="space-y-6 mb-8">
               {/* STEP 2: GOALS */}
               {step === 2 && (
                 <div className="space-y-3">
                   <p className="text-sm text-gray-600">Select your primary goals to unlock <span className="font-bold">{stepData?.incentive}</span>.</p>
                   {['Improve Resilience', 'Manage Stress', 'Better Sleep', 'Professional Growth'].map(g => (
                     <label key={g} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                       <input type="checkbox" className="w-5 h-5 text-[#b425aa] rounded focus:ring-[#b425aa]" />
                       <span className="ml-3 font-medium">{g}</span>
                     </label>
                   ))}
                 </div>
               )}

               {/* STEP 3: SERVICES */}
               {step === 3 && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded-xl text-center hover:border-[#b425aa] cursor-pointer">
                       <BookOpen className="mx-auto mb-2 text-gray-400"/>
                       <span className="font-bold block">Modules</span>
                    </div>
                    <div className="border p-4 rounded-xl text-center hover:border-[#b425aa] cursor-pointer">
                       <Target className="mx-auto mb-2 text-gray-400"/>
                       <span className="font-bold block">Coaching</span>
                    </div>
                    <div className="border p-4 rounded-xl text-center hover:border-[#b425aa] cursor-pointer">
                       <Zap className="mx-auto mb-2 text-gray-400"/>
                       <span className="font-bold block">Biometrics</span>
                    </div>
                 </div>
               )}

               {/* STEP 5: SIMULATION (Mini-Game) */}
               {step === 5 && (
                 <div className="bg-gray-900 rounded-xl p-6 text-white text-center relative overflow-hidden">
                    
                    {isSimulating ? (
                       <div className="py-10">
                          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p>Simulating {userType === 'mhp' ? 'Client Intake' : 'Platform Setup'}...</p>
                       </div>
                    ) : (
                       <div className="py-8">
                          <PlayCircle size={48} className="mx-auto mb-4 text-green-400" />
                          <h3 className="text-xl font-bold mb-2">Start Interactive Simulation</h3>
                          <p className="text-gray-400 mb-6">Complete this 2-minute task to prove proficiency.</p>
                          <button onClick={runSimulation} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100">Launch Task</button>
                       </div>
                    )}
                 </div>
               )}

                {/* STEP 6: PRICING */}
               {step === 6 && (
                 <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><DollarSign size={18}/> Estimated Investment</h3>
                    <div className="flex justify-between items-end mb-4 border-b border-purple-200 pb-4">
                       <span>Base Platform Fee</span>
                       <span className="font-bold text-xl">₱0.00</span>
                    </div>
                    <div className="flex justify-between items-end mb-4 text-[#b425aa]">
                       <span>Subsidy Applied (Step 4)</span>
                       <span className="font-bold">-100%</span>
                    </div>
                    <p className="text-xs text-gray-500">Based on your "Individual" status and declared needs.</p>
                 </div>
               )}

               {/* STEP 8: CONTRACT */}
               {step === 8 && (
                 <div className="text-center py-4">
                    <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="mb-6 text-gray-600">Please review the Terms of Service and Data Privacy Act compliance.</p>
                    <div className="bg-gray-100 p-4 rounded text-left text-xs h-32 overflow-y-auto font-mono mb-4 text-gray-500">
                       1. DEFINITIONS... <br/> 2. USER RESPONSIBILITIES... <br/> 3. DATA PRIVACY...
                    </div>
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                       <input type="checkbox" className="w-5 h-5 text-[#b425aa]" />
                       <span className="font-bold text-gray-800">I Agree & Sign</span>
                    </label>
                 </div>
               )}
               
               {/* Default Generic Input for other steps */}
               {![2,3,5,6,8].includes(step) && (
                 <input type="text" placeholder={`Enter ${stepData?.task}...`} className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#b425aa] outline-none" />
               )}
            </div>

            {/* Footer Controls */}
            <div className="flex justify-between items-center mt-auto">
                <button 
                  onClick={() => setStep(step - 1)} 
                  className={`text-gray-500 font-medium hover:text-gray-800 ${step === 1 ? 'invisible' : ''}`}
                >
                   Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={isSimulating}
                  className="bg-[#b425aa] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#a01f96] hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                   {step === 8 ? 'Finish & Launch' : 'Next Step'} <ArrowRight size={18} />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
