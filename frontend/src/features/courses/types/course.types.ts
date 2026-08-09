export type BackendDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface LecturerResponse {
  lecturerId: string;
  fullName: string;
  faculty?: string;
}

export interface CourseScheduleResponse {
  dayOfWeek: BackendDayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
}

export interface CourseResponse {
  courseId: string;
  courseName: string;
  credits: number;
  lecturerId: string;
  lecturer: LecturerResponse;
  maxCapacity: number;
  currentCapacity: number;
  schedules: CourseScheduleResponse[];
}

export interface ClassSchedule {
  dayOfWeek: number;
  dayLabel?: string;
  periods: string;
  periodNumbers: number[];
  room: string;
  shift: string;
  startTime?: string;
  endTime?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  lecturerId?: string;
  credits: number;
  schedules: ClassSchedule[];
  enrolled: number;
  capacity: number;
  status: string;
  faculty?: string;
  prerequisite?: string;
  description?: string;
  classGroup?: string;
}

export interface CourseFilterState {
  searchQuery: string;
  dayOfWeek: string;
  status: string;
  minCredits: string;
}
