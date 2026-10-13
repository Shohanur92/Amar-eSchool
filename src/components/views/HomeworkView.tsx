import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Homework } from '../../types';
import {
  BookMarked,
  Plus,
  Printer,
  Trash2,
  Calendar,
  CheckCircle,
  X
} from 'lucide-react';

export const HomeworkView: React.FC = () => {
  const { classes, subjects, homeworks, addHomework, deleteHomework, settings, currentUser } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<Partial<Homework>>({
    classId: classes[2]?.id || 'c_1',
    section: 'ক',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    teacherName: currentUser?.name || 'সহকারী শিক্ষক',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: 'আগামীকাল',
  });

  const filteredHomeworks = homeworks.filter(
    (h) => selectedClass === 'all' || h.classId === selectedClass
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    const sub = subjects.find((s) => s.id === form.subjectId);

    addHomework({
      classId: form.classId || 'c_1',
      section: form.section || 'ক',
      subjectId: form.subjectId || '',
      subjectName: sub?.name || 'বিষয়',
      teacherName: form.teacherName || 'সহকারী শিক্ষক',
      title: form.title,
      description: form.description,
      date: form.date || new Date().toISOString().split('T')[0],
      dueDate: form.dueDate || 'আগামীকাল',
    });

    setIsModalOpen(false);
    setForm({
      classId: classes[2]?.id || 'c_1',
      section: 'ক',
      subjectId: subjects[0]?.id || '',
      subjectName: subjects[0]?.name || '',
      teacherName: currentUser?.name || 'সহকারী শিক্ষক',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: 'আগামীকাল',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-600" />
            <span>হোমওয়ার্ক ডায়েরি (দৈনিক বাড়ির কাজ)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            শ্রেণি ও বিষয়ভিত্তিক বাড়ির কাজ এন্ট্রি ও একসাথে সব শ্রেণির ডায়েরি প্রিন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>সব শ্রেণির ডায়েরি প্রিন্ট করুন</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন হোমওয়ার্ক যোগ</span>
          </button>
        </div>
      </div>

      {/* Class Filter Bar */}
      <div className="flex items-center gap-2 no-print overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedClass('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedClass === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          সকল শ্রেণির কাজ
        </button>
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClass(cls.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedClass === cls.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {cls.name}
          </button>
        ))}
      </div>

      {/* Printable All Classes Combined Diary View */}
      <div className="space-y-4">
        {filteredHomeworks.map((hw) => {
          const cls = classes.find((c) => c.id === hw.classId);
          return (
            <div
              key={hw.id}
              className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                    {cls?.name} (শাখা: {hw.section})
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {hw.subjectName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">তারিখ: {hw.date}</span>
                  <button
                    onClick={() => deleteHomework(hw.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {hw.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                {hw.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>নিয়োজিত শিক্ষক: {hw.teacherName}</span>
                <span className="font-bold text-emerald-600">জমার সময়: {hw.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Homework Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-sm text-slate-900 dark:text-white mb-4">
              নতুন দৈনিক বাড়ির কাজ এন্ট্রি
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">শ্রেণি</label>
                  <select
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">শাখা</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">বিষয়</label>
                <select
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name} ({classes.find(c => c.id === sub.classId)?.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">পাঠ বা অধ্যায়ের নাম</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="যেমন: অধ্যায় ৩ - অনুশীলনী ৩ এর অঙ্ক"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বাড়ির কাজের বিবরণ</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="বিস্তারিত নির্দেশাবলী লিখুন..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
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
