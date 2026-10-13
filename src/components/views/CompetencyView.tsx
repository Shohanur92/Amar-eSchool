import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetencyAssessment } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Target,
  Sparkles,
  Printer,
  CheckCircle,
  Plus,
  Triangle,
  Circle,
  Square,
  Award
} from 'lucide-react';

export const CompetencyView: React.FC = () => {
  const { students, classes, subjects, competencies, saveCompetency } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>(classes[6]?.id || 'c_5');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[9]?.id || 'sub_10');
  const [activePI, setActivePI] = useState<string>('৫.১.১');
  const [activePITitle, setActivePITitle] = useState<string>('পাঠের মূলভাব উপলব্ধি করে প্রমিত ভাষায় উত্তর প্রদান');

  const classStudents = students.filter((s) => s.classId === selectedClass && s.status === 'active');
  const classSubjects = subjects.filter((s) => s.classId === selectedClass);

  const handleLevelSelect = (studentId: string, level: 'A' | 'B' | 'C' | 'D') => {
    saveCompetency({
      studentId,
      classId: selectedClass,
      subjectId: selectedSubject,
      competencyNo: activePI,
      competencyTitle: activePITitle,
      level,
      date: new Date().toISOString().split('T')[0],
      remarks: level === 'A' ? 'উচ্চতর পারদর্শিতা' : level === 'B' ? 'সন্তোষজনক' : 'অগ্রগতি প্রয়োজন',
    });
  };

  const getStudentLevel = (studentId: string) => {
    const comp = competencies.find(
      (c) =>
        c.studentId === studentId &&
        c.subjectId === selectedSubject &&
        c.competencyNo === activePI
    );
    return comp ? comp.level : 'B';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <span>শিক্ষার্থী শিখন অগ্রগতি ও যোগ্যতা ট্র্যাকিং (নতুন শিক্ষাক্রম)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            পারদর্শিতা নির্দেশক (PI) এবং শিখন অর্জন সূচকভিত্তিক গ্রেডিং (A/B/C/D বা চতুর্ভুজ/বৃত্ত/ত্রিভুজ)
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          <Printer className="w-4 h-4" />
          <span>মূল্যায়ন শিট প্রিন্ট</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">শ্রেণি</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">বিষয়</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            {classSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">যোগ্যতা সূচক (PI নং)</label>
          <input
            type="text"
            value={activePI}
            onChange={(e) => setActivePI(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          />
        </div>
      </div>

      {/* Competency Level Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">A</div>
          <div>
            <p className="font-bold text-emerald-950 dark:text-emerald-200">ত্রিভুজ / A গ্রেড</p>
            <p className="text-[10px] text-emerald-700">সর্বোচ্চ পারদর্শিতা অর্জন</p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 rounded-xl flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">B</div>
          <div>
            <p className="font-bold text-blue-950 dark:text-blue-200">বৃত্ত / B গ্রেড</p>
            <p className="text-[10px] text-blue-700">সন্তোষজনক প্রয়োগ</p>
          </div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">C</div>
          <div>
            <p className="font-bold text-amber-950 dark:text-amber-200">চতুর্ভুজ / C গ্রেড</p>
            <p className="text-[10px] text-amber-700">প্রাথমিক পর্যায়</p>
          </div>
        </div>

        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 rounded-xl flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">D</div>
          <div>
            <p className="font-bold text-rose-950 dark:text-rose-200">সহায়তা প্রয়োজন / D</p>
            <p className="text-[10px] text-rose-700">বিশেষ নজর দরকার</p>
          </div>
        </div>
      </div>

      {/* Assessment Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            সূচক: {activePI} — {activePITitle}
          </h3>
          <p className="text-xs text-slate-500">প্রতিটি শিক্ষার্থীর বিপরীতে তার অর্জিত পারদর্শিতার স্তর নির্বাচন করুন</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <th className="p-3 text-center w-14">রোল</th>
                <th className="p-3">শিক্ষার্থীর নাম</th>
                <th className="p-3 text-center">পারদর্শিতা নির্বাচন (Select Level)</th>
                <th className="p-3">বর্তমান সূচক স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classStudents.map((st) => {
                const currentLevel = getStudentLevel(st.id);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-center font-bold">{toBanglaNumber(st.roll)}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      {st.name}
                      <span className="block text-[10px] text-slate-400 font-medium">শাখা: {st.section}</span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 gap-1.5">
                        {(['A', 'B', 'C', 'D'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleLevelSelect(st.id, lvl)}
                            className={`w-9 h-8 rounded-lg font-black text-xs transition-all ${
                              currentLevel === lvl
                                ? lvl === 'A'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : lvl === 'B'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : lvl === 'C'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          currentLevel === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentLevel === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : currentLevel === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {currentLevel === 'A'
                          ? 'ত্রিভুজ (উচ্চতর)'
                          : currentLevel === 'B'
                          ? 'বৃত্ত (সন্তোষজনক)'
                          : currentLevel === 'C'
                          ? 'চতুর্ভুজ (চলমান)'
                          : 'বিশেষ সহায়তা'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
