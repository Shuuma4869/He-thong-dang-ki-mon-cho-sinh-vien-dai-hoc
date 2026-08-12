import { Course } from '@/features/courses/types/course.types';
import { mapScheduleResponse } from '@/features/courses/utils/courseMappers';
import { TimetableEntryResponse } from '@/features/timetable/types/timetable.types';
import { requestApi } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';

export const timetableApi = {
  async getTimetable(studentId: string): Promise<Course[]> {
    const entries = await requestApi<TimetableEntryResponse[]>(API_ENDPOINTS.TIMETABLE(studentId));
    return mapTimetableEntriesToCourses(entries);
  },
};

function mapTimetableEntriesToCourses(entries: TimetableEntryResponse[]): Course[] {
  const courseMap = new Map<string, Course>();

  for (const entry of entries) {
    const schedule = mapScheduleResponse(entry);
    const existingCourse = courseMap.get(entry.courseId);

    if (existingCourse) {
      existingCourse.schedules.push(schedule);
      continue;
    }

    courseMap.set(entry.courseId, {
      id: entry.courseId,
      code: entry.courseId,
      name: entry.courseName,
      lecturer: entry.lecturerName,
      credits: entry.credits,
      schedules: [schedule],
      enrolled: 0,
      capacity: 0,
      status: 'Đã đăng ký',
    });
  }

  return Array.from(courseMap.values());
}
