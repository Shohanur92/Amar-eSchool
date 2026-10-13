import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { toBanglaNumber, formatBanglaDate } from '../../utils/bengaliUtils';
import {
  Award,
  Printer,
  FileCheck,
  FileText,
  Search,
  Check,
  Sparkles,
  Building2
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { students, classes, settings } = useApp();

  const [certType, setCertType] = useState<'testimonial' | 'tc' | 'letterhead'>('testimonial');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [memoNo, setMemoNo] = useState<string>(`স্মারক নং: শাপলা/২০২৬/${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customLetterheadTitle, setCustomLetterheadTitle] = useState<string>('বিজ্ঞপ্তি / প্রত্যয়ন পত্র');
  const [customLetterheadBody, setCustomLetterheadBody] = useState<string>(
    'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, অত্র বিদ্যালয়ের শিক্ষাবর্ষ ২০২৬ এর সকল শিক্ষার্থী নিয়মিত ও শৃঙ্খলাবদ্ধভাবে পাঠ্যক্রমে অংশগ্রহণ করছে।'
  );

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentClass = classes.find((c) => c.id === student?.classId);

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>সার্টিফিকেট, প্রশংসাপত্র ও লেটারহেড প্যাড</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বিদ্যালয়ের প্রাতিষ্ঠানিক ওয়াটারমার্ক, সিল ও প্রধান শিক্ষকের স্বাক্ষরযুক্ত প্রত্যয়নপত্র
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন (A4)</span>
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            সার্টিফিকেটের ধরন
          </label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              onClick={() => setCertType('testimonial')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                certType === 'testimonial'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              প্রশংসাপত্র
            </button>
            <button
              onClick={() => setCertType('tc')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                certType === 'tc'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              ছাড়পত্র (TC)
            </button>
            <button
              onClick={() => setCertType('letterhead')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                certType === 'letterhead'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              লেটারহেড প্যাড
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            শিক্ষার্থী নির্বাচন
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (রোল: {toBanglaNumber(s.roll)}, {classes.find((c) => c.id === s.classId)?.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            ইস্যুর তারিখ
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          />
        </div>
      </div>

      {/* A4 DOCUMENT PREVIEW CONTAINER WITH WATERMARK */}
      <div className="bg-white text-slate-900 border-4 border-emerald-900/80 p-8 sm:p-12 rounded-2xl shadow-xl max-w-3xl mx-auto relative overflow-hidden print-avoid-break">
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
          <div className="text-center">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Watermark" className="w-48 h-48 object-contain mx-auto grayscale" />
            ) : (
              <span className="text-9xl font-black">🏫</span>
            )}
            <p className="text-5xl font-black tracking-widest mt-2">{settings.name}</p>
          </div>
        </div>

        {/* Official Header */}
        <div className="flex items-center justify-center gap-4 border-b-2 border-emerald-900 pb-4 mb-6 relative z-10 text-center">
          {settings.logoUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-300">
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{settings.code}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-0.5">{settings.name}</h1>
            <p className="text-xs font-semibold text-slate-600">{settings.address}</p>
            <p className="text-[10px] text-slate-500 font-medium">
              স্থাপিত: {settings.established} খ্রি. • ইমেইল: {settings.email} • মোবাইল: {settings.contactNumber}
            </p>
          </div>
        </div>

        {/* Memo & Date Row */}
        <div className="flex justify-between items-center text-xs text-slate-700 mb-8 font-medium">
          <span>{memoNo}</span>
          <span>তারিখ: {formatBanglaDate(issueDate)}</span>
        </div>

        {/* DOCUMENT TYPE 1: TESTIMONIAL (প্রশংসাপত্র) */}
        {certType === 'testimonial' && student && (
          <div className="space-y-6 text-sm leading-relaxed text-slate-800">
            <div className="text-center">
              <span className="inline-block px-6 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-base font-black border border-emerald-300">
                প্রশংসাপত্র (Testimonial)
              </span>
            </div>

            <p className="text-justify indent-8">
              এই মর্মে অত্যন্ত আনন্দের সাথে প্রত্যয়ন করা যাচ্ছে যে, <strong>{student.name}</strong>, পিতা: <strong>{student.fatherName || 'মো: অভিভাবক'}</strong>, মাতা: <strong>{student.motherName || 'মোসা: অভিভাবক'}</strong>, গ্রাম/ঠিকানা: <strong>{student.address || 'ঢাকা'}</strong>; অত্র বিদ্যালয়ের <strong>{studentClass?.name}</strong> এর একজন নিয়মিত ও চরিত্রবান শিক্ষার্থী ছিল। তার শ্রেণি রোল নং <strong>{toBanglaNumber(student.roll)}</strong> এবং ভর্তি নং <strong>{student.admissionNo}</strong>।
            </p>

            <p className="text-justify indent-8">
              সে অত্র বিদ্যালয়ের শিক্ষাবর্ষ {settings.currentSession} এর পরীক্ষায় কৃতিত্বের সাথে উত্তীর্ণ হয়েছে। বিদ্যালয়ে অধ্যয়নকালে সে সর্বদা শিক্ষকগণের অনুগত, নিয়মানুবর্তী এবং সহপাঠীদের প্রতি আন্তরিক ছিল। বিদ্যালয়ের কোনো নিয়ম-শৃঙ্খলা ভঙ্গ বা রাষ্ট্রবিরোধী কোনো কাজে তার সম্পৃক্ততা ছিল না।
            </p>

            <p className="text-justify indent-8">
              আমার জানা মতে তার নৈতিক চরিত্র প্রশংসনীয়। আমি তার ভবিষ্যৎ জীবনের উত্তরোত্তর সাফল্য, সুস্বাস্থ্য এবং উজ্জ্বল ভবিষ্যৎ কামনা করি।
            </p>
          </div>
        )}

        {/* DOCUMENT TYPE 2: TRANSFER CERTIFICATE (ছাড়পত্র / TC) */}
        {certType === 'tc' && student && (
          <div className="space-y-6 text-sm leading-relaxed text-slate-800">
            <div className="text-center">
              <span className="inline-block px-6 py-1.5 rounded-full bg-blue-100 text-blue-950 text-base font-black border border-blue-300">
                বিদ্যালয় ছাড়পত্র (Transfer Certificate)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>১. শিক্ষার্থীর নাম: <strong>{student.name}</strong></div>
              <div>২. পিতা: <strong>{student.fatherName}</strong></div>
              <div>৩. শ্রেণি: <strong>{studentClass?.name}</strong></div>
              <div>৪. রোল নং: <strong>{toBanglaNumber(student.roll)}</strong></div>
              <div>৫. জন্ম তারিখ: <strong>{student.dob}</strong></div>
              <div>৬. জন্ম নিবন্ধন নং: <strong>{student.birthRegNo || '—'}</strong></div>
              <div>৭. বেতন পরিশোধ: <strong>পরিশোধিত</strong></div>
              <div>৮. ছাড়পত্রের কারণ: <strong>অভিভাবকের বদলি / বাসস্থান পরিবর্তন</strong></div>
            </div>

            <p className="text-justify indent-8">
              এই মর্মে ছাড়পত্র প্রদান করা যাচ্ছে যে, উক্ত শিক্ষার্থীর যাবতীয় পাওনাদি সম্পূর্ণরূপে পরিশোধ করা হয়েছে। তাহার চরিত্র উত্তম এবং আচরণ সন্তোষজনক ছিল।
            </p>
          </div>
        )}

        {/* DOCUMENT TYPE 3: LETTERHEAD PAD (লেটারহেড প্যাড) */}
        {certType === 'letterhead' && (
          <div className="space-y-4">
            <input
              type="text"
              value={customLetterheadTitle}
              onChange={(e) => setCustomLetterheadTitle(e.target.value)}
              className="w-full text-center font-black text-lg text-emerald-950 border-b border-dashed pb-1 bg-transparent focus:outline-hidden"
            />
            <textarea
              rows={8}
              value={customLetterheadBody}
              onChange={(e) => setCustomLetterheadBody(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-transparent text-slate-800 focus:outline-hidden leading-relaxed"
            />
          </div>
        )}

        {/* Signatures & Seal */}
        <div className="pt-20 flex justify-between items-end text-xs">
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-dashed border-emerald-700/60 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-800 p-1 mb-1">
              বিদ্যালয়ের গোল সিল
            </div>
          </div>

          <div className="text-center">
            <div className="font-signature font-bold text-slate-800 text-base mb-1">Motiur</div>
            <div className="border-t-2 border-slate-800 pt-1 w-44 font-bold text-slate-900">
              <p>প্রধান শিক্ষক</p>
              <p className="text-[10px] text-slate-500">{settings.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
