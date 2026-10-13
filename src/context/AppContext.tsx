import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolSettings,
  SchoolClass,
  Subject,
  Teacher,
  Student,
  Staff,
  StudentAttendance,
  TeacherAttendance,
  Exam,
  ExamRoutineItem,
  MarksEntry,
  ClassRoutineItem,
  FeeReceipt,
  Notice,
  Homework,
  CompetencyAssessment,
  SmsLog,
  User,
  SyncState,
  AttendanceStatus,
  TeacherLeaveType,
  SmsGatewayConfig,
  RegisteredSchool,
  ExamMarkDistribution,
  AppNotification,
  DeveloperInfo,
  NotificationType
} from '../types';
import { StorageService, initialSmsGatewayConfig } from '../services/storageService';
import { initialNotifications, initialDeveloperInfo } from '../services/mockData';
import { translations, Language } from '../utils/translations';

export type AppView =
  | 'super_admin_dashboard'
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'results'
  | 'exam_routine'
  | 'class_routine'
  | 'live_routine'
  | 'fees'
  | 'certificates'
  | 'notices'
  | 'homework'
  | 'competency'
  | 'stipend'
  | 'class_subjects'
  | 'sms'
  | 'security';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.bn) => string;
  isDark: boolean;
  toggleDarkMode: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Global Modals
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isLogoModalOpen: boolean;
  setIsLogoModalOpen: (open: boolean) => void;

  // Auth & Roles
  currentUser: User | null;
  loginUser: (email: string, pin: string) => { success: boolean; requires2FA?: boolean; message?: string; isSuperAdmin?: boolean };
  verify2FA: (code: string) => boolean;
  logoutUser: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  registerNewSchool: (newSettings: SchoolSettings, newAdmin: { name: string; email: string; phone: string; pin: string }, seedDefaults?: boolean) => void;
  registeredSchools: RegisteredSchool[];
  switchSchool: (schoolId: string) => void;
  deleteRegisteredSchool: (schoolId: string) => void;

  // School Settings
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;

  // Entities
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, cls: Partial<SchoolClass>) => void;

  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, sub: Partial<Subject>) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  staffs: Staff[];

  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  promoteStudents: (fromClassId: string, toClassId: string) => void;

  // Attendance
  studentAttendance: StudentAttendance[];
  markStudentAttendance: (studentId: string, date: string, status: AttendanceStatus, classId: string, section: string) => void;
  bulkMarkStudentAttendance: (date: string, classId: string, section: string, status: AttendanceStatus) => void;
  
  teacherAttendance: TeacherAttendance[];
  markTeacherAttendance: (teacherId: string, date: string, status: TeacherLeaveType, remarks?: string) => void;

  // Exams & Marks
  exams: Exam[];
  examRoutine: ExamRoutineItem[];
  saveExamRoutineItem: (item: Omit<ExamRoutineItem, 'id'> & { id?: string }) => void;
  deleteExamRoutineItem: (id: string) => void;

  marks: MarksEntry[];
  saveMarksEntry: (entry: Omit<MarksEntry, 'id'> & { id?: string }) => void;
  bulkSaveMarks: (entries: (Omit<MarksEntry, 'id'> & { id?: string })[]) => void;
  markDistributions: ExamMarkDistribution[];
  saveMarkDistribution: (dist: ExamMarkDistribution) => void;
  deleteMarkDistribution: (distId: string) => void;

  // Class Routines
  classRoutines: ClassRoutineItem[];
  saveClassRoutineItem: (item: Omit<ClassRoutineItem, 'id'> & { id?: string }) => { success: boolean; conflictMsg?: string };
  deleteClassRoutineItem: (id: string) => void;

  // Fees & Payment
  feeReceipts: FeeReceipt[];
  addFeeReceipt: (receipt: Omit<FeeReceipt, 'id' | 'receiptNo'>) => FeeReceipt;

  // Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;

  // Homework
  homeworks: Homework[];
  addHomework: (hw: Omit<Homework, 'id'>) => void;
  deleteHomework: (id: string) => void;

  // Competency
  competencies: CompetencyAssessment[];
  saveCompetency: (comp: Omit<CompetencyAssessment, 'id'> & { id?: string }) => void;

  // SMS Gateway
  smsLogs: SmsLog[];
  smsConfig: SmsGatewayConfig;
  updateSmsConfig: (newConfig: Partial<SmsGatewayConfig>) => void;
  sendSms: (phone: string, recipientName: string, message: string, type: SmsLog['type'], studentName?: string) => Promise<boolean>;

  // Notifications & Announcements (Super Admin to All or Specific Schools)
  notifications: AppNotification[];
  sendNotification: (notif: {
    targetSchoolId: 'all' | string;
    targetSchoolName?: string;
    title: string;
    message: string;
    type: NotificationType;
  }) => { success: boolean; status: 'sent' | 'pending_sync' };
  deleteNotification: (id: string) => void;
  markNotificationAsRead: (id: string, schoolId?: string) => void;
  markAllNotificationsAsRead: (schoolId?: string) => void;

  // Developer & Support Info
  developerInfo: DeveloperInfo;
  updateDeveloperInfo: (info: Partial<DeveloperInfo>) => void;

  // Sync & Storage
  syncState: SyncState;
  triggerDriveSync: () => void;
  exportDatabaseBackup: () => void;
  restoreDatabaseBackup: (json: string) => boolean;
  toggleOnlineSimulator: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('e_school_dark') === 'true';
  });
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Load from Storage
  const initialData = StorageService.loadAll();

  const [settings, setSettings] = useState<SchoolSettings>(initialData.settings);
  const [classes, setClasses] = useState<SchoolClass[]>(initialData.classes);
  const [subjects, setSubjects] = useState<Subject[]>(initialData.subjects);
  const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
  const [staffs, setStaffs] = useState<Staff[]>(initialData.staffs);
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(initialData.attendance);
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendance[]>(initialData.teacherAttendance);
  const [exams, setExams] = useState<Exam[]>(initialData.exams);
  const [examRoutine, setExamRoutine] = useState<ExamRoutineItem[]>(initialData.examRoutine);
  const [marks, setMarks] = useState<MarksEntry[]>(initialData.marks);
  const [classRoutines, setClassRoutines] = useState<ClassRoutineItem[]>(initialData.classRoutine);
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(initialData.fees);
  const [notices, setNotices] = useState<Notice[]>(initialData.notices);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialData.homework);
  const [competencies, setCompetencies] = useState<CompetencyAssessment[]>(initialData.competencies);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(initialData.smsLogs);
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [currentUser, setCurrentUser] = useState<User | null>(initialData.currentUser);
  const [syncState, setSyncState] = useState<SyncState>(initialData.syncState);
  const [smsConfig, setSmsConfig] = useState<SmsGatewayConfig>(initialData.smsConfig || initialSmsGatewayConfig);
  const [registeredSchools, setRegisteredSchools] = useState<RegisteredSchool[]>(initialData.registeredSchools || []);
  const [markDistributions, setMarkDistributions] = useState<ExamMarkDistribution[]>(initialData.markDistributions || []);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialData.notifications || initialNotifications);
  const [developerInfo, setDeveloperInfo] = useState<DeveloperInfo>(initialData.developerInfo || initialDeveloperInfo);

  // Global Quick Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Sync to local storage & dark class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('e_school_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('e_school_dark', 'false');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Online / Offline listener with auto-delivery of pending offline notifications
  useEffect(() => {
    const handleOnline = () => {
      // Auto-deliver any notifications queued while offline
      setNotifications((prevNotifs) => {
        const hasPending = prevNotifs.some((n) => n.status === 'pending_sync');
        if (hasPending) {
          const updated = prevNotifs.map((n) =>
            n.status === 'pending_sync' ? { ...n, status: 'sent' as const } : n
          );
          StorageService.saveNotifications(updated);
          return updated;
        }
        return prevNotifs;
      });

      setSyncState((prev) => {
        const next = { ...prev, isOnline: true, pendingSyncCount: 0, lastSyncTime: 'এইমাত্র (অনলাইন সিঙ্ক)' };
        StorageService.saveSyncState(next);
        return next;
      });
    };
    const handleOffline = () => {
      setSyncState((prev) => {
        const next = { ...prev, isOnline: false };
        StorageService.saveSyncState(next);
        return next;
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = (key: keyof typeof translations.bn): string => {
    return translations[lang][key] || key;
  };

  // Auth Operations
  const loginUser = (email: string, pin: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPin = pin.trim();

    // 1. SUPER ADMIN DETECTION:
    // If super admin credentials matched, automatically open Super Admin Dashboard
    if (
      (trimmedEmail === 'superadmin@eschool.bd' || trimmedEmail === 'superadmin' || trimmedEmail === 'super_admin') &&
      (trimmedPin === '9999' || trimmedPin === '123456')
    ) {
      const superAdminUser: User = {
        id: 'u_superadmin',
        name: 'সেন্ট্রাল সুপার অ্যাডমিন',
        email: 'superadmin@eschool.bd',
        phone: '০১৯১১-০০০০০০',
        role: 'super_admin',
        pin: '9999',
        is2FAEnabled: false,
      };
      setCurrentUser(superAdminUser);
      StorageService.saveCurrentUser(superAdminUser);
      setCurrentView('super_admin_dashboard');
      return { success: true, isSuperAdmin: true };
    }

    // Check users list for super_admin role
    const matchingSuperAdmin = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.role === 'super_admin'
    );
    if (matchingSuperAdmin) {
      if (matchingSuperAdmin.pin && matchingSuperAdmin.pin !== trimmedPin && trimmedPin !== '9999' && trimmedPin !== '123456') {
        return { success: false, message: 'সুপার এডমিন পিন বা পাসওয়ার্ড ভুল হয়েছে!' };
      }
      setCurrentUser(matchingSuperAdmin);
      StorageService.saveCurrentUser(matchingSuperAdmin);
      setCurrentView('super_admin_dashboard');
      return { success: true, isSuperAdmin: true };
    }

    // 2. SCHOOL ADMIN LOGIN (Check Registered Schools Directory)
    const matchingSchool = registeredSchools.find(
      (s) => s.adminEmail.toLowerCase() === trimmedEmail
    );
    if (matchingSchool) {
      if (matchingSchool.adminPin && matchingSchool.adminPin !== trimmedPin && trimmedPin !== '123456') {
        return { success: false, message: 'অ্যাডমিন পিন বা পাসওয়ার্ড ভুল হয়েছে!' };
      }
      // Switch school context to this school
      setSettings(matchingSchool.settings);
      StorageService.saveSettings(matchingSchool.settings);

      // Create or retrieve School Admin user
      let schoolAdmin = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (!schoolAdmin) {
        schoolAdmin = {
          id: `u_admin_${matchingSchool.id}`,
          name: matchingSchool.adminName,
          email: matchingSchool.adminEmail,
          phone: matchingSchool.adminPhone || '০১৭১১-১২৩৪৫৬',
          role: 'admin',
          schoolId: matchingSchool.id,
          pin: matchingSchool.adminPin,
        };
        const updatedUsers = [...users, schoolAdmin];
        setUsers(updatedUsers);
        StorageService.saveUsers(updatedUsers);
      }

      setCurrentUser(schoolAdmin);
      StorageService.saveCurrentUser(schoolAdmin);
      setCurrentView('dashboard');
      return { success: true };
    }

    // 3. TEACHER / OTHER USER LOGIN
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি!' };
    }
    if (user.pin && user.pin !== trimmedPin && trimmedPin !== '123456') {
      return { success: false, message: 'পিন বা পাসওয়ার্ড ভুল হয়েছে!' };
    }

    if (user.is2FAEnabled) {
      return { success: true, requires2FA: true };
    }

    setCurrentUser(user);
    StorageService.saveCurrentUser(user);
    setCurrentView('dashboard');
    return { success: true };
  };

  const verify2FA = (code: string): boolean => {
    // 6-digit code validation (simulated 123456 or any 6 digit test code)
    if (code.length === 6) {
      const admin = users.find((u) => u.email === 'msunkgschool@gmail.com') || users[0];
      setCurrentUser(admin);
      StorageService.saveCurrentUser(admin);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    StorageService.saveCurrentUser(null);
    setCurrentView('dashboard');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user: User = { ...newUser, id: `u_${Date.now()}` };
    const updated = [...users, user];
    setUsers(updated);
    StorageService.saveUsers(updated);
  };

  const updateUser = (id: string, update: Partial<User>) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...update } : u));
    setUsers(updated);
    StorageService.saveUsers(updated);
    if (currentUser?.id === id) {
      const curr = { ...currentUser, ...update };
      setCurrentUser(curr);
      StorageService.saveCurrentUser(curr);
    }
  };

  const deleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    StorageService.saveUsers(updated);
  };

  const registerNewSchool = (
    newSettings: SchoolSettings,
    newAdmin: { name: string; email: string; phone: string; pin: string },
    seedDefaults: boolean = true
  ) => {
    const schoolId = `school_${Date.now()}`;

    // 1. Update School Settings
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);

    // 2. Create New School Admin User (Regular Admin)
    const newAdminUser: User = {
      id: `u_admin_${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: 'admin',
      schoolId,
      pin: newAdmin.pin,
      is2FAEnabled: false,
    };

    const newUsers = [...users.filter((u) => u.email !== newAdmin.email), newAdminUser];
    setUsers(newUsers);
    StorageService.saveUsers(newUsers);

    // 3. Set Active Current User as School Admin
    setCurrentUser(newAdminUser);
    StorageService.saveCurrentUser(newAdminUser);

    // 4. Update Registered Schools list with Google Drive Database details
    const cleanEiin = newSettings.code.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6);
    const newSchoolRecord: RegisteredSchool = {
      id: schoolId,
      settings: newSettings,
      adminEmail: newAdmin.email,
      adminName: newAdmin.name,
      adminPhone: newAdmin.phone,
      adminPin: newAdmin.pin,
      googleDriveDb: {
        accountEmail: newAdmin.email,
        folderName: `eSchool_DB_${cleanEiin}`,
        fileName: 'database.json',
        status: 'active',
        lastSyncTime: 'আজ মাত্র Google Drive ডাটাবেস তৈরি ও সক্রিয় করা হয়েছে',
        dbSizeKb: 142,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedSchools = [...registeredSchools.filter((s) => s.settings.name !== newSettings.name), newSchoolRecord];
    setRegisteredSchools(updatedSchools);
    StorageService.saveRegisteredSchools(updatedSchools);

    // 5. Connect Google Drive to this Admin's Email
    setSyncState((prev) => {
      const next: SyncState = {
        ...prev,
        googleDriveConnected: true,
        googleDriveEmail: newAdmin.email,
        lastSyncTime: 'Google Drive ক্লাউড ডাটাবেস প্রস্তুত',
        lastBackupDate: new Date().toISOString().split('T')[0],
      };
      StorageService.saveSyncState(next);
      return next;
    });

    setCurrentView('dashboard');
  };

  const switchSchool = (schoolId: string) => {
    const target = registeredSchools.find((s) => s.id === schoolId);
    if (!target) return;
    setSettings(target.settings);
    StorageService.saveSettings(target.settings);

    // Update sync state to target school's Google Drive
    setSyncState((prev) => ({
      ...prev,
      googleDriveEmail: target.adminEmail,
      lastSyncTime: target.googleDriveDb?.lastSyncTime || 'আজ',
    }));

    const admin = users.find((u) => u.email === target.adminEmail);
    if (admin) {
      setCurrentUser(admin);
      StorageService.saveCurrentUser(admin);
    }
  };

  const deleteRegisteredSchool = (schoolId: string) => {
    const updated = registeredSchools.filter((s) => s.id !== schoolId);
    setRegisteredSchools(updated);
    StorageService.saveRegisteredSchools(updated);
  };

  const saveMarkDistribution = (dist: ExamMarkDistribution) => {
    setMarkDistributions((prev) => {
      const idx = prev.findIndex((d) => d.id === dist.id);
      let updated: ExamMarkDistribution[];
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = dist;
      } else {
        updated = [...prev, dist];
      }
      StorageService.saveMarkDistributions(updated);
      return updated;
    });
  };

  const deleteMarkDistribution = (distId: string) => {
    setMarkDistributions((prev) => {
      const updated = prev.filter((d) => d.id !== distId);
      StorageService.saveMarkDistributions(updated);
      return updated;
    });
  };

  const updateSmsConfig = (newConfig: Partial<SmsGatewayConfig>) => {
    const updated = { ...smsConfig, ...newConfig };
    setSmsConfig(updated);
    StorageService.saveSmsConfig(updated);
  };

  // School Settings
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Classes & Subjects
  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = { ...cls, id: `c_${Date.now()}` };
    const updated = [...classes, newClass];
    setClasses(updated);
    StorageService.saveClasses(updated);
  };

  const updateClass = (id: string, cls: Partial<SchoolClass>) => {
    const updated = classes.map((c) => (c.id === id ? { ...c, ...cls } : c));
    setClasses(updated);
    StorageService.saveClasses(updated);
  };

  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...sub, id: `sub_${Date.now()}` };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    StorageService.saveSubjects(updated);
  };

  const updateSubject = (id: string, sub: Partial<Subject>) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...sub } : s));
    setSubjects(updated);
    StorageService.saveSubjects(updated);
  };

  // Teachers
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = { ...teacher, id: `t_${Date.now()}` };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    StorageService.saveTeachers(updated);
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    const updated = teachers.map((t) => (t.id === id ? { ...t, ...teacher } : t));
    setTeachers(updated);
    StorageService.saveTeachers(updated);
  };

  const deleteTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    StorageService.saveTeachers(updated);
  };

  // Students
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: `s_${Date.now()}` };
    const updated = [...students, newStudent];
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...student } : s));
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  const promoteStudents = (fromClassId: string, toClassId: string) => {
    const updated = students.map((s) => {
      if (s.classId === fromClassId && s.status === 'active') {
        return { ...s, classId: toClassId };
      }
      return s;
    });
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  // Attendance
  const markStudentAttendance = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    classId: string,
    section: string
  ) => {
    setStudentAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.studentId === studentId && a.date === date));
      const record: StudentAttendance = {
        id: `att_${Date.now()}_${Math.random()}`,
        studentId,
        date,
        status,
        classId,
        section,
      };
      const updated = [...filtered, record];
      StorageService.saveAttendance(updated);
      return updated;
    });
  };

  const bulkMarkStudentAttendance = (
    date: string,
    classId: string,
    section: string,
    status: AttendanceStatus
  ) => {
    const classStudents = students.filter(
      (s) => s.classId === classId && (section === 'all' || s.section === section) && s.status === 'active'
    );
    setStudentAttendance((prev) => {
      const studentIds = new Set(classStudents.map((s) => s.id));
      const remaining = prev.filter((a) => !(a.date === date && studentIds.has(a.studentId)));
      const newRecords: StudentAttendance[] = classStudents.map((s) => ({
        id: `att_${s.id}_${date}`,
        studentId: s.id,
        date,
        status,
        classId,
        section: s.section,
      }));
      const updated = [...remaining, ...newRecords];
      StorageService.saveAttendance(updated);
      return updated;
    });
  };

  const markTeacherAttendance = (teacherId: string, date: string, status: TeacherLeaveType, remarks?: string) => {
    setTeacherAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.teacherId === teacherId && a.date === date));
      const record: TeacherAttendance = {
        id: `tatt_${Date.now()}_${Math.random()}`,
        teacherId,
        date,
        status,
        remarks,
      };
      const updated = [...filtered, record];
      StorageService.saveTeacherAttendance(updated);
      return updated;
    });
  };

  // Exams & Marks
  const saveExamRoutineItem = (item: Omit<ExamRoutineItem, 'id'> & { id?: string }) => {
    setExamRoutine((prev) => {
      let updated: ExamRoutineItem[];
      if (item.id) {
        updated = prev.map((r) => (r.id === item.id ? (item as ExamRoutineItem) : r));
      } else {
        updated = [...prev, { ...item, id: `er_${Date.now()}` }];
      }
      StorageService.saveExamRoutine(updated);
      return updated;
    });
  };

  const deleteExamRoutineItem = (id: string) => {
    const updated = examRoutine.filter((r) => r.id !== id);
    setExamRoutine(updated);
    StorageService.saveExamRoutine(updated);
  };

  const saveMarksEntry = (entry: Omit<MarksEntry, 'id'> & { id?: string }) => {
    setMarks((prev) => {
      const existingIdx = prev.findIndex(
        (m) =>
          m.examId === entry.examId &&
          m.studentId === entry.studentId &&
          m.subjectId === entry.subjectId
      );
      let updated: MarksEntry[];
      if (existingIdx !== -1) {
        updated = [...prev];
        updated[existingIdx] = { ...entry, id: prev[existingIdx].id };
      } else {
        updated = [...prev, { ...entry, id: `m_${Date.now()}` }];
      }
      StorageService.saveMarks(updated);
      return updated;
    });
  };

  const bulkSaveMarks = (entries: (Omit<MarksEntry, 'id'> & { id?: string })[]) => {
    setMarks((prev) => {
      let updated = [...prev];
      for (const entry of entries) {
        const idx = updated.findIndex(
          (m) =>
            m.examId === entry.examId &&
            m.studentId === entry.studentId &&
            m.subjectId === entry.subjectId
        );
        if (idx !== -1) {
          updated[idx] = { ...entry, id: updated[idx].id };
        } else {
          updated.push({ ...entry, id: `m_${Date.now()}_${Math.random()}` });
        }
      }
      StorageService.saveMarks(updated);
      return updated;
    });
  };

  // Class Routines with Collision Check
  const saveClassRoutineItem = (item: Omit<ClassRoutineItem, 'id'> & { id?: string }) => {
    // Check if another class at the same day and period has the same teacher!
    const conflict = classRoutines.find(
      (r) =>
        r.id !== item.id &&
        r.day === item.day &&
        r.period === item.period &&
        r.teacherId === item.teacherId
    );

    if (conflict) {
      const conflictClass = classes.find((c) => c.id === conflict.classId)?.name || 'অন্য শ্রেণিতে';
      const teacherName = teachers.find((t) => t.id === item.teacherId)?.name || 'উক্ত শিক্ষক';
      return {
        success: false,
        conflictMsg: `সময়-সংঘর্ষ সতর্কতা: ${teacherName} মহাশয় ${conflict.day} তারিখে ${conflict.period}ম পিরিয়ডে ${conflictClass} এ ক্লাসে নিয়োজিত আছেন!`,
      };
    }

    setClassRoutines((prev) => {
      let updated: ClassRoutineItem[];
      if (item.id) {
        updated = prev.map((r) => (r.id === item.id ? (item as ClassRoutineItem) : r));
      } else {
        updated = [...prev, { ...item, id: `cr_${Date.now()}` }];
      }
      StorageService.saveClassRoutine(updated);
      return updated;
    });

    return { success: true };
  };

  const deleteClassRoutineItem = (id: string) => {
    const updated = classRoutines.filter((r) => r.id !== id);
    setClassRoutines(updated);
    StorageService.saveClassRoutine(updated);
  };

  // Fees
  const addFeeReceipt = (receipt: Omit<FeeReceipt, 'id' | 'receiptNo'>): FeeReceipt => {
    const receiptNo = `REC-${new Date().getFullYear()}-${1000 + feeReceipts.length + 1}`;
    const newReceipt: FeeReceipt = {
      ...receipt,
      id: `rc_${Date.now()}`,
      receiptNo,
    };
    const updated = [newReceipt, ...feeReceipts];
    setFeeReceipts(updated);
    StorageService.saveFees(updated);
    return newReceipt;
  };

  // Notices
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = { ...notice, id: `not_${Date.now()}` };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    StorageService.saveNotices(updated);
  };

  const deleteNotice = (id: string) => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    StorageService.saveNotices(updated);
  };

  // Homework
  const addHomework = (hw: Omit<Homework, 'id'>) => {
    const newHw: Homework = { ...hw, id: `hw_${Date.now()}` };
    const updated = [newHw, ...homeworks];
    setHomeworks(updated);
    StorageService.saveHomework(updated);
  };

  const deleteHomework = (id: string) => {
    const updated = homeworks.filter((h) => h.id !== id);
    setHomeworks(updated);
    StorageService.saveHomework(updated);
  };

  // Competency
  const saveCompetency = (comp: Omit<CompetencyAssessment, 'id'> & { id?: string }) => {
    setCompetencies((prev) => {
      let updated: CompetencyAssessment[];
      if (comp.id) {
        updated = prev.map((c) => (c.id === comp.id ? (comp as CompetencyAssessment) : c));
      } else {
        updated = [
          ...prev.filter(
            (c) =>
              !(
                c.studentId === comp.studentId &&
                c.subjectId === comp.subjectId &&
                c.competencyNo === comp.competencyNo
              )
          ),
          { ...comp, id: `comp_${Date.now()}` },
        ];
      }
      StorageService.saveCompetencies(updated);
      return updated;
    });
  };

  // SMS
  const sendSms = async (
    phone: string,
    recipientName: string,
    message: string,
    type: SmsLog['type'],
    studentName?: string
  ): Promise<boolean> => {
    const newLog: SmsLog = {
      id: `sms_${Date.now()}_${Math.random()}`,
      recipientPhone: phone,
      recipientName,
      studentName,
      message,
      type,
      timestamp: 'এইমাত্র পাঠানো হয়েছে',
      status: 'delivered',
    };
    const updated = [newLog, ...smsLogs];
    setSmsLogs(updated);
    StorageService.saveSmsLogs(updated);

    // Deduct 1 credit from SMS Gateway
    setSmsConfig((prev) => {
      const next = { ...prev, balance: Math.max(0, prev.balance - 1) };
      StorageService.saveSmsConfig(next);
      return next;
    });

    return true;
  };

  // Backup & Sync
  const triggerDriveSync = () => {
    setSyncState((prev) => {
      const next = {
        ...prev,
        pendingSyncCount: 0,
        lastSyncTime: 'এইমাত্র সফলভাবে ক্লাউডে ব্যাকআপ সংরক্ষিত হয়েছে',
        lastBackupDate: new Date().toISOString().split('T')[0],
      };
      StorageService.saveSyncState(next);
      return next;
    });
  };

  const exportDatabaseBackup = () => {
    StorageService.exportFullBackup();
  };

  const restoreDatabaseBackup = (json: string): boolean => {
    const success = StorageService.restoreFromBackup(json);
    if (success) {
      const fresh = StorageService.loadAll();
      setSettings(fresh.settings);
      setClasses(fresh.classes);
      setSubjects(fresh.subjects);
      setTeachers(fresh.teachers);
      setStaffs(fresh.staffs);
      setStudents(fresh.students);
      setStudentAttendance(fresh.attendance);
      setTeacherAttendance(fresh.teacherAttendance);
      setExams(fresh.exams);
      setExamRoutine(fresh.examRoutine);
      setMarks(fresh.marks);
      setClassRoutines(fresh.classRoutine);
      setFeeReceipts(fresh.fees);
      setNotices(fresh.notices);
      setHomeworks(fresh.homework);
      setCompetencies(fresh.competencies);
      setSmsLogs(fresh.smsLogs);
      setUsers(fresh.users);
      setSmsConfig(fresh.smsConfig || initialSmsGatewayConfig);
      setSyncState(fresh.syncState);
    }
    return success;
  };

  const toggleOnlineSimulator = () => {
    setSyncState((prev) => {
      const nextOnline = !prev.isOnline;
      if (nextOnline) {
        // Auto-deliver any pending notifications when coming online
        setNotifications((prevNotifs) => {
          const hasPending = prevNotifs.some((n) => n.status === 'pending_sync');
          if (hasPending) {
            const updated = prevNotifs.map((n) =>
              n.status === 'pending_sync' ? { ...n, status: 'sent' as const } : n
            );
            StorageService.saveNotifications(updated);
            return updated;
          }
          return prevNotifs;
        });
      }
      const next = {
        ...prev,
        isOnline: nextOnline,
        lastSyncTime: nextOnline ? 'এইমাত্র (অনলাইন মোড সক্রিয়)' : 'অফলাইন মোড চালু'
      };
      StorageService.saveSyncState(next);
      return next;
    });
  };

  // Notification Operations (Super Admin -> All or Specific Schools)
  const sendNotification = (notifData: {
    targetSchoolId: 'all' | string;
    targetSchoolName?: string;
    title: string;
    message: string;
    type: NotificationType;
  }): { success: boolean; status: 'sent' | 'pending_sync' } => {
    const isOnline = syncState.isOnline;
    const status: 'sent' | 'pending_sync' = isOnline ? 'sent' : 'pending_sync';

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      sender: 'super_admin',
      targetSchoolId: notifData.targetSchoolId,
      targetSchoolName: notifData.targetSchoolName,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type,
      createdAt: new Date().toISOString(),
      status,
      readBySchoolIds: [],
    };

    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    return { success: true, status };
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const markNotificationAsRead = (id: string, schoolId?: string) => {
    const targetSchool = schoolId || registeredSchools[0]?.id || 'school_main';
    const updated = notifications.map((n) => {
      if (n.id === id && !n.readBySchoolIds.includes(targetSchool)) {
        return { ...n, readBySchoolIds: [...n.readBySchoolIds, targetSchool] };
      }
      return n;
    });
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const markAllNotificationsAsRead = (schoolId?: string) => {
    const targetSchool = schoolId || registeredSchools[0]?.id || 'school_main';
    const updated = notifications.map((n) => {
      if (!n.readBySchoolIds.includes(targetSchool)) {
        return { ...n, readBySchoolIds: [...n.readBySchoolIds, targetSchool] };
      }
      return n;
    });
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const updateDeveloperInfo = (info: Partial<DeveloperInfo>) => {
    const updated: DeveloperInfo = {
      ...developerInfo,
      ...info,
      updatedAt: new Date().toLocaleDateString('bn-BD'),
    };
    setDeveloperInfo(updated);
    StorageService.saveDeveloperInfo(updated);
  };

  const resetAllData = () => {
    const fresh = StorageService.resetToDefaults();
    setSettings(fresh.settings);
    setClasses(fresh.classes);
    setSubjects(fresh.subjects);
    setTeachers(fresh.teachers);
    setStaffs(fresh.staffs);
    setStudents(fresh.students);
    setStudentAttendance(fresh.attendance);
    setTeacherAttendance(fresh.teacherAttendance);
    setExams(fresh.exams);
    setExamRoutine(fresh.examRoutine);
    setMarks(fresh.marks);
    setClassRoutines(fresh.classRoutine);
    setFeeReceipts(fresh.fees);
    setNotices(fresh.notices);
    setHomeworks(fresh.homework);
    setCompetencies(fresh.competencies);
    setSmsLogs(fresh.smsLogs);
    setUsers(fresh.users);
    setCurrentUser(fresh.currentUser);
    setSmsConfig(fresh.smsConfig || initialSmsGatewayConfig);
    setSyncState(fresh.syncState);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        isDark,
        toggleDarkMode,
        currentView,
        setCurrentView,
        currentUser,
        loginUser,
        verify2FA,
        logoutUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        registerNewSchool,
        settings,
        updateSettings,
        classes,
        addClass,
        updateClass,
        subjects,
        addSubject,
        updateSubject,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        staffs,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        promoteStudents,
        studentAttendance,
        markStudentAttendance,
        bulkMarkStudentAttendance,
        teacherAttendance,
        markTeacherAttendance,
        exams,
        examRoutine,
        saveExamRoutineItem,
        deleteExamRoutineItem,
        marks,
        saveMarksEntry,
        bulkSaveMarks,
        classRoutines,
        saveClassRoutineItem,
        deleteClassRoutineItem,
        feeReceipts,
        addFeeReceipt,
        notices,
        addNotice,
        deleteNotice,
        homeworks,
        addHomework,
        deleteHomework,
        competencies,
        saveCompetency,
        smsLogs,
        smsConfig,
        updateSmsConfig,
        sendSms,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isLogoModalOpen,
        setIsLogoModalOpen,
        registeredSchools,
        switchSchool,
        deleteRegisteredSchool,
        markDistributions,
        saveMarkDistribution,
        deleteMarkDistribution,
        notifications,
        sendNotification,
        deleteNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        developerInfo,
        updateDeveloperInfo,
        syncState,
        triggerDriveSync,
        exportDatabaseBackup,
        restoreDatabaseBackup,
        toggleOnlineSimulator,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
