import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  X,
  Check,
  IdCard,
  Printer,
  ArrowRight,
  Sparkles,
  PhoneCall,
  MapPin,
  Calendar,
  FileSpreadsheet,
  Camera,
  Image,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    promoteStudents,
    settings,
    currentUser
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [parsedImportStudents, setParsedImportStudents] = useState<Partial<Student>[]>([]);
  const [importErrorMsg, setImportErrorMsg] = useState<string>('');
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');

  // Promotion state
  const [promoteFrom, setPromoteFrom] = useState<string>(classes[2]?.id || 'c_1');
  const [promoteTo, setPromoteTo] = useState<string>(classes[3]?.id || 'c_2');
  const [promotionSuccessMsg, setPromotionSuccessMsg] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    nameEn: '',
    classId: classes[2]?.id || 'c_1',
    section: 'ক',
    roll: 1,
    gender: 'ছেলে',
    dob: '2018-01-01',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    address: '',
    bloodGroup: 'A+',
    birthRegNo: '',
    admissionNo: `২০২৬-${Math.floor(100 + Math.random() * 900)}`,
    admissionDate: new Date().toISOString().split('T')[0],
    photoUrl: '',
    isStipendBeneficiary: true,
    status: 'active',
  });

  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.roll).includes(searchQuery) ||
      toBanglaNumber(s.roll).includes(searchQuery) ||
      s.guardianPhone.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      nameEn: '',
      classId: selectedClass !== 'all' ? selectedClass : (classes[2]?.id || 'c_1'),
      section: 'ক',
      roll: (students.filter(s => s.classId === (selectedClass !== 'all' ? selectedClass : 'c_1')).length + 1),
      gender: 'ছেলে',
      dob: '2018-01-01',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      address: '',
      bloodGroup: 'A+',
      birthRegNo: '',
      admissionNo: `২০২৬-${Math.floor(100 + Math.random() * 900)}`,
      admissionDate: new Date().toISOString().split('T')[0],
      isStipendBeneficiary: true,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData as Omit<Student, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" শিক্ষার্থীর তথ্য মুছে ফেলতে চান?`)) {
      deleteStudent(id);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ ২ মেগাবাইট এর কম হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, photoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSampleCSV = () => {
    const headers = ['রোল,ভর্তি নং,নাম,ইংরেজি নাম,শ্রেণি,শাখা,লিঙ্গ,অভিভাবকের মোবাইল,পিতার নাম,মাতার নাম,ঠিকানা,জন্ম নিবন্ধন'];
    const sampleRows = [
      '"১","২০২৬-১০১","তাহমিদ হাসান","Tahmid Hasan","৫ম শ্রেণি","ক","ছেলে","০১৯৩৩-৪৪৫৫৬৬","জাহিদুল ইসলাম","ফারহানা ইয়াসমিন","মিরপুর-১০, ঢাকা","২০১৪২৬৯২৬১১০১১২৩৪"',
      '"২","২০২৬-১০২","জান্নাতুল ফেরদৌস","Jannatul Ferdous","৫ম শ্রেণি","ক","মেয়ে","০১৭১১-২২৩৩৪৪","মো: মোশাররফ হোসেন","সালমা বেগম","মিরপুর-১২, ঢাকা","২০১৪২৬৯২৬১১০১১২৩৫"',
      '"৩","২০২৬-১০৩","আব্দুল্লাহ আল নোমান","Abdullah Al Noman","৪র্থ শ্রেণি","খ","ছেলে","০১৮১২-৩৪৫৬৭৮","রফিকুল ইসলাম","রোকেয়া বেগম","পল্লবী, ঢাকা","২০১৫২৬৯২৬১১০১১২৩৬"'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...sampleRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'sample_students_template.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileSelectForImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setImportErrorMsg('CSV ফাইলে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি!');
          return;
        }

        const parseLine = (line: string): string[] => {
          const result: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
              inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
              result.push(cur.trim().replace(/^"|"$/g, ''));
              cur = '';
            } else {
              cur += ch;
            }
          }
          result.push(cur.trim().replace(/^"|"$/g, ''));
          return result;
        };

        const parsed: Partial<Student>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = parseLine(lines[i]);
          if (cols.length < 3 || !cols[2]) continue;

          const rollVal = parseInt(cols[0]?.replace(/[^0-9]/g, '')) || (students.length + i);
          const admVal = cols[1] || `২০২৬-${Math.floor(100 + Math.random() * 900)}`;
          const nameVal = cols[2];
          const nameEnVal = cols[3] || nameVal;
          const classStr = cols[4] || '';

          let matchedClassId = classes[2]?.id || 'c_1';
          const foundCls = classes.find((c) => c.name.includes(classStr) || classStr.includes(c.name));
          if (foundCls) matchedClassId = foundCls.id;
          else if (selectedClass !== 'all') matchedClassId = selectedClass;

          const sectionVal = cols[5] || 'ক';
          const genderVal = (cols[6]?.includes('মেয়ে') ? 'মেয়ে' : 'ছেলে') as 'ছেলে' | 'মেয়ে';
          const phoneVal = cols[7] || '০১৭১১-০০০০০০';
          const fatherVal = cols[8] || '';
          const motherVal = cols[9] || '';
          const addressVal = cols[10] || '';
          const regVal = cols[11] || '';

          parsed.push({
            id: `s_imp_${Date.now()}_${i}`,
            roll: rollVal,
            admissionNo: admVal,
            name: nameVal,
            nameEn: nameEnVal,
            classId: matchedClassId,
            section: sectionVal,
            gender: genderVal,
            guardianPhone: phoneVal,
            fatherName: fatherVal,
            motherName: motherVal,
            address: addressVal,
            birthRegNo: regVal,
            dob: '2018-01-01',
            admissionDate: new Date().toISOString().split('T')[0],
            isStipendBeneficiary: true,
            status: 'active'
          });
        }

        if (parsed.length === 0) {
          setImportErrorMsg('সঠিক ফরম্যাটের কোনো রেকর্ড শনাক্ত করা যায়নি। অনুগ্রহ করে নমুনা CSV ফরম্যাট অনুসরণ করুন।');
        } else {
          setParsedImportStudents(parsed);
        }
      } catch (err) {
        console.error(err);
        setImportErrorMsg('CSV ফাইল পার্স করতে ত্রুটি হয়েছে। অনুগ্রহ করে ফাইলের ফরম্যাট যাচাই করুন।');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleConfirmImport = () => {
    if (parsedImportStudents.length === 0) return;
    for (const st of parsedImportStudents) {
      addStudent(st as Omit<Student, 'id'>);
    }
    setImportSuccessMsg(`সফলভাবে ${toBanglaNumber(parsedImportStudents.length)} জন শিক্ষার্থীর তথ্য ইমপোর্ট করা হয়েছে!`);
    setTimeout(() => {
      setImportSuccessMsg('');
      setParsedImportStudents([]);
      setIsImportModalOpen(false);
    }, 1800);
  };

  const handleExportCSV = () => {
    const headers = ['রোল,ভর্তি নং,নাম,ইংরেজি নাম,শ্রেণি,শাখা,লিঙ্গ,অভিভাবকের মোবাইল,পিতার নাম,মাতার নাম,ঠিকানা,জন্ম নিবন্ধন'];
    const rows = filteredStudents.map((s) => {
      const clsName = classes.find((c) => c.id === s.classId)?.name || '';
      return `"${s.roll}","${s.admissionNo}","${s.name}","${s.nameEn}","${clsName}","${s.section}","${s.gender}","${s.guardianPhone}","${s.fatherName}","${s.motherName}","${s.address}","${s.birthRegNo}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shiksharthi_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    promoteStudents(promoteFrom, promoteTo);
    const fromName = classes.find((c) => c.id === promoteFrom)?.name;
    const toName = classes.find((c) => c.id === promoteTo)?.name;
    setPromotionSuccessMsg(`সফলভাবে ${fromName} এর সকল শিক্ষার্থীকে ${toName} এ প্রমোশন দেওয়া হয়েছে!`);
    setTimeout(() => {
      setPromotionSuccessMsg('');
      setIsPromoteModalOpen(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>শিক্ষার্থী ব্যবস্থাপনা ও ভর্তি রেজিস্টার</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            মোট শিক্ষার্থী: {toBanglaNumber(students.length)} জন (প্লে থেকে ৫ম শ্রেণি)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Sample CSV */}
          <button
            onClick={handleDownloadSampleCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            title="নমুনা এক্সেল/সিএসভি ফরম্যাট ডাউনলোড করুন"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>নমুনা CSV</span>
          </button>

          {/* Import CSV */}
          <button
            onClick={() => {
              setParsedImportStudents([]);
              setImportErrorMsg('');
              setIsImportModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>CSV ইমপোর্ট</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>শ্রেণি প্রমোশন</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন শিক্ষার্থী ভর্তি</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Class Filter */}
        <div className="w-full sm:w-60 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">সকল শ্রেণি (সবগুলো দেখুন)</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.nameEn})
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="w-full flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, রোল, অভিভাবকের মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <th className="p-3 text-center w-14">রোল</th>
                <th className="p-3">শিক্ষার্থীর নাম</th>
                <th className="p-3">শ্রেণি ও শাখা</th>
                <th className="p-3">পিতা ও মাতার নাম</th>
                <th className="p-3">অভিভাবকের মোবাইল</th>
                <th className="p-3">উপবৃত্তি স্ট্যাটাস</th>
                <th className="p-3 text-center">আইডি কার্ড</th>
                <th className="p-3 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const cls = classes.find((c) => c.id === student.classId);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3 text-center font-bold text-slate-900 dark:text-white">
                        <span className="w-7 h-7 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                          {toBanglaNumber(student.roll)}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border border-emerald-500 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {student.nameEn} • {student.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {cls?.name || 'অনির্ধারিত'}
                        </span>
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          শাখা: {student.section}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {student.fatherName || '—'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          মাতা: {student.motherName || '—'}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                        {student.guardianPhone}
                      </td>

                      <td className="p-3">
                        {student.isStipendBeneficiary ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            উপবৃত্তি প্রাপক
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            সাধারণ
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => setIdCardStudent(student)}
                          className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold flex items-center justify-center gap-1 mx-auto"
                        >
                          <IdCard className="w-3.5 h-3.5" />
                          <span>আইডি</span>
                        </button>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="সম্পাদনা"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    কোন শিক্ষার্থী খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Admission / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>{editingStudent ? 'শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী ভর্তি ফরম'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Student Photo Attachment Box */}
              <div className="p-3.5 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-24 rounded-xl border-2 border-emerald-500 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs relative">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                      <span className="text-[9px] block">ছবি নির্বাচন করুন</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                    শিক্ষার্থীর পাসপোর্ট সাইজ ছবি (প্রবেশপত্র ও আইডি কার্ডে সংযুক্ত হবে)
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    এখানে ছবি যুক্ত করলে স্বয়ংক্রিয়ভাবে প্রবেশপত্র, ডিজিটাল আইডি কার্ড এবং প্রশংসাপত্রে সংযুক্ত হবে।
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.photoUrl ? 'ছবি পরিবর্তন' : 'ছবি আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: '' })}
                        className="px-2.5 py-1.5 rounded-xl border border-rose-300 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold"
                      >
                        ছবি মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শিক্ষার্থীর নাম (বাংলায়) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="যেমন: মো: আব্দুল্লাহ"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn || ''}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Md. Abdullah"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণি *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শাখা *
                  </label>
                  <input
                    type="text"
                    value={formData.section || 'ক'}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণি রোল *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.roll || 1}
                    onChange={(e) => setFormData({ ...formData, roll: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    লিঙ্গ *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ছেলে">ছেলে</option>
                    <option value="মেয়ে">মেয়ে</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    অভিভাবকের মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone || ''}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    জন্ম তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.dob || '2018-01-01'}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={formData.bloodGroup || 'A+'}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জন্ম নিবন্ধন সনদ নম্বর (১৭ ডিজিট)
                </label>
                <input
                  type="text"
                  value={formData.birthRegNo || ''}
                  onChange={(e) => setFormData({ ...formData, birthRegNo: e.target.value })}
                  placeholder="২০১৫২৬৯২৬১১০XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বর্তমান ঠিকানা
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="গ্রাম/রোড, পোস্ট অফিস, থানা, জেলা"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="stipendCheck"
                  checked={formData.isStipendBeneficiary}
                  onChange={(e) => setFormData({ ...formData, isStipendBeneficiary: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="stipendCheck" className="font-bold text-slate-700 dark:text-slate-300">
                  উপবৃত্তি সুবিধাভোগী তালিকাভুক্ত শিক্ষার্থী
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingStudent ? 'হালনাগাদ সম্পন্ন করুন' : 'ভর্তি নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Promotion Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setIsPromoteModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  স্বয়ংক্রিয় শ্রেণি প্রমোশন
                </h3>
                <p className="text-xs text-slate-500">পরবর্তী সেশনে উত্তীর্ণ করার টুল</p>
              </div>
            </div>

            {promotionSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center">
                {promotionSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePromote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বর্তমান শ্রেণি:
                </label>
                <select
                  value={promoteFrom}
                  onChange={(e) => setPromoteFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({students.filter((s) => s.classId === cls.id).length} জন শিক্ষার্থী)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center py-1">
                <ArrowRight className="w-5 h-5 text-purple-600 mx-auto" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উত্তীর্ণ বা প্রমোটেড শ্রেণি:
                </label>
                <select
                  value={promoteTo}
                  onChange={(e) => setPromoteTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                ⚠️ নিশ্চিতকরণ: উক্ত শ্রেণির সকল সক্রিয় শিক্ষার্থীর শ্রেণি এক ক্লিকে আপডেট করা হবে।
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
              >
                প্রমোশন নিশ্চিত করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal Preview */}
      {idCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setIdCardStudent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4 no-print">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">ডিজিটাল আইডি কার্ড প্রিভিউ</h4>
            </div>

            {/* Printable ID Card */}
            <div className="w-full rounded-2xl border-2 border-emerald-600 bg-white text-slate-900 overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-3 text-center text-white">
                <p className="text-[10px] tracking-wide uppercase opacity-80">{settings.code}</p>
                <h5 className="font-black text-xs">{settings.name}</h5>
                <p className="text-[9px] text-emerald-100">{settings.address}</p>
              </div>

              <div className="p-4 text-center">
                {idCardStudent.photoUrl ? (
                  <div className="w-20 h-24 mx-auto rounded-xl overflow-hidden border-2 border-emerald-500 mb-2 shadow-xs bg-slate-50">
                    <img
                      src={idCardStudent.photoUrl}
                      alt={idCardStudent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 border-2 border-emerald-500 flex items-center justify-center font-bold text-2xl text-emerald-700 mb-2">
                    {idCardStudent.name.charAt(0)}
                  </div>
                )}

                <h4 className="font-extrabold text-sm text-slate-900">{idCardStudent.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{idCardStudent.nameEn}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-left bg-slate-50 p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px] block">শ্রেণি:</span>
                    <strong className="text-slate-800">
                      {classes.find((c) => c.id === idCardStudent.classId)?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">রোল নং:</span>
                    <strong className="text-slate-800">{toBanglaNumber(idCardStudent.roll)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">রক্তের গ্রুপ:</span>
                    <strong className="text-rose-600">{idCardStudent.bloodGroup || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">জরুরি ফোন:</span>
                    <strong className="text-slate-800 font-mono text-[10px]">{idCardStudent.guardianPhone}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">সেশন: ২০২৬</span>
                  <div className="text-center">
                    <div className="font-signature font-bold text-slate-700 text-xs">Motiur</div>
                    <span className="text-slate-500 border-t border-slate-300 pt-0.5 block">প্রধান শিক্ষক</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CSV Import Modal with Sample Template and Live Sample Preview */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    CSV ফাইল থেকে শিক্ষার্থী তথ্য ইমপোর্ট করুন
                  </h3>
                  <p className="text-xs text-slate-500">
                    এক্সেল (Excel) বা স্প্রেডশিট থেকে সকল শিক্ষার্থীর তথ্য এক ক্লিকে আপলোড করুন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction & Sample Download Banner */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>নমুনা ফরম্যাট নির্দেশিকা</span>
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  ভুল এড়াতে প্রথমে নিচের নমুনা CSV ডাউনলোড করে হুবহু কলাম ফরম্যাটে আপনার শিক্ষার্থীদের ডাটা পেস্ট করুন।
                </p>
              </div>

              <button
                onClick={handleDownloadSampleCSV}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Download className="w-4 h-4" />
                <span>নমুনা CSV ডাউনলোড</span>
              </button>
            </div>

            {/* Live Visual Sample Table */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                নমুনা CSV ফরম্যাট প্রিভিউ (সঠিক কলাম বিন্যাস):
              </span>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">রোল</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">ভর্তি নং</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">নাম</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">ইংরেজি নাম</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">শ্রেণি</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700"> শাখা</th>
                      <th className="p-2 border-r border-slate-200 dark:border-slate-700">লিঙ্গ</th>
                      <th className="p-2">মোবাইল</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                    <tr>
                      <td className="p-2 font-mono">১</td>
                      <td className="p-2 font-mono">২০২৬-১০১</td>
                      <td className="p-2 font-bold text-slate-900 dark:text-slate-200">তাহমিদ হাসান</td>
                      <td className="p-2">Tahmid Hasan</td>
                      <td className="p-2">৫ম শ্রেণি</td>
                      <td className="p-2">ক</td>
                      <td className="p-2">ছেলে</td>
                      <td className="p-2 font-mono">০১৯৩৩-৪৪৫৫৬৬</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">২</td>
                      <td className="p-2 font-mono">২০২৬-১০২</td>
                      <td className="p-2 font-bold text-slate-900 dark:text-slate-200">জান্নাতুল ফেরদৌস</td>
                      <td className="p-2">Jannatul Ferdous</td>
                      <td className="p-2">৫ম শ্রেণি</td>
                      <td className="p-2">ক</td>
                      <td className="p-2">মেয়ে</td>
                      <td className="p-2 font-mono">০১৭১১-২২৩৩৪৪</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* File Upload Drop Area */}
            <div className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs">
                <label className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                  <span>আপনার তৈরি করা CSV ফাইল নির্বাচন করুন</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileSelectForImport}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">UTF-8 এনকোডেড .csv ফাইল সাপোর্ট করে</p>
              </div>
            </div>

            {/* Error Message */}
            {importErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importErrorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {importSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedImportStudents.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    ✓ মোট {toBanglaNumber(parsedImportStudents.length)} জন শিক্ষার্থীর তথ্য শনাক্ত করা হয়েছে:
                  </span>
                  <span className="text-slate-400 text-[11px]">নিচের প্রিভিউ যাচাই করুন</span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold sticky top-0">
                        <th className="p-2">রোল</th>
                        <th className="p-2">নাম</th>
                        <th className="p-2">শ্রেণি</th>
                        <th className="p-2">শাখা</th>
                        <th className="p-2">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedImportStudents.slice(0, 10).map((st, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <td className="p-2 font-mono font-bold">{toBanglaNumber(st.roll || i + 1)}</td>
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{st.name}</td>
                          <td className="p-2">{classes.find((c) => c.id === st.classId)?.name}</td>
                          <td className="p-2">{st.section}</td>
                          <td className="p-2 font-mono">{st.guardianPhone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedImportStudents.length > 10 && (
                    <div className="p-2 text-center text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                      ... আরও {toBanglaNumber(parsedImportStudents.length - 10)} জন শিক্ষার্থী অন্তর্ভুক্ত রয়েছে
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setParsedImportStudents([])}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    পুনরায় নির্বাচন
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    ইমপোর্ট নিশ্চিত করুন ({toBanglaNumber(parsedImportStudents.length)} জন)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
