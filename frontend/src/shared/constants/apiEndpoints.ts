export const API_BASE_PATH = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  STUDENT_BY_ID: (studentId: string) => `/students/${encodeURIComponent(studentId)}`,
  COURSES: '/courses',
  COURSE_BY_ID: (courseId: string) => `/courses/${encodeURIComponent(courseId)}`,
  COURSE_SEARCH: (keyword: string) => `/courses/search?${new URLSearchParams({ keyword }).toString()}`,
  REGISTRATIONS: (studentId: string) => `/students/${encodeURIComponent(studentId)}/registrations`,
  REGISTER_COURSE: (studentId: string) => `/students/${encodeURIComponent(studentId)}/registrations`,
  CANCEL_REGISTRATION: (studentId: string, courseId: string) =>
    `/students/${encodeURIComponent(studentId)}/registrations/${encodeURIComponent(courseId)}`,
  TIMETABLE: (studentId: string) => `/students/${encodeURIComponent(studentId)}/timetable`,
  auth: '/auth',
  courses: '/courses',
  registrations: '/registrations',
  profile: '/profile',
  timetable: '/timetable',
} as const;
