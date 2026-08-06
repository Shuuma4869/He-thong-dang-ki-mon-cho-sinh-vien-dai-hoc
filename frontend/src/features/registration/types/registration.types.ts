import { Course } from '@/features/courses/types/course.types';

export interface RegisteredCourse {
  courseId: string;
  course: Course;
  registeredAt: string;
  status: 'Thành công' | 'Chờ duyệt';
}
