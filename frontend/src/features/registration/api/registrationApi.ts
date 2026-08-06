import { Course } from '@/features/courses/types/course.types';

export interface RegisterCourseRequest {
  courseId: string;
}

export const registrationApi = {
  async registerCourse(_request: RegisterCourseRequest): Promise<Course> {
    throw new Error('API đăng ký là skeleton, chưa kết nối backend.');
  },
};
