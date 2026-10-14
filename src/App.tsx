import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { TwoFactorModal } from './components/TwoFactorModal';
import { LogoUploadModal } from './components/LogoUploadModal';
import { RegisterSchoolModal } from './components/RegisterSchoolModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { StudentView } from './components/views/StudentView';
import { AttendanceView } from './components/views/AttendanceView';
import { ResultView } from './components/views/ResultView';
import { ExamRoutineView } from './components/views/ExamRoutineView';
import { RoutineView } from './components/views/RoutineView';
import { LiveRoutineView } from './components/views/LiveRoutineView';
import { FeesView } from './components/views/FeesView';
import { CertificatesView } from './components/views/CertificatesView';
import { NoticeView } from './components/views/NoticeView';
import { CalendarEventsView } from './components/views/CalendarEventsView';
import { HomeworkView } from './components/views/HomeworkView';
import { CompetencyView } from './components/views/CompetencyView';
import { AdmissionRegisterView } from './components/views/AdmissionRegisterView';
import { ClassSubjectView } from './components/views/ClassSubjectView';
import { SmsView } from './components/views/SmsView';
import { SecurityBackupView } from './components/views/SecurityBackupView';
import { SuperAdminDashboardView } from './components/views/SuperAdminDashboardView';
import { PublicSchoolLandingView } from './components/views/PublicSchoolLandingView';

import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Receipt,
  Menu
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    isLogoModalOpen,
    setIsLogoModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState('');

  const renderView = () => {
    switch (currentView) {
      case 'super_admin_dashboard':
        return <SuperAdminDashboardView />;
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentView />;
      case 'attendance':
        return <AttendanceView />;
      case 'results':
        return <ResultView />;
      case 'exam_routine':
        return <ExamRoutineView />;
      case 'class_routine':
        return <RoutineView />;
      case 'live_routine':
        return <LiveRoutineView />;
      case 'fees':
        return <FeesView />;
      case 'certificates':
        return <CertificatesView />;
      case 'notices':
        return <NoticeView />;
      case 'calendar':
        return <CalendarEventsView />;
      case 'homework':
        return <HomeworkView />;
      case 'competency':
        return <CompetencyView />;
      case 'stipend':
        return <AdmissionRegisterView />;
      case 'class_subjects':
        return <ClassSubjectView />;
      case 'sms':
        return <SmsView />;
      case 'security':
        return <SecurityBackupView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* When Logged Out: Show ONLY Public School Portal (Welcome, Notices, Calendar, Gallery, Map) */}
      {!currentUser ? (
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-3.5 sm:p-6 lg:p-8">
          <PublicSchoolLandingView onOpenLogin={() => setLoginModalOpen(true)} />
        </main>
      ) : (
        <>
          <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
            {/* Navigation Sidebar */}
            <Sidebar
              mobileOpen={mobileMenuOpen}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-full overflow-x-hidden pb-20 lg:pb-8">
              {renderView()}
            </main>
          </div>

          {/* Mobile Sticky Bottom Quick Bar */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around text-[10px] font-bold no-print shadow-lg">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'dashboard'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>ড্যাশবোর্ড</span>
            </button>

            <button
              onClick={() => setCurrentView('attendance')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'attendance'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
              <span>হাজিরা</span>
            </button>

            <button
              onClick={() => setCurrentView('live_routine')}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                currentView === 'live_routine'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Clock className="w-5 h-5" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-ping"></span>
              </div>
              <span>লাইভ ঘড়ি</span>
            </button>

            <button
              onClick={() => setCurrentView('fees')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'fees'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>ফি আদায়</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>মেনু</span>
            </button>
          </nav>
        </>
      )}

      {/* Auth & 2FA Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onRequire2FA={(email) => {
          setTwoFactorEmail(email);
          setTwoFactorModalOpen(true);
        }}
      />

      <TwoFactorModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        email={twoFactorEmail}
      />

      {/* School Logo & Signature Upload Modal */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* Register New School & Super Admin Modal */}
      <RegisterSchoolModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
