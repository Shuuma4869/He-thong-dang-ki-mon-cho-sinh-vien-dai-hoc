export interface ClassSchedule {
  dayOfWeek: number;
  periods: string;
  periodNumbers: number[];
  room: string;
  shift: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  credits: number;
  schedules: ClassSchedule[];
  enrolled: number;
  capacity: number;
  status: string;
  faculty: string;
  prerequisite?: string;
  description?: string;
  classGroup: string;
}

export interface CourseFilterState {
  searchQuery: string;
  faculty: string;
  dayOfWeek: string;
  status: string;
  minCredits: string;
}
