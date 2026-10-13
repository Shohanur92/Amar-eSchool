import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, TeacherLeaveType } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Printer,
  Filter,
  UserCheck,
  Calendar,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    students,
    classes,
    teachers,
    studentAttendance,
    markStudentAttendance,
    bulkMarkStudentAttendance,
    teacherAttendance,
    markTeacherAttendance,
    sendSms,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'monthly_report'>('student');
  const [selectedClass, setSelectedClass] = useState<string>(classes[2]?.id || 'c_1');
  const [selectedSection, setSelectedSection] = useState<string>('ক');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [smsFeedback, setSmsFeedback] = useState<string>('');

  const classStudents = students.filter(
    (s) => s.classId === selectedClass && (selectedSection === 'all' || s.section === selectedSection) && s.status === 'active'
  );

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const rec = studentAttendance.find((a) => a.studentId === studentId && a.date === selectedDate);
    return rec ? rec.status : 'present';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const st = students.find((s) => s.id === studentId);
    markStudentAttendance(studentId, selectedDate, status, selectedClass, st?.section || 'ক');
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    bulkMarkStudentAttendance(selectedDate, selectedClass, selectedSection, status);
  };

  const handleSendAbsentSms = async (studentName: string, guardianPhone: string, roll: number) => {
    const msg = `শ্রদ্ধেয় অভিভাবক, আপনার সন্তান ${studentName} (রোল: ${toBanglaNumber(roll)}) আজ ${selectedDate} তারিখে বিদ্যালয়ে অনুপস্থিত। অনুপস্থিতির কারণ অবগত করার অনুরোধ রইল। - ${settings.name}`;
    await sendSms(guardianPhone, 'অভিভাবক', msg, 'attendance', studentName);
    setSmsFeedback(`${studentName} এর অভিভাবকের নম্বরে (${guardianPhone}) অনুপস্থিতির এসএমএস পাঠানো হয়েছে!`);
    setTimeout(() => setSmsFeedback(''), 3000);
  };

  const handleSendAllAbsentSms = async () => {
    let sentCount = 0;
    for (const student of classStudents) {
      if (getStudentStatus(student.id) === 'absent') {
        const msg = `শ্রদ্ধেয় অভিভাবক, আপনার সন্তান ${student.name} (রোল: ${toBanglaNumber(student.roll)}) আজ বিদ্যালয়ে অনুপস্থিত। - ${settings.name}`;
        await sendSms(student.guardianPhone, 'অভিভাবক', msg, 'attendance', student.name);
        sentCount++;
      }
    }
    setSmsFeedback(`সকল অনুপস্থিত (${toBanglaNumber(sentCount)} জন) শিক্ষার্থীর অভিভাবকের কাছে এসএমএস পাঠানো হয়েছে!`);
    setTimeout(() => setSmsFeedback(''), 3500);
  };

  // Stats for current class & date
  const presentCount = classStudents.filter((s) => getStudentStatus(s.id) === 'present').length;
  const absentCount = classStudents.filter((s) => getStudentStatus(s.id) === 'absent').length;
  const leaveCount = classStudents.filter((s) => getStudentStatus(s.id) === 'leave').length;
  const lateCount = classStudents.filter((s) => getStudentStatus(s.id) === 'late').length;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('student')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'student'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>দৈনিক শিক্ষার্থী হাজিরা</span>
        </button>

        <button
          onClick={() => setActiveTab('teacher')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'teacher'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>শিক্ষক হাজিরা ও ছুটির রেজিস্টার</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly_report')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'monthly_report'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>মাসিক ও বাৎসরিক হাজিরা বিবরণী</span>
        </button>
      </div>

      {smsFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{smsFeedback}</span>
        </div>
      )}

      {/* TAB 1: STUDENT ATTENDANCE */}
      {activeTab === 'student' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">তারিখ</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">শ্রেণি</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">শাখা</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="all">সকল শাখা</option>
                  <option value="ক">শাখা: ক</option>
                  <option value="খ">শাখা: খ</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
              >
                সবাই উপস্থিত
              </button>

              <button
                onClick={handleSendAllAbsentSms}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>অনুপস্থিতদের এসএমএস পাঠান</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                title="প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">উপস্থিত</span>
              <p className="text-xl font-black text-emerald-800 dark:text-emerald-200">{toBanglaNumber(presentCount)}</p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">অনুপস্থিত</span>
              <p className="text-xl font-black text-rose-800 dark:text-rose-200">{toBanglaNumber(absentCount)}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">ছুটি (Leave)</span>
              <p className="text-xl font-black text-amber-800 dark:text-amber-200">{toBanglaNumber(leaveCount)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">বিলম্ব (Late)</span>
              <p className="text-xl font-black text-blue-800 dark:text-blue-200">{toBanglaNumber(lateCount)}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3 text-center w-14">রোল</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">অভিভাবকের মোবাইল</th>
                  <th className="p-3 text-center">উপস্থিতি স্থিতি (Toggle Status)</th>
                  <th className="p-3 text-right">এসএমএস নোটিফিকেশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {classStudents.map((student) => {
                  const status = getStudentStatus(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-center font-bold">{toBanglaNumber(student.roll)}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 dark:text-white">{student.name}</div>
                        <div className="text-[10px] text-slate-400">শাখা: {student.section}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300">
                        {student.guardianPhone}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 gap-1">
                          <button
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                            }`}
                          >
                            উপস্থিত
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                            }`}
                          >
                            অনুপস্থিত
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'leave')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              status === 'leave'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                            }`}
                          >
                            ছুটি
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              status === 'late'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                            }`}
                          >
                            বিলম্ব
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {status === 'absent' ? (
                          <button
                            onClick={() => handleSendAbsentSms(student.name, student.guardianPhone, student.roll)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold border border-purple-200"
                          >
                            <Send className="w-3 h-3" />
                            <span>অনুপস্থিতি এসএমএস</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">প্রযোজ্য নয়</span>
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

      {/* TAB 2: TEACHER ATTENDANCE */}
      {activeTab === 'teacher' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                দৈনিক শিক্ষক উপস্থিতি ও ছুটি রেজিস্টার ({selectedDate})
              </h3>
              <p className="text-xs text-slate-500">নৈমিত্তিক ছুটি (CL), চিকিৎসা ছুটি (ML) এবং নিয়মিত হাজিরা</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3">শিক্ষকের নাম</th>
                  <th className="p-3">পদবী</th>
                  <th className="p-3">দায়িত্ব</th>
                  <th className="p-3 text-center">উপস্থিতি স্থিতি</th>
                  <th className="p-3">মন্তব্য / ছুটির কারণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teachers.map((teacher) => {
                  const tatt = teacherAttendance.find((t) => t.teacherId === teacher.id && t.date === selectedDate);
                  const currentStatus = tatt ? tatt.status : 'present';

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{teacher.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{teacher.designation}</td>
                      <td className="p-3">
                        {teacher.isClassTeacher ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            শ্রেণি শিক্ষক
                          </span>
                        ) : (
                          <span className="text-slate-400">বিষয় শিক্ষক</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={currentStatus}
                          onChange={(e) => markTeacherAttendance(teacher.id, selectedDate, e.target.value as TeacherLeaveType)}
                          className="px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                        >
                          <option value="present">উপস্থিত (Present)</option>
                          <option value="cl">নৈমিত্তিক ছুটি (CL)</option>
                          <option value="ml">চিকিৎসা ছুটি (ML)</option>
                          <option value="el">অর্জিত ছুটি (EL)</option>
                          <option value="absent">অনুপস্থিত (Absent)</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-500">{tatt?.remarks || 'নিয়মিত দায়িত্ব পালন'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MONTHLY REGISTER REPORT */}
      {activeTab === 'monthly_report' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                মাসিক হাজিরা রেজিস্টার শিট (মার্চ ২০২৬)
              </h3>
              <p className="text-xs text-slate-500">সরকারি প্রাথমিক বিদ্যালয়ের নির্ধারিত হাজিরা রেজিস্টার ছক</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>রেজিস্টার প্রিন্ট করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-300 dark:border-slate-700 text-center">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <th className="p-2 border border-slate-300 w-12">রোল</th>
                  <th className="p-2 border border-slate-300 text-left w-48">শিক্ষার্থীর নাম</th>
                  {[...Array(15)].map((_, i) => (
                    <th key={i} className="p-1 border border-slate-300 w-8">
                      {toBanglaNumber(i + 1)}
                    </th>
                  ))}
                  <th className="p-2 border border-slate-300 w-16">মোট দিন</th>
                  <th className="p-2 border border-slate-300 w-16">হার (%)</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 font-bold">{toBanglaNumber(s.roll)}</td>
                    <td className="p-2 border border-slate-300 text-left font-bold">{s.name}</td>
                    {[...Array(15)].map((_, i) => {
                      const isWeekend = i === 5 || i === 12; // Fridays
                      const isAbsent = idx === 2 && i === 2; // student 3 absent
                      return (
                        <td
                          key={i}
                          className={`p-1 border border-slate-300 font-bold text-[10px] ${
                            isWeekend ? 'bg-slate-200 text-slate-500' : isAbsent ? 'text-rose-600 bg-rose-50' : 'text-emerald-600'
                          }`}
                        >
                          {isWeekend ? 'ছুটি' : isAbsent ? 'অ' : 'উ'}
                        </td>
                      );
                    })}
                    <td className="p-2 border border-slate-300 font-bold">{toBanglaNumber(13)}</td>
                    <td className="p-2 border border-slate-300 font-bold text-emerald-600">
                      {toBanglaNumber(idx === 2 ? 92 : 100)}%
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
