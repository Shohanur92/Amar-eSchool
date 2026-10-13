import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  ShieldCheck,
  School,
  Building2,
  Users,
  GraduationCap,
  HardDrive,
  Cloud,
  Mail,
  KeyRound,
  Phone,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Sparkles,
  RefreshCw,
  LogIn,
  Check,
  Database,
  Bell,
  Send,
  MessageCircle,
  Wifi,
  WifiOff,
  Code2,
  Headphones,
  AlertTriangle,
  Info,
  Clock,
  Radio
} from 'lucide-react';
import { NotificationType, DeveloperInfo } from '../../types';

export const SuperAdminDashboardView: React.FC = () => {
  const {
    registeredSchools,
    switchSchool,
    deleteRegisteredSchool,
    setIsRegisterModalOpen,
    students,
    teachers,
    setCurrentView,
    logoutUser,
    syncState,
    triggerDriveSync,
    notifications,
    sendNotification,
    deleteNotification,
    developerInfo,
    updateDeveloperInfo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'schools' | 'notifications' | 'developer'>('schools');

  // Search & School Directory states
  const [searchTerm, setSearchTerm] = useState('');
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Send Notification Form states
  const [notifTarget, setNotifTarget] = useState<'all' | string>('all');
  const [notifType, setNotifType] = useState<NotificationType>('info');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [isSendingNotif, setIsSendingNotif] = useState(false);

  // Developer Settings Form states
  const [devForm, setDevForm] = useState<DeveloperInfo>({ ...developerInfo });
  const [isSavingDev, setIsSavingDev] = useState(false);

  const togglePinVisibility = (schoolId: string) => {
    setShowPins((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`${label} ক্লিপবোর্ডে কপি করা হয়েছে!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEnterSchool = (schoolId: string) => {
    switchSchool(schoolId);
    setCurrentView('dashboard');
    showToast('স্কুল অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করা হয়েছে');
  };

  const handleGlobalDriveTest = () => {
    setIsSyncing(true);
    triggerDriveSync();
    setTimeout(() => {
      setIsSyncing(false);
      showToast('সকল স্কুলের গুগল ড্রাইভ ক্লাউড ব্যাকআপ সিঙ্ক সফল হয়েছে');
    }, 1500);
  };

  const handleSendNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      showToast('শিরোনাম ও বিস্তারিত বার্তা লিখুন');
      return;
    }

    setIsSendingNotif(true);

    const targetSchoolName =
      notifTarget === 'all'
        ? 'সকল নিবন্ধিত বিদ্যালয়'
        : registeredSchools.find((s) => s.id === notifTarget)?.settings.name || 'নির্দিষ্ট বিদ্যালয়';

    const res = sendNotification({
      targetSchoolId: notifTarget,
      targetSchoolName,
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType
    });

    setIsSendingNotif(false);
    setNotifTitle('');
    setNotifMessage('');

    if (res.status === 'sent') {
      showToast('নোটিফিকেশন সফলভাবে প্রাপকদের কাছে পাঠানো হয়েছে (অনলাইন সরাসরি ডেলিভারি)!');
    } else {
      showToast('আপনি অফলাইন আছেন: নোটিফিকেশনটি অফলাইন কিউতে জমা হয়েছে, ইন্টারনেট সংযোগ পেলেই স্বয়ংক্রিয়ভাবে পৌঁছে যাবে!');
    }
  };

  const handleSaveDeveloperSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDev(true);
    updateDeveloperInfo(devForm);
    setTimeout(() => {
      setIsSavingDev(false);
      showToast('ডেভেলপার ও হেল্পলাইন তথ্য সফলভাবে আপডেট করা হয়েছে!');
    }, 400);
  };

  const filteredSchools = registeredSchools.filter(
    (s) =>
      s.settings.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.settings.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Central Super Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>একক কেন্দ্রীয় সুপার অ্যাডমিন পোর্টাল (Single Global Super Admin)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              বিদ্যালয় ও অ্যাডমিন নিয়ন্ত্রণ কেন্দ্র
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              সিস্টেমে নিবন্ধিত সকল বিদ্যালয় তদারকি, অ্যাডমিন ক্রেডেনশিয়াল, কেন্দ্রীভূত নোটিফিকেশন ব্রডকাস্ট এবং অফিসিয়াল হেল্পলাইন সেটিংস।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Register New School Button (Exclusively in Super Admin!) */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন স্কুল নিবন্ধন করুন</span>
            </button>

            <button
              onClick={handleGlobalDriveTest}
              disabled={isSyncing}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>ড্রাইভ সিঙ্ক পরীক্ষা</span>
            </button>

            <button
              onClick={logoutUser}
              className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 rotate-180" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <School className="w-4 h-4 text-emerald-400" />
              <span>নিবন্ধিত স্কুল</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {toBanglaNumber(registeredSchools.length)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>স্কুল অ্যাডমিন</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {toBanglaNumber(registeredSchools.length)} <span className="text-xs font-normal text-slate-400">জন</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>মোট নোটিফিকেশন</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {toBanglaNumber(notifications.length)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>মোট শিক্ষার্থী</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {toBanglaNumber(students.length)} <span className="text-xs font-normal text-slate-400">জন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('schools')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'schools'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>নিবন্ধিত বিদ্যালয় ও অ্যাডমিন তালিকা ({toBanglaNumber(registeredSchools.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>নোটিফিকেশন ও মেসেজিং কেন্দ্র ({toBanglaNumber(notifications.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('developer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'developer'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>ডেভেলপার ও হেল্পলাইন সেটিংস</span>
        </button>
      </div>

      {/* TAB 1: SCHOOLS DIRECTORY & ADMIN LOGINS */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          {/* Directory Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="স্কুলের নাম, EIIN, অ্যাডমিন নাম বা ইমেইল দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
                মোট ফলাফল: {toBanglaNumber(filteredSchools.length)} টি
              </span>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন স্কুল</span>
              </button>
            </div>
          </div>

          {/* List of Registered Schools with Full Admin & Google Drive Database Details */}
          <div className="space-y-4">
            {filteredSchools.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <School className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-700 dark:text-slate-300">
                  কোন বিদ্যালয় খুঁজে পাওয়া যায়নি
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন অথবা নতুন বিদ্যালয় নিবন্ধন করুন।
                </p>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  + নতুন বিদ্যালয় নিবন্ধন করুন
                </button>
              </div>
            ) : (
              filteredSchools.map((sch, index) => {
                const isPinVisible = showPins[sch.id] ?? false;
                const driveDb = sch.googleDriveDb || {
                  accountEmail: sch.adminEmail,
                  folderName: `eSchool_DB_${sch.settings.code.replace(/[^0-9]/g, '') || 'MAIN'}`,
                  fileName: 'database.json',
                  status: 'active',
                  lastSyncTime: 'আজ সকাল ১০:০০',
                  dbSizeKb: 148,
                };

                return (
                  <div
                    key={sch.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 transition-all hover:border-emerald-500/40 relative overflow-hidden"
                  >
                    {/* Index Ribbon */}
                    <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1 rounded-bl-xl border-l border-b border-slate-200 dark:border-slate-700">
                      স্কুল নং #{toBanglaNumber(index + 1)}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Column: School Profile & Info */}
                      <div className="lg:col-span-4 space-y-3.5">
                        <div className="flex items-start gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center text-white">
                            {sch.settings.logoUrl ? (
                              <img
                                src={sch.settings.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-cover rounded-[14px]"
                              />
                            ) : (
                              <School className="w-7 h-7 text-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                              {sch.settings.name}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                              {sch.settings.nameEn}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {sch.settings.code}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                স্থাপিত: {sch.settings.established}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-slate-400">ঠিকানা:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {sch.settings.address}
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-slate-400">সেশন:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {sch.settings.currentSession || '২০২৬'}
                            </span>
                            <span className="text-slate-400 ml-2">নিবন্ধন তারিখ:</span>
                            <span className="font-semibold">{sch.createdAt}</span>
                          </p>
                        </div>

                        {/* Action: Switch to manage this school */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleEnterSchool(sch.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>স্কুল অ্যাডমিন প্যানেলে প্রবেশ</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(sch.id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                            title="বিদ্যালয় মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Column: School Admin Login Credentials */}
                      <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/70 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <KeyRound className="w-4 h-4 text-emerald-600" />
                            <span>অ্যাডমিন লগইন ক্রেডেনশিয়াল</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                            School Admin
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">
                              অ্যাডমিনের নাম ও পদবি
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {sch.adminName}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">
                              মোবাইল নম্বর
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {sch.adminPhone || sch.settings.contactNumber}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    sch.adminPhone || sch.settings.contactNumber,
                                    `${sch.id}_phone`,
                                    'মোবাইল নম্বর'
                                  )
                                }
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="কপি করুন"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">
                              লগইন ইমেইল
                            </span>
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                              <span className="truncate text-slate-800 dark:text-slate-200">
                                {sch.adminEmail}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(sch.adminEmail, `${sch.id}_email`, 'লগইন ইমেইল')
                                }
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-600"
                                title="ইমেইল কপি করুন"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">
                              লগইন পাসওয়ার্ড / পিন
                            </span>
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                {isPinVisible ? sch.adminPin || '123456' : '••••••'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => togglePinVisibility(sch.id)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                                  title={isPinVisible ? 'লুকান' : 'দেখান'}
                                >
                                  {isPinVisible ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      sch.adminPin || '123456',
                                      `${sch.id}_pin`,
                                      'পাসওয়ার্ড পিন'
                                    )
                                  }
                                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-600"
                                  title="পিন কপি করুন"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Google Drive Cloud Database Integration Info */}
                      <div className="lg:col-span-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl p-4 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-900/60">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                            <Cloud className="w-4 h-4 text-blue-600" />
                            <span>Google Drive ডাটাবেস</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            সংযুক্ত ও সক্রিয়
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold text-blue-500 uppercase">
                              সংযুক্ত গুগল ড্রাইভ অ্যাকাউন্ট
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 break-all text-[11px]">
                              {driveDb.accountEmail}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50">
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">
                                ক্লাউড ফোল্ডার
                              </span>
                              <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate block">
                                {driveDb.folderName}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50">
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">
                                ডাটা ফাইল
                              </span>
                              <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate block">
                                {driveDb.fileName}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between mt-2">
                            <span>অটো-ব্যাকআপ স্ট্যাটাস:</span>
                            <span className="font-bold">সফলভাবে সিঙ্ক হচ্ছে</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deletion Confirmation Modal inside Card */}
                    {deleteConfirmId === sch.id && (
                      <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>
                            আপনি কি নিশ্চিত এই বিদ্যালয় এবং এর সকল ডাটা মুছে ফেলতে চান?
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              deleteRegisteredSchool(sch.id);
                              setDeleteConfirmId(null);
                              showToast('বিদ্যালয় সফলভাবে মুছে ফেলা হয়েছে');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                          >
                            হ্যাঁ, মুছুন
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 cursor-pointer"
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS & MESSAGING CENTER (To All or Specific Schools) */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Send Notification Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  নতুন নোটিফিকেশন বা বার্তা প্রেরণ
                </h3>
                <p className="text-[11px] text-slate-400">
                  সকল বিদ্যালয় অথবা নির্দিষ্ট কোনো বিদ্যালয়কে বার্তা দিন
                </p>
              </div>
            </div>

            {/* Online / Offline Delivery Status Banner */}
            {syncState.isOnline ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px]">
                  <strong>অনলাইন মোড সক্রিয়:</strong> নোটিফিকেশন পাঠানোর সাথে সাথেই সকল প্রাপকের কাছে পৌঁছে যাবে।
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
                <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">
                  <strong>অফলাইন মোড চালু:</strong> বার্তাটি অফলাইন কিউতে সংরক্ষিত থাকবে এবং ইন্টারনেট সংযোগ পেলেই স্বয়ংক্রিয়ভাবে পৌঁছে যাবে।
                </span>
              </div>
            )}

            <form onSubmit={handleSendNotificationSubmit} className="space-y-4 text-xs">
              {/* Recipient Target: All or Specific School */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  প্রাপক নির্ধারণ করুন (Target) *
                </label>
                <select
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">📢 সকল নিবন্ধিত বিদ্যালয় (সার্বজনীন ব্রডকাস্ট)</option>
                  <optgroup label="নির্দিষ্ট বিদ্যালয় বেছে নিন:">
                    {registeredSchools.map((s) => (
                      <option key={s.id} value={s.id}>
                        🏫 {s.settings.name} ({s.settings.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {notifTarget === 'all'
                    ? 'সকল নিবন্ধিত বিদ্যালয়ের প্রধান শিক্ষক ও শিক্ষকরা এই নোটিফিকেশনটি দেখতে পাবেন।'
                    : 'শুধুমাত্র নির্বাচিত নির্দিষ্ট বিদ্যালয়ের ড্যাশবোর্ড ও নোটিফিকেশন বারে এই বার্তাটি যাবে।'}
                </p>
              </div>

              {/* Category / Type */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  বার্তার ধরন / ক্যাটাগরি *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifType('info')}
                    className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      notifType === 'info'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>সাধারণ তথ্য</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifType('urgent')}
                    className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      notifType === 'urgent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>জরুরি নোটিশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifType('instruction')}
                    className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      notifType === 'instruction'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>প্রশাসনিক নির্দেশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifType('warning')}
                    className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      notifType === 'warning'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>সতর্কতা</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  বার্তার শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="যেমন: নতুন শিক্ষাবর্ষের ডাটাবেস ও ব্যাকআপ সংক্রান্ত..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  বিস্তারিত নোটিফিকেশন বার্তা *
                </label>
                <textarea
                  required
                  rows={4}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="সকল বিদ্যালয়কে অবগত করার জন্য আপনার বার্তাটি লিখুন..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingNotif}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingNotif ? 'প্রেরণ করা হচ্ছে...' : 'নোটিফিকেশন প্রকাশ করুন'}</span>
              </button>
            </form>
          </div>

          {/* Sent Notifications History */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  প্রেরিত নোটিফিকেশনের ইতিহাস
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-bold">
                মোট: {toBanglaNumber(notifications.length)} টি
              </span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">এখনো কোনো নোটিফিকেশন পাঠানো হয়নি</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const isDirect = n.targetSchoolId !== 'all';

                  return (
                    <div
                      key={n.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {n.type === 'urgent' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              জরুরি
                            </span>
                          ) : n.type === 'warning' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              সতর্কতা
                            </span>
                          ) : n.type === 'instruction' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              নির্দেশনা
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              সাধারণ
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            প্রাপক: {n.targetSchoolName || (isDirect ? 'নির্দিষ্ট স্কুল' : 'সকল বিদ্যালয়')}
                          </span>

                          {n.status === 'sent' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              ডেলিভার্ড (Online)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              অফলাইন কিউতে অপেক্ষমান
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            deleteNotification(n.id);
                            showToast('নোটিফিকেশন মুছে ফেলা হয়েছে');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {n.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                        <span>
                          তারিখ: {new Date(n.createdAt).toLocaleDateString('bn-BD')} {new Date(n.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {toBanglaNumber(n.readBySchoolIds.length)} টি বিদ্যালয় দ্বারা পঠিত
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPER & HELPLINE SETTINGS */}
      {activeTab === 'developer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Developer Edit Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  সফটওয়্যার ডেভেলপার ও হেল্পলাইন তথ্য পরিবর্তন
                </h3>
                <p className="text-[11px] text-slate-400">
                  এখানে পরিবর্তন করলে প্রতিটি স্কুল অ্যাডমিনের ড্যাশবোর্ড ও ফুটারে তা দৃশ্যমান হবে
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveDeveloperSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    ডেভেলপারের নাম (Developer Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={devForm.name}
                    onChange={(e) => setDevForm({ ...devForm, name: e.target.value })}
                    placeholder="যেমন: Md Shohanur Rahaman"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    হোয়াটসঅ্যাপ নম্বর (WhatsApp Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={devForm.whatsapp}
                    onChange={(e) => setDevForm({ ...devForm, whatsapp: e.target.value })}
                    placeholder="যেমন: 01936918482"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    হেল্পলাইন ফোন নম্বর (Helpline Phone) *
                  </label>
                  <input
                    type="text"
                    required
                    value={devForm.helplinePhone}
                    onChange={(e) => setDevForm({ ...devForm, helplinePhone: e.target.value })}
                    placeholder="যেমন: 01936918482"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    কোম্পানি বা প্রতিষ্ঠান (Company / Agency) *
                  </label>
                  <input
                    type="text"
                    required
                    value={devForm.company}
                    onChange={(e) => setDevForm({ ...devForm, company: e.target.value })}
                    placeholder="যেমন: APPTECH IT"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    পদবি (Designation / Role) *
                  </label>
                  <input
                    type="text"
                    required
                    value={devForm.designation}
                    onChange={(e) => setDevForm({ ...devForm, designation: e.target.value })}
                    placeholder="যেমন: Owner: AppTech IT"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    সাপোর্ট ইমেইল (Support Email)
                  </label>
                  <input
                    type="email"
                    value={devForm.email}
                    onChange={(e) => setDevForm({ ...devForm, email: e.target.value })}
                    placeholder="support@techbd.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  বিদ্যালয় প্রধানদের জন্য সাপোর্ট বার্তা (Help Message)
                </label>
                <textarea
                  rows={3}
                  value={devForm.message}
                  onChange={(e) => setDevForm({ ...devForm, message: e.target.value })}
                  placeholder="যে কোনো প্রযুক্তিগত সহায়তা বা কাস্টমাইজেশনের জন্য সরাসরি যোগাযোগ করুন..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingDev}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>{isSavingDev ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
              </button>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Headphones className="w-4 h-4 text-emerald-600" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                স্কুল অ্যাডমিন ড্যাশবোর্ডে যেমন দেখাবে (Live Preview)
              </h3>
            </div>

            {/* Preview Box 1: Small Card in Dashboard */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                ড্যাশবোর্ড সেটআপ কার্ড প্রিভিউ:
              </span>
              <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-teal-500/5 dark:bg-slate-800/80 rounded-2xl p-4 border border-teal-200 dark:border-teal-800/60 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        সফটওয়্যার ডেভেলপার ও হেল্পলাইন
                      </h4>
                      <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-md text-[9px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        ২৪/৭ টেকনিক্যাল সাপোর্ট
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs pt-1 border-t border-teal-100 dark:border-teal-900/40">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">
                        Developed By:
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white block mt-0.5">
                        {devForm.name || 'Md Shohanur Rahaman'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 block">
                        Owner: APPTECH IT
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>WhatsApp / ফোন: </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {devForm.whatsapp || '01936918482'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-teal-200/60 dark:border-teal-800/40 flex items-center gap-2">
                  <span className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp চ্যাট</span>
                  </span>
                  <span className="py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>কল করুন</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Box 2: Full Support Card */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                ফুটার সাপোর্ট ব্যানার প্রিভিউ:
              </span>
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        সফটওয়্যার ডেভেলপার
                      </span>
                      <span className="text-[9px] text-emerald-300 font-extrabold uppercase">
                        APPTECH IT
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-indigo-300 font-semibold block">Developed By:</span>
                      <h4 className="text-xs font-black text-white">
                        {devForm.name || 'Md Shohanur Rahaman'}
                      </h4>
                      <p className="text-[10px] font-bold text-emerald-300 mt-0.5">
                        Owner: APPTECH IT
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300">
                  <p>{devForm.message}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp: {devForm.whatsapp}</span>
                  </span>
                  <span className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-[10px] font-bold flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>কল: {devForm.helplinePhone}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
