import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarksEntry, Student, ExamMarkDistribution, ExamMarkComponent } from '../../types';
import { toBanglaNumber, calculateGrade, formatBanglaDate } from '../../utils/bengaliUtils';
import {
  GraduationCap,
  Award,
  Printer,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  X,
  Sparkles,
  BookOpen,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  Settings2,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ResultView: React.FC = () => {
  const {
    students,
    classes,
    subjects,
    exams,
    marks,
    saveMarksEntry,
    bulkSaveMarks,
    settings,
    markDistributions,
    saveMarkDistribution,
    deleteMarkDistribution
  } = useApp();

  const [selectedExam, setSelectedExam] = useState<string>(exams[0]?.id || 'ex_1');
  const [selectedClass, setSelectedClass] = useState<string>(classes[6]?.id || 'c_5');
  const [activeTab, setActiveTab] = useState<'merit' | 'entry' | 'distribution'>('merit');
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [cardPages, setCardPages] = useState<'1page' | '2page'>('1page');
  const [selectedSubjectForEntry, setSelectedSubjectForEntry] = useState<string>('all');

  // Selected distribution ID for entry grid
  const [activeDistId, setActiveDistId] = useState<string>(
    markDistributions[0]?.id || 'dist_mcq_written_ct'
  );

  // New Distribution Creation Form State
  const [isCreatingDist, setIsCreatingDist] = useState(false);
  const [newDistTitle, setNewDistTitle] = useState('');
  const [newComponents, setNewComponents] = useState<ExamMarkComponent[]>([
    { id: 'written', name: 'রচনামূলক / লিখিত (Written)', nameEn: 'Written', maxMarks: 50, passMarks: 17 },
    { id: 'mcq', name: 'নৈর্ব্যক্তিক (MCQ)', nameEn: 'MCQ', maxMarks: 30, passMarks: 10 },
    { id: 'ct', name: 'শ্রেণি পরীক্ষা (Class Test - CT)', nameEn: 'CT Exam', maxMarks: 20, passMarks: 7 },
  ]);
  const [distError, setDistError] = useState('');

  const classStudents = students.filter((s) => s.classId === selectedClass && s.status === 'active');
  const classSubjects = subjects.filter((s) => s.classId === selectedClass);
  const currentExam = exams.find((e) => e.id === selectedExam);

  // Active distribution components
  const activeDistribution =
    markDistributions.find((d) => d.id === activeDistId) ||
    markDistributions[0] || {
      id: 'dist_std',
      title: 'সাধারণ মূল্যায়ন',
      totalMarks: 100,
      components: [
        { id: 'written', name: 'লিখিত (Written)', nameEn: 'Written', maxMarks: 70, passMarks: 23 },
        { id: 'continuous', name: 'শিখনকালীন (Continuous)', nameEn: 'Continuous', maxMarks: 30, passMarks: 10 },
      ],
    };

  // Compute student results with totals, GPA, and Merit Rank
  const studentResults = classStudents.map((student) => {
    const studentMarks = marks.filter((m) => m.studentId === student.id && m.examId === selectedExam);
    const totalMarks = studentMarks.reduce((sum, m) => sum + (m.totalMarks || 0), 0);
    const totalSubjects = classSubjects.length || 1;
    const average = Math.round(totalMarks / totalSubjects);
    const hasFailed = studentMarks.some((m) => m.grade === 'F');

    // GPA
    const totalGP = studentMarks.reduce((sum, m) => sum + (m.gradePoint || 0), 0);
    const gpa = hasFailed ? 0.0 : +(totalGP / totalSubjects).toFixed(2);
    const overallGrade = hasFailed ? 'F' : calculateGrade(average).grade;

    return {
      student,
      marks: studentMarks,
      totalMarks,
      average,
      gpa,
      overallGrade,
      hasFailed,
    };
  });

  // Sort by GPA desc, then totalMarks desc to establish Merit Order
  studentResults.sort((a, b) => {
    if (b.gpa !== a.gpa) return b.gpa - a.gpa;
    return b.totalMarks - a.totalMarks;
  });

  // Handle Dynamic Component Mark Change
  const handleComponentMarkChange = (
    studentId: string,
    subjectId: string,
    componentId: string,
    value: number
  ) => {
    const existing = marks.find(
      (m) => m.studentId === studentId && m.subjectId === subjectId && m.examId === selectedExam
    );

    const prevComponents = existing?.componentMarks || {};
    const updatedComponents = { ...prevComponents, [componentId]: value };

    // Calculate sum across all components of current active distribution
    let calculatedTotal = 0;
    activeDistribution.components.forEach((c) => {
      calculatedTotal += Number(updatedComponents[c.id] || 0);
    });

    const writtenVal = updatedComponents['written'] ?? (existing?.writtenMarks || 0);
    const continuousVal = updatedComponents['continuous'] ?? updatedComponents['ct'] ?? (existing?.continuousMarks || 0);

    const gradeInfo = calculateGrade(calculatedTotal, activeDistribution.totalMarks || 100);

    saveMarksEntry({
      examId: selectedExam,
      studentId,
      classId: selectedClass,
      subjectId,
      writtenMarks: writtenVal,
      continuousMarks: continuousVal,
      componentMarks: updatedComponents,
      totalMarks: calculatedTotal,
      grade: gradeInfo.grade,
      gradePoint: gradeInfo.point,
    });
  };

  const handleExportExcel = () => {
    const headers = ['মেধাক্রম,রোল,নাম,মোট নম্বর,গড় নম্বর,জিপিএ (GPA),প্রাপ্ত গ্রেড'];
    const rows = studentResults.map((r, idx) => {
      return `"${idx + 1}","${r.student.roll}","${r.student.name}","${r.totalMarks}","${r.average}","${r.gpa}","${r.overallGrade}"`;
    });
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `Result_Sheet_${classes.find((c) => c.id === selectedClass)?.nameEn || 'Class'}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Distribution Form Helpers
  const handleAddComponentRow = () => {
    const newId = `comp_${Date.now()}`;
    setNewComponents((prev) => [
      ...prev,
      { id: newId, name: 'নতুন পরীক্ষা/সিটি', nameEn: 'Component', maxMarks: 10, passMarks: 3.3 },
    ]);
  };

  const handleRemoveComponentRow = (idx: number) => {
    if (newComponents.length <= 1) return;
    setNewComponents((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateComponentRow = (idx: number, field: keyof ExamMarkComponent, val: any) => {
    setNewComponents((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSaveNewDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    setDistError('');

    if (!newDistTitle.trim()) {
      setDistError('নম্বর বণ্টনের একটি শিরোনাম বা নাম দিন!');
      return;
    }

    const totalSum = newComponents.reduce((sum, c) => sum + Number(c.maxMarks || 0), 0);
    if (totalSum <= 0) {
      setDistError('মোট নম্বর ০ এর বেশি হতে হবে!');
      return;
    }

    const newDist: ExamMarkDistribution = {
      id: `dist_${Date.now()}`,
      title: newDistTitle.trim(),
      totalMarks: totalSum,
      components: newComponents,
    };

    saveMarkDistribution(newDist);
    setActiveDistId(newDist.id);
    setIsCreatingDist(false);
    setNewDistTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">পরীক্ষা নির্বাচন</label>
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
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>এক্সেল শিট</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট শিট</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('merit')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'merit'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>মেধাক্রম ও ফলাফল শিট (Merit List)</span>
        </button>

        <button
          onClick={() => setActiveTab('entry')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'entry'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>নম্বর এন্ট্রি (Marks Entry Grid)</span>
        </button>

        <button
          onClick={() => setActiveTab('distribution')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'distribution'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>কাস্টম নম্বর বণ্টন কনফিগারেশন (MCQ, Written, CT ইত্যাদি)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MERIT LIST */}
      {/* ============================================================== */}
      {activeTab === 'merit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {currentExam?.name} — {classes.find((c) => c.id === selectedClass)?.name} ফলাফল ও মেধাক্রম
              </h3>
              <p className="text-xs text-slate-500">স্বয়ংক্রিয় মোট নম্বর, শতকরা হার ও জিপিএ হিসাব</p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              মোট পরীক্ষার্থী: {toBanglaNumber(studentResults.length)} জন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="p-3 text-center w-16">মেধাক্রম</th>
                  <th className="p-3 text-center w-14">রোল</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3 text-center">মোট নম্বর</th>
                  <th className="p-3 text-center">গড় (%)</th>
                  <th className="p-3 text-center">জিপিএ (GPA)</th>
                  <th className="p-3 text-center">গ্রেড</th>
                  <th className="p-3 text-right">অগ্রগতি প্রতিবেদন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentResults.map((r, idx) => (
                  <tr key={r.student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-black">
                      <span
                        className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-800 ring-2 ring-slate-400'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-300'
                            : 'text-slate-600'
                        }`}
                      >
                        {toBanglaNumber(idx + 1)}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold">{toBanglaNumber(r.student.roll)}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      {r.student.name}
                      <span className="block text-[10px] text-slate-400 font-medium">শাখা: {r.student.section}</span>
                    </td>
                    <td className="p-3 text-center font-bold">{toBanglaNumber(r.totalMarks)}</td>
                    <td className="p-3 text-center font-bold">{toBanglaNumber(r.average)}%</td>
                    <td className="p-3 text-center font-black text-emerald-600 dark:text-emerald-400">
                      {toBanglaNumber(r.gpa.toFixed(2))}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          r.overallGrade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.overallGrade === 'F'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {r.overallGrade}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedStudentForCard(r.student)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>রিপোর্ট কার্ড</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MARKS ENTRY GRID WITH CUSTOM COMPONENTS (Requirement 9) */}
      {/* ============================================================== */}
      {activeTab === 'entry' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-4 sm:p-5">
          {/* Active Distribution Selector & Subject Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  নম্বর বণ্টন মডেল (Distribution Model)
                </label>
                <select
                  value={activeDistId}
                  onChange={(e) => setActiveDistId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-extrabold text-emerald-700 dark:text-emerald-300"
                >
                  {markDistributions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} (পূর্ণমান: {d.totalMarks})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  বিষয় ফিল্টার
                </label>
                <select
                  value={selectedSubjectForEntry}
                  onChange={(e) => setSelectedSubjectForEntry(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="all">সকল বিষয় একনজরে</option>
                  {classSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">
                সক্রিয় উপাদানসমূহ:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeDistribution.components.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    {c.name}: {toBanglaNumber(c.maxMarks)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid View */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 dark:border-slate-800 text-center">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                  <th className="p-2 border border-slate-200 dark:border-slate-700 w-12">রোল</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-left w-36">শিক্ষার্থীর নাম</th>
                  {(selectedSubjectForEntry === 'all'
                    ? classSubjects
                    : classSubjects.filter((s) => s.id === selectedSubjectForEntry)
                  ).map((sub) => (
                    <th key={sub.id} className="p-2 border border-slate-200 dark:border-slate-700 min-w-[220px]">
                      <div className="font-extrabold text-slate-900 dark:text-white">{sub.name}</div>
                      <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
                        {activeDistribution.components.map((c) => (
                          <span key={c.id} className="bg-slate-200/80 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                            {c.name.split(' ')[0]} ({toBanglaNumber(c.maxMarks)})
                          </span>
                        ))}
                        <span className="font-bold text-emerald-600">মোট ({toBanglaNumber(activeDistribution.totalMarks)})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold">
                      {toBanglaNumber(student.roll)}
                    </td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-900 dark:text-white">
                      {student.name}
                      <span className="block text-[10px] text-slate-400 font-normal">শাখা: {student.section}</span>
                    </td>
                    {(selectedSubjectForEntry === 'all'
                      ? classSubjects
                      : classSubjects.filter((s) => s.id === selectedSubjectForEntry)
                    ).map((sub) => {
                      const entry = marks.find(
                        (m) =>
                          m.studentId === student.id &&
                          m.subjectId === sub.id &&
                          m.examId === selectedExam
                      );
                      const compMarks = entry?.componentMarks || {
                        written: entry?.writtenMarks || 0,
                        continuous: entry?.continuousMarks || 0,
                      };
                      const total = entry?.totalMarks || 0;
                      const grade = entry?.grade || '-';

                      return (
                        <td key={sub.id} className="p-2 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {activeDistribution.components.map((comp) => {
                              const val = compMarks[comp.id] ?? 0;
                              return (
                                <div key={comp.id} className="flex flex-col items-center">
                                  <span className="text-[9px] text-slate-400 font-semibold mb-0.5">
                                    {comp.name.split(' ')[0]}
                                  </span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={comp.maxMarks}
                                    value={val || ''}
                                    placeholder="০"
                                    onChange={(e) =>
                                      handleComponentMarkChange(
                                        student.id,
                                        sub.id,
                                        comp.id,
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-12 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center font-bold text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                                  />
                                </div>
                              );
                            })}

                            {/* Computed Total & Grade Badge */}
                            <div className="flex flex-col items-center pl-1 border-l border-slate-200 dark:border-slate-700">
                              <span className="text-[9px] font-bold text-emerald-600 mb-0.5">মোট</span>
                              <div className="w-10 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                                {toBanglaNumber(total)}
                              </div>
                              <span
                                className={`text-[9px] font-black mt-0.5 ${
                                  grade === 'A+'
                                    ? 'text-emerald-600'
                                    : grade === 'F'
                                    ? 'text-rose-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                {grade}
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CUSTOM MARK DISTRIBUTION MANAGEMENT (Requirement 9) */}
      {/* ============================================================== */}
      {activeTab === 'distribution' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>কাস্টম পরীক্ষার নম্বর বণ্টন ব্যবস্থাপনা (Exam Marks Distribution)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রতিটি পরীক্ষার জন্য ইচ্ছামতো নৈর্ব্যক্তিক (MCQ), লিখিত (Written), সিটি (CT Exam), ব্যবহারিক বা শিখনকালীন উপাদানের নম্বর বণ্টন তৈরি ও সংরক্ষণ করুন।
              </p>
            </div>

            <button
              onClick={() => setIsCreatingDist(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন নম্বর বণ্টন তৈরি</span>
            </button>
          </div>

          {/* Form to Create / Add New Distribution */}
          {isCreatingDist && (
            <div className="bg-emerald-50/50 dark:bg-slate-900 rounded-3xl p-5 border-2 border-emerald-500/50 shadow-md animate-in fade-in space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>নতুন কাস্টম মূল্যায়ন বণ্টন ফর্ম (New Marks Breakdown Scheme)</span>
                </div>
                <button
                  onClick={() => setIsCreatingDist(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {distError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  {distError}
                </div>
              )}

              <form onSubmit={handleSaveNewDistribution} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বণ্টনের নাম / শিরোনাম *
                  </label>
                  <input
                    type="text"
                    value={newDistTitle}
                    onChange={(e) => setNewDistTitle(e.target.value)}
                    required
                    placeholder="যেমন: অর্ধ-বার্ষিকী পরীক্ষা মডেল (MCQ ৩০ + লিখিত ৫০ + CT ২০ = ১০০)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Dynamic Component Rows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      উপাদানসমূহের তালিকা ও পূর্ণমান
                    </label>
                    <button
                      type="button"
                      onClick={handleAddComponentRow}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ আরও উপাদান যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {newComponents.map((comp, idx) => (
                      <div
                        key={comp.id || idx}
                        className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center"
                      >
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={comp.name}
                            onChange={(e) => handleUpdateComponentRow(idx, 'name', e.target.value)}
                            placeholder="উপাদানের নাম (যেমন: MCQ / Written / CT)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">পূর্ণমান:</span>
                            <input
                              type="number"
                              min={1}
                              value={comp.maxMarks}
                              onChange={(e) => handleUpdateComponentRow(idx, 'maxMarks', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                            />
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">পাস:</span>
                            <input
                              type="number"
                              min={0}
                              value={comp.passMarks}
                              onChange={(e) => handleUpdateComponentRow(idx, 'passMarks', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                            />
                          </div>
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveComponentRow(idx)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    <span>
                      মোট পূর্ণমান হিসাব: {toBanglaNumber(newComponents.reduce((sum, c) => sum + Number(c.maxMarks || 0), 0))} নম্বর
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {newComponents.length} টি উপাদান
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingDist(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Existing Mark Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markDistributions.map((dist) => {
              const isSelected = activeDistId === dist.id;

              return (
                <div
                  key={dist.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {dist.title}
                      </h4>
                      <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        মোট পূর্ণমান: {toBanglaNumber(dist.totalMarks)}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white">
                        সক্রিয়
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-2.5 mb-3">
                    {dist.components.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-medium">{comp.name}</span>
                        <span className="font-bold">
                          {toBanglaNumber(comp.maxMarks)} (পাস: {toBanglaNumber(comp.passMarks)})
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setActiveDistId(dist.id);
                        setActiveTab('entry');
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>নম্বর এন্ট্রিতে ব্যবহার করুন</span>
                    </button>

                    {dist.id !== 'dist_std' && (
                      <button
                        onClick={() => deleteMarkDistribution(dist.id)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PRINTABLE PROGRESS CARD / REPORT CARD MODAL */}
      {/* ============================================================== */}
      {selectedStudentForCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 no-print">
              <div className="flex items-center gap-3">
                <h4 className="font-black text-base text-slate-900">শিখন অগ্রগতি প্রতিবেদন (Report Card)</h4>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setCardPages('1page')}
                    className={`px-3 py-1 rounded-md ${cardPages === '1page' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                  >
                    ১ পৃষ্ঠা ফরম্যাট
                  </button>
                  <button
                    onClick={() => setCardPages('2page')}
                    className={`px-3 py-1 rounded-md ${cardPages === '2page' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                  >
                    ২ পৃষ্ঠা বিস্তারিত ফরম্যাট
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForCard(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Container */}
            <div className="border-4 border-double border-emerald-800 p-6 rounded-xl bg-white text-slate-900 space-y-4">
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{settings.code}</p>
                <h2 className="text-2xl font-black text-emerald-900">{settings.name}</h2>
                <p className="text-xs text-slate-600">{settings.address}</p>
                <div className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                  শিখন অগ্রগতি প্রতিবেদন — {currentExam?.name} ({settings.currentSession})
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">শিক্ষার্থীর নাম:</span>
                  <strong>{selectedStudentForCard.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">শ্রেণি ও শাখা:</span>
                  <strong>
                    {classes.find((c) => c.id === selectedStudentForCard.classId)?.name} (শাখা: {selectedStudentForCard.section})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">শ্রেণি রোল:</span>
                  <strong>{toBanglaNumber(selectedStudentForCard.roll)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ভর্তি নং:</span>
                  <strong className="font-mono">{selectedStudentForCard.admissionNo}</strong>
                </div>
              </div>

              {/* Marks Table with Component Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-300 text-center">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-300">
                      <th className="p-2 border border-slate-300 text-left">বিষয়</th>
                      <th className="p-2 border border-slate-300 w-16">পূর্ণমান</th>
                      <th className="p-2 border border-slate-300">নম্বর উপাদান বণ্টন (Breakdown)</th>
                      <th className="p-2 border border-slate-300 w-20">মোট প্রাপ্ত</th>
                      <th className="p-2 border border-slate-300 w-16">লেটার গ্রেড</th>
                      <th className="p-2 border border-slate-300 w-16">জিপিএ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classSubjects.map((sub) => {
                      const m = marks.find(
                        (entry) =>
                          entry.studentId === selectedStudentForCard.id &&
                          entry.subjectId === sub.id &&
                          entry.examId === selectedExam
                      );
                      const total = m?.totalMarks || 0;
                      const grade = m?.grade || 'A+';
                      const gp = m?.gradePoint || 5.0;
                      const compMarks = m?.componentMarks || {};

                      return (
                        <tr key={sub.id} className="border-b border-slate-200">
                          <td className="p-2 border border-slate-300 text-left font-bold">{sub.name}</td>
                          <td className="p-2 border border-slate-300">{toBanglaNumber(sub.fullMarks || 100)}</td>
                          <td className="p-2 border border-slate-300 text-slate-700">
                            {Object.keys(compMarks).length > 0 ? (
                              <div className="flex items-center justify-center gap-2 text-[10px]">
                                {Object.entries(compMarks).map(([cKey, cVal]) => (
                                  <span key={cKey} className="bg-slate-100 px-1.5 py-0.5 rounded">
                                    {cKey}: <strong>{toBanglaNumber(cVal)}</strong>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                লিখিত: {toBanglaNumber(m?.writtenMarks || 0)} + শিখনকালীন: {toBanglaNumber(m?.continuousMarks || 0)}
                              </span>
                            )}
                          </td>
                          <td className="p-2 border border-slate-300 font-extrabold">{toBanglaNumber(total)}</td>
                          <td className="p-2 border border-slate-300 font-black text-emerald-800">{grade}</td>
                          <td className="p-2 border border-slate-300 font-bold">{toBanglaNumber(gp.toFixed(2))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs text-slate-700">
                <div className="border-t border-slate-400 pt-1 font-semibold">অভিভাবকের স্বাক্ষর</div>
                <div className="border-t border-slate-400 pt-1 font-semibold">শ্রেণি শিক্ষকের স্বাক্ষর</div>
                <div className="border-t border-slate-400 pt-1 font-semibold">প্রধান শিক্ষকের স্বাক্ষর ও সিল</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
