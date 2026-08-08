export const API_BASE_PATH = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  STUDENT_BY_ID: (studentId: string) => `/students/${encodeURIComponent(studentId)}`,
  auth: '/auth',
  courses: '/courses',
  registrations: '/registrations',
  profile: '/profile',
  timetable: '/timetable',
} as const;
