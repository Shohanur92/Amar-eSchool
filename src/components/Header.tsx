import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  WifiOff,
  Menu,
  LogIn,
  LogOut,
  School,
  Camera,
  ChevronDown,
  ShieldCheck,
  Bell,
  CheckCheck,
  AlertCircle,
  Info,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { toBanglaNumber } from '../utils/bengaliUtils';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenLogin }) => {
  const {
    lang,
    t,
    settings,
    currentUser,
    logoutUser,
    syncState,
    toggleOnlineSimulator,
    setCurrentView,
    setIsLogoModalOpen,
    registeredSchools,
    switchSchool,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showSchoolSwitcher, setShowSchoolSwitcher] = useState<boolean>(false);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);

  // Active School ID
  const activeSchool = registeredSchools.find((s) => s.settings.name === settings.name) || registeredSchools[0];
  const currentSchoolId = activeSchool?.id || 'school_main';

  // Notifications relevant for this school / user
  const relevantNotifications = notifications.filter((n) => {
    if (currentUser?.role === 'super_admin') return true;
    // For school admin or teacher: only show if targeted to 'all' or specifically to this school
    return (n.targetSchoolId === 'all' || n.targetSchoolId === currentSchoolId) && n.status === 'sent';
  });

  const unreadCount = relevantNotifications.filter(
    (n) => !n.readBySchoolIds.includes(currentSchoolId)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 max-w-[1600px] mx-auto">
        {/* Left: Mobile hamburger & School Logo & Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {currentUser && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* School Logo with hoverable Quick Edit / Upload trigger */}
          <div className="relative group shrink-0">
            <div
              onClick={() => {
                if (currentUser) {
                  setIsLogoModalOpen(true);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              title={currentUser ? "বিদ্যালয়ের লোগো পরিবর্তন বা আপলোড করতে ক্লিক করুন" : settings.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-emerald-500/30 overflow-hidden cursor-pointer relative transition-transform hover:scale-105"
            >
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🏫</span>
              )}

              {/* Hover Overlay Camera Badge (only for logged in admins) */}
              {currentUser && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-emerald-300" />
                </div>
              )}
            </div>

            {currentUser && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow-xs border border-white dark:border-slate-900 pointer-events-none">
                ✎
              </span>
            )}
          </div>

          {/* School Name & Multi-School Switcher */}
          <div className="relative min-w-0">
            <div className="flex items-center gap-1.5">
              <div
                onClick={() => {
                  if (currentUser) {
                    setCurrentView('dashboard');
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="cursor-pointer select-none group min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base lg:text-lg leading-tight truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {lang === 'bn' ? settings.name : settings.nameEn}
                  </h1>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300/40 shrink-0">
                    {settings.code}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-sm md:max-w-md hidden sm:block">
                  {settings.address} • সেশন {settings.currentSession}
                </p>
              </div>

              {/* School Switcher Caret (if registered schools exist) */}
              {registeredSchools.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowSchoolSwitcher(!showSchoolSwitcher)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                  title="স্কুল পরিবর্তন করুন"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* School Switcher Dropdown */}
            {showSchoolSwitcher && registeredSchools.length > 1 && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                    নিবন্ধিত বিদ্যালয়সমূহ
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({toBanglaNumber(registeredSchools.length)} টি)
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {registeredSchools.map((sch) => {
                    const isCurrent = sch.settings.name === settings.name;
                    return (
                      <div
                        key={sch.id}
                        onClick={() => {
                          switchSchool(sch.id);
                          setShowSchoolSwitcher(false);
                        }}
                        className={`px-3.5 py-2.5 flex items-center gap-2.5 cursor-pointer transition-colors ${
                          isCurrent
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 overflow-hidden">
                          {sch.settings.logoUrl ? (
                            <img src={sch.settings.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <School className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs">{sch.settings.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{sch.settings.code}</p>
                        </div>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Public Portal Navigation Links (When Logged Out) */}
        {!currentUser && (
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#welcome" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              স্বাগতম
            </a>
            <a href="#notices" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              নোটিশ বোর্ড
            </a>
            <a href="#calendar" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              একাডেমিক ক্যালেন্ডার
            </a>
            <a href="#gallery" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              ফটো গ্যালারি
            </a>
            <a href="#location" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              লোকেশন ও যোগাযোগ
            </a>
          </nav>
        )}

        {/* Right: Clean & Highly Responsive Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Online / Offline Simulator Status Pill (Primary retained item as requested) */}
          <button
            onClick={toggleOnlineSimulator}
            title={
              syncState.isOnline
                ? 'অনলাইন মোডে সক্রিয় (ক্লিক করে অফলাইন পরীক্ষা করুন)'
                : 'অফলাইন মোড চালু (ক্লিক করে অনলাইন ফিরুন)'
            }
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              syncState.isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  syncState.isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  syncState.isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>

            {syncState.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs">{lang === 'bn' ? 'অনলাইন' : 'Online'}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs">{lang === 'bn' ? 'অফলাইন' : 'Offline'}</span>
              </>
            )}
          </button>

          {/* Notification Bell with Badge (only for logged-in users) */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                title="সুপার অ্যাডমিন নোটিফিকেশন ও বার্তা"
                className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs ring-1 ring-white dark:ring-slate-900">
                  {toBanglaNumber(unreadCount)}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      সুপার অ্যাডমিন নোটিফিকেশন
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                        {toBanglaNumber(unreadCount)} টি নতুন
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead(currentSchoolId)}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                    >
                      সব পঠিত করুন
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {relevantNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs">কোনো নোটিফিকেশন নেই</p>
                    </div>
                  ) : (
                    relevantNotifications.map((n) => {
                      const isUnread = !n.readBySchoolIds.includes(currentSchoolId);
                      const isDirect = n.targetSchoolId !== 'all';

                      return (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id, currentSchoolId)}
                          className={`p-3.5 transition-colors cursor-pointer ${
                            isUnread
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {n.type === 'urgent' ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                  জরুরি
                                </span>
                              ) : n.type === 'warning' ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                  সতর্কতা
                                </span>
                              ) : n.type === 'instruction' ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                  নির্দেশনা
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  সাধারণ
                                </span>
                              )}

                              {isDirect && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                                  🔒 শুধু আপনার স্কুলে
                                </span>
                              )}

                              {n.status === 'pending_sync' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 border border-amber-300/40">
                                  অফলাইন কিউতে অপেক্ষমান
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString('bn-BD', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-1">
                            {n.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>প্রেরক: সেন্ট্রাল সুপার অ্যাডমিন</span>
                            {isUnread && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                ক্লিক করে পঠিত করুন
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

          {/* User Account / Profile Badge */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0 ${
                      currentUser.role === 'super_admin'
                        ? 'bg-gradient-to-tr from-indigo-700 to-purple-600'
                        : currentUser.role === 'admin'
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                        : 'bg-gradient-to-tr from-blue-600 to-cyan-600'
                    }`}
                  >
                    {currentUser.role === 'super_admin' ? (
                      <ShieldCheck className="w-4 h-4 text-white" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>

                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold leading-none truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">
                      {currentUser.role === 'super_admin'
                        ? 'সুপার অ্যাডমিন'
                        : currentUser.role === 'admin'
                        ? 'প্রধান শিক্ষক (Admin)'
                        : 'সহকারী শিক্ষক'}
                    </p>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Minimal User Profile & Logout Popover */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-extrabold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
                        {currentUser.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            currentUser.role === 'super_admin'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                              : currentUser.role === 'admin'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          }`}
                        >
                          {currentUser.role === 'super_admin'
                            ? 'Super Admin'
                            : currentUser.role === 'admin'
                            ? 'School Admin'
                            : 'Teacher'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsLogoModalOpen(true);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>লোগো ও প্রোফাইল পরিবর্তন</span>
                      </button>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logoutUser();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>লগআউট করুন</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
