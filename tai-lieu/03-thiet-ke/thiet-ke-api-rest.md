# Thiết kế API REST

API base:

```text
http://localhost:8080/api
```

Frontend mặc định dùng `VITE_API_BASE_URL` nếu có, nếu không dùng `http://localhost:8080/api`.

## Response envelope

Response thành công dùng `ApiResponse<T>`:

```json
{
  "success": true,
  "message": "Thong bao thanh cong.",
  "data": {}
}
```

Response lỗi dùng `ApiErrorResponse`:

```json
{
  "success": false,
  "message": "Thong bao loi.",
  "errorCode": "ERROR_CODE",
  "timestamp": "2026-08-10T00:00:00Z"
}
```

`BusinessException` chứa `errorCode`. `GlobalExceptionHandler` map `BusinessException` thành HTTP 400, validation request thành `VALIDATION_ERROR`, lỗi không lường trước thành `INTERNAL_SERVER_ERROR`.

## Auth demo

### POST `/api/auth/login`

Request:

```json
{
  "studentId": "23010690",
  "password": "demo"
}
```

Backend chỉ dùng `studentId` để kiểm tra sinh viên tồn tại. `password` được giữ để tương thích giao diện demo, không lưu và không xác thực như mật khẩu thật.

Response:

```json
{
  "success": true,
  "message": "Dang nhap thanh cong.",
  "data": {
    "studentId": "23010690",
    "fullName": "Nguyen Trong Tuan",
    "className": "CNTT7 - K17",
    "major": "Cong nghe thong tin",
    "maxCredits": 18
  }
}
```

Error codes chính:

- `VALIDATION_ERROR` nếu thiếu `studentId`.
- `STUDENT_NOT_FOUND` nếu sinh viên không tồn tại.

Không có JWT, Spring Security, token persistence hoặc lưu password ở frontend.

## Student/Profile

### GET `/api/students/{studentId}`

Response:

```json
{
  "success": true,
  "message": "Lay thong tin sinh vien thanh cong.",
  "data": {
    "studentId": "23010690",
    "fullName": "Nguyen Trong Tuan",
    "className": "CNTT7 - K17",
    "major": "Cong nghe thong tin",
    "maxCredits": 18
  }
}
```

Error code chính:

- `STUDENT_NOT_FOUND`

## Courses

### GET `/api/courses`

Trả danh sách `CourseResponse`.

Dataset demo hien co 40 hoc phan. Backend tra danh sach day du; frontend chiu trach nhiem sort va phan trang toi da 10 mon/trang.

### GET `/api/courses/{courseId}`

Trả chi tiết một course.

### GET `/api/courses/search?keyword=...`

Tìm theo `courseId` hoặc `courseName` bằng lowercase contains. Không cam kết accent folding.

Course item:

```json
{
  "courseId": "OOP101",
  "courseName": "Lap trinh huong doi tuong",
  "credits": 3,
  "lecturerId": "GV001",
  "lecturer": {
    "lecturerId": "GV001",
    "fullName": "TS. Pham Quoc Bao",
    "faculty": "Khoa Cong nghe thong tin"
  },
  "maxCapacity": 60,
  "currentCapacity": 42,
  "schedules": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "07:30:00",
      "endTime": "09:30:00",
      "room": "A2-301"
    }
  ]
}
```

Error codes chính:

- `COURSE_NOT_FOUND`
- `LECTURER_NOT_FOUND`

Course domain không có field `faculty` hoặc `classGroup` trực tiếp. Faculty nằm trong `lecturer.faculty`.

## Registrations

### GET `/api/students/{studentId}/registrations`

Trả active registration summary. Nếu sinh viên chưa có đăng ký active, API vẫn success với `courses: []` và `totalCredits: 0`.

Response:

```json
{
  "success": true,
  "message": "Lay danh sach dang ky hoc phan thanh cong.",
  "data": {
    "registrationId": "REG-23010690-DEMO",
    "studentId": "23010690",
    "status": "ACTIVE",
    "registeredAt": "2026-08-05T08:15:00",
    "details": [
      { "courseId": "OOP101" },
      { "courseId": "WEB201" },
      { "courseId": "DSA102" },
      { "courseId": "DBS202" },
      { "courseId": "SE204" }
    ],
    "courses": [
      {
        "courseId": "OOP101",
        "courseName": "Lap trinh huong doi tuong",
        "credits": 3,
        "lecturerId": "GV001",
        "lecturer": {
          "lecturerId": "GV001",
          "fullName": "TS. Pham Quoc Bao",
          "faculty": "Khoa Cong nghe thong tin"
        },
        "maxCapacity": 60,
        "currentCapacity": 42,
        "schedules": [
          {
            "dayOfWeek": "MONDAY",
            "startTime": "07:30:00",
            "endTime": "09:30:00",
            "room": "A2-301"
          }
        ]
      }
    ],
    "totalCredits": 15
  }
}
```

### POST `/api/students/{studentId}/registrations`

Request:

```json
{
  "courseId": "UX205"
}
```

`studentId` trong path là nguồn sự thật. Field `studentId` trong `RegistrationRequest` không được dùng cho quyết định đăng ký hiện tại.

Response thành công trả `RegistrationResponse` đã cập nhật, gồm `courses` và `totalCredits`.

Error codes chính:

- `VALIDATION_ERROR`
- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `DUPLICATE_REGISTRATION`
- `COURSE_FULL`
- `CREDIT_LIMIT_EXCEEDED`
- `SCHEDULE_CONFLICT`
- `LECTURER_NOT_FOUND`

### DELETE `/api/students/{studentId}/registrations/{courseId}`

Response thành công trả `RegistrationResponse` sau khi hủy. Nếu hủy course cuối cùng, `courses: []`, `totalCredits: 0` và status có thể là `CANCELLED`.

Error codes chính:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `REGISTRATION_NOT_FOUND`

## Timetable

### GET `/api/students/{studentId}/timetable`

Timetable không có persistence riêng. Response tính từ:

```text
ACTIVE Registration
-> Course
-> Schedule
-> Lecturer
```

Một course có nhiều schedule tạo nhiều item.

Item:

```json
{
  "courseId": "OOP101",
  "courseName": "Lap trinh huong doi tuong",
  "credits": 3,
  "lecturerName": "TS. Pham Quoc Bao",
  "dayOfWeek": "MONDAY",
  "startTime": "07:30:00",
  "endTime": "09:30:00",
  "room": "A2-301"
}
```

Response empty hợp lệ:

```json
{
  "success": true,
  "message": "Lay thoi khoa bieu thanh cong.",
  "data": []
}
```

Error codes chính:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `LECTURER_NOT_FOUND`

## Dashboard

Không có endpoint dashboard riêng.

Frontend dashboard tổng hợp từ:

- `currentStudent` từ Auth/Profile API.
- Registration API để lấy `totalCredits` và số môn đã đăng ký.
- Course API để đếm số môn đang mở.
- Timetable API để hiển thị preview lịch học.

## Notifications

Không có Notification backend API trong phiên bản hiện tại.

Notifications là state local ở frontend:

- unread
- mark read
- mark all read

Không có backend persistence, realtime hoặc WebSocket.
