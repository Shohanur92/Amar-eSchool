import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  BookOpenCheck,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Award
} from 'lucide-react';

export const AdmissionRegisterView: React.FC = () => {
  const { students, classes, settings } = useApp();

  const [activeTab, setActiveTab] = useState<'admission_register' | 'stipend_demand'>('admission_register');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [stipendFilter, setStipendFilter] = useState<'all' | 'eligible_only'>('eligible_only');

  const filteredStudents = students.filter(
    (s) => (selectedClass === 'all' || s.classId === selectedClass) && s.status === 'active'
  );

  // Stipend beneficiary list with attendance calculation simulation (85% condition)
  const stipendList = filteredStudents.map((st, idx) => {
    // Simulated attendance rate (students 1, 2, 4, 5, 6, 7 have >= 85%, student 3 has 80%)
    const attendancePercentage = idx === 2 ? 78 : (88 + (idx % 10));
    const isEligibleByAttendance = attendancePercentage >= 85;

    return {
      student: st,
      attendancePercentage,
      isEligible: st.isStipendBeneficiary && isEligibleByAttendance,
      mobileBankingAccount: st.guardianPhone,
      mfsOperator: idx % 2 === 0 ? 'বিকাশ (bKash)' : 'নগদ (Nagad)',
    };
  });

  const displayStipendList = stipendFilter === 'eligible_only'
    ? stipendList.filter((s) => s.isEligible)
    : stipendList;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-emerald-600" />
            <span>ভর্তি রেজিস্টার ও উপবৃত্তি চাহিদা তালিকা (৮৫% উপস্থিতি শর্তসহ)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            সরকারি প্রাথমিক বিদ্যালয়ের আনুষ্ঠানিক রেজিস্টার খাতা ও উপবৃত্তি সুবিধাভোগীদের তালিকা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>রেজিস্টার প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('admission_register')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'admission_register'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>১. পূর্ণাঙ্গ ভর্তি রেজিস্টার (Admission Book)</span>
        </button>

        <button
          onClick={() => setActiveTab('stipend_demand')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'stipend_demand'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>২. প্রাথমিক উপবৃত্তি রেজিস্টার (৮৫% উপস্থিতি ও নগদ/বিকাশ)</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            <option value="all">সকল শ্রেণির রেজিস্টার</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {activeTab === 'stipend_demand' && (
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setStipendFilter('eligible_only')}
              className={`px-3 py-1 rounded-xl transition-all ${
                stipendFilter === 'eligible_only'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              শুধু ৮৫%+ উপস্থিতিযোগ্য (Eligible)
            </button>
            <button
              onClick={() => setStipendFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                stipendFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              সকল শিক্ষার্থী
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: FULL ADMISSION REGISTER */}
      {activeTab === 'admission_register' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                বিদ্যালয় আনুষ্ঠানিক ছাত্রভর্তি রেজিস্টার খাতা
              </h3>
              <p className="text-xs text-slate-500">সরকারি রেজিস্টার ফরম্যাট অনুযায়ী মুদ্রিত কপি</p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              মোট শিক্ষার্থী: {toBanglaNumber(filteredStudents.length)} জন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3 text-center w-14">ভর্তি নং</th>
                  <th className="p-3">ভর্তির তারিখ</th>
                  <th className="p-3">শিক্ষার্থীর নাম ও রোল</th>
                  <th className="p-3">শ্রেণি</th>
                  <th className="p-3">পিতার নাম</th>
                  <th className="p-3">মাতার নাম</th>
                  <th className="p-3">জন্ম নিবন্ধন সনদ নং</th>
                  <th className="p-3">স্থায়ী ঠিকানা</th>
                  <th className="p-3">মোবাইল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {st.admissionNo}
                    </td>
                    <td className="p-3 text-slate-500">{st.admissionDate}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      {st.name}
                      <span className="block text-[10px] text-slate-400 font-normal">রোল: {toBanglaNumber(st.roll)} ({st.gender})</span>
                    </td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                      {classes.find((c) => c.id === st.classId)?.name}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{st.fatherName || '—'}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{st.motherName || '—'}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {st.birthRegNo || '—'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {st.address}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {st.guardianPhone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STIPEND DEMAND REGISTER (85% CONDITION) */}
      {activeTab === 'stipend_demand' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                প্রাথমিক শিক্ষা উপবৃত্তি চাহিদা রেজিস্টার (চলমান কোয়ার্টার)
              </h3>
              <p className="text-xs text-slate-500">
                উপস্থিতির হার ন্যূনতম ৮৫% প্রাপ্ত শিক্ষার্থীদের মোবাইল ব্যাংকিং (বিকাশ/নগদ) হিসাব বিবরণী
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              সুবিধাভোগী: {toBanglaNumber(displayStipendList.length)} জন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3 text-center w-12">রোল</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">শ্রেণি</th>
                  <th className="p-3 text-center">উপস্থিতির হার (%)</th>
                  <th className="p-3 text-center">যোগ্যতা যাচাই (৮৫% শর্ত)</th>
                  <th className="p-3">অভিভাবকের মোবাইল ব্যাংকিং একাউন্ট</th>
                  <th className="p-3">এমএফএস অপারেটর</th>
                  <th className="p-3 text-right">উপবৃত্তি পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayStipendList.map((item) => (
                  <tr key={item.student.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-center font-bold">{toBanglaNumber(item.student.roll)}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      {item.student.name}
                      <span className="block text-[10px] text-slate-400">মাতা: {item.student.motherName}</span>
                    </td>
                    <td className="p-3 font-bold">{classes.find((c) => c.id === item.student.classId)?.name}</td>
                    <td className="p-3 text-center font-bold">
                      <span
                        className={
                          item.attendancePercentage >= 85
                            ? 'text-emerald-600 font-black'
                            : 'text-rose-600 font-black'
                        }
                      >
                        {toBanglaNumber(item.attendancePercentage)}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.isEligible ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>উপযুক্ত (Eligible)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 inline-flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>অনুপযুক্ত (&lt;৮৫%)</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {item.mobileBankingAccount}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                        {item.mfsOperator}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      ৳ {toBanglaNumber(450)}/-
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
