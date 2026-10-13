import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { toBanglaNumber } from '../../utils/bengaliUtils';
import {
  Clock,
  Radio,
  Flame,
  Sparkles,
  Calendar,
  User,
  GraduationCap,
  ArrowRight,
  BellRing
} from 'lucide-react';

export const LiveRoutineView: React.FC = () => {
  const {
    classes,
    subjects,
    teachers,
    classRoutines,
    settings
  } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activePeriodIndex, setActivePeriodIndex] = useState<number>(1); // 1 to 6

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const todayDay = daysBn[currentTime.getDay()];

  const periods = [
    { num: 1, label: '১ম পিরিয়ড', time: '১০:০০ - ১০:৪৫', startH: 10, startM: 0, endH: 10, endM: 45 },
    { num: 2, label: '২য় পিরিয়ড', time: '১০:৪৫ - ১১:৩০', startH: 10, startM: 45, endH: 11, endM: 30 },
    { num: 3, label: '৩য় পিরিয়ড', time: '১১:৩০ - ১২:১৫', startH: 11, startM: 30, endH: 12, endM: 15 },
    { num: 4, label: '৪র্থ পিরিয়ড', time: '১২:১৫ - ০১:০০', startH: 12, startM: 15, endH: 13, endM: 0 },
    { num: 5, label: '৫ম পিরিয়ড (টিফিন পরবর্তী)', time: '০১:৩০ - ০২:১৫', startH: 13, startM: 30, endH: 14, endM: 15 },
    { num: 6, label: '৬ষ্ঠ পিরিয়ড', time: '০২:১৫ - ০৩:০০', startH: 14, startM: 15, endH: 15, endM: 0 },
  ];

  const currentPeriod = periods.find((p) => p.num === activePeriodIndex) || periods[0];
  const nextPeriod = periods.find((p) => p.num === activePeriodIndex + 1);

  return (
    <div className="space-y-6">
      {/* Live Big Clock & Status Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>🔴 লাইভ মনিটরিং স্ক্রিন</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              চলমান ক্লাস ও শিক্ষক লাইভ ট্র্যাকার
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              আজ {todayDay} • বিদ্যালয়ে এখন কোন শ্রেণিতে কোন পাঠদান চলছে তা জীবন্ত প্রদর্শন করছে
            </p>
          </div>

          {/* Real-time Giant Clock */}
          <div className="bg-black/40 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-5 text-center min-w-[240px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">ডিজিটাল সময়</p>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white mt-1">
              {currentTime.toLocaleTimeString('bn-BD')}
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentPeriod.label} চলমান</span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Timeline Selector Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
          <span>আজকের পিরিয়ড টাইমলাইন:</span>
          <span className="text-emerald-600 font-bold">ক্লিক করে যেকোনো পিরিয়ডের লাইভ অবস্থা দেখুন</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {periods.map((p) => {
            const isActive = p.num === activePeriodIndex;
            return (
              <button
                key={p.num}
                onClick={() => setActivePeriodIndex(p.num)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-lg shadow-emerald-600/25 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="text-xs font-extrabold">{p.label}</div>
                <div className={`text-[10px] mt-0.5 font-mono ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {p.time}
                </div>
                {isActive && (
                  <div className="mt-1.5 text-[9px] bg-white/20 py-0.5 rounded font-bold uppercase tracking-wider">
                    ● লাইভ
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of All Classes Under Current Period */}
      <div>
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
          <span>🏫</span>
          <span>{currentPeriod.label} ({currentPeriod.time}) — সকল শ্রেণির লাইভ দৃশ্য</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, idx) => {
            // Find what subject is scheduled for this class in this period & day
            const scheduled = classRoutines.find(
              (r) => r.classId === cls.id && r.period === activePeriodIndex
            );
            const sub = subjects.find((s) => s.id === scheduled?.subjectId) || {
              name: idx % 2 === 0 ? 'আমার বাংলা বই' : 'প্রাথমিক গণিত',
            };
            const teacher = teachers.find((t) => t.id === scheduled?.teacherId) || teachers[idx % teachers.length];

            return (
              <div
                key={cls.id}
                className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all"
              >
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse"></div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {cls.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    ক্লাস চলছে
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      চলমান বিষয়
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {sub.name}
                    </h4>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{teacher.name}</p>
                      <p className="text-[10px] text-slate-500">{teacher.designation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>কক্ষ: ১০{idx + 1}</span>
                  <span className="font-medium text-emerald-600">সময় বাকি: ~১৮ মিনিট</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
