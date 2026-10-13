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
  SmsGatewayConfig,
  RegisteredSchool,
  ExamMarkDistribution,
  AppNotification,
  DeveloperInfo,
  SchoolEvent,
  SchoolGalleryImage
} from '../types';

import {
  initialSchoolSettings,
  initialClasses,
  initialTeachers,
  initialStaffs,
  initialUsers,
  initialSubjects,
  initialStudents,
  initialStudentAttendance,
  initialTeacherAttendance,
  initialExams,
  initialExamRoutine,
  initialMarks,
  initialClassRoutines,
  initialFeeReceipts,
  initialNotices,
  initialHomeworks,
  initialCompetencies,
  initialSmsLogs,
  initialMarkDistributions,
  initialNotifications,
  initialDeveloperInfo,
  defaultInfrastructure,
  initialSchoolEvents,
  initialGalleryImages
} from './mockData';

export const initialSmsGatewayConfig: SmsGatewayConfig = {
  provider: 'greenweb',
  apiKey: 'gw_live_98a72b14c3e8',
  senderId: 'PRIMARYSCH',
  apiEndpoint: 'https://api.greenweb.com.bd/api.php',
  clientId: 'CLIENT-PRIMARY-101',
  balance: 4850,
  isActive: true,
  isMasking: true,
};

const STORAGE_KEYS = {
  SETTINGS: 'e_school_settings',
  CLASSES: 'e_school_classes',
  SUBJECTS: 'e_school_subjects',
  TEACHERS: 'e_school_teachers',
  STAFFS: 'e_school_staffs',
  STUDENTS: 'e_school_students',
  ATTENDANCE: 'e_school_attendance',
  TEACHER_ATTENDANCE: 'e_school_teacher_attendance',
  EXAMS: 'e_school_exams',
  EXAM_ROUTINE: 'e_school_exam_routine',
  MARKS: 'e_school_marks',
  CLASS_ROUTINE: 'e_school_class_routine',
  FEES: 'e_school_fees',
  NOTICES: 'e_school_notices',
  HOMEWORK: 'e_school_homework',
  COMPETENCY: 'e_school_competency',
  SMS_LOGS: 'e_school_sms_logs',
  USERS: 'e_school_users',
  SYNC_STATE: 'e_school_sync_state',
  CURRENT_USER: 'e_school_current_user',
  SMS_CONFIG: 'e_school_sms_config',
  REGISTERED_SCHOOLS: 'e_school_registered_schools',
  MARK_DISTRIBUTIONS: 'e_school_mark_distributions',
  NOTIFICATIONS: 'e_school_notifications',
  DEVELOPER_INFO: 'e_school_developer_info',
  EVENTS: 'e_school_events',
  GALLERY_IMAGES: 'e_school_gallery_images',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export class StorageService {
  // Load All State
  static loadAll() {
    return {
      settings: (() => {
        const s = getLocal<SchoolSettings>(STORAGE_KEYS.SETTINGS, initialSchoolSettings);
        if (!s.infrastructure) {
          s.infrastructure = defaultInfrastructure;
          setLocal(STORAGE_KEYS.SETTINGS, s);
        }
        return s;
      })(),
      classes: getLocal<SchoolClass[]>(STORAGE_KEYS.CLASSES, initialClasses),
      subjects: getLocal<Subject[]>(STORAGE_KEYS.SUBJECTS, initialSubjects),
      teachers: getLocal<Teacher[]>(STORAGE_KEYS.TEACHERS, initialTeachers),
      staffs: getLocal<Staff[]>(STORAGE_KEYS.STAFFS, initialStaffs),
      students: getLocal<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
      attendance: getLocal<StudentAttendance[]>(STORAGE_KEYS.ATTENDANCE, initialStudentAttendance),
      teacherAttendance: getLocal<TeacherAttendance[]>(STORAGE_KEYS.TEACHER_ATTENDANCE, initialTeacherAttendance),
      exams: getLocal<Exam[]>(STORAGE_KEYS.EXAMS, initialExams),
      examRoutine: getLocal<ExamRoutineItem[]>(STORAGE_KEYS.EXAM_ROUTINE, initialExamRoutine),
      marks: getLocal<MarksEntry[]>(STORAGE_KEYS.MARKS, initialMarks),
      classRoutine: getLocal<ClassRoutineItem[]>(STORAGE_KEYS.CLASS_ROUTINE, initialClassRoutines),
      fees: getLocal<FeeReceipt[]>(STORAGE_KEYS.FEES, initialFeeReceipts),
      notices: getLocal<Notice[]>(STORAGE_KEYS.NOTICES, initialNotices),
      events: getLocal<SchoolEvent[]>(STORAGE_KEYS.EVENTS, initialSchoolEvents),
      galleryImages: getLocal<SchoolGalleryImage[]>(STORAGE_KEYS.GALLERY_IMAGES, initialGalleryImages),
      homework: getLocal<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomeworks),
      competencies: getLocal<CompetencyAssessment[]>(STORAGE_KEYS.COMPETENCY, initialCompetencies),
      smsLogs: getLocal<SmsLog[]>(STORAGE_KEYS.SMS_LOGS, initialSmsLogs),
      users: getLocal<User[]>(STORAGE_KEYS.USERS, initialUsers),
      currentUser: getLocal<User | null>(STORAGE_KEYS.CURRENT_USER, initialUsers[1]),
      smsConfig: getLocal<SmsGatewayConfig>(STORAGE_KEYS.SMS_CONFIG, initialSmsGatewayConfig),
      markDistributions: getLocal<ExamMarkDistribution[]>(STORAGE_KEYS.MARK_DISTRIBUTIONS, initialMarkDistributions),
      notifications: getLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
      developerInfo: (() => {
        const loaded = getLocal<DeveloperInfo>(STORAGE_KEYS.DEVELOPER_INFO, initialDeveloperInfo);
        if (loaded.company === 'Smart Education Solutions BD' || !loaded.company) {
          loaded.company = 'APPTECH IT';
          loaded.designation = 'Owner: AppTech IT';
          setLocal(STORAGE_KEYS.DEVELOPER_INFO, loaded);
        }
        return loaded;
      })(),
      registeredSchools: getLocal<RegisteredSchool[]>(STORAGE_KEYS.REGISTERED_SCHOOLS, [
        {
          id: 'school_main',
          settings: initialSchoolSettings,
          adminEmail: 'msunkgschool@gmail.com',
          adminName: 'মো: মতিউর রহমান (প্রধান শিক্ষক)',
          adminPhone: '০১৭০১-১২২২৩৩',
          adminPin: '123456',
          googleDriveDb: {
            accountEmail: 'msunkgschool@gmail.com',
            folderName: 'eSchool_DB_134520',
            fileName: 'database.json',
            status: 'active',
            lastSyncTime: 'আজ সকাল ১০:০০',
            dbSizeKb: 148,
          },
          createdAt: '২০২৬-০১-০১',
        },
      ]),
      syncState: getLocal<SyncState>(STORAGE_KEYS.SYNC_STATE, {
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        lastSyncTime: 'আজ সকাল ১০:০০',
        pendingSyncCount: 0,
        googleDriveConnected: true,
        googleDriveEmail: 'msunkgschool@gmail.com',
        autoSyncEnabled: true,
        lastBackupDate: new Date().toISOString().split('T')[0],
      }),
    };
  }

  // Save specific data
  static saveSettings(settings: SchoolSettings) {
    setLocal(STORAGE_KEYS.SETTINGS, settings);
  }
  static saveClasses(classes: SchoolClass[]) {
    setLocal(STORAGE_KEYS.CLASSES, classes);
  }
  static saveSubjects(subjects: Subject[]) {
    setLocal(STORAGE_KEYS.SUBJECTS, subjects);
  }
  static saveTeachers(teachers: Teacher[]) {
    setLocal(STORAGE_KEYS.TEACHERS, teachers);
  }
  static saveStaffs(staffs: Staff[]) {
    setLocal(STORAGE_KEYS.STAFFS, staffs);
  }
  static saveStudents(students: Student[]) {
    setLocal(STORAGE_KEYS.STUDENTS, students);
  }
  static saveAttendance(att: StudentAttendance[]) {
    setLocal(STORAGE_KEYS.ATTENDANCE, att);
  }
  static saveTeacherAttendance(tatt: TeacherAttendance[]) {
    setLocal(STORAGE_KEYS.TEACHER_ATTENDANCE, tatt);
  }
  static saveExams(exams: Exam[]) {
    setLocal(STORAGE_KEYS.EXAMS, exams);
  }
  static saveExamRoutine(routine: ExamRoutineItem[]) {
    setLocal(STORAGE_KEYS.EXAM_ROUTINE, routine);
  }
  static saveMarks(marks: MarksEntry[]) {
    setLocal(STORAGE_KEYS.MARKS, marks);
  }
  static saveClassRoutine(routine: ClassRoutineItem[]) {
    setLocal(STORAGE_KEYS.CLASS_ROUTINE, routine);
  }
  static saveFees(fees: FeeReceipt[]) {
    setLocal(STORAGE_KEYS.FEES, fees);
  }
  static saveNotices(notices: Notice[]) {
    setLocal(STORAGE_KEYS.NOTICES, notices);
  }
  static saveHomework(homework: Homework[]) {
    setLocal(STORAGE_KEYS.HOMEWORK, homework);
  }
  static saveCompetencies(comps: CompetencyAssessment[]) {
    setLocal(STORAGE_KEYS.COMPETENCY, comps);
  }
  static saveSmsLogs(logs: SmsLog[]) {
    setLocal(STORAGE_KEYS.SMS_LOGS, logs);
  }
  static saveUsers(users: User[]) {
    setLocal(STORAGE_KEYS.USERS, users);
  }
  static saveCurrentUser(user: User | null) {
    setLocal(STORAGE_KEYS.CURRENT_USER, user);
  }
  static saveSmsConfig(config: SmsGatewayConfig) {
    setLocal(STORAGE_KEYS.SMS_CONFIG, config);
  }
  static saveRegisteredSchools(schools: RegisteredSchool[]) {
    setLocal(STORAGE_KEYS.REGISTERED_SCHOOLS, schools);
  }
  static saveEvents(events: SchoolEvent[]) {
    setLocal(STORAGE_KEYS.EVENTS, events);
  }
  static saveGalleryImages(images: SchoolGalleryImage[]) {
    setLocal(STORAGE_KEYS.GALLERY_IMAGES, images);
  }
  static saveMarkDistributions(dist: ExamMarkDistribution[]) {
    setLocal(STORAGE_KEYS.MARK_DISTRIBUTIONS, dist);
  }
  static saveNotifications(notifs: AppNotification[]) {
    setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
  static saveDeveloperInfo(info: DeveloperInfo) {
    setLocal(STORAGE_KEYS.DEVELOPER_INFO, info);
  }
  static saveSyncState(state: SyncState) {
    setLocal(STORAGE_KEYS.SYNC_STATE, state);
  }

  // Full Database Backup to JSON file
  static exportFullBackup() {
    const data = StorageService.loadAll();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `shikhya_school_backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Restore database from JSON
  static restoreFromBackup(jsonContent: string): boolean {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.settings) setLocal(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (parsed.classes) setLocal(STORAGE_KEYS.CLASSES, parsed.classes);
      if (parsed.subjects) setLocal(STORAGE_KEYS.SUBJECTS, parsed.subjects);
      if (parsed.teachers) setLocal(STORAGE_KEYS.TEACHERS, parsed.teachers);
      if (parsed.staffs) setLocal(STORAGE_KEYS.STAFFS, parsed.staffs);
      if (parsed.students) setLocal(STORAGE_KEYS.STUDENTS, parsed.students);
      if (parsed.attendance) setLocal(STORAGE_KEYS.ATTENDANCE, parsed.attendance);
      if (parsed.teacherAttendance) setLocal(STORAGE_KEYS.TEACHER_ATTENDANCE, parsed.teacherAttendance);
      if (parsed.exams) setLocal(STORAGE_KEYS.EXAMS, parsed.exams);
      if (parsed.examRoutine) setLocal(STORAGE_KEYS.EXAM_ROUTINE, parsed.examRoutine);
      if (parsed.marks) setLocal(STORAGE_KEYS.MARKS, parsed.marks);
      if (parsed.classRoutine) setLocal(STORAGE_KEYS.CLASS_ROUTINE, parsed.classRoutine);
      if (parsed.fees) setLocal(STORAGE_KEYS.FEES, parsed.fees);
      if (parsed.notices) setLocal(STORAGE_KEYS.NOTICES, parsed.notices);
      if (parsed.events) setLocal(STORAGE_KEYS.EVENTS, parsed.events);
      if (parsed.galleryImages) setLocal(STORAGE_KEYS.GALLERY_IMAGES, parsed.galleryImages);
      if (parsed.homework) setLocal(STORAGE_KEYS.HOMEWORK, parsed.homework);
      if (parsed.competencies) setLocal(STORAGE_KEYS.COMPETENCY, parsed.competencies);
      if (parsed.smsLogs) setLocal(STORAGE_KEYS.SMS_LOGS, parsed.smsLogs);
      if (parsed.users) setLocal(STORAGE_KEYS.USERS, parsed.users);
      if (parsed.smsConfig) setLocal(STORAGE_KEYS.SMS_CONFIG, parsed.smsConfig);
      if (parsed.registeredSchools) setLocal(STORAGE_KEYS.REGISTERED_SCHOOLS, parsed.registeredSchools);
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }

  // Reset to default sample database
  static resetToDefaults() {
    localStorage.clear();
    return StorageService.loadAll();
  }
}
