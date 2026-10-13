import React, { useState, useEffect } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  Users,
  BookOpenCheck,
  CalendarCheck,
  GraduationCap,
  FileSpreadsheet,
  CalendarDays,
  Calendar,
  Receipt,
  Award,
  Bell,
  BookMarked,
  Target,
  Layers,
  MessageSquare,
  ShieldCheck,
  X,
  School,
  Camera,
  Cloud,
  RefreshCw,
  Globe,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppView;
  labelBn: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'main' | 'academic' | 'exams' | 'admin' | 'settings';
  badge?: string;
  isHot?: boolean;
}

const navItems: NavItem[] = [
  // Main
  { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard, category: 'main' },
  { id: 'live_routine', labelBn: 'লাইভ রুটিন (চলমান ঘড়ি)', labelEn: 'Live Routine (Clock)', icon: Clock, category: 'main', isHot: true },

  // Academic
  { id: 'students', labelBn: 'শিক্ষার্থী ব্যবস্থাপনা', labelEn: 'Student Management', icon: Users, category: 'academic' },
  { id: 'calendar', labelBn: 'একাডেমিক ক্যালেন্ডার ও ইভেন্ট', labelEn: 'Academic Calendar & Events', icon: Calendar, category: 'academic' },
  { id: 'stipend', labelBn: 'ভর্তি ও উপবৃত্তি রেজিস্টার', labelEn: 'Admission & Stipend', icon: BookOpenCheck, category: 'academic' },
  { id: 'class_routine', labelBn: 'স্মার্ট ক্লাস রুটিন', labelEn: 'Smart Class Routine', icon: CalendarDays, category: 'academic' },
  { id: 'homework', labelBn: 'হোমওয়ার্ক ডায়েরি', labelEn: 'Homework Diary', icon: BookMarked, category: 'academic' },

  // Exams & Evaluation
  { id: 'attendance', labelBn: 'হাজিরা ব্যবস্থাপনা', labelEn: 'Attendance Register', icon: CalendarCheck, category: 'exams' },
  { id: 'results', labelBn: 'ফলাফল ও কাস্টম মার্কস', labelEn: 'Results & Custom Marks', icon: GraduationCap, category: 'exams', badge: 'কাস্টম' },
  { id: 'exam_routine', labelBn: 'রুটিন, প্রবেশপত্র ও সিট লেবেল', labelEn: 'Admit Card & Seat Labels', icon: FileSpreadsheet, category: 'exams', badge: 'A4 ২-কপি' },
  { id: 'competency', labelBn: 'শিখন অগ্রগতি ট্র্যাকিং', labelEn: 'Competency Tracking', icon: Target, category: 'exams' },

  // Admin & Finance
  { id: 'fees', labelBn: 'ফি সংগ্রহ ও দ্বিকপি রসিদ', labelEn: 'Fee Collection & Receipt', icon: Receipt, category: 'admin', badge: 'বিকাশ/নগদ' },
  { id: 'certificates', labelBn: 'প্রশংসাপত্র ও প্রত্যয়ন', labelEn: 'Certificates & Letters', icon: Award, category: 'admin' },
  { id: 'notices', labelBn: 'নোটিশ বোর্ড', labelEn: 'Notice Board', icon: Bell, category: 'admin' },
  { id: 'sms', labelBn: 'এসএমএস গেটওয়ে ও নোটিফিকেশন', labelEn: 'Parent SMS & API Gateway', icon: MessageSquare, category: 'admin', badge: 'এপিআই' },

  // System
  { id: 'class_subjects', labelBn: 'শ্রেণি ও বিষয় ব্যবস্থাপনা', labelEn: 'Classes & Subjects', icon: Layers, category: 'settings' },
  { id: 'security', labelBn: 'বিদ্যালয় প্রোফাইল ও ক্লাউড ডাটা', labelEn: 'School Profile & Cloud Data', icon: ShieldCheck, category: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    lang,
    setLang,
    isDark,
    toggleDarkMode,
    currentView,
    setCurrentView,
    currentUser,
    logoutUser,
    syncState,
    triggerDriveSync,
    settings,
    setIsLogoModalOpen,
    developerInfo
  } = useApp();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleSyncClick = () => {
    setIsSyncing(true);
    triggerDriveSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    onCloseMobile();
  };

  const categories = [
    { key: 'main', labelBn: 'প্রধান মেনু', labelEn: 'Main Navigation' },
    { key: 'academic', labelBn: 'শিক্ষার্থী ও পাঠদান', labelEn: 'Academic & Classes' },
    { key: 'exams', labelBn: 'হাজিরা, পরীক্ষা ও ফলাফল', labelEn: 'Attendance & Exams' },
    { key: 'admin', labelBn: 'প্রশাসন, ফি ও যোগাযোগ', labelEn: 'Admin & Accounts' },
    { key: 'settings', labelBn: 'সেটিংস ও নিরাপত্তা', labelEn: 'Settings & Security' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between lg:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-xs overflow-hidden">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                '🏫'
              )}
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white text-sm block leading-tight">
                ই-প্রাথমিক সফটওয়্যার
              </span>
              <span className="text-[10px] text-slate-400">স্মার্ট স্কুল ম্যানেজমেন্ট</span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FIXED AT TOP: Live Date & Digital Clock Card */}
        <div className="p-2.5 sm:p-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px] truncate">
                {currentDate}
              </span>
            </div>
            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs shrink-0 pl-1.5">
              {currentTime}
            </span>
          </div>
        </div>

        {/* SCROLLABLE AREA: All remaining menu items and controls scroll below the fixed time */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Super Admin Special Button (if logged in as super admin) */}
          {currentUser?.role === 'super_admin' && (
            <div>
              <button
                type="button"
                onClick={() => handleNavClick('super_admin_dashboard')}
                className={`w-full p-2.5 rounded-2xl flex items-center gap-3 font-extrabold text-xs transition-all shadow-sm cursor-pointer ${
                  currentView === 'super_admin_dashboard'
                    ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-indigo-500/25 ring-2 ring-indigo-400'
                    : 'bg-gradient-to-r from-indigo-900/90 to-slate-900 text-white hover:from-indigo-800 border border-indigo-700/40'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600/60 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="truncate leading-tight">সুপার অ্যাডমিন ড্যাশবোর্ড</p>
                  <p className="text-[10px] text-indigo-200/80 font-normal truncate mt-0.5">
                    সকল স্কুল ও অ্যাডমিন লগিন
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Navigation Items (Scrollable) */}
          {categories.map((cat) => {
            const items = navItems.filter((i) => i.category === cat.key);
            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {lang === 'bn' ? cat.labelBn : cat.labelEn}
                </div>

                <div className="space-y-1 mt-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-600'
                            }`}
                          />
                          <span className="truncate">{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {item.isHot && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          )}
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-emerald-700 text-emerald-100'
                                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Google Drive Cloud Sync Card (Scrolls with menu) */}
          <div className="rounded-xl p-2.5 bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] font-bold">Google Drive ক্লাউড</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                সক্রিয়
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {syncState.googleDriveEmail || 'admin-drive@gmail.com'}
            </p>

            <button
              type="button"
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="w-full py-1.5 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-blue-200 dark:border-blue-800/80 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ড্রাইভে সিঙ্ক করুন'}</span>
            </button>
          </div>

          {/* Theme Toggle & Language Toggle */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="ভাষা পরিবর্তন করুন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'bn' ? 'English (EN)' : 'বাংলা (বাং)'}</span>
            </button>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="ডার্ক / লাইট মোড পরিবর্তন"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>লাইট মোড</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>ডার্ক মোড</span>
                </>
              )}
            </button>
          </div>

          {/* Software Developer Attribution */}
          <div className="pt-2.5 pb-2 text-center border-t border-slate-200/60 dark:border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Developed By:
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
              {developerInfo.name || 'Md Shohanur Rahaman'}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold block">
              Owner: APPTECH IT
            </span>
            <div className="pt-0.5">
              <a
                href={`https://wa.me/88${(developerInfo.whatsapp || '01936918482').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম, ${settings.name} থেকে যোগাযোগ করছি।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>WhatsApp: {developerInfo.whatsapp || '01936918482'}</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
