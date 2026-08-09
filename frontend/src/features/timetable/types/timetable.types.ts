import { BackendDayOfWeek } from '@/features/courses/types/course.types';

export interface TimetableEntryResponse {
  courseId: string;
  courseName: string;
  credits: number;
  lecturerName: string;
  dayOfWeek: BackendDayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
}
