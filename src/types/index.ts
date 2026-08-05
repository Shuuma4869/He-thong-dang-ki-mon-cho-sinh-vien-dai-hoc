export interface Student {
  id: string; // Mã sinh viên, e.g. "21010045"
  name: string; // "Nguyễn Văn A"
  avatarUrl: string;
  className: string; // "CNTT-K16"
  major: string; // "Công nghệ Thông tin"
  faculty: string; // "Khoa Công nghệ Thông tin"
  cohort: string; // "2021 - 2025"
  email: string; // "21010045@st.phenikaa-uni.edu.vn"
  phone: string; // "0987 654 321"
  dob: string; // "15/08/2003"
  gender: string; // "Nam"
  cpa: number; // 3.52
  gpaPrevious: number; // 3.65
  creditsPassed: number; // 88
  totalCreditsRequired: number; // 132
}

export interface ClassSchedule {
  dayOfWeek: number; // 2 = Thứ 2, ..., 7 = Thứ 7, 8 = Chủ Nhật
  periods: string; // "Tiết 1 - 3 (07:00 - 09:25)"
  periodNumbers: number[]; // [1, 2, 3]
  room: string; // "P.302 - Tòa A2"
  shift: 'Sáng' | 'Chiều' | 'Tối';
}

export interface Course {
  id: string; // ID duy nhất của lớp HP, e.g. "INT3101_01"
  code: string; // Mã môn học, e.g. "INT3101"
  name: string; // Tên môn, e.g. "Lập trình Web nâng cao"
  lecturer: string; // Giảng viên, e.g. "TS. Trịnh Văn Minh"
  credits: number; // Tín chỉ, e.g. 3
  schedules: ClassSchedule[];
  enrolled: number; // Sĩ số hiện tại
  capacity: number; // Sĩ số tối đa
  status: 'Còn chỗ' | 'Đã đầy' | 'Trùng lịch' | 'Đã đăng ký';
  faculty: string; // Khoa phụ trách
  prerequisite?: string; // Môn tiên quyết
  description?: string;
  classGroup: string; // "Nhóm 01 - Lớp LT"
}

export interface RegisteredCourse {
  courseId: string;
  course: Course;
  registeredAt: string; // "05/08/2026 08:30"
  status: 'Thành công' | 'Chờ duyệt';
}

export interface TimetableSlot {
  day: number; // 2..7
  period: number; // 1..12
  courseCode: string;
  courseName: string;
  room: string;
  lecturer: string;
  classGroup: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export interface UniversityNotification {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Đào tạo' | 'Lịch học' | 'Học phí' | 'Hệ thống';
  createdAt: string;
  isRead: boolean;
  priority?: 'Cao' | 'Bình thường';
}

export interface CourseFilterState {
  searchQuery: string;
  faculty: string;
  dayOfWeek: string;
  status: string;
  minCredits: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'courses' 
  | 'registered' 
  | 'timetable' 
  | 'notifications' 
  | 'profile';
