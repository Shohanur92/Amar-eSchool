import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  School,
  Building2,
  Upload,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Cloud,
  GraduationCap,
  Check,
  Image,
  Trash2,
  Lock,
  Layers
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequire2FA: (email: string) => void;
}

const PRESET_LOGOS = [
  {
    name: 'সরকারি শাপলা ক্রেস্ট',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23047857" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><circle cx="50" cy="40" r="14" fill="%23f59e0b"/><path d="M50 32 Q54 44 50 56 Q46 44 50 32 Z" fill="%23047857"/><path d="M42 42 Q50 48 58 42 Q50 54 42 42 Z" fill="%2310b981"/><path d="M30 65 Q50 58 70 65 L66 70 Q50 64 34 70 Z" fill="%23047857"/><circle cx="50" cy="50" r="4" fill="%23dc2626"/></svg>',
  },
  {
    name: 'জ্ঞান মশাল ও মুক্ত বই',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%231e3a8a" stroke="%2338bdf8" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><path d="M26 62 Q50 54 50 68 Q50 54 74 62 L74 46 Q50 38 50 52 Q50 38 26 46 Z" fill="%230284c7" stroke="%230369a1" stroke-width="2"/><line x1="50" y1="52" x2="50" y2="68" stroke="%23ffffff" stroke-width="2"/><path d="M50 24 Q54 34 50 40 Q46 34 50 24 Z" fill="%23ef4444"/><polygon points="48,40 52,40 53,48 47,48" fill="%23f59e0b"/><circle cx="50" cy="28" r="3" fill="%23fef08a"/></svg>',
  },
  {
    name: 'মডেল কেজি স্টার ব্যাজ',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%237c3aed" stroke="%23fbbf24" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><polygon points="50,22 58,38 76,40 62,52 66,70 50,60 34,70 38,52 24,40 42,38" fill="%23f59e0b" stroke="%23b45309" stroke-width="2"/><circle cx="50" cy="48" r="10" fill="%23ffffff"/><text x="50" y="52" font-size="11" font-weight="bold" fill="%237c3aed" text-anchor="middle" font-family="sans-serif">★</text></svg>',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onRequire2FA }) => {
  const { loginUser, registerNewSchool } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register_school'>('login');

  // Login role selection: Admin or Teacher (Requirement 5)
  const [loginRole, setLoginRole] = useState<'admin' | 'teacher'>('admin');
  const [email, setEmail] = useState('msunkgschool@gmail.com');
  const [pin, setPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  // Register New School Form States
  const [schoolName, setSchoolName] = useState('');
  const [schoolNameEn, setSchoolNameEn] = useState('');
  const [schoolCode, setSchoolCode] = useState('EIIN: ১৩৪৮৯০');
  const [established, setEstablished] = useState('২০০০');
  const [address, setAddress] = useState('মিরপুর, ঢাকা, বাংলাদেশ');
  const [logoPreview, setLogoPreview] = useState<string>(PRESET_LOGOS[0].url);

  // Admin & Google Drive Database Credentials (Requirement 3)
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('০১৭১২-');
  const [adminPin, setAdminPin] = useState('123456');
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const handleRoleChange = (role: 'admin' | 'teacher') => {
    setLoginRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('msunkgschool@gmail.com');
      setPin('123456');
    } else {
      setEmail('farhana@school.edu.bd');
      setPin('123456');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = loginUser(email, pin);
    if (res.requires2FA) {
      onClose();
      onRequire2FA(email);
      return;
    }

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'লগইন ব্যর্থ হয়েছে! সঠিক তথ্য প্রদান করুন।');
    }
  };

  const handleQuickFill = (targetEmail: string, targetPin: string = '123456', role: 'admin' | 'teacher' = 'admin') => {
    setLoginRole(role);
    setEmail(targetEmail);
    setPin(targetPin);
    setError('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      setError('বিদ্যালয়ের নাম (বাংলা) আবশ্যক!');
      setRegStep(1);
      return;
    }
    if (!adminName.trim() || !adminEmail.trim()) {
      setError('অ্যাডমিনের নাম ও Google Drive জিমেইল আইডি আবশ্যক!');
      setRegStep(3);
      return;
    }

    const newSchoolSettings: SchoolSettings = {
      name: schoolName.trim(),
      nameEn: schoolNameEn.trim() || schoolName.trim(),
      code: schoolCode.trim() || `EIIN: ${Math.floor(100000 + Math.random() * 900000)}`,
      established: established.trim() || '২০০০',
      address: address.trim() || 'বাংলাদেশ',
      headTeacherName: adminName.trim(),
      contactNumber: adminPhone.trim(),
      email: adminEmail.trim(),
      logoUrl: logoPreview,
      currentSession: '২০২৬',
    };

    registerNewSchool(newSchoolSettings, {
      name: adminName.trim(),
      email: adminEmail.trim(),
      phone: adminPhone.trim(),
      pin: adminPin.trim() || '123456',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${
          activeTab === 'register_school' ? 'max-w-xl' : 'max-w-md'
        } bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tab Switcher: Login vs Register New School */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লগইন পোর্টাল</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register_school');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register_school'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>+ নতুন স্কুল নিবন্ধন</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: LOGIN (Admin or Teacher, Auto Super Admin Detection) */}
        {/* ============================================================== */}
        {activeTab === 'login' && (
          <div>
            {/* 2-Option Role Selector: Admin or Teacher (Requirement 5) */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                লগইন ধরণ নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    loginRole === 'admin'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <School className="w-5 h-5 text-emerald-600" />
                  <span>অ্যাডমিন (Admin)</span>
                  <span className="text-[10px] text-slate-400 font-normal">প্রধান শিক্ষক / স্কুল প্রধান</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('teacher')}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    loginRole === 'teacher'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>শিক্ষক (Teacher)</span>
                  <span className="text-[10px] text-slate-400 font-normal">শ্রেণি শিক্ষক / বিষয় শিক্ষক</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {loginRole === 'admin' ? 'অ্যাডমিন ইমেইল / ইউজার আইডি' : 'শিক্ষক ইমেইল আইডি'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder={loginRole === 'admin' ? 'admin@school.edu.bd বা superadmin' : 'farhana@school.edu.bd'}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    পিন বা পাসওয়ার্ড
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPin ? 'লুকান' : 'দেখান'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            </form>

            {/* Quick Demo Access Chips */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center mb-2.5 uppercase tracking-wider">
                এক ক্লিকে ডেমো লগইন পরীক্ষা
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Super Admin Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('superadmin@eschool.bd', '9999', 'admin')}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white hover:from-slate-800 border border-slate-700 text-left transition-all cursor-pointer shadow-xs group"
                >
                  <div className="font-extrabold text-xs flex items-center justify-between text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      একক সুপার অ্যাডমিন
                    </span>
                    <span className="text-[9px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">9999</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate mt-1">superadmin@eschool.bd</div>
                </button>

                {/* School Admin Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('msunkgschool@gmail.com', '123456', 'admin')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer"
                >
                  <div className="font-extrabold text-xs flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-emerald-600" />
                      শাপলা স্কুল অ্যাডমিন
                    </span>
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">123456</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">msunkgschool@gmail.com</div>
                </button>

                {/* Teacher Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('farhana@school.edu.bd', '123456', 'teacher')}
                  className="sm:col-span-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      ফার
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">ফারহানা ইয়াসমিন (১ম শ্রেণি শিক্ষক)</div>
                      <div className="text-[10px] text-slate-400">farhana@school.edu.bd</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
                    লগইন করুন
                  </span>
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register_school');
                    setError('');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>আপনার নতুন বিদ্যালয়ের জন্য অ্যাকাউন্ট নিবন্ধন করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: REGISTER NEW SCHOOL & GOOGLE DRIVE CLOUD DATABASE */}
        {/* ============================================================== */}
        {activeTab === 'register_school' && (
          <div>
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-5 px-2">
              <button
                type="button"
                onClick={() => setRegStep(1)}
                className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  regStep === 1 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ১
                </span>
                <span>স্কুলের তথ্য</span>
              </button>

              <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                onClick={() => setRegStep(2)}
                className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  regStep === 2 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ২
                </span>
                <span>লোগো যুক্ত</span>
              </button>

              <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                onClick={() => setRegStep(3)}
                className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  regStep === 3 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ৩
                </span>
                <span>অ্যাডমিন ও Drive</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSchoolSubmit} className="space-y-4">
              {/* STEP 1: School Identity */}
              {regStep === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      বিদ্যালয়ের নাম (বাংলায়) *
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                      placeholder="যেমন: সোনার বাংলা মডেল সরকারি প্রাথমিক বিদ্যালয়"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      School Name (English)
                    </label>
                    <input
                      type="text"
                      value={schoolNameEn}
                      onChange={(e) => setSchoolNameEn(e.target.value)}
                      placeholder="Sonar Bangla Model Govt. Primary School"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        EIIN / EMIS কোড
                      </label>
                      <input
                        type="text"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        প্রতিষ্ঠা সাল
                      </label>
                      <input
                        type="text"
                        value={established}
                        onChange={(e) => setEstablished(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ঠিকানা ও উপজেলা/জেলা
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="সদর, বগুড়া"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!schoolName.trim()) {
                        setError('বিদ্যালয়ের নাম বাংলায় পূরণ করুন!');
                        return;
                      }
                      setError('');
                      setRegStep(2);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: লোগো নির্বাচন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Logo Attachment (Requirement 7) */}
              {regStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      বিদ্যালয় লোগো প্রিভিউ
                    </label>
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 p-1 shadow-md flex items-center justify-center overflow-hidden mb-3">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <School className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>ডিভাইস হতে ছবি আপলোড (PNG/JPG)</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      অথবা প্রস্তুতকৃত সরকারি/মডেল মনোগ্রাম নির্বাচন করুন:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_LOGOS.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLogoPreview(p.url)}
                          className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                            logoPreview === p.url
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400'
                          }`}
                        >
                          <img src={p.url} alt={p.name} className="w-8 h-8 mx-auto mb-1" />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      পেছনে
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>পরবর্তী: অ্যাডমিন ও Drive তথ্য</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Admin & Google Drive Database (Requirement 3) */}
              {regStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in">
                  {/* Google Drive Highlight Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-blue-900 dark:text-blue-300">
                      <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>গুগল ড্রাইভ ক্লাউড ডাটাবেস অটো-ক্রিয়েশন (Google Drive DB)</span>
                    </div>
                    <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                      এডমিন রেজিস্টারের সময় যে মেইল আইডি ব্যবহার করবেন, তার জিমেইল আইডির Google Drive ব্যবহার করে
                      স্বয়ংক্রিয়ভাবে বিদ্যালয়ের ডাটাবেস প্রস্তুত ও অটো-সিঙ্ক সক্রিয় হবে।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      অ্যাডমিনের নাম (প্রধান শিক্ষক) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                        placeholder="মো: আব্দুল্লাহ"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      অ্যাডমিন জিমেইল / গুগল ড্রাইভ ইমেইল *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        placeholder="principal.school@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        মোবাইল নম্বর
                      </label>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        লগইন পিন / পাসওয়ার্ড
                      </label>
                      <input
                        type="password"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      পেছনে
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>নিবন্ধন সম্পন্ন ও ডাটাবেস তৈরি</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
