import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Users,
  UserCheck,
  GraduationCap,
  Receipt,
  Building2,
  CalendarCheck,
  Clock,
  Sparkles,
  ArrowUpRight,
  Send,
  FileText,
  AlertTriangle,
  Award,
  CloudCheck,
  CheckCircle2,
  Calendar,
  School,
  Camera,
  MessageSquare,
  Phone,
  MessageCircle,
  Code2,
  Headphones,
  Bell,
  ShieldCheck,
  ExternalLink,
  Cloud,
  RefreshCw,
  Download
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    lang,
    t,
    settings,
    students,
    teachers,
    staffs,
    studentAttendance,
    feeReceipts,
    notices,
    classRoutines,
    classes,
    subjects,
    setCurrentView,
    syncState,
    triggerDriveSync,
    exportDatabaseBackup,
    setIsLogoModalOpen,
    smsConfig,
    developerInfo,
    notifications,
    registeredSchools
  } = useApp();

  const [midCardTab, setMidCardTab] = useState<'drive' | 'admit'>('drive');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  const handleInstantDriveSync = () => {
    setIsSyncingDrive(true);
    triggerDriveSync();
    setTimeout(() => {
      setIsSyncingDrive(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 2500);
    }, 1000);
  };

  const activeSchool = registeredSchools.find((s) => s.settings.name === settings.name) || registeredSchools[0];
  const currentSchoolId = activeSchool?.id || 'school_main';

  // Urgent notifications for this school
  const urgentNotifications = notifications.filter(
    (n) =>
      (n.targetSchoolId === 'all' || n.targetSchoolId === currentSchoolId) &&
      n.status === 'sent' &&
      n.type === 'urgent' &&
      !n.readBySchoolIds.includes(currentSchoolId)
  );

  const activeStudents = students.filter((s) => s.status === 'active');
  const today = new Date().toISOString().split('T')[0];
  const todayAttendanceRecords = studentAttendance.filter((a) => a.date === today);

  const presentCount = todayAttendanceRecords.filter((a) => a.status === 'present').length;
  const attendanceRate =
    todayAttendanceRecords.length > 0
      ? Math.round((presentCount / todayAttendanceRecords.length) * 100)
      : 92;

  // Today fees collection
  const todayFeeCollection = feeReceipts
    .filter((f) => f.date === today)
    .reduce((sum, f) => sum + f.paidAmount, 0);

  // Determine current active class from routine
  const currentDayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const todayDayName = currentDayNames[new Date().getDay()];
  const todayRoutines = classRoutines.filter((r) => r.day === todayDayName || r.day === 'রবিবার');
  const liveOngoingClass = todayRoutines[0] || classRoutines[0];

  const ongoingSubject = subjects.find((s) => s.id === liveOngoingClass?.subjectId)?.name || 'আমার বাংলা বই';
  const ongoingTeacher = teachers.find((t) => t.id === liveOngoingClass?.teacherId)?.name || 'ফারহানা ইয়াসমিন';
  const ongoingClass = classes.find((c) => c.id === liveOngoingClass?.classId)?.name || '৫ম শ্রেণি';

  return (
    <div className="space-y-6">
      {/* Top Welcome & Live Class Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{settings.code} • শিক্ষাবর্ষ {settings.currentSession}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              স্বাগতম, {settings.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              বিদ্যালয়ের দৈনন্দিন হাজিরা, শিক্ষার্থী তথ্য, স্বয়ংক্রিয় রুটিন, ফলাফল এবং অনলাইন ফি আদায়ের পূর্ণাঙ্গ ক্লাউড ও অফলাইন ড্যাশবোর্ড।
            </p>
          </div>

          {/* Ongoing Live Class Widget */}
          <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  এখন চলমান ক্লাস (লাইভ)
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 font-mono">
                  {liveOngoingClass?.startTime || '১০:০০'} - {liveOngoingClass?.endTime || '১০:৪৫'}
                </span>
              </div>
              <p className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                {ongoingSubject} — {ongoingClass}
              </p>
              <p className="text-xs text-emerald-200">শিক্ষক: {ongoingTeacher}</p>
            </div>
            <button
              onClick={() => setCurrentView('live_routine')}
              className="ml-auto hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors"
            >
              <span>লাইভ ঘড়ি</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Announcement Banner if sent by Super Admin */}
      {urgentNotifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 shadow-xs animate-in fade-in">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                সুপার অ্যাডমিন জরুরি বার্তা
              </span>
              <span className="text-[10px] text-slate-400">
                {new Date(urgentNotifications[0].createdAt).toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <h4 className="font-extrabold text-xs text-rose-950 dark:text-rose-100 mt-1">
              {urgentNotifications[0].title}
            </h4>
            <p className="text-[11px] text-rose-800 dark:text-rose-200 mt-0.5 leading-relaxed">
              {urgentNotifications[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Primary Setup Strip: Logo, Developer Support & SMS API Gateway */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: School Logo & Signature */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:bg-slate-900 rounded-2xl p-4.5 border border-emerald-200 dark:border-emerald-800/60 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                ) : (
                  <span className="text-2xl">🏫</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug">
                  <span>বিদ্যালয় লোগো ও স্বাক্ষর</span>
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  প্রাতিষ্ঠানিক ব্র্যান্ডিং
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                অফিসিয়াল ব্র্যান্ডিং ও ডিজিটাল সিল
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                রসিদ, সনদপত্র, প্রত্যয়নপত্র ও প্রবেশপত্রে স্বয়ংক্রিয়ভাবে দৃশ্যমান থাকবে।
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>লোগো ও স্বাক্ষর পরিবর্তন</span>
            </button>
          </div>
        </div>

        {/* Card 2: Google Drive Cloud Database & Smart Admit Card Hub (Full Preview & Bottom Actions) */}
        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:bg-slate-900 rounded-2xl p-4.5 border border-blue-200 dark:border-blue-800/60 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all relative">
          {syncToast && (
            <div className="absolute top-2 right-2 z-20 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>ক্লাউড সিঙ্ক সফল!</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Header with Feature Tabs Switcher */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  {midCardTab === 'drive' ? (
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {midCardTab === 'drive' ? 'গুগল ড্রাইভ ক্লাউড ডাটাবেস' : 'স্মার্ট প্রবেশপত্র ও সনদপত্র'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {midCardTab === 'drive' ? 'অটো-সিঙ্ক সক্রিয়' : 'প্রিন্ট-রেডি ফরম্যাট'}
                  </span>
                </div>
              </div>

              {/* Toggle Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMidCardTab('drive')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    midCardTab === 'drive'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="গুগল ড্রাইভ ক্লাউড ব্যাকআপ প্রিভিউ"
                >
                  ক্লাউড
                </button>
                <button
                  type="button"
                  onClick={() => setMidCardTab('admit')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    midCardTab === 'admit'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="পরীক্ষার প্রবেশপত্র ও সনদ প্রিভিউ"
                >
                  প্রবেশপত্র
                </button>
              </div>
            </div>

            {/* TAB 1: GOOGLE DRIVE FULL PREVIEW */}
            {midCardTab === 'drive' && (
              <div className="space-y-2 text-xs pt-1 border-t border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">সংযুক্ত ড্রাইভ অ্যাকাউন্ট:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {syncState.googleDriveEmail || 'admin-drive@gmail.com'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-blue-100 dark:border-blue-900/40 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">ক্লাউড ডাটাবেস ফাইল:</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">shapla-database-2026.json</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">নিরাপত্তা এনক্রিপশন:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> অফলাইন ও অনলাইন সুরক্ষিত
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  সর্বশেষ সিঙ্ক: <span className="font-semibold text-slate-700 dark:text-slate-300">{syncState.lastSyncTime || 'আজ দুপুর ১২:৪৫'}</span>
                </p>
              </div>
            )}

            {/* TAB 2: SMART ADMIT CARD / CERTIFICATE FULL PREVIEW */}
            {midCardTab === 'admit' && (
              <div className="space-y-2 text-xs pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-700 pb-1">
                    <span className="font-extrabold text-[10px] text-indigo-700 dark:text-indigo-300 truncate">
                      ১ম সাময়িক পরীক্ষা ২০২৬ • প্রবেশপত্র
                    </span>
                    <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-1 rounded font-bold shrink-0">
                      A4 ২-কপি
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800 dark:text-white">আব্দুল্লাহ আল নোমান</span>
                    <span className="font-mono font-extrabold text-indigo-600 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                      রোল: ০১
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>শ্রেণি: ৫ম শ্রেণি</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      ✓ ডিজিটাল সিলযুক্ত
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  সকল শিক্ষার্থীর জন্য ১-ক্লিকে বাল্ক প্রবেশপত্র ও সনদ প্রস্তুত।
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons at the Bottom */}
          <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-800/40">
            {midCardTab === 'drive' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstantDriveSync}
                  disabled={isSyncingDrive}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                  <span>{isSyncingDrive ? 'সিঙ্ক হচ্ছে...' : 'এখনই ড্রাইভে সিঙ্ক করুন'}</span>
                </button>
                <button
                  type="button"
                  onClick={exportDatabaseBackup}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title="ডাটাবেস ব্যাকআপ JSON ফাইল ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('certificates')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>প্রবেশপত্র ও প্রত্যয়ন প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('exam_routine')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title="পরীক্ষার সিট প্ল্যান ও রুটিন দেখুন"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>সিট প্ল্যান</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: SMS API Gateway */}
        <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-500/5 dark:bg-slate-900 rounded-2xl p-4.5 border border-purple-200 dark:border-purple-800/60 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  <span>এসএমএস এপিআই গেটওয়ে</span>
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {smsConfig.provider.toUpperCase()} গেটওয়ে
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1 border-t border-purple-100 dark:border-purple-900/40">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  বর্তমান অবশিষ্ট ব্যালেন্স:
                </span>
                <span className="text-sm font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1 mt-0.5">
                  <span className="font-mono text-base font-black">{toBanglaNumber(smsConfig.balance)}</span>
                  <span>টি এসএমএস অবশিষ্ট</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                অভিভাবকদের স্বয়ংক্রিয় হাজিরা ও ফি রসিদের কনফার্মেশন এসএমএস পাঠানোর সুবিধা।
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-purple-800/40">
            <button
              type="button"
              onClick={() => setCurrentView('sms')}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>এপিআই সেটিংস ও রিচার্জ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => setCurrentView('students')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">মোট শিক্ষার্থী</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {toBanglaNumber(activeStudents.length)}
            </span>
            <span className="text-xs text-slate-500">জন শিক্ষার্থী</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            প্লে থেকে ৫ম শ্রেণি পর্যন্ত
          </p>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => setCurrentView('attendance')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">আজকের উপস্থিতি হার</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {toBanglaNumber(attendanceRate)}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">সন্তোষজনক</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            উপস্থিত: {toBanglaNumber(presentCount || 9)} জন | অনুপস্থিত: {toBanglaNumber(todayAttendanceRecords.length - presentCount || 1)} জন
          </p>
        </div>

        {/* Teachers & Staff */}
        <div
          onClick={() => setCurrentView('class_subjects')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">শিক্ষক ও কর্মচারী</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {toBanglaNumber(teachers.length + staffs.length)}
            </span>
            <span className="text-xs text-slate-500">জন কর্মরত</span>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">
            শিক্ষক {toBanglaNumber(teachers.length)} জন • স্টাফ {toBanglaNumber(staffs.length)} জন
          </p>
        </div>

        {/* Today's Fee Collection */}
        <div
          onClick={() => setCurrentView('fees')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">আজকের ফি আদায়</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">৳</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {toBanglaNumber(todayFeeCollection || 1250)}
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            দ্বিকপি রসিদ ও বিকাশ/নগদ পেমেন্ট
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-3.5 flex items-center gap-2">
          <span>⚡</span>
          <span>দ্রুত সেবা শর্টকাট (Quick Actions)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setCurrentView('attendance')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">আজকের হাজিরা</p>
            <p className="text-[10px] text-slate-500">এক ক্লিকে হাজিরা গ্রহণ</p>
          </button>

          <button
            onClick={() => setCurrentView('fees')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">ফি আদায় ও রসিদ</p>
            <p className="text-[10px] text-slate-500">দ্বিকপি রসিদ প্রিন্ট</p>
          </button>

          <button
            onClick={() => setCurrentView('exam_routine')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">প্রবেশপত্র ও সিট লেবেল</p>
            <p className="text-[10px] text-slate-500">A4 পাতায় ২/১৬ কপি</p>
          </button>

          <button
            onClick={() => setCurrentView('results')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">ফলাফল ও প্রোগ্রেস কার্ড</p>
            <p className="text-[10px] text-slate-500">১ ও ২ পৃষ্ঠার রিপোর্ট</p>
          </button>

          <button
            onClick={() => setCurrentView('sms')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">অভিভাবক এসএমএস</p>
            <p className="text-[10px] text-slate-500">অনুপস্থিতি ও নোটিশ</p>
          </button>

          <button
            onClick={() => setCurrentView('certificates')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">সার্টিফিকেট ও TC</p>
            <p className="text-[10px] text-slate-500">ওয়াটারমার্কসহ সার্টিফিকেট</p>
          </button>
        </div>
      </div>

      {/* Middle Section: Building/Room Status & Notices & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Infrastructure & Rooms Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>বিদ্যালয় অবকাঠামো ও কক্ষ বিবরণী</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              ২টি ভবন
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="font-medium text-slate-700 dark:text-slate-300">মূল একাডেমিক ভবন (৩ তলা)</span>
              <span className="font-bold text-emerald-600">৮টি শ্রেণিকক্ষ</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="font-medium text-slate-700 dark:text-slate-300">প্রধান শিক্ষক ও অফিস কক্ষ</span>
              <span className="font-bold text-blue-600">১টি সুসজ্জিত কক্ষ</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="font-medium text-slate-700 dark:text-slate-300">শিক্ষক মিলনায়তন ও বিশ্রামাগার</span>
              <span className="font-bold text-purple-600">১টি কক্ষ</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="font-medium text-slate-700 dark:text-slate-300">বিজ্ঞান ও কম্পিউটার ল্যাব</span>
              <span className="font-bold text-teal-600">মাল্টিমিডিয়া ল্যাব</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="font-medium text-slate-700 dark:text-slate-300">শিশু কর্নার ও লাইব্রেরি</span>
              <span className="font-bold text-amber-600">৫০০+ শিশুতোষ বই</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
            ✓ সিসিটিভি ক্যামেরা ও বিশুদ্ধ খাবার পানির ফিল্টার সক্রিয় রয়েছে।
          </div>
        </div>

        {/* Recent Official Notices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>📢</span>
              <span>সাম্প্রতিক নোটিশ বোর্ড</span>
            </h3>
            <button
              onClick={() => setCurrentView('notices')}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              সকল নোটিশ
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                onClick={() => setCurrentView('notices')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {notice.category === 'exam' ? 'পরীক্ষা' : notice.category === 'holiday' ? 'ছুটি' : 'বিজ্ঞপ্তি'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {notice.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Calendar & Sync Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>মাসিক ক্যালেন্ডার ও ইভেন্ট</span>
            </h3>
            <span className="text-xs text-slate-400">মার্চ ২০২৬</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                ১৫
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">১ম প্রান্তিক মূল্যায়ন শুরু</p>
                <p className="text-[11px] text-slate-500">সকল শ্রেণির বিষয়ভিত্তিক লিখিত ও ব্যবহারিক মূল্যায়ন</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                ২৬
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">মহান স্বাধীনতা ও জাতীয় দিবস</p>
                <p className="text-[11px] text-slate-500">বিদ্যালয় প্রাঙ্গণে চিত্রাঙ্কন ও জাতীয় সংগীত প্রতিযোগিতা</p>
              </div>
            </div>
          </div>

          {/* Cloud & Offline Status Summary */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Google Drive ডাটাবেস:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ১০০% সুরক্ষিত
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              নেটওয়ার্ক না থাকলেও সম্পূর্ণ অফলাইনে লোকাল ফোল্ডারে স্বয়ংক্রিয় সেভ হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Software Developer & Technical Support Card (Requirement: Developed By: Md Shohanur Rahaman. Whatsapp: 01936918482) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
            <Code2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                সফটওয়্যার ডেভেলপার ও হেল্পলাইন
              </span>
              <span className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider">
                APPTECH IT
              </span>
            </div>
            <div className="mt-1.5 space-y-0.5">
              <span className="text-[11px] text-indigo-300 font-semibold block">
                Developed By:
              </span>
              <h4 className="text-base font-black text-white">
                {developerInfo.name || 'Md Shohanur Rahaman'}
              </h4>
              <div className="text-xs font-extrabold text-emerald-300 pt-0.5">
                Owner: APPTECH IT
              </div>
              <p className="text-[11px] text-indigo-200/90 leading-relaxed pt-0.5">
                {developerInfo.message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
          <a
            href={`https://wa.me/88${developerInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `আসসালামু আলাইকুম, ${settings.name} থেকে সফটওয়্যার সাপোর্ট প্রয়োজন।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp: {developerInfo.whatsapp}</span>
          </a>

          <a
            href={`tel:${developerInfo.helplinePhone.replace(/[^0-9]/g, '')}`}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>কল: {developerInfo.helplinePhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
