import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoutineItem } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  CalendarDays,
  Plus,
  Trash2,
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

export const RoutineView: React.FC = () => {
  const {
    classes,
    subjects,
    teachers,
    classRoutines,
    saveClassRoutineItem,
    deleteClassRoutineItem,
    settings
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>(classes[6]?.id || 'c_5');
  const [selectedDay, setSelectedDay] = useState<string>('রবিবার');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [conflictWarning, setConflictWarning] = useState<string>('');

  const [form, setForm] = useState<Partial<ClassRoutineItem>>({
    day: 'রবিবার',
    period: 1,
    startTime: '১০:০০',
    endTime: '১০:৪৫',
    classId: selectedClass,
    section: 'ক',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
  });

  const days: ('শনিবার' | 'রবিবার' | 'সোমবার' | 'মঙ্গলবার' | 'বুধবার' | 'বৃহস্পতিবার')[] = [
    'শনিবার',
    'রবিবার',
    'সোমবার',
    'মঙ্গলবার',
    'বুধবার',
    'বৃহস্পতিবার',
  ];

  const periods = [
    { num: 1, start: '১০:০০', end: '১০:৪৫' },
    { num: 2, start: '১০:৪৫', end: '১১:৩০' },
    { num: 3, start: '১১:৩০', end: '১২:১৫' },
    { num: 4, start: '১২:১৫', end: '০১:০০' },
    { num: 5, start: '০১:৩০', end: '০২:১৫' }, // lunch break in between
    { num: 6, start: '০২:১৫', end: '০৩:০০' },
  ];

  const currentClass = classes.find((c) => c.id === selectedClass);
  const classRoutinesFiltered = classRoutines.filter((r) => r.classId === selectedClass);

  const handleOpenAdd = (day: any, periodNum: number, start: string, end: string) => {
    setConflictWarning('');
    setForm({
      day,
      period: periodNum,
      startTime: start,
      endTime: end,
      classId: selectedClass,
      section: 'ক',
      subjectId: subjects.filter((s) => s.classId === selectedClass)[0]?.id || subjects[0]?.id,
      teacherId: teachers[1]?.id || teachers[0]?.id,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning('');

    const res = saveClassRoutineItem({
      day: form.day as any,
      period: form.period || 1,
      startTime: form.startTime || '১০:০০',
      endTime: form.endTime || '১০:৪৫',
      classId: selectedClass,
      section: form.section || 'ক',
      subjectId: form.subjectId || '',
      teacherId: form.teacherId || '',
    });

    if (!res.success) {
      setConflictWarning(res.conflictMsg || 'সময় সংঘর্ষ হয়েছে!');
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Class Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>স্মার্ট সাপ্তাহিক ক্লাস রুটিন (সংঘর্ষহীন শিডিউলিং)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            শিক্ষকদের সময়-সংঘর্ষ স্বয়ংক্রিয়ভাবে এড়িয়ে সাপ্তাহিক পিরিয়ড পরিচালনা করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.nameEn})
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>রুটিন প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Routine Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {currentClass?.name} — সাপ্তাহিক ক্লাস সময়সূচী
          </h3>
          <span className="text-xs text-slate-400">শনিবার থেকে বৃহস্পতিবার (৬টি পিরিয়ড)</span>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-xs border border-slate-200 dark:border-slate-700 text-center">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 font-bold">
                <th className="p-3 border border-slate-200 dark:border-slate-700 w-24">বার / দিন</th>
                {periods.map((p) => (
                  <th key={p.num} className="p-3 border border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-extrabold">{toBanglaNumber(p.num)}ম পিরিয়ড</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {p.start} - {p.end}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-extrabold bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white">
                    {day}
                  </td>
                  {periods.map((p) => {
                    const item = classRoutinesFiltered.find(
                      (r) => r.day === day && r.period === p.num
                    );
                    const sub = subjects.find((s) => s.id === item?.subjectId);
                    const teacher = teachers.find((t) => t.id === item?.teacherId);

                    return (
                      <td
                        key={p.num}
                        className="p-2 border border-slate-200 dark:border-slate-700 relative group min-w-[120px]"
                      >
                        {item ? (
                          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left relative">
                            <button
                              onClick={() => deleteClassRoutineItem(item.id)}
                              className="absolute top-1 right-1 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="font-extrabold text-emerald-900 dark:text-emerald-200 truncate">
                              {sub?.name || 'বিষয়'}
                            </div>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                              {teacher?.name || 'শিক্ষক'}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAdd(day, p.num, p.start, p.end)}
                            className="w-full py-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1 text-[11px]"
                          >
                            <Plus className="w-3 h-3" />
                            <span>যোগ</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routine Add Modal with Collision Detector */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
              পিরিয়ডে বিষয় ও শিক্ষক বরাদ্দ
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {form.day} • {toBanglaNumber(form.period)}ম পিরিয়ড ({form.startTime} - {form.endTime})
            </p>

            {conflictWarning && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিষয় নির্বাচন
                </label>
                <select
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {subjects
                    .filter((s) => s.classId === selectedClass)
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নিয়োজিত শিক্ষক
                </label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
