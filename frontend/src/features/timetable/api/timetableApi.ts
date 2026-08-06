import { Course } from '@/features/courses/types/course.types';

export const timetableApi = {
  async getRegisteredCourseSchedule(): Promise<Course[]> {
    throw new Error('API thời khóa biểu là skeleton, chưa kết nối backend.');
  },
};
