import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, SchoolSettings, SmsGatewayConfig } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  ShieldCheck,
  Cloud,
  Download,
  Upload,
  UserPlus,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Lock,
  HardDrive,
  Users,
  Settings,
  AlertTriangle,
  FileJson,
  Building,
  Mail,
  Phone,
  Image,
  MessageSquare,
  Radio,
  Send,
  Eye,
  EyeOff,
  School,
  Check,
  Sparkles
} from 'lucide-react';

export const SecurityBackupView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    smsConfig,
    updateSmsConfig,
    sendSms,
    classes,
    syncState,
    triggerDriveSync,
    exportDatabaseBackup,
    restoreDatabaseBackup,
    toggleOnlineSimulator,
    resetAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile_logo' | 'sms_api' | 'users' | 'backup'>('profile_logo');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // School profile form
  const [profileForm, setProfileForm] = useState<SchoolSettings>(settings);

  // SMS API form
  const [smsApiForm, setSmsApiForm] = useState<SmsGatewayConfig>(smsConfig);
  const [testMobile, setTestMobile] = useState('01711223344');
  const [isTestingSms, setIsTestingSms] = useState(false);


  // New Teacher User Form (Super admin creating teachers)
  const [newUserForm, setNewUserForm] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'class_teacher',
    assignedClass: classes[2]?.id || 'c_1',
    assignedSection: 'ক',
    pin: '123456',
    is2FAEnabled: false,
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, logoUrl: dataUrl }));
      updateSettings({ logoUrl: dataUrl });
      setSuccessMsg('বিদ্যালয়ের লোগো সফলভাবে আপলোড ও আপডেট করা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Handle Signature Upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, signatureUrl: dataUrl }));
      updateSettings({ signatureUrl: dataUrl });
      setSuccessMsg('প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(profileForm);
    setSuccessMsg('বিদ্যালয় প্রোফাইল ও তথ্যাবলি সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // SMS API Save
  const handleSaveSmsApi = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmsConfig(smsApiForm);
    setSuccessMsg('এসএমএস গেটওয়ে এপিআই (SMS API Gateway) সফলভাবে কনফিগার করা হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleTestSmsSend = async () => {
    if (!testMobile) return;
    setIsTestingSms(true);
    const testMsg = `[${profileForm.name}] টেস্ট এসএমএস: আপনার বিদ্যালয় এসএমএস এপিআই গেটওয়ে (${smsApiForm.provider.toUpperCase()}) সফলভাবে সংযুক্ত হয়েছে।`;
    await sendSms(testMobile, 'টেস্ট ব্যবহারকারী', testMsg, 'notice');
    setTimeout(() => {
      setIsTestingSms(false);
      setSuccessMsg(`টেস্ট এসএমএস সফলভাবে ${testMobile} নম্বরে প্রেরণ সম্পন্ন হয়েছে!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
  };


  // Create Teacher
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    addUser({
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone || '০১৭১১-XXXXXX',
      role: newUserForm.role as any,
      assignedClass: newUserForm.assignedClass,
      assignedSection: newUserForm.assignedSection || 'ক',
      pin: newUserForm.pin || '123456',
      is2FAEnabled: !!newUserForm.is2FAEnabled,
    });

    setIsAddUserOpen(false);
    setSuccessMsg(`শিক্ষক "${newUserForm.name}" এর লগইন অ্যাকাউন্ট তৈরি হয়েছে!`);
    setTimeout(() => setSuccessMsg(''), 3500);

    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'class_teacher',
      assignedClass: classes[2]?.id || 'c_1',
      assignedSection: 'ক',
      pin: '123456',
      is2FAEnabled: false,
    });
  };

  const handleSyncDrive = () => {
    setIsSyncingDrive(true);
    triggerDriveSync();
    setTimeout(() => {
      setIsSyncingDrive(false);
      setSuccessMsg('Google Drive এ সম্পূর্ণ ডাটাবেস সফলভাবে এনক্রিপ্ট করে ব্যাকআপ সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = restoreDatabaseBackup(content);
      if (ok) {
        setSuccessMsg('ডাটাবেস ব্যাকআপ থেকে সফলভাবে রিস্টোর সম্পন্ন হয়েছে!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('ফাইলটি সঠিক ব্যাকআপ ফাইল নয়!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>নিরাপত্তা, লোগো, এসএমএস এপিআই ও ক্লাউড সিঙ্ক</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বিদ্যালয়ের লোগো আপলোড, SMS API ইন্টিগ্রেশন, সুপার অ্যাডমিন নিয়ন্ত্রণ ও ক্লাউড ব্যাকআপ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncDrive}
            disabled={isSyncingDrive}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
          >
            <Cloud className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
            <span>{isSyncingDrive ? 'ড্রাইভ সিঙ্ক হচ্ছে...' : 'Google Drive এ ব্যাকআপ'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('profile_logo')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profile_logo'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>বিদ্যালয় প্রোফাইল ও লোগো আপলোড</span>
        </button>

        <button
          onClick={() => setActiveTab('sms_api')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sms_api'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>এসএমএস এপিআই (SMS API Gateway)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>শিক্ষক ও অ্যাডমিন অ্যাকাউন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'backup'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>অফলাইন/অনলাইন সিঙ্ক ও ব্যাকআপ</span>
        </button>
      </div>

      {/* TAB 1: SCHOOL PROFILE & LOGO UPLOAD */}
      {activeTab === 'profile_logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo and Signature Upload Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>বিদ্যালয়ের অফিশিয়াল লোগো</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সকল রসিদ, প্রবেশপত্র, প্রত্যয়ন ও নোটিশে এই লোগোটি দৃশ্যমান হবে
              </p>
            </div>

            <div className="text-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 bg-white shadow-md mb-3 flex items-center justify-center">
                {profileForm.logoUrl ? (
                  <img src={profileForm.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-4xl">🏫</span>
                )}
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-600/20 transition-all">
                <Upload className="w-4 h-4" />
                <span>লোগো আপলোড করুন (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-2">সর্বোচ্চ সাইজ: ২ মেগাবাইট (স্বচ্ছ PNG বাঞ্ছনীয়)</p>
            </div>

            {/* Signature Upload */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">সার্টিফিকেট ও প্রবেশপত্রে ব্যবহারের জন্য</p>

              <div className="flex items-center gap-3">
                <div className="w-20 h-10 border border-slate-300 dark:border-slate-700 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                  {profileForm.signatureUrl ? (
                    <img src={profileForm.signatureUrl} alt="Signature" className="max-h-full" />
                  ) : (
                    <span className="font-signature font-bold text-slate-700 text-xs">Motiur</span>
                  )}
                </div>

                <label className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer">
                  <span>স্বাক্ষর আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* School Details Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>বিদ্যালয় বিবরণী ও প্রাতিষ্ঠানিক তথ্য</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">বিদ্যালয়ের নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">School Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.nameEn}
                    onChange={(e) => setProfileForm({ ...profileForm, nameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">EIIN / EMIS কোড *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.code}
                    onChange={(e) => setProfileForm({ ...profileForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">প্রতিষ্ঠিত সাল</label>
                  <input
                    type="text"
                    value={profileForm.established}
                    onChange={(e) => setProfileForm({ ...profileForm, established: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">প্রধান শিক্ষকের নাম</label>
                <input
                  type="text"
                  value={profileForm.headTeacherName}
                  onChange={(e) => setProfileForm({ ...profileForm, headTeacherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">অফিসিয়াল ইমেইল</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">যোগাযোগের মোবাইল</label>
                  <input
                    type="text"
                    value={profileForm.contactNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">বিদ্যালয়ের পূর্ণাঙ্গ ঠিকানা</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
              >
                তথ্যাবলি ও লোগো সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SMS API GATEWAY CONFIGURATION */}
      {activeTab === 'sms_api' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Status & Balance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  এসএমএস গেটওয়ে ব্যালেন্স
                </h4>
                <p className="text-xs text-slate-500">অনলাইন সংযোগ সক্রিয়</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-900 text-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                অবশিষ্ট এসএমএস
              </span>
              <div className="text-3xl font-black font-mono">
                {toBanglaNumber(smsApiForm.balance)} <span className="text-sm font-normal">টি</span>
              </div>
              <p className="text-[11px] text-purple-200">
                প্রোভাইডার: {smsApiForm.provider.toUpperCase()} ({smsApiForm.isMasking ? 'মাস্কিং' : 'নন-মাস্কিং'})
              </p>
            </div>

            {/* Test SMS Sender Tool */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                টেস্ট এসএমএস পাঠিয়ে যাচাই করুন
              </span>
              <input
                type="text"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleTestSmsSend}
                disabled={isTestingSms}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTestingSms ? 'প্রেরণ হচ্ছে...' : 'টেস্ট এসএমএস পাঠান'}</span>
              </button>
            </div>
          </div>

          {/* SMS Gateway API Settings Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              <span>এসএমএস প্রোভাইডার ও এপিআই সেটিংস (SMS API Gateway Setup)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              বাংলাদেশের শীর্ষস্থানীয় এসএমএস গেটওয়ে বা আপনার কাস্টম REST API সংযুক্ত করুন
            </p>

            <form onSubmit={handleSaveSmsApi} className="space-y-4 text-xs">
              {/* Provider Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  এসএমএস গেটওয়ে প্রোভাইডার নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'greenweb', name: 'Greenweb' },
                    { id: 'bulksmsbd', name: 'BulkSMSBD' },
                    { id: 'onnorokom', name: 'Onnorokom' },
                    { id: 'teletalk', name: 'Teletalk' },
                    { id: 'custom', name: 'Custom API' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        let endpoint = smsApiForm.apiEndpoint;
                        if (p.id === 'greenweb') endpoint = 'https://api.greenweb.com.bd/api.php';
                        if (p.id === 'bulksmsbd') endpoint = 'http://bulksmsbd.net/api/smsapi';
                        if (p.id === 'onnorokom') endpoint = 'https://api2.onnorokomsms.com/send-sms';
                        if (p.id === 'teletalk') endpoint = 'https://bulkmessage.teletalk.com.bd/api/send';
                        setSmsApiForm({ ...smsApiForm, provider: p.id as any, apiEndpoint: endpoint });
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        smsApiForm.provider === p.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    এপিআই কী / টোকেন (API Key / Auth Token) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showApiKey ? 'লুকান' : 'দেখান'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    required
                    value={smsApiForm.apiKey}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, apiKey: e.target.value })}
                    placeholder="gw_live_xxxxxxxxxxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Sender ID & API Endpoint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">
                    সেন্ডার আইডি (Sender ID / Masking Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={smsApiForm.senderId}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, senderId: e.target.value })}
                    placeholder="যেমন: PRIMARYSCH"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    এসএমএস কোটা / ব্যালেন্স সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={smsApiForm.balance}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, balance: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  এপিআই এন্ডপয়েন্ট ইউআরএল (API Endpoint URL) *
                </label>
                <input
                  type="text"
                  required
                  value={smsApiForm.apiEndpoint}
                  onChange={(e) => setSmsApiForm({ ...smsApiForm, apiEndpoint: e.target.value })}
                  placeholder="https://api.greenweb.com.bd/api.php"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={smsApiForm.isActive}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>এসএমএস গেটওয়ে সার্ভিস সক্রিয় রাখুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={smsApiForm.isMasking}
                    onChange={(e) => setSmsApiForm({ ...smsApiForm, isMasking: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>মাস্কিং এসএমএস (স্কুলের নামে যাবে)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
              >
                এসএমএস এপিআই কনফিগারেশন সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS & SUPER ADMIN */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                সুপার অ্যাডমিন ও শ্রেণি শিক্ষকদের লগইন তালিকা
              </h3>
              <p className="text-xs text-slate-500">
                সুপার অ্যাডমিন হিসেবে শুধুমাত্র আপনি নতুন শিক্ষকদের পাসওয়ার্ড ও শ্রেণি বরাদ্দ দিতে পারবেন
              </p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন শিক্ষকের লগইন তৈরি করুন</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3">ব্যবহারকারীর নাম</th>
                  <th className="p-3">ইমেইল (লগইন আইডি)</th>
                  <th className="p-3">ভূমিকা (Role)</th>
                  <th className="p-3">বরাদ্দকৃত শ্রেণি</th>
                  <th className="p-3 text-center">২-ফ্যাক্টর অথেনটিকেশন (2FA)</th>
                  <th className="p-3 text-center">লগইন পিন</th>
                  <th className="p-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const assignedClassName = classes.find((c) => c.id === u.assignedClass)?.name;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                        {u.name}
                        {u.role === 'super_admin' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                            সুপার অ্যাডমিন
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {u.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'শ্রেণি শিক্ষক'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-600">
                        {u.role === 'super_admin' ? 'সকল শ্রেণি (Full Access)' : assignedClassName || '—'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => updateUser(u.id, { is2FAEnabled: !u.is2FAEnabled })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            u.is2FAEnabled
                              ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {u.is2FAEnabled ? '✓ 2FA চালু' : '✗ বন্ধ (ক্লিক করে চালু)'}
                        </button>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">
                        ••••••
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি "${u.name}" এর অ্যাকাউন্ট মুছে ফেলতে চান?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="text-rose-500 hover:underline font-bold text-[11px]"
                          >
                            মুছুন
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP, RESTORE & GOOGLE DRIVE SYNC */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Drive Status */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Google Drive ক্লাউড ডাটাবেস
                    </h4>
                    <p className="text-xs text-slate-500">স্বয়ংক্রিয় ক্লাউড ব্যাকআপ ও রিভিশন হিস্ট্রি</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  সংযুক্ত
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                <p>Google একাউন্ট: <strong className="font-mono text-blue-600">{syncState.googleDriveEmail}</strong></p>
                <p>সর্বশেষ সিঙ্ক: <strong>{syncState.lastSyncTime}</strong></p>
                <p>ব্যাকআপ সাইকেল: <strong>প্রতিদিন স্বয়ংক্রিয়</strong></p>
              </div>

              <button
                onClick={handleSyncDrive}
                disabled={isSyncingDrive}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                <span>{isSyncingDrive ? 'ক্লাউড সিঙ্ক চলছে...' : 'এখনই ড্রাইভে সিঙ্ক করুন'}</span>
              </button>
            </div>

            {/* Offline Local Folder Mode */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      অফলাইন লোকাল স্টোরেজ ও অটো-সিঙ্ক
                    </h4>
                    <p className="text-xs text-slate-500">ইন্টারনেট না থাকলেও নিরবচ্ছিন্ন কার্যক্রম</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    syncState.isOnline
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {syncState.isOnline ? 'অনলাইন' : 'অফলাইন ফোল্ডারে সেভ'}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                <p>বর্তমান স্ট্যাটাস: <strong>{syncState.isOnline ? 'সরাসরি অনলাইন মোডে সচল' : 'অফলাইনে লোকাল মেমরিতে সুরক্ষিত'}</strong></p>
                <p>পেন্ডিং সিঙ্ক: <strong>{toBanglaNumber(syncState.pendingSyncCount)} টি পরিবর্তন</strong></p>
                <p className="text-[11px] text-slate-400">নেটওয়ার্ক আসার সাথে সাথে ব্যাকগ্রাউন্ডে গুগল ড্রাইভে সিঙ্ক হবে।</p>
              </div>

              <button
                onClick={toggleOnlineSimulator}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>{syncState.isOnline ? 'অফলাইন মোড পরীক্ষা করুন' : 'অনলাইন মোডে ফিরে যান'}</span>
              </button>
            </div>
          </div>

          {/* Manual JSON Export / Import */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>এক ক্লিকে ডাটাবেস ডাউনলোড ও রিস্টোর (JSON Backup)</span>
            </h4>
            <p className="text-xs text-slate-500">
              বিদ্যালয়ের যাবতীয় শিক্ষার্থী, ফলাফল, হাজিরা, এবং ফি আদায়ের তথ্য এনক্রিপ্টেড ব্যাকআপ ফাইল হিসেবে সেভ করুন।
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportDatabaseBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" />
                <span>সম্পূর্ণ ডাটাবেস ডাউনলোড করুন (.json)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer border border-slate-300 dark:border-slate-700">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('আপনি কি টেস্ট ডাটাবেস সম্পূর্ণ রিসেট করে ডিফল্ট অবস্থায় নিতে চান?')) {
                    resetAllData();
                    setSuccessMsg('ডাটাবেস সফলভাবে ফ্যাক্টরি রিসেট করা হয়েছে!');
                  }
                }}
                className="ml-auto text-rose-500 hover:underline text-xs font-bold"
              >
                ফ্যাক্টরি রিসেট (নমুনা ডাটা)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Login Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              নতুন শিক্ষকের অ্যাকাউন্ট তৈরি
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">শিক্ষকের নাম *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="যেমন: ফারহানা ইয়াসমিন"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ইমেইল এড্রেস (লগইন ইউজারনেম) *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="teacher@school.edu.bd"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">শ্রেণি শিক্ষক পদবী</label>
                  <select
                    value={newUserForm.assignedClass}
                    onChange={(e) => setNewUserForm({ ...newUserForm, assignedClass: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">পাসওয়ার্ড / পিন</label>
                  <input
                    type="password"
                    value={newUserForm.pin}
                    onChange={(e) => setNewUserForm({ ...newUserForm, pin: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="user2FA"
                  checked={newUserForm.is2FAEnabled}
                  onChange={(e) => setNewUserForm({ ...newUserForm, is2FAEnabled: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4"
                />
                <label htmlFor="user2FA" className="font-bold text-slate-700 dark:text-slate-300">
                  টু-ফ্যাক্টর অথেনটিকেশন (2FA) বাধ্যতামূলক করুন
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
