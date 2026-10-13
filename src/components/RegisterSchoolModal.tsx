import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolSettings } from '../types';
import {
  School,
  Building2,
  ShieldCheck,
  UserCheck,
  Mail,
  KeyRound,
  Phone,
  MapPin,
  Upload,
  Sparkles,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Image,
  ArrowRight
} from 'lucide-react';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({ isOpen, onClose }) => {
  const { registerNewSchool } = useApp();

  // School Profile States
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [code, setCode] = useState('EIIN: ১৩৪৮৯০');
  const [established, setEstablished] = useState('২০০২');
  const [category, setCategory] = useState<'government' | 'model_kg' | 'non_govt'>('government');
  const [address, setAddress] = useState('মিরপুর, ঢাকা, বাংলাদেশ');
  const [currentSession, setCurrentSession] = useState('২০২৬');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0].url);

  // Super Admin Credentials
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('০১৭১২-');
  const [adminPin, setAdminPin] = useState('123456');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Setup options
  const [seedDefaultClasses, setSeedDefaultClasses] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFillDemoData = () => {
    setName('সূর্যমুখী আদর্শ প্রাথমিক বিদ্যালয়');
    setNameEn('Suryamukhi Model Primary School');
    setCode('EIIN: ১৩৯৮৭২ | EMIS: ৪৫১২');
    setEstablished('১৯৯৫');
    setAddress('ধানমন্ডি-৩২, ঢাকা-১২০৫');
    setAdminName('প্রফেসর মো: আসাদুজ্জামান');
    setAdminEmail('headmaster.suryamukhi@gmail.com');
    setAdminPhone('০১৭৫৫-৮৮৯৯০০');
    setAdminPin('123456');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('বিদ্যালয়ের নাম (বাংলায়) অবশ্যই দিতে হবে!');
      return;
    }
    if (!adminName.trim()) {
      setError('সুপার অ্যাডমিনের নাম অবশ্যই দিতে হবে!');
      return;
    }
    if (!adminEmail.trim()) {
      setError('সুপার অ্যাডমিনের লগইন ইমেইল অবশ্যই দিতে হবে!');
      return;
    }
    if (!adminPin || adminPin.length < 4) {
      setError('লগইন পিন / পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    const newSettings: SchoolSettings = {
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      code: code.trim(),
      established: established.trim(),
      address: address.trim(),
      headTeacherName: adminName.trim(),
      contactNumber: adminPhone.trim(),
      email: adminEmail.trim(),
      currentSession,
      logoUrl: logoUrl || PRESET_LOGOS[0].url,
    };

    registerNewSchool(
      newSettings,
      {
        name: adminName.trim(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        pin: adminPin.trim(),
      },
      seedDefaultClasses
    );

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                নতুন বিদ্যালয় নিবন্ধন ও সুপার অ্যাডমিন তৈরি
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                নতুন স্কুলের নিজস্ব ডাটাবেস, প্রাতিষ্ঠানিক লোগো ও পূর্ণাঙ্গ অ্যাডমিন অ্যাকাউন্ট সেটআপ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>নতুন বিদ্যালয় ও সুপার অ্যাডমিন সফলভাবে নিবন্ধিত হয়েছে! স্বাগতম।</span>
            </div>
          )}

          {/* Quick Demo Fill Helper */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-amber-800 dark:text-amber-300 font-semibold">
                দ্রুত টেস্ট করতে চান? এক ক্লিকে ডেমো স্কুল তথ্য পূরণ করুন:
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoData}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shrink-0 cursor-pointer"
            >
              ডেমো ডাটা পূরণ
            </button>
          </div>

          {/* SECTION 1: SCHOOL IDENTITY */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3.5">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>১. বিদ্যালয়ের পরিচিতি ও তথ্য</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  বিদ্যালয়ের নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ধানমন্ডি মডেল প্রাথমিক বিদ্যালয়"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  School Name (English)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Dhanmondi Model Primary School"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  EIIN / EMIS কোড *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  প্রতিষ্ঠিত সাল
                </label>
                <input
                  type="text"
                  value={established}
                  onChange={(e) => setEstablished(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  চলতি সেশন
                </label>
                <input
                  type="text"
                  value={currentSession}
                  onChange={(e) => setCurrentSession(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                বিদ্যালয়ের পূর্ণাঙ্গ ঠিকানা ও অবস্থান *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="গ্রাম/রোড, থানা, জেলা"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* SECTION 2: SCHOOL LOGO */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>২. বিদ্যালয়ের লোগো যুক্ত করুন</span>
              </h3>
              <span className="text-[11px] text-slate-500">পরবর্তীতে যেকোনো সময় পরিবর্তন করা যাবে</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-sm flex items-center justify-center p-1 overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl">🏫</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>লোগো ফাইল আপলোড</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-400">বা নিচের প্রিসেট থেকে বাছাই করুন:</span>
                </div>

                <div className="flex items-center gap-2">
                  {PRESET_LOGOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(p.url)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                        logoUrl === p.url
                          ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img src={p.url} alt="" className="w-4 h-4 object-contain" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SCHOOL ADMIN ACCOUNT & GOOGLE DRIVE CLOUD DATABASE */}
          <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3.5">
            <div>
              <h3 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>৩. স্কুল অ্যাডমিন একাউন্ট ও Google Drive ডাটাবেস (Admin Credentials)</span>
              </h3>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                এডমিন যে জিমেইল আইডি ব্যবহার করবেন, তার Google Drive ব্যবহার করে স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেস
                ফোল্ডার তৈরি হবে এবং বিদ্যালয় পরিচালনার সমস্ত মডিউল অ্যাডমিনের অধীনে সচল থাকবে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                  স্কুল অ্যাডমিন নাম (প্রধান শিক্ষক) *
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="যেমন: মো: মতিউর রহমান"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                  গুগল ড্রাইভ জিমেইল / লগইন আইডি *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="headmaster@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                  যোগাযোগের মোবাইল নম্বর
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                  লগইন পাসওয়ার্ড বা পিন (Security PIN) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={is2FAEnabled}
                  onChange={(e) => setIs2FAEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span>দ্বি-স্তরীয় নিরাপত্তা (2FA OTP) সক্রিয় রাখুন</span>
              </label>
            </div>
          </div>

          {/* SETUP PREFERENCES */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={seedDefaultClasses}
                onChange={(e) => setSeedDefaultClasses(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>
                প্রাথমিক বিদ্যালয়ের стандарт ৬টি শ্রেণি (প্লে/শিশু, ১ম, ২য়, ৩য়, ৪র্থ, ৫ম শ্রেণি) ও বিষয়সমূহ স্বয়ংক্রিয়ভাবে তৈরি করুন
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <School className="w-4 h-4" />
              <span>নিবন্ধন সম্পন্ন করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
