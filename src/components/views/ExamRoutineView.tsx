import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamRoutineItem, Student } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  FileText,
  LayoutGrid
} from 'lucide-react';

export const ExamRoutineView: React.FC = () => {
  const {
    exams,
    classes,
    subjects,
    students,
    examRoutine,
    saveExamRoutineItem,
    deleteExamRoutineItem,
    settings
  } = useApp();

  const [selectedExam, setSelectedExam] = useState<string>(exams[0]?.id || 'ex_1');
  const [selectedClass, setSelectedClass] = useState<string>(classes[6]?.id || 'c_5');
  const [activeTab, setActiveTab] = useState<'routine' | 'admit_cards' | 'seat_labels'>('routine');
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState<boolean>(false);

  const [routineForm, setRoutineForm] = useState<Partial<ExamRoutineItem>>({
    examId: selectedExam,
    classId: selectedClass,
    date: '২০২৬-০৩-১৫',
    dayName: 'রবিবার',
    time: 'সকাল ১০:০০ - ১২:০০',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    roomNo: '১০১',
  });

  const currentExam = exams.find((e) => e.id === selectedExam);
  const currentClass = classes.find((c) => c.id === selectedClass);
  const classStudents = students.filter((s) => s.classId === selectedClass && s.status === 'active');
  const filteredRoutine = examRoutine.filter(
    (r) => r.examId === selectedExam && (r.classId === selectedClass || !r.classId)
  );

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === routineForm.subjectId);
    saveExamRoutineItem({
      examId: selectedExam,
      classId: selectedClass,
      date: routineForm.date || '২০২৬-০৩-১৫',
      dayName: routineForm.dayName || 'রবিবার',
      time: routineForm.time || 'সকাল ১০:০০ - ১২:০০',
      subjectId: routineForm.subjectId || '',
      subjectName: sub?.name || 'বিষয়',
      roomNo: routineForm.roomNo || '১০১',
    });
    setIsAddRoutineOpen(false);
  };

  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Exam Routine</title></head>
      <body>
        <h2 style="text-align:center;">${settings.name}</h2>
        <p style="text-align:center;">${currentExam?.name} - সময়সূচী (${currentClass?.name})</p>
        <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:center;">
          <tr style="background:#f2f2f2;"><th>তারিখ</th><th>বার</th><th>সময়</th><th>বিষয়</th><th>কক্ষ নং</th></tr>
          ${filteredRoutine.map(r => `<tr><td>${r.date}</td><td>${r.dayName}</td><td>${r.time}</td><td>${r.subjectName}</td><td>${r.roomNo}</td></tr>`).join('')}
        </table>
      </body></html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Exam_Routine_${currentClass?.nameEn || 'Routine'}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">পরীক্ষা</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">শ্রেণি নির্বাচন</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Word ফাইল ডাউনলোড</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন (A4)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'routine'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>পরীক্ষার সময়সূচী (Routine)</span>
        </button>

        <button
          onClick={() => setActiveTab('admit_cards')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'admit_cards'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>A4 প্রবেশপত্র (এক পাতায় ২টি)</span>
        </button>

        <button
          onClick={() => setActiveTab('seat_labels')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'seat_labels'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>সিট লেবেল (এক পাতায় ১৬টি)</span>
        </button>
      </div>

      {/* TAB 1: ROUTINE */}
      {activeTab === 'routine' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {currentExam?.name} — {currentClass?.name} পরীক্ষার রুটিন
              </h3>
              <p className="text-xs text-slate-500">প্রতিটি বিষয়ের তারিখ, সময় ও কক্ষ বরাদ্দ</p>
            </div>

            <button
              onClick={() => setIsAddRoutineOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন পরীক্ষার বিষয় যোগ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3">তারিখ</th>
                  <th className="p-3">বার</th>
                  <th className="p-3">সময়সূচী</th>
                  <th className="p-3">বিষয়</th>
                  <th className="p-3 text-center">কক্ষ নম্বর</th>
                  <th className="p-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRoutine.length > 0 ? (
                  filteredRoutine.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{item.date}</td>
                      <td className="p-3 font-medium text-slate-600 dark:text-slate-300">{item.dayName}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{item.time}</td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{item.subjectName}</td>
                      <td className="p-3 text-center font-bold">কক্ষ-{toBanglaNumber(item.roomNo)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteExamRoutineItem(item.id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      রুটিন যোগ করা হয়নি। &quot;নতুন পরীক্ষার বিষয় যোগ&quot; বাটনে ক্লিক করুন।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIT CARDS (2 PER A4 SHEET) */}
      {activeTab === 'admit_cards' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between no-print">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                A4 সাইজে ২টি প্রবেশপত্র প্রিন্ট লেআউট
              </h3>
              <p className="text-xs text-slate-500">
                প্রতিটি A4 পাতায় ২টি প্রবেশপত্র ছবি বক্স, রুটিন এবং স্বাক্ষর সহ নিখুঁতভাবে প্রিন্ট হবে।
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>সকল প্রবেশপত্র প্রিন্ট করুন</span>
            </button>
          </div>

          {/* Group students in pairs of 2 per A4 sheet */}
          <div className="space-y-8">
            {classStudents.map((student, idx) => {
              if (idx % 2 !== 0) return null; // process pairs
              const pair = [student, classStudents[idx + 1]].filter(Boolean);

              return (
                <div key={idx} className="print-page-break space-y-4">
                  {pair.map((st) => (
                    <div
                      key={st.id}
                      className="admit-card-container border-2 border-slate-800 rounded-xl p-5 bg-white text-slate-900 relative shadow-sm"
                    >
                      {/* School Heading with Logo */}
                      <div className="flex items-center justify-center gap-3 border-b border-slate-400 pb-2 mb-3">
                        {settings.logoUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{settings.code}</p>
                          <h2 className="text-lg font-black text-slate-900 leading-tight">{settings.name}</h2>
                          <p className="text-[10px] text-slate-600">{settings.address}</p>
                          <div className="inline-block px-3 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px] mt-1">
                            প্রবেশপত্র (Admit Card) — {currentExam?.name}
                          </div>
                        </div>
                      </div>

                      {/* Student Info and Photo Box */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs flex-1">
                          <div>
                            <span className="text-slate-500 text-[10px]">শিক্ষার্থীর নাম:</span>
                            <strong className="block text-slate-900 font-extrabold">{st.name}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">শ্রেণি ও শাখা:</span>
                            <strong className="block text-slate-900">{currentClass?.name} (শাখা: {st.section})</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">রোল নম্বর:</span>
                            <strong className="block text-slate-900 text-sm font-black">{toBanglaNumber(st.roll)}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">ভর্তি নং:</span>
                            <strong className="block text-slate-900 font-mono">{st.admissionNo}</strong>
                          </div>
                        </div>

                        {/* Student Photo in Admit Card */}
                        {st.photoUrl ? (
                          <div className="w-16 h-20 border-2 border-slate-700 rounded overflow-hidden shrink-0 shadow-xs bg-white">
                            <img src={st.photoUrl} alt={st.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-20 border border-dashed border-slate-400 rounded flex items-center justify-center text-center p-1 text-[9px] text-slate-400 shrink-0 bg-slate-50">
                            ছবি সংযুক্ত করুন
                          </div>
                        )}
                      </div>

                      {/* Mini Routine Table */}
                      <div className="mb-3">
                        <table className="w-full text-[10px] border border-slate-300 text-center">
                          <thead>
                            <tr className="bg-slate-100 font-bold border-b border-slate-300">
                              <th className="p-1 border border-slate-300">তারিখ</th>
                              <th className="p-1 border border-slate-300">সময়সূচী</th>
                              <th className="p-1 border border-slate-300 text-left pl-2">বিষয়</th>
                              <th className="p-1 border border-slate-300">কক্ষ নং</th>
                              <th className="p-1 border border-slate-300">পরিদর্শকের স্বাক্ষর</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRoutine.slice(0, 4).map((r) => (
                              <tr key={r.id}>
                                <td className="p-1 border border-slate-300">{r.date}</td>
                                <td className="p-1 border border-slate-300 font-mono">{r.time}</td>
                                <td className="p-1 border border-slate-300 text-left pl-2 font-bold">{r.subjectName}</td>
                                <td className="p-1 border border-slate-300">{r.roomNo}</td>
                                <td className="p-1 border border-slate-300"></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Instructions & Signature */}
                      <div className="flex items-end justify-between text-[9px] pt-1 border-t border-slate-300">
                        <div className="text-slate-600 space-y-0.5">
                          <p>১. প্রবেশপত্র ব্যতীত পরীক্ষায় অংশগ্রহণ করা যাবে না।</p>
                          <p>২. পরীক্ষা শুরুর ১৫ মিনিট পূর্বে আসন গ্রহণ করতে হবে।</p>
                        </div>
                        <div className="text-center">
                          <div className="font-signature text-xs font-bold text-slate-800">Motiur</div>
                          <span className="border-t border-slate-400 pt-0.5 block font-bold text-[10px]">
                            প্রধান শিক্ষক
                          </span>
                        </div>
                      </div>

                      {/* Scissors cut-line indicator */}
                      <div className="absolute -bottom-3 left-0 right-0 text-center pointer-events-none no-print">
                        <span className="text-[10px] text-slate-400 bg-white px-2">✂ কাটার দাগ (Cut Line)</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SEAT LABELS (16 PER A4 SHEET - 4x4 GRID) */}
      {activeTab === 'seat_labels' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between no-print">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                সিট লেবেল (Seat Labels) — এক পাতায় ১৬টি
              </h3>
              <p className="text-xs text-slate-500">
                A4 কাগজে ৪×৪ গ্রিডে ১৬টি সিট স্টিকার বা লেবেল নিখুঁতভাবে প্রিন্ট করুন।
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>১৬টি লেবেল প্রিন্ট করুন</span>
            </button>
          </div>

          {/* 16 Seat Labels Grid (4x4) */}
          <div className="seat-label-grid grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white text-slate-900 p-2 border border-slate-300 rounded-xl">
            {classStudents.map((st) => (
              <div
                key={st.id}
                className="border-2 border-slate-800 rounded-lg p-2 text-center bg-white space-y-1 shadow-xs"
              >
                <div className="text-[9px] font-black uppercase text-emerald-800 border-b border-slate-300 pb-0.5 truncate">
                  {settings.name}
                </div>
                <div className="text-[8px] text-slate-500 font-bold truncate">
                  {currentExam?.name}
                </div>
                <div className="text-xs font-black text-slate-900 truncate">{st.name}</div>
                <div className="bg-slate-100 rounded p-1 flex justify-around items-center text-[10px] font-bold">
                  <span>{currentClass?.name}</span>
                  <span className="text-xs font-black text-emerald-700">রোল: {toBanglaNumber(st.roll)}</span>
                  <span>শাখা: {st.section}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500">কক্ষ নং: ১০১</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routine Add Modal */}
      {isAddRoutineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              পরীক্ষার নতুন সময়সূচী যোগ করুন
            </h3>
            <form onSubmit={handleSaveRoutine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিষয় নির্বাচন</label>
                <select
                  value={routineForm.subjectId}
                  onChange={(e) => setRoutineForm({ ...routineForm, subjectId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {subjects.filter(s => s.classId === selectedClass).map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">তারিখ</label>
                  <input
                    type="text"
                    value={routineForm.date}
                    onChange={(e) => setRoutineForm({ ...routineForm, date: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বার</label>
                  <input
                    type="text"
                    value={routineForm.dayName}
                    onChange={(e) => setRoutineForm({ ...routineForm, dayName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সময়</label>
                <input
                  type="text"
                  value={routineForm.time}
                  onChange={(e) => setRoutineForm({ ...routineForm, time: e.target.value })}
                  placeholder="সকাল ১০:০০ - ১২:০০"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">কক্ষ নম্বর</label>
                <input
                  type="text"
                  value={routineForm.roomNo}
                  onChange={(e) => setRoutineForm({ ...routineForm, roomNo: e.target.value })}
                  placeholder="১০১"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddRoutineOpen(false)}
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
