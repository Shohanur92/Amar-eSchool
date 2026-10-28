import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice, SchoolEvent, SchoolGalleryImage } from '../../types';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  School,
  MapPin,
  Calendar,
  CalendarDays,
  Image as ImageIcon,
  Bell,
  LogIn,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  Printer,
  Eye,
  X,
  Building2,
  Navigation,
  Globe,
  Share2,
  ChevronLeft,
  GraduationCap,
  ShieldCheck,
  Laptop,
  ArrowUp
} from 'lucide-react';

interface PublicSchoolLandingViewProps {
  onOpenLogin: () => void;
}

export const PublicSchoolLandingView: React.FC<PublicSchoolLandingViewProps> = ({ onOpenLogin }) => {
  const {
    settings,
    notices,
    events,
    galleryImages,
    developerInfo,
    setIsRegisterModalOpen
  } = useApp();

  // Active Notice category filter & Modal
  const [noticeFilter, setNoticeFilter] = useState<'all' | 'exam' | 'general' | 'holiday' | 'sports'>('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Gallery category filter & Lightbox Modal
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<SchoolGalleryImage | null>(null);

  // Calendar month selection for Academic Calendar
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth()); // 0-indexed

  // Sticky Go to Top State & Scroll Listener
  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowGoTop(true);
      } else {
        setShowGoTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const banglaMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const filteredNotices = notices.filter((n) => {
    if (noticeFilter === 'all') return true;
    return n.category === noticeFilter;
  });

  const filteredGallery = galleryImages.filter((img) => {
    if (galleryFilter === 'all') return true;
    return img.category === galleryFilter;
  });

  // Calculate days for the selected month in 2026
  const year = 2026;
  const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, currentMonthIndex, 1).getDay(); // 0 is Sunday

  // Events for selected month
  const monthString = String(currentMonthIndex + 1).padStart(2, '0');
  const currentMonthEvents = events.filter((ev) => {
    const evDate = ev.date;
    return (
      evDate.includes(`-${monthString}-`) ||
      (currentMonthIndex === 0 && (evDate.includes('জানুয়ারি') || evDate.includes('০১'))) ||
      (currentMonthIndex === 1 && (evDate.includes('ফেব্রুয়ারি') || evDate.includes('০২'))) ||
      (currentMonthIndex === 2 && (evDate.includes('মার্চ') || evDate.includes('০৩'))) ||
      (currentMonthIndex === 3 && (evDate.includes('এপ্রিল') || evDate.includes('০৪'))) ||
      (currentMonthIndex === 4 && (evDate.includes('মে') || evDate.includes('০৫'))) ||
      (currentMonthIndex === 5 && (evDate.includes('জুন') || evDate.includes('০৬')))
    );
  });

  // Map directions url
  const mapsSearchQuery = encodeURIComponent(`${settings.name}, ${settings.address}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapsSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. WELCOME SECTION (GORGEOUS HERO & HEAD TEACHER MESSAGE) */}
      {/* ========================================================= */}
      <section id="welcome" className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
        {/* Top Decorative Gradient Banner with Rich Visual Accents */}
        <div className="relative h-56 sm:h-72 lg:h-80 bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 overflow-hidden flex items-end">
          {/* Subtle Ambient Radial Glowing Lights & Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Badges Bar */}
          <div className="absolute top-4 sm:top-6 left-6 sm:left-8 right-6 sm:right-8 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-400/90 text-amber-950 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>স্মার্ট ডিজিটাল শিক্ষাঙ্গন</span>
              </span>
              <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-extrabold bg-white/15 backdrop-blur-md text-emerald-100 border border-white/20">
                স্থাপিত: {settings.established}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                EIIN: {settings.code}
              </span>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                সেশন: {settings.currentSession}
              </span>
            </div>
          </div>

          {/* Banner Hero Title & Monogram */}
          <div className="p-6 sm:p-8 lg:p-10 w-full flex items-end justify-between relative z-10 text-white">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* School Emblem / Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-white p-1.5 shadow-2xl ring-4 ring-emerald-400/40 shrink-0 overflow-hidden flex items-center justify-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl sm:text-4xl">🏫</span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md">
                  {settings.name}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-emerald-100 font-semibold mt-1 opacity-95">
                  {settings.nameEn} • {settings.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Body Content - Desktop Gorgeous Split */}
        <div className="p-6 sm:p-8 lg:p-12 space-y-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-between">
            {/* Left: About School & Quick Nav Action Buttons (NO duplicate login button) */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800 shadow-xs">
                  <School className="w-4 h-4 text-emerald-600" />
                  <span>জ্ঞানের আলোয় আলোকিত হোক প্রতিটি জীবন</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  জ্ঞান, নৈতিকতা ও আধুনিক তথ্যপ্রযুক্তির সমন্বয়ে আগামীর নেতৃত্ব বিনির্মাণ।
                </h2>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  আমাদের প্রতিষ্ঠানে প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা বিকাশ, সৃষ্টিশীল চিন্তন এবং নৈতিক মূল্যবোধ জাগ্রত করতে আমরা প্রতিশ্রুতিবদ্ধ। মাল্টিমিডিয়া শ্রেণিকক্ষ, কম্পিউটার ল্যাব, সমৃদ্ধ পাঠাগার এবং খেলাধুলার মাধ্যমে একটি সার্বিক ও আনন্দময় আধুনিক শিখন পরিবেশ নিশ্চিত করা হয়।
                </p>
              </div>

              {/* Action Buttons: Login button removed as requested, replaced with Gallery & Section Links */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#gallery"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-700/25 flex items-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-100" />
                    <span>বিদ্যালয় ফটো গ্যালারি</span>
                  </a>

                  <a
                    href="#notices"
                    className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <span>সাম্প্রতিক নোটিশ বোর্ড</span>
                  </a>

                  <a
                    href="#calendar"
                    className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <CalendarDays className="w-4 h-4 text-teal-600" />
                    <span>মাসিক ক্যালেন্ডার ও ইভেন্ট</span>
                  </a>

                  <a
                    href="#location"
                    className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>লোকেশন ও যোগাযোগ</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Head Teacher Message Card - Connected to Admin Custom Speech */}
            <div className="w-full lg:w-[420px] bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-slate-850 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 dark:border-slate-700 shadow-xl space-y-4 shrink-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 border-b border-emerald-100 dark:border-slate-700 pb-4">
                  {/* Head Teacher Portrait Photo */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md bg-emerald-100 dark:bg-emerald-950 shrink-0 flex items-center justify-center">
                    {settings.headTeacherPhoto ? (
                      <img
                        src={settings.headTeacherPhoto}
                        alt={settings.headTeacherName}
                        className="w-full h-full object-cover"
                      />
                    ) : settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl">👨‍🏫</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      <span>{settings.headTeacherDesignation || 'প্রধান শিক্ষকের বাণী'}</span>
                    </span>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate">
                      {settings.headTeacherName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {settings.headTeacherDesignation || 'প্রধান শিক্ষক'}, {settings.name}
                    </p>
                  </div>
                </div>

                {/* Custom Head Teacher Speech */}
                <div className="relative pt-4">
                  <span className="text-3xl text-emerald-400/40 font-serif leading-none select-none">“</span>
                  <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed whitespace-pre-wrap pl-2 font-medium">
                    {settings.headTeacherMessage ||
                      'সুশিক্ষা জাতির মেরুদণ্ড। আদর্শ নাগরিক হিসেবে শিক্ষার্থীদের গড়ে তুলতে পাঠ্যপুস্তকের পাশাপাশি আমরা নৈতিক শিক্ষা, প্রযুক্তি দক্ষতা ও সহশিক্ষা কার্যক্রমে সমভাবে গুরুত্ব দিই। সম্মানিত অভিভাবকবৃন্দের আস্থা ও শিক্ষকদের ঐকান্তিক আত্মনিয়োগেই আমাদের প্রতিষ্ঠানের গৌরবময় পথচলা ও সার্বিক সাফল্য।'}
                  </blockquote>
                  <div className="text-right">
                    <span className="text-3xl text-emerald-400/40 font-serif leading-none select-none">”</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Credentials & Seal */}
              <div className="pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-emerald-100 dark:border-slate-700/80">
                <span className="font-semibold">সেশন: {settings.currentSession}</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{settings.headTeacherName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Highlight Pillars / Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">ডিজিটাল স্মার্ট শিখন</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">মাল্টিমিডিয়া ও কম্পিউটার ল্যাব</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/40 dark:from-blue-950/40 dark:to-slate-800/60 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">অভিজ্ঞ শিক্ষক পরিষদ</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">দক্ষ ও নিবেদিত শিক্ষকবৃন্দ</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/60 border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">সহ-শিক্ষা ও ক্রীড়া</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">সাংস্কৃতিক ও খেলাধুলার সুযোগ</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-800/60 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">নিরাপদ ক্যাম্পাস</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">সিসিটিভি ও সার্বক্ষণিক নিরাপত্তা</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. RECENT NOTICE BOARD (সাম্প্রতিক নোটিশ বোর্ড)             */}
      {/* ========================================================= */}
      <section id="notices" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <Bell className="w-4 h-4" />
              <span>ঘোষণা ও বিজ্ঞপ্তি</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              সাম্প্রতিক নোটিশ বোর্ড
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              বিদ্যালয়ের শিক্ষার্থী, অভিভাবক ও শিক্ষকদের জন্য হালনাগাদ তথ্যাবলি
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'সকল নোটিশ' },
              { id: 'general', label: 'সাধারণ' },
              { id: 'exam', label: 'পরীক্ষা' },
              { id: 'holiday', label: 'ছুটি' },
              { id: 'sports', label: 'খেলাধুলা' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setNoticeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  noticeFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
              <p className="text-xs">উক্ত ক্যাটাগরিতে কোনো সক্রিয় নোটিশ নেই।</p>
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const badgeColors: Record<string, string> = {
                exam: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
                holiday: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
                general: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
                sports: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
              };

              const categoryLabels: Record<string, string> = {
                exam: 'পরীক্ষা বিজ্ঞপ্তি',
                holiday: 'ছুটি সংক্রান্ত',
                general: 'সাধারণ নোটিশ',
                sports: 'খেলাধুলা ও উৎসব',
              };

              return (
                <div
                  key={notice.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColors[notice.category] || 'bg-slate-100 text-slate-700'}`}>
                        {categoryLabels[notice.category] || 'বিজ্ঞপ্তি'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notice.date}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {notice.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">
                      কর্তৃপক্ষ: প্রধান শিক্ষক
                    </span>
                    <button
                      onClick={() => setSelectedNotice(notice)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MONTHLY ACADEMIC CALENDAR & EVENTS                     */}
      {/* ========================================================= */}
      <section id="calendar" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>একাডেমিক বর্ষপঞ্জিকা ২০২৬</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              মাসিক একাডেমিক ক্যালেন্ডার ও ইভেন্ট
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              সরকারি ছুটির দিন, পরীক্ষা সূচি ও বিদ্যালয়ের বিভিন্ন বার্ষিক কার্যক্রম
            </p>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="পূর্ববর্তী মাস"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-black text-slate-900 dark:text-white min-w-28 text-center">
              {banglaMonths[currentMonthIndex]} ২০২৬
            </span>
            <button
              onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="পরবর্তী মাস"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid View (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <span>{banglaMonths[currentMonthIndex]} ২০২৬ এর দিনপঞ্জি</span>
              </h4>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> ছুটি
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> পরীক্ষা
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ইভেন্ট
                </span>
              </div>
            </div>

            {/* Day Headers (Fri, Sat, Sun, etc.) */}
            <div className="grid grid-cols-7 gap-1 text-center font-black text-[11px] text-slate-400 mb-2">
              <span className="text-rose-500">শুক্র</span>
              <span>শনি</span>
              <span>রবি</span>
              <span>সোম</span>
              <span>মঙ্গল</span>
              <span>বুধ</span>
              <span>বৃহঃ</span>
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-xs font-bold text-center">
              {/* Empty leading padding */}
              {Array.from({ length: (firstDayOfWeek + 2) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent opacity-0"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${monthString}-${String(dayNum).padStart(2, '0')}`;
                const dayOfWeek = (firstDayOfWeek + i) % 7;
                const isFriday = dayOfWeek === 5; // Friday is public holiday in BD

                const dayEvent = events.find(
                  (e) => e.date === dateStr || e.date.endsWith(`-${monthString}-${String(dayNum).padStart(2, '0')}`)
                );

                const isHoliday = isFriday || dayEvent?.isHoliday;

                return (
                  <div
                    key={dayNum}
                    className={`h-11 sm:h-14 rounded-xl p-1 flex flex-col items-center justify-between transition-colors border ${
                      isHoliday
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                        : dayEvent
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-extrabold text-xs">
                      {toBanglaNumber(dayNum)}
                    </span>
                    {dayEvent && (
                      <span
                        title={dayEvent.title}
                        className={`w-full truncate px-1 py-0.2 rounded text-[8px] font-bold text-center ${
                          dayEvent.isHoliday ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {dayEvent.title.slice(0, 6)}..
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events List in Selected Month (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>{banglaMonths[currentMonthIndex]} মাসের নির্ধারিত ইভেন্টসমূহ</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {toBanglaNumber(currentMonthEvents.length)} টি ইভেন্ট
              </span>
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {currentMonthEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">এই মাসে কোনো বিশেষ ইভেন্ট বা পরীক্ষা সূচি নেই।</p>
                </div>
              ) : (
                currentMonthEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          ev.isHoliday
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : ev.category === 'exam'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {ev.isHoliday ? 'সাধারণ ছুটি' : ev.category === 'exam' ? 'পরীক্ষা' : 'একাডেমিক'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        📅 {ev.date} {ev.endDate ? `হতে ${ev.endDate}` : ''}
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
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SCHOOL IMAGE GALLERY (বিদ্যালয়ের ফটো গ্যালারি)           */}
      {/* ========================================================= */}
      <section id="gallery" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>চিত্রমালা ও পরিবেশ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              বিদ্যালয় ফটো গ্যালারি (Image Gallery)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ক্যাম্পাস ভবন, মাল্টিমিডিয়া ক্লাসরুম, ডিজিটাল ল্যাব ও বার্ষিক ক্রীড়া-সাংস্কৃতিক মুহূর্তসমূহ
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'সকল ফটো' },
              { id: 'campus', label: 'ক্যাম্পাস' },
              { id: 'classroom', label: 'শ্রেণিকক্ষ' },
              { id: 'lab', label: 'কম্পিউটার ল্যাব' },
              { id: 'sports', label: 'খেলাধুলা' },
              { id: 'cultural', label: 'সাংস্কৃতিক' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setGalleryFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  galleryFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGallery.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-10 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-600" />
              <p className="text-xs">উক্ত বিভাগে কোনো ছবি পাওয়া যায়নি।</p>
            </div>
          ) : (
            filteredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="w-full h-56 sm:h-64 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Hover Eye Badge */}
                  <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-xs">
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-emerald-900 font-extrabold text-xs shadow-lg">
                      <Eye className="w-4 h-4 text-emerald-700" />
                      <span>বড় করে দেখুন</span>
                    </span>
                  </div>
                </div>

                {/* Only Caption as requested by user */}
                <div className="p-4 bg-white dark:bg-slate-900 min-h-[58px] flex items-center">
                  <p className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
                    {img.caption || img.title}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. GOOGLE MAP LOCATION & CONTACT                           */}
      {/* ========================================================= */}
      <section id="location" className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
            <MapPin className="w-4 h-4" />
            <span>অবস্থান ও সরাসরি যোগাযোগ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            বিদ্যালয়ের গুগল ম্যাপ লোকেশন (Google Maps)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সরাসরি আমাদের বিদ্যালয় প্রাঙ্গণে আসার দিকনির্দেশনা ও যোগাযোগের মাধ্যম
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Google Maps Interactive Frame (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative flex flex-col min-h-[380px]">
            {/* Top Bar above map */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">{settings.name} — {settings.address}</span>
              </span>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors"
              >
                <span>গুগল ম্যাপে বড় করে দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Responsive Google Map Iframe */}
            <div className="flex-1 w-full relative min-h-[320px]">
              <iframe
                title="School Location Map"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Contact Details Card (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>যোগাযোগের তথ্যাবলি</span>
              </h4>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">ঠিকানা</strong>
                    <span className="text-slate-500 dark:text-slate-400">{settings.address}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">হটলাইন / মোবাইল</strong>
                    <a href={`tel:${settings.contactNumber}`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      {settings.contactNumber}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">ইমেইল ঠিকানা</strong>
                    <a href={`mailto:${settings.email}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">অফিস সময়</strong>
                    <span className="text-slate-500 dark:text-slate-400">সকাল ৯:০০ - বিকাল ৪:০০ (রবিবার - বৃহস্পতিবার)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Direction CTA button */}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>গুগল ম্যাপে ডিরেকশন নিন (Get Directions)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PUBLIC FOOTER (CLEAN & OFFICIAL)                       */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 6. PUBLIC FOOTER (ONLY LOGIN, REGISTER & GO TOP)          */}
      {/* ========================================================= */}
      <footer className="pt-8 pb-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* School Name & Copyright */}
          <div className="text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
            <p className="font-extrabold text-slate-900 dark:text-white text-sm">
              © ২০২৬ {settings.name}
            </p>
            <p className="text-xs mt-0.5">
              ইআইআইএন: {settings.code} • সেশন: {settings.currentSession}
            </p>
          </div>

          {/* Only Login / Register New School & Go Top Buttons as requested */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              <span>প্রবেশ / লগইন</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>নতুন বিদ্যালয় নিবন্ধন</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer hover:scale-[1.02]"
              title="পৃষ্ঠার শুরুতে যান"
            >
              <ArrowUp className="w-4 h-4" />
              <span>উপরে যান</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Sticky Floating Go to Top Button */}
      {showGoTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-600/40 border border-white/20 flex items-center gap-2 text-xs font-black transition-all duration-300 hover:scale-110 cursor-pointer animate-in fade-in slide-in-from-bottom-5"
        >
          <ArrowUp className="w-5 h-5" />
          <span className="hidden sm:inline">শীর্ষে যান</span>
        </button>
      )}

      {/* ========================================================= */}
      {/* MODALS: NOTICE DETAIL & LIGHTBOX GALLERY                  */}
      {/* ========================================================= */}
      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                অফিসিয়াল বিজ্ঞপ্তি
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">
                {selectedNotice.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                প্রকাশের তারিখ: {selectedNotice.date}
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2">
              <p>{selectedNotice.content}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold">
                স্বাক্ষর: {settings.headTeacherName} (প্রধান শিক্ষক)
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-4 sm:p-5 text-white bg-slate-900/95 border-t border-slate-800">
              <p className="font-extrabold text-xs sm:text-sm text-slate-100 leading-relaxed text-center sm:text-left">
                {lightboxImage.caption || lightboxImage.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
