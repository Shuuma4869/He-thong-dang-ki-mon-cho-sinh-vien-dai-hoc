# Yêu cầu chức năng

| Mã | Yêu cầu | Thành phần chính |
|---|---|---|
| FR-01 | Sinh viên đăng nhập bằng mã sinh viên demo | `AuthController`, `AuthService`, `LoginPage` |
| FR-02 | Sinh viên xem hồ sơ | `StudentController`, `StudentService`, `ProfilePage` |
| FR-03 | Sinh viên xem danh sách môn học | `CourseController`, `CourseService`, `CourseListPage` |
| FR-04 | Sinh viên tìm kiếm môn học theo mã hoặc tên | `CourseService.searchCourses`, `courseApi.searchCourses` |
| FR-05 | Sinh viên xem chi tiết môn học | `CourseDetailModal`, `GET /api/courses/{courseId}` |
| FR-06 | Sinh viên đăng ký môn học | `RegistrationController`, `RegistrationService` |
| FR-07 | Sinh viên hủy đăng ký môn học | `DELETE /api/students/{studentId}/registrations/{courseId}` |
| FR-08 | Sinh viên xem môn đã đăng ký và tổng tín chỉ | `RegisteredCoursesPage`, `RegistrationSummary` |
| FR-09 | Sinh viên xem thời khóa biểu | `TimetableController`, `TimetableService`, `TimetableWeeklyPage` |
| FR-10 | Sinh viên xem thông báo demo | `NotificationsPage`, `NOTIFICATIONS_MOCK` |

