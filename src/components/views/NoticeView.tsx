import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice } from '../../types';
import {
  Bell,
  Plus,
  Printer,
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  X,
  Share2
} from 'lucide-react';

export const NoticeView: React.FC = () => {
  const { notices, addNotice, deleteNotice, settings, currentUser, setCurrentView } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printableNotice, setPrintableNotice] = useState<Notice | null>(null);

  const [form, setForm] = useState<Partial<Notice>>({
    title: '',
    content: '',
    category: 'general',
    target: 'all',
    date: new Date().toISOString().split('T')[0],
    publishedBy: currentUser?.name || 'প্রধান শিক্ষক',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    addNotice({
      title: form.title,
      content: form.content,
      category: form.category as any,
      target: form.target as any,
      date: form.date || new Date().toISOString().split('T')[0],
      publishedBy: form.publishedBy || 'প্রধান শিক্ষক',
    });

    setIsModalOpen(false);
    setForm({
      title: '',
      content: '',
      category: 'general',
      target: 'all',
      date: new Date().toISOString().split('T')[0],
      publishedBy: currentUser?.name || 'প্রধান শিক্ষক',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>বিদ্যালয় নোটিশ বোর্ড ও অফিশিয়াল বিজ্ঞপ্তি</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            নোটিশ প্রকাশ ও স্কুলের প্রাতিষ্ঠানিক লেটারহেডে A4 ফরম্যাটে প্রিন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('calendar')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>একাডেমিক ক্যালেন্ডার</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নোটিশ প্রকাশ করুন</span>
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                  n.category === 'exam'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : n.category === 'holiday'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {n.category === 'exam' ? 'পরীক্ষা' : n.category === 'holiday' ? 'ছুটি' : 'বিজ্ঞপ্তি'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">{n.date}</span>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
              {n.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {n.content}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">স্বাক্ষরকারী: {n.publishedBy}</span>
              <button
                onClick={() => setPrintableNotice(n)}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>অফিসিয়াল প্রিন্ট</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-sm text-slate-900 dark:text-white mb-4">
              নতুন প্রাতিষ্ঠানিক নোটিশ প্রকাশ
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">নোটিশের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="যেমন: ১ম প্রান্তিক মূল্যায়ন ২০২৬ এর রুটিন সংক্রান্ত"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ক্যাটাগরি</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="general">সাধারণ বিজ্ঞপ্তি</option>
                    <option value="exam">পরীক্ষা সংক্রান্ত</option>
                    <option value="holiday">ছুটির নোটিশ</option>
                    <option value="urgent">জরুরি নোটিশ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">প্রাপক</label>
                  <select
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="all">সবার জন্য</option>
                    <option value="students">শিক্ষার্থীদের জন্য</option>
                    <option value="guardians">অভিভাবকদের জন্য</option>
                    <option value="teachers">শিক্ষকবৃন্দের জন্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">নোটিশের মূল বক্তব্য *</label>
                <textarea
                  rows={5}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন..."
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
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL NOTICE MODAL */}
      {printableNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end gap-2 mb-4 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setPrintableNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Notice Sheet */}
            <div className="border-4 border-double border-emerald-900 p-8 rounded-xl bg-white text-slate-900 space-y-6">
              <div className="text-center border-b-2 border-emerald-900 pb-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{settings.code}</p>
                <h1 className="text-2xl font-black text-emerald-950 mt-0.5">{settings.name}</h1>
                <p className="text-xs text-slate-600">{settings.address}</p>
                <div className="inline-block mt-3 px-5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                  অফিসিয়াল নোটিশ
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>স্মারক নং: নোটিশ/২০২৬/{Math.floor(100 + Math.random() * 900)}</span>
                <span>তারিখ: {printableNotice.date}</span>
              </div>

              <h2 className="text-center text-base font-black text-slate-900 underline underline-offset-4">
                {printableNotice.title}
              </h2>

              <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line text-justify indent-8">
                {printableNotice.content}
              </p>

              <div className="pt-16 flex justify-between items-end text-xs">
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-emerald-800 rounded-full flex items-center justify-center text-[9px] font-bold text-emerald-900">
                    বিদ্যালয় সিল
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-signature font-bold text-slate-800 text-sm mb-1">Motiur</div>
                  <div className="border-t border-slate-800 pt-1 w-36 font-bold">
                    <p>{printableNotice.publishedBy}</p>
                    <p className="text-[10px] text-slate-500">{settings.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
