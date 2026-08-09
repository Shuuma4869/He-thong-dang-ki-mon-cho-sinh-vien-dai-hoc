import { requestApi } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import { Course, CourseResponse } from '@/features/courses/types/course.types';
import { mapCourseResponse } from '@/features/courses/utils/courseMappers';

export const courseApi = {
  async getCourses(): Promise<Course[]> {
    const courses = await requestApi<CourseResponse[]>(API_ENDPOINTS.COURSES);
    return courses.map(mapCourseResponse);
  },

  async getCourseById(courseId: string): Promise<Course> {
    const course = await requestApi<CourseResponse>(API_ENDPOINTS.COURSE_BY_ID(courseId));
    return mapCourseResponse(course);
  },

  async searchCourses(keyword: string): Promise<Course[]> {
    const normalizedKeyword = keyword.trim();
    if (!normalizedKeyword) {
      return this.getCourses();
    }

    const courses = await requestApi<CourseResponse[]>(API_ENDPOINTS.COURSE_SEARCH(normalizedKeyword));
    return courses.map(mapCourseResponse);
  },
};
