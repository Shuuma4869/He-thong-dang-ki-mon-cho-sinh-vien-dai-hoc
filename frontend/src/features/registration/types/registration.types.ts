import { Course, CourseResponse } from '@/features/courses/types/course.types';

export type RegistrationStatus = 'ACTIVE' | 'CANCELLED';

export interface RegistrationRequest {
  courseId: string;
}

export interface RegistrationDetailResponse {
  courseId: string;
}

export type RegisteredCourseResponse = CourseResponse;

export interface RegistrationResponse {
  registrationId: string | null;
  studentId: string;
  status: RegistrationStatus;
  registeredAt: string | null;
  details: RegistrationDetailResponse[];
  courses: RegisteredCourseResponse[];
  totalCredits: number;
}

export interface RegistrationSummary {
  registrationId: string | null;
  studentId: string;
  status: RegistrationStatus;
  registeredAt: string | null;
  courses: Course[];
  totalCredits: number;
}
