import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolClass, Subject } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Layers,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Copy,
  Check,
  X
} from 'lucide-react';

export const ClassSubjectView: React.FC = () => {
  const {
    classes,
    subjects,
    teachers,
    addClass,
    updateClass,
    addSubject,
    updateSubject
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[2]?.id || 'c_1');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // New Class Form
  const [classForm, setClassForm] = useState({
    name: '',
    nameEn: '',
    sections: 'ক, খ',
  });

  // New Subject Form
  const [subForm, setSubForm] = useState({
    name: '',
    nameEn: '',
    code: '১০১',
    fullMarks: 100,
    passMarks: 33,
    teacherId: teachers[0]?.id || '',
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const classSubjects = subjects.filter((s) => s.classId === selectedClassId);

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name) return;

    addClass({
      name: classForm.name,
      nameEn: classForm.nameEn || classForm.name,
      order: classes.length + 1,
      sections: classForm.sections.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddClassOpen(false);
    setClassForm({ name: '', nameEn: '', sections: 'ক, খ' });
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.name) return;

    const teacher = teachers.find((t) => t.id === subForm.teacherId);

    addSubject({
      name: subForm.name,
      nameEn: subForm.nameEn || subForm.name,
      code: subForm.code,
      classId: selectedClassId,
      fullMarks: subForm.fullMarks,
      passMarks: subForm.passMarks,
      teacherId: subForm.teacherId,
      teacherName: teacher?.name,
    });

    setIsAddSubjectOpen(false);
    setSubForm({
      name: '',
      nameEn: '',
      code: '১০১',
      fullMarks: 100,
      passMarks: 33,
      teacherId: teachers[0]?.id || '',
    });
  };

  const handleAssignClassTeacher = (teacherId: string) => {
    const t = teachers.find((tc) => tc.id === teacherId);
    updateClass(selectedClassId, {
      classTeacherId: teacherId,
      classTeacherName: t?.name,
    });
  };

  const handleCopySubjectsFromClass = (fromClassId: string) => {
    const sourceSubjects = subjects.filter((s) => s.classId === fromClassId);
    sourceSubjects.forEach((s) => {
      addSubject({
        name: s.name,
        nameEn: s.nameEn,
        code: `${s.code}C`,
        classId: selectedClassId,
        fullMarks: s.fullMarks,
        passMarks: s.passMarks,
        teacherId: s.teacherId,
        teacherName: s.teacherName,
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>শ্রেণি ও বিষয় ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            নতুন শ্রেণি সংযোজন, বিষয় সেটআপ এবং শ্রেণি শিক্ষক (Class Teacher) নিয়োগ
          </p>
        </div>

        <button
          onClick={() => setIsAddClassOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শ্রেণি যোগ করুন</span>
        </button>
      </div>

      {/* Main Grid: Left classes list, Right subjects and Class Teacher setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white px-2 mb-2">
            বিদ্যালয়ের সকল শ্রেণি
          </h3>

          <div className="space-y-1.5">
            {classes.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              const subCount = subjects.filter((s) => s.classId === cls.id).length;

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{cls.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      {toBanglaNumber(subCount)} টি বিষয়
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>শাখা: {cls.sections.join(', ')}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {cls.classTeacherName ? `শ্রেণি শিক্ষক: ${cls.classTeacherName}` : 'শ্রেণি শিক্ষক নেই'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subjects & Class Teacher Setup for Selected Class */}
        <div className="lg:col-span-2 space-y-4">
          {/* Class Teacher Assignment Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{selectedClass?.name} — শ্রেণি শিক্ষক (Class Teacher) নিয়োগ</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নিযুক্ত শিক্ষক অত্র শ্রেণির ফলাফল ও হাজিরা তদারকির পূর্ণ অনুমতি পাবেন
                </p>
              </div>

              <select
                value={selectedClass?.classTeacherId || ''}
                onChange={(e) => handleAssignClassTeacher(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="">-- শ্রেণি শিক্ষক নির্বাচন করুন --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{selectedClass?.name} এর পাঠ্য বিষয়সমূহ</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* Copy from other class */}
                <button
                  onClick={() => {
                    const from = prompt('কোন শ্রেণি থেকে বিষয় কপি করতে চান? (যেমন: ৫ম শ্রেণি এর আইডি c_5)', 'c_5');
                    if (from) handleCopySubjectsFromClass(from);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  title="অন্য শ্রেণি হতে বিষয় কপি"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>বিষয় কপি</span>
                </button>

                <button
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন বিষয় যোগ</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <th className="p-3">কোড</th>
                    <th className="p-3">বিষয়ের নাম</th>
                    <th className="p-3">English Name</th>
                    <th className="p-3 text-center">পূর্ণমান</th>
                    <th className="p-3 text-center">পাস নম্বর</th>
                    <th className="p-3">নিয়োজিত শিক্ষক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classSubjects.length > 0 ? (
                    classSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70">
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{sub.code}</td>
                        <td className="p-3 font-extrabold text-slate-900 dark:text-white">{sub.name}</td>
                        <td className="p-3 text-slate-500">{sub.nameEn}</td>
                        <td className="p-3 text-center font-bold">{toBanglaNumber(sub.fullMarks)}</td>
                        <td className="p-3 text-center font-bold text-emerald-600">{toBanglaNumber(sub.passMarks)}</td>
                        <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                          {sub.teacherName || 'অনির্ধারিত'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        কোন বিষয় অন্তর্ভুক্ত করা হয়নি। &quot;নতুন বিষয় যোগ&quot; বাটনে ক্লিক করুন।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">নতুন শ্রেণি যোগ করুন</h3>
            <form onSubmit={handleAddClassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">শ্রেণির নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="যেমন: ৬ষ্ঠ শ্রেণি বা নার্সারি"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ইংরেজি নাম</label>
                <input
                  type="text"
                  value={classForm.nameEn}
                  onChange={(e) => setClassForm({ ...classForm, nameEn: e.target.value })}
                  placeholder="e.g. Class 6"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">শাখা সমূহ (কমা দিয়ে পৃথক করুন)</label>
                <input
                  type="text"
                  value={classForm.sections}
                  onChange={(e) => setClassForm({ ...classForm, sections: e.target.value })}
                  placeholder="ক, খ"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">নতুন বিষয় যোগ করুন</h3>
            <form onSubmit={handleAddSubjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">বিষয়ের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  placeholder="যেমন: সংগীত ও শারীরিক শিক্ষা"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">বিষয় কোড</label>
                  <input
                    type="text"
                    value={subForm.code}
                    onChange={(e) => setSubForm({ ...subForm, code: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">পূর্ণমান</label>
                  <input
                    type="number"
                    value={subForm.fullMarks}
                    onChange={(e) => setSubForm({ ...subForm, fullMarks: parseInt(e.target.value) || 100 })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">দায়িত্বপ্রাপ্ত শিক্ষক</label>
                <select
                  value={subForm.teacherId}
                  onChange={(e) => setSubForm({ ...subForm, teacherId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  বিষয় সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
