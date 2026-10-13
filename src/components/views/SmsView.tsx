import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import { SmsGatewayConfig } from '../../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Users,
  Smartphone,
  AlertTriangle,
  History,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Settings,
  HelpCircle,
  Radio,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const SmsView: React.FC = () => {
  const { students, classes, smsLogs, sendSms, settings, smsConfig, updateSmsConfig } = useApp();

  const [activeTab, setActiveTab] = useState<'send' | 'api_setup' | 'history'>('send');

  // Send SMS Form
  const [recipientType, setRecipientType] = useState<'all' | 'class' | 'individual'>('class');
  const [targetClass, setTargetClass] = useState<string>(classes[2]?.id || 'c_1');
  const [targetStudentId, setTargetStudentId] = useState<string>(students[0]?.id || '');
  const [customMessage, setCustomMessage] = useState<string>(
    'শ্রদ্ধেয় অভিভাবক, আগামীকাল বিশেষ কারণে বিদ্যালয় ছুটি থাকবে। - ' + settings.name
  );
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // API Setup Form
  const [apiForm, setApiForm] = useState<SmsGatewayConfig>(smsConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('01711223344');
  const [isTestingSms, setIsTestingSms] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const templates = [
    {
      id: 'attendance',
      name: 'অনুপস্থিতি নোটিফিকেশন',
      text: 'শ্রদ্ধেয় অভিভাবক, আপনার সন্তান আজ বিদ্যালয়ে অনুপস্থিত। অনুপস্থিতির কারণ জানানোর জন্য অনুরোধ করা যাচ্ছে। - ' + settings.name,
    },
    {
      id: 'result',
      name: 'পরীক্ষার ফলাফল প্রকাশ',
      text: 'শ্রদ্ধেয় অভিভাবক, ১ম প্রান্তিক মূল্যায়নের ফলাফল প্রকাশিত হয়েছে। রিপোর্ট কার্ড সংগ্রহ করার জন্য বিদ্যালয় অফিসে যোগাযোগ করুন। - ' + settings.name,
    },
    {
      id: 'fees',
      name: 'বকেয়া ফি পরিশোধের তাগাদা',
      text: 'শ্রদ্ধেয় অভিভাবক, আপনার সন্তানের চলতি মাসের বেতন ও ফি আগামী ১০ তারিখের মধ্যে পরিশোধ করার অনুরোধ রইল। - ' + settings.name,
    },
    {
      id: 'meeting',
      name: 'অভিভাবক সমাবেশ',
      text: 'শ্রদ্ধেয় অভিভাবক, আগামী শনিবার সকাল ১০ ঘটিকায় বিদ্যালয়ে অভিভাবক সমাবেশ অনুষ্ঠিত হবে। আপনার উপস্থিতি একান্ত কাম্য। - ' + settings.name,
    },
  ];

  const handleSelectTemplate = (tmplText: string) => {
    setCustomMessage(tmplText);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    setIsSending(true);
    setStatusMessage('');

    let sentCount = 0;

    if (recipientType === 'individual') {
      const st = students.find((s) => s.id === targetStudentId);
      if (st) {
        await sendSms(st.guardianPhone, 'অভিভাবক', customMessage, 'notice', st.name);
        sentCount = 1;
      }
    } else if (recipientType === 'class') {
      const classStudents = students.filter((s) => s.classId === targetClass && s.status === 'active');
      for (const st of classStudents) {
        await sendSms(st.guardianPhone, 'অভিভাবক', customMessage, 'notice', st.name);
        sentCount++;
      }
    } else {
      // all students
      for (const st of students.slice(0, 20)) {
        await sendSms(st.guardianPhone, 'অভিভাবক', customMessage, 'notice', st.name);
        sentCount++;
      }
    }

    setTimeout(() => {
      setIsSending(false);
      setStatusMessage(`সফলভাবে ${toBanglaNumber(sentCount)} জন অভিভাবকের নম্বরে এসএমএস প্রেরিত হয়েছে!`);
      setTimeout(() => setStatusMessage(''), 4000);
    }, 1000);
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmsConfig(apiForm);
    setStatusMessage('এসএমএস গেটওয়ে এপিআই (SMS API Gateway) কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleTestSms = async () => {
    if (!testPhoneNumber) return;
    setIsTestingSms(true);
    setTestResult(null);

    const testMsg = `[${settings.name}] টেস্ট এসএমএস: আপনার SMS Gateway API (${apiForm.provider.toUpperCase()}) সফলভাবে সংযুক্ত হয়েছে।`;
    await sendSms(testPhoneNumber, 'টেস্ট নম্বর', testMsg, 'notice');

    setTimeout(() => {
      setIsTestingSms(false);
      setTestResult(`অভিনন্দন! ${testPhoneNumber} নম্বরে টেস্ট এসএমএস সফলভাবে পাঠানো সম্পন্ন হয়েছে।`);
      setTimeout(() => setTestResult(null), 5000);
    }, 1200);
  };

  const handleRechargeSimulate = () => {
    const updated = { ...apiForm, balance: apiForm.balance + 1000 };
    setApiForm(updated);
    updateSmsConfig(updated);
    setStatusMessage('সফলভাবে ১০০০ টি অতিরিক্ত এসএমএস ক্রেডিট যুক্ত হয়েছে!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>অভিভাবক এসএমএস নোটিফিকেশন ও এপিআই গেটওয়ে</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            অনুপস্থিতি সতর্কতা, ফলাফল বিজ্ঞপ্তি, ফি বকেয়া নোটিশ ও বাল্ক এসএমএস প্রেরণ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>
              প্রোভাইডার: {apiForm.provider.toUpperCase()} ({toBanglaNumber(apiForm.balance)} টি ক্রেডিট অবশিষ্ট)
            </span>
          </div>

          <button
            type="button"
            onClick={handleRechargeSimulate}
            className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            title="এসএমএস রিচার্জ করুন"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+১০০০ এসএমএস</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 p-1 text-xs font-bold gap-1">
        <button
          onClick={() => setActiveTab('send')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'send'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>এসএমএস বার্তা প্রেরণ (Compose & Send)</span>
        </button>

        <button
          onClick={() => setActiveTab('api_setup')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'api_setup'
              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>এসএমএস এপিআই কনফিগারেশন (SMS Gateway API Setup)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>প্রেরিত হিস্ট্রি ও রিপোর্ট ({toBanglaNumber(smsLogs.length)} টি)</span>
        </button>
      </div>

      {/* TAB 1: SEND SMS */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Compose Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              নতুন এসএমএস বার্তা তৈরি ও প্রেরণ
            </h3>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              {/* Recipient Scope */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  প্রাপক নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType('class')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'class'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    শ্রেণিভিত্তিক সকল অভিভাবক
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('individual')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'individual'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    নির্দিষ্ট একক শিক্ষার্থী
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('all')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'all'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    বিদ্যালয়ের সকল অভিভাবক (Bulk)
                  </button>
                </div>
              </div>

              {recipientType === 'class' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    নির্দিষ্ট শ্রেণি:
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({students.filter((s) => s.classId === cls.id).length} জন অভিভাবক)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {recipientType === 'individual' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শিক্ষার্থী নির্বাচন:
                  </label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} (রোল: {toBanglaNumber(st.roll)}, ফোন: {st.guardianPhone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quick Templates Buttons */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  তৈরি টেমপ্লেট হতে বাছাই করুন:
                </label>
                <div className="flex flex-wrap gap-2">
                  {templates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.text)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Area */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    এসএমএস বার্তা (Message Body) *
                  </label>
                  <span className="text-slate-400 text-[11px]">
                    অক্ষর সংখ্যা: {toBanglaNumber(customMessage.length)} (১ এসএমএস)
                  </span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>এসএমএস প্রেরিত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>এখনই এসএমএস পাঠান</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Quick Delivery Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>সর্বশেষ প্রেরিত এসএমএস</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="text-[11px] text-emerald-600 font-bold hover:underline"
              >
                সব দেখুন
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {smsLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.studentName || log.recipientName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      সফলভাবে প্রেরিত
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">{log.recipientPhone}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {log.message}
                  </p>
                  <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMS API GATEWAY SETUP */}
      {activeTab === 'api_setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Provider Selection & API Form (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <span>এসএমএস গেটওয়ে এপিআই কনফিগারেশন (SMS API Gateway Settings)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার পছন্দের বাল্ক এসএমএস সার্ভিস প্রোভাইডারের API Key এবং Sender ID এখানে যুক্ত করুন:
              </p>
            </div>

            <form onSubmit={handleSaveApiConfig} className="space-y-4 text-xs">
              {/* Provider Buttons */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ১. এসএমএস গেটওয়ে প্রোভাইডার নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { id: 'greenweb', name: 'Greenweb BD', endpoint: 'https://api.greenweb.com.bd/api.php' },
                    { id: 'bulksmsbd', name: 'BulkSMSBD', endpoint: 'http://bulksmsbd.net/api/smsapi' },
                    { id: 'onnorokom', name: 'Onnorokom SMS', endpoint: 'https://api2.onnorokomsms.com/send-sms' },
                    { id: 'teletalk', name: 'Teletalk Govt', endpoint: 'https://bulkmessage.teletalk.com.bd/api/send' },
                    { id: 'mimsms', name: 'MimSMS', endpoint: 'https://mimsms.com/smsapi' },
                    { id: 'custom', name: 'Custom HTTP', endpoint: 'https://your-domain.com/api/send-sms' },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => {
                        setApiForm({
                          ...apiForm,
                          provider: prov.id as any,
                          apiEndpoint: prov.endpoint,
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        apiForm.provider === prov.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-600/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {prov.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key / Token */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    ২. এপিআই কী বা টোকেন (API Key / Auth Token) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showApiKey ? 'গোপন রাখুন' : 'দেখান'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    required
                    value={apiForm.apiKey}
                    onChange={(e) => setApiForm({ ...apiForm, apiKey: e.target.value })}
                    placeholder="যেমন: gw_live_98a72b14c3e8 లేదా your_secret_api_token"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Sender ID & Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    ৩. সেন্ডার আইডি / মাস্কিং নাম (Sender ID / Header) *
                  </label>
                  <input
                    type="text"
                    required
                    value={apiForm.senderId}
                    onChange={(e) => setApiForm({ ...apiForm, senderId: e.target.value })}
                    placeholder="যেমন: PRIMARYSCH বা 8809612XXXXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    বিটিআরসি অনুমোদিত আলফানিউমেরিক নাম (সর্বোচ্চ ১১ অক্ষর)
                  </span>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    ৪. অবশিষ্ট এসএমএস ব্যালেন্স সংখ্যা (SMS Balance)
                  </label>
                  <input
                    type="number"
                    value={apiForm.balance}
                    onChange={(e) => setApiForm({ ...apiForm, balance: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    গেটওয়ে রিচার্জের পর স্বয়ংক্রিয়ভাবে আপডেট হবে
                  </span>
                </div>
              </div>

              {/* API Endpoint URL */}
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  ৫. গেটওয়ে এপিআই এন্ডপয়েন্ট ইউআরএল (API Endpoint URL) *
                </label>
                <input
                  type="text"
                  required
                  value={apiForm.apiEndpoint}
                  onChange={(e) => setApiForm({ ...apiForm, apiEndpoint: e.target.value })}
                  placeholder="https://api.greenweb.com.bd/api.php"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={apiForm.isActive}
                    onChange={(e) => setApiForm({ ...apiForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>এসএমএস গেটওয়ে সার্ভিস সক্রিয় রাখুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={apiForm.isMasking}
                    onChange={(e) => setApiForm({ ...apiForm, isMasking: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>মাস্কিং এসএমএস (স্কুলের ব্র্যান্ড নামে যাবে)</span>
                </label>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>এসএমএস এপিআই কনফিগারেশন সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>

          {/* Right: Live Test SMS Tool & Provider Help (1 col) */}
          <div className="space-y-5">
            {/* Live Test Tool Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>টেস্ট এসএমএস পাঠিয়ে সংযোগ পরীক্ষা</span>
              </h4>
              <p className="text-xs text-slate-500">
                এপিআই কি সঠিক কাজ করছে তা দেখতে নিজের মোবাইল নম্বরে একটি টেস্ট এসএমএস পাঠান:
              </p>

              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  আপনার মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />

                <button
                  type="button"
                  onClick={handleTestSms}
                  disabled={isTestingSms}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  {isTestingSms ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>টেস্ট করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>টেস্ট এসএমএস পাঠান</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                  {testResult}
                </div>
              )}
            </div>

            {/* How to get API keys Guide */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>বাংলাদেশে এসএমএস এপিআই পাওয়ার নিয়ম:</span>
              </h4>

              <div className="space-y-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <p>
                  <strong>১. Greenweb BD:</strong> greenweb.com.bd ওয়েবসাইটে সাইন আপ করে ড্যাশবোর্ড থেকে API Token সংগ্রহ করুন।
                </p>
                <p>
                  <strong>২. BulkSMSBD:</strong> bulksmsbd.net থেকে একাউন্ট খুলে API Key জেনারেট করুন।
                </p>
                <p>
                  <strong>৩. টেলিটক এসএমএস গেটওয়ে:</strong> সরকারি বা নিবন্ধিত প্রাথমিক বিদ্যালয় সরাসরি টেলিটক থেকে স্বল্পমূল্যে বা বিনামূল্যে এসএমএস প্যাকের API সুবিধা পেতে পারে।
                </p>
                <p>
                  <strong>৪. মাস্কিং অনুমোদনের জন্য:</strong> স্কুলের প্যাড, প্রধান শিক্ষকের সিল ও ট্রেড লাইসেন্স/রেজিস্ট্রেশন জমা দিতে হয়।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY LOGS */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                সকল প্রেরিত এসএমএস হিস্ট্রি ও ডেলিভারি স্ট্যাটাস
              </h3>
              <p className="text-xs text-slate-500">
                মোট প্রেরিত বার্তা: {toBanglaNumber(smsLogs.length)} টি
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3">ক্রমিক</th>
                  <th className="p-3">শিক্ষার্থী / প্রাপকের নাম</th>
                  <th className="p-3">মোবাইল নম্বর</th>
                  <th className="p-3">বার্তার বিষয়বস্তু</th>
                  <th className="p-3">ধরন</th>
                  <th className="p-3">সময় ও তারিখ</th>
                  <th className="p-3 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {smsLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono text-slate-400">#{toBanglaNumber(index + 1)}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {log.studentName || log.recipientName}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {log.recipientPhone}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={log.message}>
                      {log.message}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {log.type === 'attendance' ? 'হাজিরা' : log.type === 'exam' ? 'ফলাফল' : log.type === 'fee' ? 'ফি' : 'নোটিশ'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>বিতরণ সম্পন্ন</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
