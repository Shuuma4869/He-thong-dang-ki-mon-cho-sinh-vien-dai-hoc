# Ma trận truy vết yêu cầu

| Requirement | Class/API | Test | Demo scenario |
|---|---|---|---|
| FR-01 Login | `POST /api/auth/login`, `AuthService` | `AuthServiceTest`, `AuthControllerTest` | Đăng nhập `23010690`, thử `SV999` |
| FR-02 Profile | `GET /api/students/{studentId}` | `StudentServiceTest`, `StudentControllerTest` | Mở Hồ sơ sinh viên |
| FR-03 Course list | `GET /api/courses` | `CourseServiceTest`, `CourseControllerTest` | Mở Đăng ký môn học |
| FR-04 Course search | `GET /api/courses/search` | `CourseServiceTest`, `CourseControllerTest` | Tìm `OOP`, tìm chuỗi rỗng |
| FR-05 Course detail | `GET /api/courses/{courseId}` | `CourseControllerTest` | Mở modal chi tiết |
| FR-06 Register | `POST /api/students/{studentId}/registrations` | `RegistrationServiceTest`, `RegistrationControllerTest` | Đăng ký môn còn chỗ |
| FR-07 Cancel | `DELETE /api/students/{studentId}/registrations/{courseId}` | `RegistrationServiceTest`, `RegistrationControllerTest` | Hủy một môn đã đăng ký |
| FR-08 Summary | `GET /api/students/{studentId}/registrations` | `RegistrationServiceTest` | Xem môn đã đăng ký |
| FR-09 Timetable | `GET /api/students/{studentId}/timetable` | `TimetableServiceTest`, `TimetableControllerTest` | Mở thời khóa biểu |

