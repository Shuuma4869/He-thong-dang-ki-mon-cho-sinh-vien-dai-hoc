# Bảng API sử dụng

| API | Frontend gọi từ |
|---|---|
| `POST /api/auth/login` | `authApi.login` |
| `GET /api/students/{studentId}` | `profileApi.getStudentById` |
| `GET /api/courses` | `courseApi.getCourses` |
| `GET /api/courses/{courseId}` | `courseApi.getCourseById` |
| `GET /api/courses/search` | `courseApi.searchCourses` |
| `GET /api/students/{studentId}/registrations` | `registrationApi.getRegistrations` |
| `POST /api/students/{studentId}/registrations` | `registrationApi.registerCourse` |
| `DELETE /api/students/{studentId}/registrations/{courseId}` | `registrationApi.cancelCourse` |
| `GET /api/students/{studentId}/timetable` | `timetableApi.getTimetable` |

