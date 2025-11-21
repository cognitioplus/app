import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Moon, 
  Globe, 
  Target, 
  LogOut, 
  ChevronRight, 
  Home as HomeIcon,
  Activity,
  BookOpen,
  Calendar,
  Menu,
  X,
  Heart,
  Brain,
  Zap,
  Music,
  Smile,
  ArrowLeft,
  Play,
  CheckCircle,
  Plus,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Facebook,
  Bell,
  Smartphone,
  FileText,
  DollarSign,
  Clock,
  Search,
  Filter,
  Check,
  AlertCircle,
  Briefcase,
  Sparkles,      
  ArrowRight,    
  TrendingUp,    
  Users,         
  Award,
  BarChart2,
  Thermometer,
  Wind,
  MessageSquare,
  Share2,
  ThumbsUp,
  Video,
  Clipboard,
  List,
  AlertTriangle,
  Flame,
  CheckSquare,
  RefreshCw
} from 'lucide-react';

// --- Global Brand Styles & Fonts ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&family=Roboto+Condensed:wght@300;400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');
    
    :root {
      --cognitio-primary: #b425aa;
      --cognitio-purple: #c80ec9;
      --cognitio-gold: #D4AF37;
      --cognitio-neutral: #f8f9fa;
    }

    body {
      font-family: 'Roboto Condensed', sans-serif;
      background-color: var(--cognitio-neutral);
      color: #334155;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Poppins', sans-serif;
    }

    .brand-font {
      font-family: 'Montserrat', sans-serif;
    }
    
    .oswald-font {
      font-family: 'Oswald', sans-serif;
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* For Well-Be Charts */
    .bar-graph {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 60px;
    }
    .bar {
      flex: 1;
      background: #e2e8f0;
      border-radius: 2px;
      transition: height 0.5s ease;
    }
    .bar.active {
      background: #b425aa;
    }
  `}</style>
);

// --- Constants & Assets ---

const BRAND = {
  primary: '#b425aa',
  purple: '#c80ec9',
  gold: '#D4AF37',
  neutral: '#f8f9fa'
};

const ICONS = {
  logo: 'https://579557-c8ed3d25e86041dcbd15c382ded585e0-1-latest.app.mgx.dev/assets/cognitio-main-logo.png',
  resilience: 'https://appimize.app/assets/apps/user_1097/images/20aa97ab307c_945_1097.png',
  habit: 'https://appimize.app/assets/apps/user_1097/images/2eb035e66921_749_1097.png',
  wellbe: 'https://appimize.app/assets/apps/user_1097/images/59e4d59b8372_727_1097.png',
  emotion: 'https://appimize.app/assets/apps/user_1097/images/1fbf3fc9faa2_81_1097.png',
  oasis: 'https://appimize.app/assets/apps/user_1097/images/30eb29593783_604_1097.png',
  growth: 'https://appimize.app/assets/apps/user_1097/images/2d5cb5dadead_225_1097.png',
  psych: 'https://appimize.app/assets/apps/user_1097/images/bae59281d566_404_1097.png',
  partner: 'https://appimize.app/assets/apps/user_1097/images/d2e70ec09200_94_1097.png',
  rooted: 'https://appimize.app/assets/apps/user_1097/images/bfbcbeb7bb69_808_1097.png',
  awareness: 'https://appimize.app/assets/apps/user_1097/images/ee4a29071876_35_1097.png',
  technology: 'https://appimize.app/assets/apps/user_1097/images/a00e6e94af97_251_1097.png'
};

// --- Types ---

type UserType = 'individual' | 'mhp';
type ViewType = 'home' | 'onboarding' | 'dashboard' | 'settings' | 'book-service' | 'resilience-navigator' | 'habit-studio' | 'well-be' | 'emotion-tracker' | 'oasis' | 'subscription-plans' | 'growth-tribe' | 'psych-assess';

interface UserProfile {
  occupation?: string;
  age?: number;
  bio?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  language: 'en' | 'tl';
  region: string;
  goals: string[];
  vulnerabilities: string[];
  onboardingCompleted: boolean;
  profile: UserProfile;
  gamification: {
    level: number;
    xp: number;
    badges: string[];
    streaks: Record<string, any>;
    achievements: string[];
  };
}

// --- UI Components ---

const Button = ({ className, variant = 'primary', children, ...props }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#b425aa] text-white hover:bg-[#9d1f94] shadow-md hover:shadow-lg",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    gold: "bg-[#D4AF37] text-white hover:bg-[#b8962e] shadow-md"
  };
  return <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>;
const Input = ({ className, ...props }: any) => <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b425aa] focus:border-transparent ${className}`} {...props} />;
const Label = ({ children, className }: any) => <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>;
const Switch = ({ checked, onCheckedChange }: any) => (
  <button 
    onClick={() => onCheckedChange(!checked)} 
    className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-[#b425aa]' : 'bg-gray-200'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
  </button>
);
const Badge = ({ children, variant = 'default' }: any) => {
  const styles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant as keyof typeof styles]}`}>{children}</span>;
};

// --- Layout & Helper Components (RESTORED) ---

const CognitioLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-24 h-24', xl: 'w-32 h-32' };
  return <img src={ICONS.logo} alt="Cognitio+ Logo" className={`${sizes[size]} object-contain`} />;
};

const GreetingMessage = () => {
  const getHolidayGreeting = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayOfWeek = now.getDay();
    if (month === 12 && date === 25) return { greeting: "Merry Christmas!", message: "Wishing you joy and peace.", icon: "🎄" };
    if (dayOfWeek === 0) return { greeting: "Happy Sunday!", message: "A perfect day to rest and recharge.", icon: "☀️" };
    return null;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good morning", message: "Start your day with mindfulness.", icon: "🌅" };
    if (hour < 18) return { greeting: "Good afternoon", message: "Hope your day is going well.", icon: "☀️" };
    return { greeting: "Good evening", message: "Time to wind down and relax.", icon: "🌙" };
  };

  const finalGreeting = getHolidayGreeting() || getTimeBasedGreeting();

  return (
    <div className="mb-6 text-white">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-3xl font-bold">{finalGreeting.greeting} {finalGreeting.icon}</h2>
      </div>
      <p className="text-purple-100 font-medium">{finalGreeting.message}</p>
    </div>
  );
};

const AppLayout = ({ children, user, onLogout, onNavigate, onLoginClick }: { children: React.ReactNode; user: User | null; onLogout?: () => void; onNavigate: (view: ViewType) => void; onLoginClick?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <GlobalStyles />
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <CognitioLogo size="sm" />
            <span className="brand-font font-bold text-xl text-[#b425aa]">Cognitio<span className="text-[#D4AF37]">+</span></span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <nav className="flex items-center gap-4">
                  <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-[#b425aa] font-medium transition-colors">Dashboard</button>
                  <button onClick={() => onNavigate('settings')} className="text-gray-600 hover:text-[#b425aa] font-medium transition-colors">Settings</button>
                </nav>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#b425aa]/10 text-[#b425aa] flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Sign Out</button>
                </div>
              </>
            ) : (
               <Button onClick={onLoginClick} size="sm">Login / Sign Up</Button>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg absolute w-full">
             <nav className="flex flex-col gap-4">
                {user ? (
                  <>
                    <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="text-left text-gray-700">Dashboard</button>
                    <button onClick={() => { onNavigate('settings'); setIsMenuOpen(false); }} className="text-left text-gray-700">Settings</button>
                    <button onClick={() => { if(onLogout) onLogout(); setIsMenuOpen(false); }} className="text-left text-red-500">Sign Out</button>
                  </>
                ) : (
                  <Button onClick={() => { if(onLoginClick) onLoginClick(); setIsMenuOpen(false); }}>Login / Sign Up</Button>
                )}
             </nav>
          </div>
        )}
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4"><CognitioLogo size="sm" /></div>
          <p className="text-sm text-gray-500 font-['Roboto_Condensed']">
            © 2024 Cognitio Health. All rights reserved. <br/>
            <span className="text-[#b425aa] font-bold">Powered by Awareness, Enhanced by Technology.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- Feature & Home Components (RESTORED) ---

const StatsInfographic = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 px-4 w-full max-w-6xl mx-auto">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><Users size={24}/></div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">1 in 5</h3>
      <p className="text-gray-500 text-sm">Adults experience mental illness each year.</p>
    </div>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><TrendingUp size={24}/></div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">60%</h3>
      <p className="text-gray-500 text-sm">Of people with mental health conditions go untreated.</p>
    </div>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><Award size={24}/></div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">4x</h3>
      <p className="text-gray-500 text-sm">Improvement in resilience with regular practice.</p>
    </div>
  </div>
);

const FeatureShowcase = () => {
  const features = [
    { title: "Resilience Navigator", desc: "Build strength with CASE Framework.", icon: ICONS.resilience },
    { title: "Habit Design Studio", desc: "Create lasting habits with B=MAP.", icon: ICONS.habit },
    { title: "Well-Be Monitor", desc: "Track physiological stress via HRV.", icon: ICONS.wellbe },
    { title: "Emotion Tracker", desc: "Understand feelings with Hawkins Scale.", icon: ICONS.emotion },
    { title: "Oasis Sanctuary", desc: "Find peace with guided mindfulness.", icon: ICONS.oasis },
    { title: "Professional Care", desc: "Connect with licensed experts.", icon: ICONS.psych },
  ];

  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10 brand-font">Comprehensive Wellness Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
            <img src={feat.icon} className="w-16 h-16 object-contain" alt={feat.title} />
            <div>
              <h4 className="font-bold text-lg text-gray-800">{feat.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubscriptionCTA = ({ onSubscribe }: { onSubscribe: () => void }) => (
  <section className="relative max-w-5xl mx-auto px-6 py-16 bg-gradient-to-r from-[#b425aa] to-[#c80ec9] rounded-3xl shadow-2xl overflow-hidden my-12">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl"></div>
    <div className="relative z-10 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3e329] text-[#c80ec9] mb-6 shadow-lg">
        <Sparkles className="h-8 w-8" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold font-[Oswald] text-white mb-6">Unlock Advanced Wellness Intelligence</h2>
      <p className="text-lg md:text-xl text-white/90 font-[Montserrat] max-w-3xl mx-auto mb-10 leading-relaxed">
        Subscribe to get access to advanced analytics on data correlations across the Cognitio+ ecosystem and Well-Be features, health trends, personalized resilience insights, and more.
      </p>
      <Button onClick={onSubscribe} size="lg" className="bg-[#f3e329] text-[#c80ec9] hover:bg-[#f3e329]/90 font-bold px-10 py-4 text-lg font-[Montserrat] shadow-xl transition-all duration-200 hover:scale-105 rounded-full">
        Subscribe Now <ArrowRight className="ml-2 h-6 w-6" />
      </Button>
    </div>
  </section>
);

const SubscriptionPlaceholder = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-4xl mx-auto">
    <button onClick={onBack} className="mb-4 text-gray-500 hover:text-[#b425aa] flex items-center gap-1"><ArrowLeft size={16}/> Back to Home</button>
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
       <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3e329] text-[#c80ec9] mb-6"><Sparkles size={32}/></div>
       <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Plans</h1>
       <p className="text-gray-500 mb-8 max-w-lg mx-auto">Unlock the full power of the Cognitio+ ecosystem with advanced analytics and resilience insights.</p>
       <div className="grid md:grid-cols-3 gap-6 text-left">
          {['Basic', 'Premium', 'Professional'].map((plan, i) => (
             <div key={plan} className={`border rounded-xl p-6 ${i===1 ? 'border-[#b425aa] bg-purple-50 relative' : 'border-gray-200'}`}>
                {i===1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b425aa] text-white text-xs px-3 py-1 rounded-full">Most Popular</span>}
                <h3 className="font-bold text-xl mb-2">{plan}</h3>
                <p className="text-2xl font-bold mb-4">₱{i===0 ? '0' : i===1 ? '499' : '1,299'}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <ul className="space-y-2 mb-6 text-sm">
                   {[1,2,3,4].map(x => <li key={x} className="flex gap-2"><Check size={16} className="text-green-500"/> Feature point {x}</li>)}
                </ul>
                <Button className={`w-full ${i===1 ? 'bg-[#b425aa] text-white' : 'bg-gray-100 text-gray-900'}`}>{i===0 ? 'Current Plan' : 'Upgrade'}</Button>
             </div>
          ))}
       </div>
    </div>
  </div>
);

// Updated FeaturePlaceholder to take image URL string instead of Icon Component
const FeaturePlaceholder = ({ title, icon, onBack }: any) => (
  <div className="text-center py-12">
    <button onClick={onBack} className="mb-4 text-gray-500 hover:text-[#b425aa] flex items-center justify-center gap-1 mx-auto"><ArrowLeft size={16}/> Back</button>
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <img src={icon} alt={title} className="w-10 h-10 object-contain" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500">Feature loaded successfully.</p>
  </div>
);

// --- Auth Modal Component ---

const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (data: any) => void }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: 'user_' + Date.now(),
        name: formData.name || 'User',
        email: formData.email,
        userType: 'individual', 
        profile: { occupation: 'New Member' }
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'login' ? 'text-[#b425aa] border-b-2 border-[#b425aa] bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'signup' ? 'text-[#b425aa] border-b-2 border-[#b425aa] bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl oswald-font text-[#b425aa]">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Cognitio+'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'login' ? 'Enter your credentials to access your account' : 'Start your resilience journey today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="pl-10" 
                    required 
                    value={formData.name}
                    onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-10" 
                  required 
                  value={formData.email}
                  onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="pl-10 pr-10" 
                  required 
                  value={formData.password}
                  onChange={(e: any) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-[#b425aa]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Processing..." : (activeTab === 'login' ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full text-xs">
              <Facebook className="h-4 w-4 text-blue-600 mr-2" /> Facebook
            </Button>
            <Button variant="outline" className="w-full text-xs">
              <Mail className="h-4 w-4 text-red-500 mr-2" /> Gmail
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center">
           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// --- Settings Component ---

const SettingsComponent = ({ onBack }: { onBack: () => void }) => {
  const [notifications, setNotifications] = useState({ push: true, email: false, hrv: true });
  const [privacy, setPrivacy] = useState({ dataSharing: false, analytics: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 brand-font">Settings</h1>
          <p className="text-gray-500">Manage your preferences and account security</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-[#b425aa]" />
          <h3 className="text-lg font-bold">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Push Notifications</p><p className="text-sm text-gray-500">Receive notifications on your device</p></div>
            <Switch checked={notifications.push} onCheckedChange={(c: boolean) => setNotifications({...notifications, push: c})} />
          </div>
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Email Summaries</p><p className="text-sm text-gray-500">Weekly health reports</p></div>
            <Switch checked={notifications.email} onCheckedChange={(c: boolean) => setNotifications({...notifications, email: c})} />
          </div>
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <div><p className="font-medium">HRV Alerts</p><p className="text-sm text-gray-500">Notify on significant changes</p></div>
             </div>
             <Switch checked={notifications.hrv} onCheckedChange={(c: boolean) => setNotifications({...notifications, hrv: c})} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-[#b425aa]" />
          <h3 className="text-lg font-bold">Privacy & Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Data Sharing</p><p className="text-sm text-gray-500">Share anonymized data for research</p></div>
            <Switch checked={privacy.dataSharing} onCheckedChange={(c: boolean) => setPrivacy({...privacy, dataSharing: c})} />
          </div>
          <div className="h-px bg-gray-100 my-2" />
           <div className="flex items-center justify-between">
            <div><p className="font-medium">Analytics</p><p className="text-sm text-gray-500">Help improve Cognitio+ functionality</p></div>
            <Switch checked={privacy.analytics} onCheckedChange={(c: boolean) => setPrivacy({...privacy, analytics: c})} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-[#b425aa]" />
          <h3 className="text-lg font-bold">Connected Devices</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Activity className="h-5 w-5 text-gray-600" /></div>
              <div><p className="font-medium">Apple Watch Series 8</p><p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected</p></div>
            </div>
            <Button variant="outline" className="text-xs">Disconnect</Button>
          </div>
          <Button variant="outline" className="w-full">+ Add New Device</Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

// --- Updated Well-Be Component ---

const WellBe = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'measure' | 'insights'>('dashboard');
  const [measuring, setMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | number>(null);

  // Measure Logic
  const startMeasurement = () => {
    setMeasuring(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setMeasuring(false);
          setResult(78); // Mock HRV Score
          return 100;
        }
        return p + 1;
      });
    }, 50); 
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Status */}
      <div className="bg-gradient-to-r from-[#b425aa] to-[#c80ec9] rounded-3xl p-6 text-white shadow-xl flex flex-col items-center justify-center py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center relative z-10">
          <div className="text-center">
             <span className="text-5xl font-bold font-['Oswald']">85</span>
             <p className="text-xs uppercase tracking-widest text-white/80 mt-1">Wellness Score</p>
          </div>
          <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="8" strokeDasharray="289" strokeDashoffset="50" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-white/90 font-medium">You are well recovered today!</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
             <Moon size={16} className="text-indigo-500"/> Sleep
           </div>
           <p className="text-2xl font-bold text-gray-800">7h 42m</p>
           <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
             <div className="bg-indigo-500 w-[85%] h-full rounded-full"></div>
           </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
             <Activity size={16} className="text-pink-500"/> HRV
           </div>
           <p className="text-2xl font-bold text-gray-800">65 ms</p>
           <div className="bar-graph mt-2">
              <div className="bar h-[40%]"></div>
              <div className="bar h-[60%]"></div>
              <div className="bar h-[50%]"></div>
              <div className="bar h-[80%] active"></div>
           </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
             <Heart size={16} className="text-red-500"/> Heart Rate
           </div>
           <p className="text-2xl font-bold text-gray-800">58 bpm</p>
           <p className="text-xs text-green-500 flex items-center mt-1"><ArrowRight className="rotate-45 w-3 h-3"/> Resting</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
             <Zap size={16} className="text-yellow-500"/> Stress
           </div>
           <p className="text-2xl font-bold text-gray-800">Low</p>
           <div className="flex gap-1 mt-2">
             <div className="h-2 w-full bg-green-400 rounded-full"></div>
             <div className="h-2 w-full bg-gray-200 rounded-full"></div>
             <div className="h-2 w-full bg-gray-200 rounded-full"></div>
           </div>
        </div>
      </div>
      
      <Button className="w-full py-6 text-lg" onClick={() => setActiveTab('measure')}>
         <Plus size={20} className="mr-2"/> Start New Measurement
      </Button>
    </div>
  );

  const renderMeasure = () => (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden h-full flex flex-col justify-center animate-fadeIn">
        {!measuring && !result && (
          <>
            <img src={ICONS.wellbe} className="w-20 h-20 mx-auto mb-6" alt="wellbe" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Stress</h3>
            <p className="text-gray-500 mb-8">Place your index finger gently on the camera lens.</p>
            <button onClick={startMeasurement} className="w-40 h-40 rounded-full bg-red-50 border-4 border-red-500 flex items-center justify-center mx-auto animate-pulse">
               <Heart className="text-red-500 w-16 h-16 fill-current" />
            </button>
            <p className="mt-6 font-bold text-red-500">TAP TO START</p>
          </>
        )}

        {measuring && (
          <div className="py-12">
            <div className="w-40 h-40 rounded-full border-4 border-gray-100 mx-auto relative flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300">{Math.round(progress)}%</span>
              <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#b425aa" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} className="transition-all duration-100" />
              </svg>
            </div>
            <p className="mt-8 text-gray-600 animate-pulse">Detecting heartbeat...</p>
          </div>
        )}

        {result && (
          <div className="animate-fadeIn">
            <div className="text-5xl font-bold text-green-500 mb-2">{result}</div>
            <p className="text-gray-400 uppercase tracking-wider font-bold text-xs mb-6">HRV Score</p>
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6">
              Your stress levels are <strong>Low</strong>. State of coherence achieved.
            </div>
            <div className="flex flex-col gap-3">
               <Button onClick={() => setResult(null)} variant="outline">Measure Again</Button>
               <Button onClick={() => { setResult(null); setActiveTab('dashboard'); }}>View Dashboard</Button>
            </div>
          </div>
        )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
        <h2 className="text-xl font-bold text-[#b425aa]">Well-Be Monitor</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'measure' && renderMeasure()}
         {activeTab === 'insights' && (
           <div className="space-y-4 animate-fadeIn">
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                 <h3 className="font-bold text-[#b425aa] mb-2 flex items-center gap-2"><Sparkles size={18}/> Daily Insight</h3>
                 <p className="text-sm text-gray-700">Your HRV trend suggests you are recovering well from yesterday's stress. Today is a good day for deep work.</p>
              </div>
              <h3 className="font-bold text-gray-800">Recommendations</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center">
                 <div className="bg-blue-100 text-blue-600 p-3 rounded-lg"><Wind size={20}/></div>
                 <div>
                    <h4 className="font-bold text-sm">Box Breathing</h4>
                    <p className="text-xs text-gray-500">5 min session • Reduce anxiety</p>
                 </div>
                 <Button size="sm" variant="ghost" className="ml-auto"><Play size={16}/></Button>
              </div>
           </div>
         )}
      </div>

      {/* Bottom Nav for Well-Be */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full px-6 py-3 border border-gray-100 flex items-center gap-8 z-20">
         <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab==='dashboard' ? 'text-[#b425aa]' : 'text-gray-400'}`}>
            <Activity size={20} />
            <span className="text-[10px] font-bold">Dash</span>
         </button>
         <button onClick={() => setActiveTab('measure')} className={`flex flex-col items-center gap-1 ${activeTab==='measure' ? 'text-[#b425aa]' : 'text-gray-400'}`}>
            <div className="bg-[#b425aa] text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-[#f8f9fa]">
               <Plus size={24} />
            </div>
         </button>
         <button onClick={() => setActiveTab('insights')} className={`flex flex-col items-center gap-1 ${activeTab==='insights' ? 'text-[#b425aa]' : 'text-gray-400'}`}>
            <Brain size={20} />
            <span className="text-[10px] font-bold">Insights</span>
         </button>
      </div>
    </div>
  );
};

// --- NEW COMPONENTS: Resilience Navigator & Habit Design Studio ---

// 1. Resilience Navigator (CASE Framework)
const ResilienceNavigator = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<any>({ coping: 0, adaptability: 0, sensitivity: 0, exposure: 0 });

  const questions = [
    { category: 'coping', text: "I can effectively calm myself when I feel overwhelmed." },
    { category: 'coping', text: "I recover quickly from setbacks." },
    { category: 'adaptability', text: "I am comfortable dealing with unexpected changes." },
    { category: 'adaptability', text: "I can easily shift my perspective to see the positive." },
    { category: 'sensitivity', text: "I can observe my emotions without being controlled by them." },
    { category: 'sensitivity', text: "I don't take constructive criticism personally." },
    { category: 'exposure', text: "I set healthy boundaries with draining people or situations." },
    { category: 'exposure', text: "I curate my environment to support my well-being." }
  ];

  const handleAnswer = (value: number) => {
    const cat = questions[qIndex].category;
    setScores((prev: any) => ({ ...prev, [cat]: prev[cat] + value }));
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep('result');
    }
  };

  // Calculate percentages (max score per category is 10 because 2 questions * 5 points)
  const getPercent = (val: number) => (val / 10) * 100;

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
        <div className="flex items-center gap-2 text-[#b425aa] font-bold text-lg">
          <img src={ICONS.resilience} className="w-8 h-8"/> Resilience Navigator
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto relative">
        {step === 'intro' && (
          <div className="text-center flex flex-col items-center justify-center h-full animate-fadeIn">
            <img src={ICONS.resilience} className="w-24 h-24 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4 brand-font">Assess Your Resilience</h2>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Using the CASE Framework, we'll measure your <strong>Coping</strong>, <strong>Adaptability</strong>, <strong>Sensitivity</strong>, and <strong>Exposure</strong> control.
            </p>
            <Button onClick={() => setStep('quiz')} className="w-full max-w-xs py-4 text-lg">Start Assessment</Button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="animate-fadeIn h-full flex flex-col">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">
                <span>Question {qIndex + 1} / {questions.length}</span>
                <span>{Math.round(((qIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#b425aa] transition-all duration-300" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-medium text-gray-800 mb-10 text-center leading-snug">
                {questions[qIndex].text}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => handleAnswer(val)}
                    className="p-4 text-left border border-gray-200 rounded-xl hover:bg-[#b425aa] hover:text-white hover:border-[#b425aa] transition-all font-medium group flex justify-between items-center"
                  >
                    <span>{val === 1 ? 'Strongly Disagree' : val === 5 ? 'Strongly Agree' : val === 3 ? 'Neutral' : val === 2 ? 'Disagree' : 'Agree'}</span>
                    <div className={`w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-white`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 brand-font">Your Resilience Profile</h2>
              <p className="text-gray-500">Based on the CASE Framework</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { key: 'coping', label: 'Coping Capacity', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
                { key: 'adaptability', label: 'Adaptability', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
                { key: 'sensitivity', label: 'Sensitivity Reduction', color: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50' },
                { key: 'exposure', label: 'Exposure Control', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' }
              ].map((item) => (
                <div key={item.key} className={`${item.bg} p-5 rounded-2xl`}>
                  <div className="flex justify-between items-end mb-2">
                    <h4 className={`font-bold ${item.text}`}>{item.label}</h4>
                    <span className={`text-2xl font-bold ${item.text}`}>{Math.round(getPercent(scores[item.key]))}%</span>
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${getPercent(scores[item.key])}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-[#D4AF37]"/> Recommended Action</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Based on your scores, focusing on <strong>Exposure Control</strong> could have the biggest impact. Try identifying one energy-draining activity this week and reducing it by 10%.
              </p>
              <Button variant="outline" onClick={() => { setStep('intro'); setScores({ coping: 0, adaptability: 0, sensitivity: 0, exposure: 0 }); setQIndex(0); }} className="w-full">
                <RefreshCw size={16} className="mr-2"/> Retake Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Habit Design Studio (B=MAP)
const HabitDesignStudio = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'track' | 'design'>('track');
  const [habits, setHabits] = useState([
    { id: 1, title: "Morning Hydration", anchor: "After I wake up", behavior: "I will drink 1 glass water", celebration: "Smile", streak: 12, done: false },
    { id: 2, title: "Mindful Breath", anchor: "After I sit at desk", behavior: "I will take 3 deep breaths", celebration: "Fist pump", streak: 5, done: true },
  ]);
  const [newHabit, setNewHabit] = useState({ anchor: '', behavior: '', celebration: '' });

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : h.streak - 1 } : h));
  };

  const saveHabit = () => {
    if (newHabit.anchor && newHabit.behavior) {
      setHabits([...habits, { 
        id: Date.now(), 
        title: "New Tiny Habit", 
        anchor: newHabit.anchor, 
        behavior: newHabit.behavior, 
        celebration: newHabit.celebration, 
        streak: 0, 
        done: false 
      }]);
      setNewHabit({ anchor: '', behavior: '', celebration: '' });
      setActiveTab('track');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
        <div className="flex items-center gap-2 text-[#b425aa] font-bold text-lg">
          <img src={ICONS.habit} className="w-8 h-8 rounded-lg"/> Habit Design Studio
        </div>
        <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button onClick={() => setActiveTab('track')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'track' ? 'bg-white shadow-sm text-[#b425aa]' : 'text-gray-500'}`}>My Habits</button>
        <button onClick={() => setActiveTab('design')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-[#b425aa]' : 'text-gray-500'}`}>Design Lab</button>
      </div>

      {activeTab === 'track' && (
        <div className="space-y-4 animate-fadeIn">
          {habits.map(habit => (
            <div key={habit.id} className={`bg-white p-4 rounded-2xl border transition-all ${habit.done ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">{habit.behavior}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <span className="font-semibold text-[#b425aa]">Anchor:</span> {habit.anchor}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                    <Flame size={18} className={habit.streak > 0 ? 'fill-orange-500' : ''}/> {habit.streak}
                  </div>
                  <button 
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${habit.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300 hover:bg-gray-200'}`}
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {habits.length === 0 && (
            <div className="text-center py-10 text-gray-400">No habits designed yet. Go to the Lab!</div>
          )}
        </div>
      )}

      {activeTab === 'design' && (
        <div className="animate-fadeIn bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 brand-font">Create a Recipe (B=MAP)</h3>
          
          <div className="space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"></div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xs z-10">M</div>
              <Label className="text-[#D4AF37]">1. Anchor Moment (Prompt)</Label>
              <p className="text-xs text-gray-400 mb-2">An existing routine (e.g., "After I brush my teeth")</p>
              <Input placeholder="After I..." value={newHabit.anchor} onChange={(e: any) => setNewHabit({...newHabit, anchor: e.target.value})} />
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-8 h-8 bg-[#b425aa] rounded-full flex items-center justify-center text-white font-bold text-xs z-10">B</div>
              <Label className="text-[#b425aa]">2. Tiny Behavior (Ability)</Label>
              <p className="text-xs text-gray-400 mb-2">Super small action (e.g., "I will floss one tooth")</p>
              <Input placeholder="I will..." value={newHabit.behavior} onChange={(e: any) => setNewHabit({...newHabit, behavior: e.target.value})} />
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-8 h-8 bg-[#c80ec9] rounded-full flex items-center justify-center text-white font-bold text-xs z-10">C</div>
              <Label className="text-[#c80ec9]">3. Celebration (Emotion)</Label>
              <p className="text-xs text-gray-400 mb-2">To wire it in (e.g., "I will smile")</p>
              <Input placeholder="To celebrate, I will..." value={newHabit.celebration} onChange={(e: any) => setNewHabit({...newHabit, celebration: e.target.value})} />
            </div>

            <div className="pt-4">
              <Button onClick={saveHabit} className="w-full py-4 font-bold text-lg shadow-lg">Save Recipe</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- NEW COMPONENTS: GROWTH Tribe & PsychAssess Pro (Previous Implementation) ---

// GROWTH Tribe Component
const GrowthTribe = ({ onBack }: { onBack: () => void }) => {
  const [tab, setTab] = useState<'community' | 'events' | 'resources'>('community');
  
  const posts = [
    { id: 1, user: "Sarah J.", avatar: "SJ", time: "2h ago", content: "Just completed my 30-day mindfulness streak! Feeling more centered than ever.", likes: 24, comments: 5 },
    { id: 2, user: "Mark D.", avatar: "MD", time: "5h ago", content: "Does anyone else struggle with sleep anxiety? Looking for tips.", likes: 12, comments: 8 },
    { id: 3, user: "Cognitio Team", avatar: "CT", time: "1d ago", content: "New Workshop Alert: Building Resilience in Tough Times. Join us this Friday!", likes: 56, comments: 2 },
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
       {/* Header */}
       <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={onBack}><ArrowLeft className="text-gray-500 hover:text-[#b425aa]"/></button>
             <div className="flex items-center gap-2">
               <img src={ICONS.growth} className="w-8 h-8 rounded-lg"/>
               <h2 className="font-bold text-lg text-gray-800">GROWTH Tribe</h2>
             </div>
          </div>
          <div className="flex gap-4 text-sm font-medium">
             <button onClick={() => setTab('community')} className={`${tab==='community' ? 'text-[#b425aa] border-b-2 border-[#b425aa]' : 'text-gray-500'}`}>Community</button>
             <button onClick={() => setTab('events')} className={`${tab==='events' ? 'text-[#b425aa] border-b-2 border-[#b425aa]' : 'text-gray-500'}`}>Events</button>
             <button onClick={() => setTab('resources')} className={`${tab==='resources' ? 'text-[#b425aa] border-b-2 border-[#b425aa]' : 'text-gray-500'}`}>Resources</button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {tab === 'community' && (
             <div className="space-y-4 max-w-2xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                   <div className="flex gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">ME</div>
                      <input type="text" placeholder="Share your journey..." className="flex-1 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#b425aa]"/>
                   </div>
                   <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-4 text-gray-400">
                         <Video size={20} className="cursor-pointer hover:text-[#b425aa]"/>
                         <Share2 size={20} className="cursor-pointer hover:text-[#b425aa]"/>
                      </div>
                      <Button size="sm">Post</Button>
                   </div>
                </div>

                {posts.map(post => (
                   <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 rounded-full flex items-center justify-center font-bold font-xs">{post.avatar}</div>
                         <div>
                            <h4 className="font-bold text-sm text-gray-900">{post.user}</h4>
                            <p className="text-xs text-gray-400">{post.time}</p>
                         </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-6 text-gray-400 text-sm border-t border-gray-100 pt-3">
                         <button className="flex items-center gap-1 hover:text-[#b425aa]"><ThumbsUp size={16}/> {post.likes}</button>
                         <button className="flex items-center gap-1 hover:text-[#b425aa]"><MessageSquare size={16}/> {post.comments}</button>
                         <button className="flex items-center gap-1 ml-auto hover:text-[#b425aa]"><Share2 size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {tab === 'events' && (
             <div className="space-y-4 max-w-2xl mx-auto">
                <div className="bg-[#b425aa] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                   <div className="relative z-10">
                      <Badge className="bg-yellow-400 text-yellow-900 mb-2">Featured</Badge>
                      <h3 className="text-2xl font-bold mb-2">Resilience Summit 2024</h3>
                      <p className="text-purple-100 mb-4 text-sm">Join world-class experts for a day of learning and growth.</p>
                      <Button variant="gold" className="text-sm font-bold text-gray-900">Register Now</Button>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                </div>
                {[1,2,3].map(i => (
                   <div key={i} className="bg-white p-4 rounded-xl flex gap-4 border border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600">
                         <span className="text-xs font-bold uppercase">Nov</span>
                         <span className="text-xl font-bold">2{i}</span>
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800">Mindfulness Workshop</h4>
                         <p className="text-sm text-gray-500">2:00 PM • Online Zoom</p>
                         <div className="flex gap-2 mt-2">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(x => <div key={x} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>)}
                           </div>
                           <span className="text-xs text-gray-400 mt-1">+42 going</span>
                         </div>
                      </div>
                      <Button variant="outline" className="ml-auto text-xs self-center">Join</Button>
                   </div>
                ))}
             </div>
          )}

          {tab === 'resources' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {['Understanding Anxiety', 'Sleep Hygiene 101', 'Nutrition for Mood', 'The Science of Habits'].map((t, i) => (
                   <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400"><Play size={32}/></div>
                      <h4 className="font-bold text-gray-800">{t}</h4>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-xs text-gray-500">Video • 5 mins</span>
                         <BookmarkButton />
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

const BookmarkButton = () => {
   const [saved, setSaved] = useState(false);
   return <button onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}><Heart size={18} className={saved ? 'fill-red-500 text-red-500' : 'text-gray-400'}/></button>
};

// PsychAssess Pro Component
const PsychAssessPro = ({ onBack }: { onBack: () => void }) => {
   const [view, setView] = useState<'list' | 'runner' | 'result' | 'ethical'>('list');
   const [activeAssessment, setActiveAssessment] = useState<any>(null);
   const [runnerStep, setRunnerStep] = useState(0);
   const [answers, setAnswers] = useState<number[]>([]);

   const assessments = [
      { id: 'gad7', title: 'GAD-7', name: 'Generalized Anxiety Disorder-7', questions: 7, time: '3 mins' },
      { id: 'phq9', title: 'PHQ-9', name: 'Patient Health Questionnaire-9', questions: 9, time: '5 mins' },
      { id: 'dass21', title: 'DASS-21', name: 'Depression Anxiety Stress Scales', questions: 21, time: '10 mins' }
   ];

   const startAssessment = (assessment: any) => {
      setActiveAssessment(assessment);
      setRunnerStep(0);
      setAnswers(new Array(assessment.questions).fill(0));
      setView('runner');
   };

   const handleAnswer = (val: number) => {
      const newAnswers = [...answers];
      newAnswers[runnerStep] = val;
      setAnswers(newAnswers);
      
      if (runnerStep < activeAssessment.questions - 1) {
         setRunnerStep(runnerStep + 1);
      } else {
         setView('result');
      }
   };

   const calculateScore = () => answers.reduce((a, b) => a + b, 0);

   const getInterpretation = (score: number) => {
      if (score < 5) return { level: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
      if (score < 10) return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      if (score < 15) return { level: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-100' };
      return { level: 'Severe', color: 'text-red-600', bg: 'bg-red-100' };
   };

   return (
      <div className="max-w-3xl mx-auto h-full flex flex-col">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <button onClick={() => { view === 'list' ? onBack() : setView('list') }} className="flex items-center gap-2 text-gray-500 hover:text-[#b425aa]">
               <ArrowLeft size={20}/> {view === 'list' ? 'Dashboard' : 'Assessments'}
            </button>
            <div className="flex items-center gap-2">
               <img src={ICONS.psych} className="w-8 h-8"/>
               <h1 className="text-xl font-bold text-gray-800 brand-font">PsychAssess Pro</h1>
            </div>
            {view === 'list' && <button onClick={() => setView('ethical')} className="text-sm text-gray-500 hover:text-[#b425aa] underline">Ethical Guidelines</button>}
            {view !== 'list' && <div className="w-20"></div>}
         </div>

         {view === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
               {assessments.map(a => (
                  <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-[#b425aa] transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-[#b425aa] group-hover:text-white transition-colors">
                           <FileText size={24}/>
                        </div>
                        <Badge>{a.time}</Badge>
                     </div>
                     <h3 className="text-xl font-bold text-gray-800 mb-1">{a.title}</h3>
                     <p className="text-sm text-gray-500 mb-6">{a.name}</p>
                     <Button onClick={() => startAssessment(a)} className="w-full">Start Assessment</Button>
                  </div>
               ))}
               <div className="md:col-span-2 bg-blue-50 border border-blue-100 p-6 rounded-xl flex gap-4 items-center">
                  <AlertCircle className="text-blue-600 shrink-0" size={32}/>
                  <div>
                     <h4 className="font-bold text-blue-800">Clinical Disclaimer</h4>
                     <p className="text-sm text-blue-700 mt-1">These tools are for screening purposes only and do not replace a formal clinical diagnosis. Ensure patient consent before proceeding.</p>
                  </div>
               </div>
            </div>
         )}

         {view === 'runner' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn max-w-2xl mx-auto w-full">
               <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                     <span>Question {runnerStep + 1} of {activeAssessment.questions}</span>
                     <span>{Math.round(((runnerStep + 1) / activeAssessment.questions) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#b425aa] transition-all duration-300" style={{ width: `${((runnerStep + 1) / activeAssessment.questions) * 100}%` }}></div>
                  </div>
               </div>
               
               <h3 className="text-2xl font-medium text-gray-800 mb-8 text-center">
                  Over the last 2 weeks, how often have you been bothered by any of the following problems?
               </h3>

               <div className="grid grid-cols-1 gap-3">
                  {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((opt, i) => (
                     <button 
                        key={i} 
                        onClick={() => handleAnswer(i)}
                        className="p-4 text-left border border-gray-200 rounded-xl hover:bg-[#b425aa] hover:text-white hover:border-[#b425aa] transition-all font-medium"
                     >
                        {opt}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {view === 'result' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn text-center max-w-xl mx-auto w-full">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <CheckCircle size={40}/>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
               <p className="text-gray-500 mb-8">Results for {activeAssessment.title}</p>
               
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                     <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Total Score</p>
                     <p className="text-4xl font-bold text-gray-900 mt-2">{calculateScore()}</p>
                  </div>
                  <div className={`${getInterpretation(calculateScore()).bg} p-4 rounded-xl`}>
                     <p className="text-sm uppercase tracking-wide font-bold opacity-70">Interpretation</p>
                     <p className={`text-xl font-bold mt-2 ${getInterpretation(calculateScore()).color}`}>
                        {getInterpretation(calculateScore()).level}
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <Button onClick={() => setView('list')}>Return to List</Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2"><Clipboard size={16}/> Copy to Clipboard</Button>
               </div>
            </div>
         )}

         {view === 'ethical' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
               <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield size={24} className="text-[#b425aa]"/> Ethical Guidelines</h2>
               <div className="space-y-6 text-gray-700">
                  <section>
                     <h3 className="font-bold text-lg mb-2">1. Informed Consent</h3>
                     <p>Practitioners must obtain and document informed consent from the client before administering any assessment tool.</p>
                  </section>
                  <section>
                     <h3 className="font-bold text-lg mb-2">2. Confidentiality</h3>
                     <p>All assessment data must be stored securely and shared only with authorized personnel or with the client's explicit permission.</p>
                  </section>
                  <section>
                     <h3 className="font-bold text-lg mb-2">3. Competence</h3>
                     <p>Users should only administer assessments they are trained to interpret and use within their scope of practice.</p>
                  </section>
                  <Button variant="outline" onClick={() => setView('list')}>Back to Tools</Button>
               </div>
            </div>
         )}
      </div>
   );
};

// --- MHPDashboard Update ---
// Just updating the navigation call in the professional tools section
const MHPDashboard = ({ user, onNavigate }: { user: User, onNavigate: (view: ViewType) => void }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // ... (Mock Data & Tabs same as before)
  const requests = [
    { id: 1, name: "Maria Santos", age: 28, urgency: "High", type: "Video", date: "Today, 2:00 PM" },
    { id: 2, name: "John Reyes", age: 34, urgency: "Medium", type: "In-Person", date: "Tomorrow, 10:00 AM" },
    { id: 3, name: "Anna Cruz", age: 24, urgency: "Low", type: "Phone", date: "Nov 25, 4:00 PM" },
  ];
  const payments = [
    { id: 'TRX-001', client: 'Maria Santos', amount: 1500, status: 'Paid', date: '2024-11-20' },
    { id: 'TRX-002', client: 'John Reyes', amount: 1200, status: 'Pending', date: '2024-11-21' },
    { id: 'TRX-003', client: 'Anna Cruz', amount: 800, status: 'Overdue', date: '2024-11-15' },
  ];
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'requests', label: 'Requests', icon: Bell },
    { id: 'notes', label: 'Clinical Notes', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'availability', label: 'Availability', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 brand-font">Dr. {user.name}</h1>
          <p className="text-gray-500 text-sm">Mental Health Professional Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm"><SettingsIcon className="w-4 h-4 mr-1"/>Settings</Button>
          <Button variant="outline" className="text-sm" onClick={() => onNavigate('growth-tribe')}><Globe className="w-4 h-4 mr-1"/>GROWTH Tribe</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-[#b425aa] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div><p className="text-gray-500 text-sm">Total Patients</p><h3 className="text-3xl font-bold mt-1">48</h3></div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><UserIcon size={20}/></div>
              </div>
              <p className="text-xs text-green-600 mt-4 flex items-center gap-1"><ArrowLeft className="rotate-90 w-3 h-3"/> +12% this month</p>
            </Card>
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div><p className="text-gray-500 text-sm">Pending Requests</p><h3 className="text-3xl font-bold mt-1">{requests.length}</h3></div>
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Bell size={20}/></div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Requires action</p>
            </Card>
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div><p className="text-gray-500 text-sm">Revenue (Nov)</p><h3 className="text-3xl font-bold mt-1">₱45k</h3></div>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20}/></div>
              </div>
              <p className="text-xs text-green-600 mt-4 flex items-center gap-1"><ArrowLeft className="rotate-90 w-3 h-3"/> +8% vs Oct</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-[#b425aa] to-purple-800 text-white">
              <div className="flex justify-between items-start">
                <div><p className="text-purple-100 text-sm">Next Session</p><h3 className="text-xl font-bold mt-1">2:00 PM</h3></div>
                <div className="p-2 bg-white/20 rounded-lg"><Clock size={20}/></div>
              </div>
              <p className="text-xs text-purple-100 mt-4">Maria Santos (Video)</p>
            </Card>

            <Card className="md:col-span-2 p-6">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase size={18} className="text-[#b425aa]"/> Professional Tools</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div onClick={() => onNavigate('psych-assess')} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-3 transition-colors">
                   <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Brain size={20}/></div>
                   <div><h4 className="font-bold text-sm">PsychAssess Pro</h4><p className="text-xs text-gray-500">Clinical assessments</p></div>
                 </div>
                 <div onClick={() => onNavigate('growth-tribe')} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-3 transition-colors">
                   <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><Globe size={20}/></div>
                   <div><h4 className="font-bold text-sm">GROWTH Tribe</h4><p className="text-xs text-gray-500">Peer supervision</p></div>
                 </div>
               </div>
            </Card>
          </div>
        )}
        {/* Other Tabs (Requests, Payments, etc.) remain the same for brevity */}
        {activeTab === 'requests' && (
          <Card className="overflow-hidden">
             {/* ...existing code... */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Incoming Booking Requests</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs"><Filter size={14} className="mr-1"/> Filter</Button>
                <Button variant="outline" className="text-xs"><Search size={14} className="mr-1"/> Search</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 font-medium uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Urgency</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Requested Time</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{req.name}</div>
                        <div className="text-xs text-gray-500">{req.age} yrs old • Female</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={req.urgency === 'High' ? 'danger' : req.urgency === 'Medium' ? 'warning' : 'success'}>
                          {req.urgency} Priority
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"><Check size={18} /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Decline"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {activeTab === 'payments' && (
          <div className="space-y-6">
             <div className="grid grid-cols-3 gap-6">
               <Card className="p-4 bg-green-50 border-green-100"><p className="text-sm text-green-600">Received</p><h3 className="text-2xl font-bold text-green-800">₱45,200</h3></Card>
               <Card className="p-4 bg-yellow-50 border-yellow-100"><p className="text-sm text-yellow-600">Pending</p><h3 className="text-2xl font-bold text-yellow-800">₱8,500</h3></Card>
               <Card className="p-4 bg-red-50 border-red-100"><p className="text-sm text-red-600">Overdue</p><h3 className="text-2xl font-bold text-red-800">₱2,400</h3></Card>
            </div>
             <Card>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Transaction History</h3>
                <Button variant="outline" className="text-xs">Export Report</Button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 font-medium uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{p.id}</td>
                      <td className="px-6 py-4 font-medium">{p.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
                      <td className="px-6 py-4 font-bold">₱{p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === 'Paid' ? 'success' : p.status === 'Pending' ? 'warning' : 'danger'}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {activeTab === 'availability' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Weekly Schedule</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-xs">Previous</Button>
                  <span className="text-sm font-bold self-center">Nov 20 - 26</span>
                  <Button variant="ghost" className="text-xs">Next</Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2 h-64 bg-gray-50 rounded-xl p-2 border border-gray-100">
                 <div className="bg-white rounded p-1 text-xs border border-gray-200">9:00 AM</div>
                 <div className="bg-[#b425aa]/10 rounded p-1 text-xs border border-[#b425aa]/20 text-[#b425aa] font-bold">10:00 AM<br/>Booked</div>
                 <div className="bg-white rounded p-1 text-xs border border-gray-200">11:00 AM</div>
              </div>
            </Card>
            <div className="space-y-6">
              <Card className="p-6">
                 <h3 className="font-bold text-sm mb-4">Set Session Rates</h3>
                 <div className="space-y-4">
                   <div>
                     <Label>Video Consultation (1hr)</Label>
                     <div className="relative"><span className="absolute left-3 top-2 text-gray-500">₱</span><Input defaultValue="1200" className="pl-6" /></div>
                   </div>
                   <div>
                     <Label>In-Person Therapy (1hr)</Label>
                     <div className="relative"><span className="absolute left-3 top-2 text-gray-500">₱</span><Input defaultValue="2000" className="pl-6" /></div>
                   </div>
                   <Button className="w-full mt-2">Update Rates</Button>
                 </div>
              </Card>
              <Card className="p-6 bg-blue-50 border-blue-100">
                <div className="flex gap-3">
                  <AlertCircle className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm">Cultural Competency</h4>
                    <p className="text-xs text-blue-700 mt-1">Reminder: Respect local dialects and customs during sessions with rural clients.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'notes' && (
           <Card className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
            <h3 className="text-lg font-bold text-gray-700">Clinical Notes Module</h3>
            <p className="text-gray-500 mb-6">Select a patient from the 'Requests' or 'Overview' tab to view their clinical history and add new notes.</p>
            <Button variant="outline">Create New Patient Record</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// --- Main App Logic ---

const IndividualDashboard = ({ user, onNavigate }: { user: User, onNavigate: (view: ViewType) => void }) => {
  const tools = [
    { id: 'resilience-navigator', title: 'Resilience Navigator', icon: ICONS.resilience },
    { id: 'habit-studio', title: 'Habit Design Studio', icon: ICONS.habit },
    { id: 'well-be', title: 'Well-Be Monitor', icon: ICONS.wellbe },
    { id: 'emotion-tracker', title: 'Emotion Tracker', icon: ICONS.emotion },
    { id: 'oasis', title: 'Oasis Sanctuary', icon: ICONS.oasis },
    { id: 'book-service', title: 'Book Professional', icon: ICONS.psych },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#b425aa] to-[#c80ec9] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <GreetingMessage />
        <div className="flex gap-4 mt-6 relative z-10">
          <button className="bg-white text-[#b425aa] px-6 py-2 rounded-full font-bold text-sm hover:bg-purple-50 transition-colors">Daily Check-in</button>
          <button onClick={() => onNavigate('book-service')} className="bg-[#b425aa] border border-white/30 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">Find Support</button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Activity className="text-[#D4AF37]" /> Your Wellness Toolkit</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => onNavigate(tool.id as ViewType)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3 h-full justify-center">
              <img src={tool.icon} className="w-12 h-12 object-contain" alt={tool.title} />
              <span className="font-bold text-sm text-gray-700 leading-tight">{tool.title}</span>
            </button>
          ))}
        </div>
        
        {/* GROWTH Tribe & PsychAssess Access for Individuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div onClick={() => onNavigate('growth-tribe')} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all">
             <img src={ICONS.growth} className="w-16 h-16 rounded-xl" alt="Growth Tribe"/>
             <div>
               <h4 className="font-bold text-lg text-gray-800">GROWTH Tribe</h4>
               <p className="text-sm text-gray-500 mb-2">Join the community of resilience.</p>
               <span className="text-[#b425aa] font-bold text-xs uppercase tracking-wide">Enter Community &rarr;</span>
             </div>
          </div>
          <div onClick={() => onNavigate('psych-assess')} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all">
             <img src={ICONS.psych} className="w-16 h-16 rounded-xl" alt="PsychAssess"/>
             <div>
               <h4 className="font-bold text-lg text-gray-800">PsychAssess Pro</h4>
               <p className="text-sm text-gray-500 mb-2">Self-assessments & tools.</p>
               <span className="text-[#b425aa] font-bold text-xs uppercase tracking-wide">Open Tool &rarr;</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = ({ onStart, onLoginClick, onSubscribe }: { onStart: () => void, onLoginClick: () => void, onSubscribe: () => void }) => (
  <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#b425aa]/10 rounded-full blur-3xl -z-10"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl -z-10"></div>
    <div className="flex flex-col items-center justify-center p-6 text-center pt-20 pb-12 max-w-5xl mx-auto">
      <CognitioLogo size="xl" />
      <h1 className="text-6xl brand-font font-bold text-slate-900 mt-8 mb-4">Cognitio<span className="text-[#D4AF37]">+</span></h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 mt-8 w-full">
        <div className="flex flex-col items-center"><img src={ICONS.partner} alt="Partner" className="w-16 h-16 mb-2 object-contain"/><p className="text-sm font-bold text-[#b425aa] uppercase">Your Partner in Resilience</p></div>
        <div className="flex flex-col items-center"><img src={ICONS.rooted} alt="Rooted" className="w-16 h-16 mb-2 object-contain"/><p className="text-sm font-bold text-[#b425aa] uppercase">Rooted in Culture</p></div>
        <div className="flex flex-col items-center"><img src={ICONS.awareness} alt="Awareness" className="w-16 h-16 mb-2 object-contain"/><p className="text-sm font-bold text-[#b425aa] uppercase">Powered by Awareness</p></div>
        <div className="flex flex-col items-center"><img src={ICONS.technology} alt="Technology" className="w-16 h-16 mb-2 object-contain"/><p className="text-sm font-bold text-[#b425aa] uppercase">Enhanced by Technology</p></div>
      </div>
      <p className="text-lg text-slate-600 max-w-2xl mb-12 font-['Roboto_Condensed'] italic border-l-4 border-[#D4AF37] pl-6 py-2 bg-gray-50 rounded-r-lg">
        "Our mission is to empower local communities to integrate mental health and substance abuse services to primary healthcare."
      </p>
      <div className="flex gap-4">
        <button onClick={onStart} className="bg-[#b425aa] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-200 hover:scale-105 transition-transform flex items-center gap-2">Begin Your Journey <ChevronRight /></button>
        <button onClick={onLoginClick} className="bg-white text-[#b425aa] border-2 border-[#b425aa] px-10 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-transform">Login</button>
      </div>
    </div>
    <div className="bg-gray-50/50 w-full border-t border-gray-100">
      <StatsInfographic />
      <FeatureShowcase />
      <SubscriptionCTA onSubscribe={onSubscribe} />
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cognitio_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (userData: any) => {
    if (userData.email.includes('dr')) userData.userType = 'mhp';
    setUser(userData);
    localStorage.setItem('cognitio_user', JSON.stringify(userData));
    setShowAuthModal(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cognitio_user');
    setView('home');
  };

  const renderContent = () => {
    switch (view) {
      case 'home': return <Home onStart={() => setView('onboarding')} onLoginClick={() => setShowAuthModal(true)} onSubscribe={() => setView('subscription-plans')} />;
      case 'onboarding': return <div className="p-10 text-center"><h2 className="text-2xl font-bold mb-4">Onboarding Flow Placeholder</h2><Button onClick={() => handleLogin({id:'1', name:'Test User', email:'test@test.com', userType:'individual'})}>Skip to Dashboard</Button></div>;
      case 'dashboard': 
        if (!user) return <Home onStart={() => setView('onboarding')} onLoginClick={() => setShowAuthModal(true)} onSubscribe={() => setView('subscription-plans')} />;
        if (user.userType === 'mhp') return <MHPDashboard user={user} onNavigate={setView} />;
        return <IndividualDashboard user={user} onNavigate={setView} />;
      
      case 'settings': return <SettingsComponent onBack={() => setView('dashboard')} />;
      case 'book-service': return <FeaturePlaceholder title="Service Booking" icon={ICONS.psych} onBack={() => setView('dashboard')} />;
      case 'resilience-navigator': return <ResilienceNavigator onBack={() => setView('dashboard')} />;
      case 'habit-studio': return <HabitDesignStudio onBack={() => setView('dashboard')} />;
      case 'well-be': return <WellBe onBack={() => setView('dashboard')} />;
      case 'emotion-tracker': return <FeaturePlaceholder title="Emotion Tracker" icon={ICONS.emotion} onBack={() => setView('dashboard')} />;
      case 'oasis': return <FeaturePlaceholder title="Oasis Sanctuary" icon={ICONS.oasis} onBack={() => setView('dashboard')} />;
      case 'subscription-plans': return <SubscriptionPlaceholder onBack={() => setView('home')} />;
      
      // New Routes
      case 'growth-tribe': return <GrowthTribe onBack={() => setView('dashboard')} />;
      case 'psych-assess': return <PsychAssessPro onBack={() => setView('dashboard')} />;

      default: return <Home onStart={() => setView('onboarding')} onLoginClick={() => setShowAuthModal(true)} onSubscribe={() => setView('subscription-plans')} />;
    }
  };

  return (
    <>
      <AppLayout user={user} onLogout={handleLogout} onNavigate={setView} onLoginClick={() => setShowAuthModal(true)}>
        {renderContent()}
      </AppLayout>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
    </>
  );
}
