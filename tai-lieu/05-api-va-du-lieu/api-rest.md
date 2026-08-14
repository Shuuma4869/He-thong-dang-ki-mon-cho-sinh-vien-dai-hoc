# API REST

Base URL local:

```text
http://localhost:8080/api
```

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/auth/login` | Đăng nhập demo |
| GET | `/students/{studentId}` | Lấy hồ sơ sinh viên |
| GET | `/courses` | Lấy danh sách môn học |
| GET | `/courses/{courseId}` | Lấy chi tiết môn học |
| GET | `/courses/search?keyword=...` | Tìm kiếm môn học |
| GET | `/students/{studentId}/registrations` | Lấy đăng ký hiện tại |
| POST | `/students/{studentId}/registrations` | Đăng ký môn |
| DELETE | `/students/{studentId}/registrations/{courseId}` | Hủy đăng ký môn |
| GET | `/students/{studentId}/timetable` | Lấy thời khóa biểu |

