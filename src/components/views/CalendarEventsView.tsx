import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolEvent } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Calendar,
  CalendarDays,
  Plus,
  Trash2,
  Edit,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  BookOpen,
  Award,
  Users,
  X,
  Check,
  Download
} from 'lucide-react';

const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BENGALI_DAYS = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];

export const CalendarEventsView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, settings } = useApp();

  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // 0-indexed (e.g. 0 = January)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<SchoolEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    endDate: '',
    category: 'holiday',
    isHoliday: true,
    description: '',
    target: 'all'
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleOpenAdd = (defaultDate?: string) => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: defaultDate || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
      endDate: '',
      category: 'holiday',
      isHoliday: true,
      description: '',
      target: 'all'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: SchoolEvent) => {
    setEditingEvent(ev);
    setFormData(ev);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${title}" ইভেন্টটি মুছে ফেলতে চান?`)) {
      deleteEvent(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent({
        title: formData.title,
        date: formData.date,
        endDate: formData.endDate || undefined,
        category: formData.category as any || 'other',
        isHoliday: !!formData.isHoliday,
        description: formData.description,
        target: formData.target as any || 'all'
      });
    }

    setIsModalOpen(false);
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Saturday-aligned first day of month (0 = Saturday, ..., 6 = Friday)
  const firstDayJs = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 6 = Saturday
  const firstDayBengali = (firstDayJs + 1) % 7; // Align to Saturday: Sat=0, Sun=1, ..., Fri=6

  const calendarDays = [];
  for (let i = 0; i < firstDayBengali; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Filtered events
  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'holidays') return ev.isHoliday;
    return ev.category === selectedCategory;
  });

  // Current month's events
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const currentMonthEvents = events.filter((ev) => {
    const evDate = ev.date.replace(/[^0-9-]/g, '');
    return evDate.startsWith(currentMonthPrefix);
  });

  const getEventsForDay = (day: number) => {
    const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((ev) => {
      const cleanDate = ev.date.replace(/[^0-9-]/g, '');
      const cleanEndDate = ev.endDate ? ev.endDate.replace(/[^0-9-]/g, '') : null;
      if (cleanDate === dayStr) return true;
      if (cleanEndDate && cleanDate <= dayStr && cleanEndDate >= dayStr) return true;
      return false;
    });
  };

  const getCategoryBadge = (category: string, isHoliday: boolean) => {
    if (isHoliday) {
      return {
        bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        label: 'সাধারণ ছুটি'
      };
    }
    switch (category) {
      case 'exam':
        return {
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          label: 'পরীক্ষা'
        };
      case 'national':
        return {
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          label: 'জাতীয় দিবস'
        };
      case 'sports':
        return {
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          label: 'ক্রীড়া ও উৎসব'
        };
      case 'cultural':
        return {
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          label: 'সাংস্কৃতিক'
        };
      case 'meeting':
        return {
          bg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          label: 'সভা/মিটিং'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          label: 'ইভেন্ট'
        };
    }
  };

  const handleExportEventsCSV = () => {
    const headers = ['শিরোনাম,তারিখ,শেষ তারিখ,ধরণ,ছুটি কি না,বিবরণ'];
    const rows = filteredEvents.map((ev) => {
      return `"${ev.title}","${ev.date}","${ev.endDate || ''}","${ev.category}","${ev.isHoliday ? 'হ্যাঁ' : 'না'}","${ev.description || ''}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `academic_calendar_events_${currentYear}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>মাসিক একাডেমিক ক্যালেন্ডার ও ইভেন্ট ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            শিক্ষাবর্ষ {toBanglaNumber(currentYear)} — মোট নির্ধারিত ইভেন্ট ও ছুটি: {toBanglaNumber(events.length)} টি
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportEventsCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV ডাউনলোড</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>প্রিন্ট করুন</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ইভেন্ট / ছুটি যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Printable Heading (Only visible in Print) */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-black text-slate-900">{settings.name}</h1>
        <p className="text-xs text-slate-600">{settings.address} | {settings.code}</p>
        <h2 className="text-base font-bold text-slate-800 mt-2">
          বার্ষিক একাডেমিক ক্যালেন্ডার ও ছুটির তালিকা — {toBanglaNumber(currentYear)}
        </h2>
      </div>

      {/* Main Grid: Calendar on Left, Event List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Month Navigator & Interactive Calendar Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          {/* Month Header Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {BENGALI_MONTHS[currentMonth]} {toBanglaNumber(currentYear)}
                </h3>
                <p className="text-[11px] text-slate-500">
                  চলতি মাসে {toBanglaNumber(currentMonthEvents.length)} টি নির্ধারিত ইভেন্ট ও ছুটি
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 no-print">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="পূর্ববর্তী মাস"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentMonth(now.getMonth());
                  setCurrentYear(now.getFullYear());
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                আজকের মাস
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="পরবর্তী মাস"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
            {BENGALI_DAYS.map((dayName, idx) => (
              <div
                key={dayName}
                className={`py-2 rounded-lg ${
                  idx === 6 // শুক্রবার (Friday)
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty_${idx}`}
                    className="min-h-[82px] rounded-xl bg-slate-50/40 dark:bg-slate-900/40 border border-transparent"
                  />
                );
              }

              const dayEvents = getEventsForDay(day);
              const isFriday = (idx % 7) === 6;
              const hasHoliday = isFriday || dayEvents.some((ev) => ev.isHoliday);
              const today = new Date();
              const isToday =
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === day;

              const dayFormatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              return (
                <div
                  key={`day_${day}`}
                  onClick={() => handleOpenAdd(dayFormatted)}
                  className={`min-h-[86px] sm:min-h-[96px] p-1.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : hasHoliday
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 hover:border-rose-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : hasHoliday
                          ? 'text-rose-600 font-bold'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {toBanglaNumber(day)}
                    </span>

                    {isFriday && dayEvents.length === 0 && (
                      <span className="text-[9px] font-bold text-rose-500">সাপ্তাহিক ছুটি</span>
                    )}

                    <span className="text-[10px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 no-print">
                      +
                    </span>
                  </div>

                  {/* Day Events Badges */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const badge = getCategoryBadge(ev.category, ev.isHoliday);
                      return (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(ev);
                          }}
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded truncate border ${badge.bg}`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      );
                    })}

                    {dayEvents.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-500 text-center">
                        +{toBanglaNumber(dayEvents.length - 2)} আরও
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>সাধারণ ছুটি / ছুটির দিন</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>পরীক্ষা ও মূল্যায়ন</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>জাতীয় দিবস</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>ক্রীড়া ও উৎসব</span>
            </div>
          </div>
        </div>

        {/* Right Column: Events List, Filter & Management */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>ইভেন্ট তালিকা ও ফিল্টার</span>
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {toBanglaNumber(filteredEvents.length)} টি
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs font-bold no-print">
              {[
                { id: 'all', label: 'সকল' },
                { id: 'holidays', label: 'ছুটির দিন' },
                { id: 'exam', label: 'পরীক্ষা' },
                { id: 'national', label: 'জাতীয় দিবস' },
                { id: 'sports', label: 'খেলাধুলা' },
                { id: 'cultural', label: 'সাংস্কৃতিক' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Events Scroll Area */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredEvents.map((ev) => {
                const badge = getCategoryBadge(ev.category, ev.isHoliday);
                return (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {ev.date} {ev.endDate ? `থেকে ${ev.endDate}` : ''}
                        </span>
                      </div>

                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {ev.title}
                      </h5>

                      {ev.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {ev.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 no-print shrink-0">
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="সম্পাদনা"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  কোনো ইভেন্ট বা ছুটির তথ্য পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingEvent ? 'ইভেন্ট বা ছুটির তথ্য সম্পাদনা' : 'নতুন ইভেন্ট বা ছুটি যোগ করুন'}
                </h3>
                <p className="text-xs text-slate-500">
                  একাডেমিক ক্যালেন্ডারে প্রদর্শনের জন্য তথ্য পূরণ করুন
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইভেন্ট / দিবসের নাম বা শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: মহান বিজয় দিবস / ২য় সাময়িক পরীক্ষা"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শুরুর তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শেষ তারিখ (যদি প্রযোজ্য হয়)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি / ধরন
                  </label>
                  <select
                    value={formData.category || 'holiday'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="holiday">সাধারণ ছুটি (Holiday)</option>
                    <option value="exam">পরীক্ষা ও মূল্যায়ন (Exam)</option>
                    <option value="national">জাতীয় দিবস (National)</option>
                    <option value="sports">ক্রীড়া ও খেলাধুলা (Sports)</option>
                    <option value="cultural">সাংস্কৃতিক উৎসব (Cultural)</option>
                    <option value="meeting">অভিভাবক/শিক্ষক সভা (Meeting)</option>
                    <option value="other">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কার জন্য প্রযোজ্য?
                  </label>
                  <select
                    value={formData.target || 'all'}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="all">সবার জন্য (All)</option>
                    <option value="students">শুধুমাত্র শিক্ষার্থী</option>
                    <option value="teachers">শুধুমাত্র শিক্ষক</option>
                    <option value="guardians">অভিভাবকবৃন্দ</option>
                  </select>
                </div>
              </div>

              {/* Holiday Toggle */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="isHolidayCheck"
                  checked={formData.isHoliday}
                  onChange={(e) => setFormData({ ...formData, isHoliday: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="isHolidayCheck" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  উক্ত দিনে বিদ্যালয়ে পাঠদান বন্ধ থাকবে (ছুটির দিন হিসেবে চিহ্নিত করুন)
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ বা নির্দেশিকা
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ইভেন্টের বিস্তারিত তথ্য, প্রয়োজনীয় নির্দেশনা বা সময়..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                  {editingEvent ? 'সংরক্ষণ করুন' : 'ইভেন্ট যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
