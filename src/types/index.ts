export type UserRole = 'super_admin' | 'admin' | 'class_teacher' | 'teacher' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  schoolId?: string;
  assignedClass?: string;
  assignedSection?: string;
  avatar?: string;
  pin?: string;
  is2FAEnabled?: boolean;
}

export interface SchoolSettings {
  name: string;
  nameEn: string;
  established: string;
  code: string; // EIIN / EMIS code
  address: string;
  headTeacherName: string;
  contactNumber: string;
  email: string;
  logoUrl?: string;
  signatureUrl?: string;
  currentSession: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  nameEn: string;
  order: number;
  sections: string[];
  classTeacherId?: string;
  classTeacherName?: string;
}

export interface Subject {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  classId: string;
  fullMarks: number;
  passMarks: number;
  teacherId?: string;
  teacherName?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  roll: number;
  name: string;
  nameEn: string;
  classId: string;
  section: string;
  gender: 'ছেলে' | 'মেয়ে';
  dob: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  address: string;
  bloodGroup?: string;
  birthRegNo: string;
  admissionDate: string;
  photoUrl?: string;
  isStipendBeneficiary: boolean;
  status: 'active' | 'passed' | 'transferred';
}

export interface Teacher {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  phone: string;
  email: string;
  qualification: string;
  joiningDate: string;
  isClassTeacher?: boolean;
  assignedClassId?: string;
  assignedSection?: string;
  status: 'active' | 'on_leave';
  photoUrl?: string;
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  phone: string;
  joiningDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';

export interface StudentAttendance {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  classId: string;
  section: string;
  status: AttendanceStatus;
  smsSent?: boolean;
}

export type TeacherLeaveType = 'present' | 'absent' | 'cl' | 'ml' | 'el'; // cl = casual, ml = medical, el = earned

export interface TeacherAttendance {
  id: string;
  date: string;
  teacherId: string;
  status: TeacherLeaveType;
  remarks?: string;
}

export interface Exam {
  id: string;
  name: string;
  term: string;
  year: string;
  startDate: string;
  endDate: string;
}

export interface ExamRoutineItem {
  id: string;
  examId: string;
  date: string;
  dayName: string;
  time: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  roomNo: string;
}

export interface ExamMarkComponent {
  id: string;
  name: string;        // e.g. "নৈর্ব্যক্তিক (MCQ)", "রচনামূলক (Written)", "শ্রেণি পরীক্ষা (CT)", "ব্যবহারিক (Practical)", "মৌখিক (Viva)"
  nameEn: string;
  maxMarks: number;    // e.g. 30, 50, 20
  passMarks: number;   // e.g. 10, 17, 7
}

export interface ExamMarkDistribution {
  id: string;
  title: string;
  examId?: string;     // optional specific exam or 'all'
  classId?: string;    // optional specific class or 'all'
  subjectId?: string;  // optional specific subject or 'all'
  totalMarks: number;
  components: ExamMarkComponent[];
}

export interface MarksEntry {
  id: string;
  examId: string;
  studentId: string;
  classId: string;
  subjectId: string;
  writtenMarks: number;
  continuousMarks: number; // শিখনকালীন/ধারাবাহিক
  componentMarks?: Record<string, number>; // Dynamic breakdown (e.g. { mcq: 28, written: 45, ct: 18 })
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface ClassRoutineItem {
  id: string;
  day: 'শনিবার' | 'রবিবার' | 'সোমবার' | 'মঙ্গলবার' | 'বুধবার' | 'বৃহস্পতিবার';
  period: number; // 1 to 6
  startTime: string; // "10:00"
  endTime: string;   // "10:45"
  classId: string;
  section: string;
  subjectId: string;
  teacherId: string;
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  classId: string;
  date: string;
  items: FeeItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';
  transactionId?: string;
  collectedBy: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'exam' | 'holiday' | 'urgent';
  target: 'all' | 'students' | 'teachers' | 'guardians';
  publishedBy: string;
}

export interface Homework {
  id: string;
  date: string;
  classId: string;
  section: string;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface CompetencyAssessment {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  competencyNo: string; // পিআই নম্বর বা যোগ্যতা সূচক
  competencyTitle: string;
  level: 'A' | 'B' | 'C' | 'D'; // বা ত্রিভুজ, বৃত্ত, চতুর্ভুজ
  date: string;
  remarks?: string;
}

export interface SmsLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  studentName?: string;
  message: string;
  type: 'attendance' | 'exam' | 'fee' | 'notice';
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
}

export interface SyncState {
  isOnline: boolean;
  lastSyncTime: string;
  pendingSyncCount: number;
  googleDriveConnected: boolean;
  googleDriveEmail: string;
  autoSyncEnabled: boolean;
  lastBackupDate: string;
}

export interface RegisteredSchool {
  id: string;
  settings: SchoolSettings;
  adminEmail: string;
  adminName: string;
  adminPhone: string;
  adminPin: string;
  googleDriveDb: {
    accountEmail: string;
    folderName: string;
    fileName: string;
    status: 'active' | 'syncing' | 'paused';
    lastSyncTime: string;
    dbSizeKb: number;
  };
  createdAt: string;
}

export interface SmsGatewayConfig {
  provider: 'greenweb' | 'bulksmsbd' | 'onnorokom' | 'teletalk' | 'mimsms' | 'custom';
  apiKey: string;
  senderId: string;
  apiEndpoint: string;
  clientId?: string;
  balance: number;
  isActive: boolean;
  isMasking: boolean;
  httpMethod?: 'GET' | 'POST';
  customUrlTemplate?: string;
  lastTestStatus?: 'success' | 'failed' | 'none';
  lastTestedAt?: string;
}

export type NotificationType = 'urgent' | 'info' | 'warning' | 'instruction';

export interface AppNotification {
  id: string;
  sender: 'super_admin' | 'system';
  targetSchoolId: 'all' | string; // 'all' or specific schoolId
  targetSchoolName?: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  status: 'sent' | 'pending_sync'; // if super admin sends while offline, 'pending_sync'. Automatically delivers when online
  readBySchoolIds: string[]; // school ids that have marked as read
}

export interface DeveloperInfo {
  name: string;
  designation: string;
  company: string;
  whatsapp: string;
  helplinePhone: string;
  email: string;
  message: string;
  updatedAt: string;
}

