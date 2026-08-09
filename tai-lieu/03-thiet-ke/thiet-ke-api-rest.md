# Thiết kế API REST

REST API hiện đã có contract và implementation cho Auth demo, Student/Profile, Course và Registration.
Các phần quản trị, giảng viên, notification runtime và timetable API đầy đủ chưa triển khai hoàn chỉnh.

## Prefix API

Các endpoint backend đi dưới prefix:

```text
/api
```

Frontend shared constants hiện khóa `API_BASE_PATH = '/api'`. Auth/Profile, Course và Registration đã chuyển sang gọi API thật;
các phần chưa migrate vẫn có thể dùng mock data.

## Auth API

Endpoint đã triển khai trong Full Solution local:

```text
POST /api/auth/login
```

Đây là demo authentication cho đồ án OOP, không phải cơ chế authentication production-ready.

Backend chỉ xác định sinh viên bằng `studentId` và kiểm tra sinh viên có tồn tại qua `StudentRepository`.
Trường `password` có thể xuất hiện trong request để tương thích giao diện hiện tại, nhưng không được lưu,
không được mã hóa, không được xác thực giả và không tạo token.

Không sử dụng:

- JWT
- Spring Security
- OAuth
- Database account
- Access token / refresh token

Request:

```json
{
  "studentId": "SV001",
  "password": "anything"
}
```

Response thành công dùng `StudentResponse` trong envelope `ApiResponse`:

```json
{
  "success": true,
  "message": "Dang nhap thanh cong.",
  "data": {
    "studentId": "SV001",
    "fullName": "Nguyen Van A",
    "className": "CNTT1",
    "major": "Cong nghe thong tin",
    "maxCredits": 18
  }
}
```

Nếu sinh viên không tồn tại, API trả lỗi với `errorCode = STUDENT_NOT_FOUND`.
Nếu request thiếu `studentId`, API trả lỗi với `errorCode = VALIDATION_ERROR`.

## Student API

Endpoint đã triển khai trong Full Solution local:

```text
GET /api/students/{studentId}
```

Mục đích:

- Trả thông tin sinh viên theo mã sinh viên.
- Không thực hiện đăng nhập.
- Không trả dữ liệu đăng ký môn học.

Profile frontend sử dụng chính endpoint này:

```text
GET /api/students/{studentId}
```

Không tạo `ProfileController` riêng nếu chỉ trả về cùng dữ liệu sinh viên. Nếu cần tổng số tín chỉ đã đăng
ký trong các phase sau, frontend nên lấy từ Registration API hoặc response composition riêng, không lưu
duplicated field vào `Student`.

Response `data` dùng `StudentResponse`:

```json
{
  "studentId": "SV001",
  "fullName": "Nguyen Van A",
  "className": "CNTT1",
  "major": "Cong nghe thong tin",
  "maxCredits": 18
}
```

## Course API

Endpoints đã triển khai trong Full Solution local:

```text
GET /api/courses
GET /api/courses/{courseId}
GET /api/courses/search?keyword=...
```

Mục đích:

- Trả danh sách học phần.
- Trả chi tiết một học phần.
- Tìm kiếm học phần theo mã hoặc tên.

Response `data` dùng `CourseResponse`:

```json
{
  "courseId": "OOP101",
  "courseName": "Lap trinh huong doi tuong",
  "credits": 3,
  "lecturerId": "GV001",
  "lecturer": {
    "lecturerId": "GV001",
    "fullName": "Tran Thi B",
    "faculty": "Khoa Cong nghe thong tin"
  },
  "maxCapacity": 60,
  "currentCapacity": 20,
  "schedules": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "07:30:00",
      "endTime": "09:30:00",
      "room": "A101"
    }
  ]
}
```

## Response thành công

Mọi API thành công phải trả envelope:

```json
{
  "success": true,
  "message": "Thông báo kết quả",
  "data": {}
}
```

DTO backend tương ứng: `ApiResponse<T>`.

## Response lỗi

Mọi API lỗi phải trả envelope:

```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "errorCode": "ERROR_CODE",
  "timestamp": "2026-08-08T00:00:00Z"
}
```

DTO backend tương ứng: `ApiErrorResponse`.

`BusinessException` phải có `errorCode`. `GlobalExceptionHandler` chịu trách nhiệm chuyển exception thành response lỗi chuẩn.

## Luồng xử lý API bắt buộc

```text
Controller
-> Service
-> Validator nếu có
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

Controller không được đọc file hoặc chứa rule nghiệp vụ chi tiết.

## Frontend API contract sau F10

Frontend đã nối API thật cho Auth và Profile:

- `AUTH_LOGIN = /auth/login`
- `STUDENT_BY_ID(studentId) = /students/{studentId}`

Feature API bắt buộc đi qua shared `requestApi`, không gọi `fetch` trực tiếp trong page.

`requestApi<T>` nhận envelope `ApiResponse<T>` từ backend và trả trực tiếp `data`. Vì vậy `authApi` và `profileApi` không unwrap response lần thứ hai.

Luồng khôi phục phiên frontend:

1. Đọc `studentId` từ `localStorage` hoặc `sessionStorage`.
2. Gọi `GET /api/students/{studentId}` để xác thực lại sinh viên còn tồn tại.
3. Nếu thành công, set `currentStudent`.
4. Nếu thất bại, xóa storage và hiển thị màn đăng nhập.

Frontend không lưu password, token, JWT hoặc thông tin xác thực production trong F10.

Registration và Timetable chưa chuyển sang API thật trong phase F10.

## Frontend Course API contract sau F11

Frontend Course runtime dùng các endpoint:

- `GET /api/courses`
- `GET /api/courses/{courseId}`
- `GET /api/courses/search?keyword=...`

`courseApi` đi qua shared `requestApi`; page/component không gọi `fetch` trực tiếp.

Mapping frontend:

- `courseId` -> `id`, `code`
- `courseName` -> `name`
- `lecturer.fullName` -> `lecturer`
- `lecturerId` -> `lecturerId`
- `currentCapacity` -> `enrolled`
- `maxCapacity` -> `capacity`
- `schedules[].dayOfWeek/startTime/endTime/room` -> schedule presentation model

Hai field mock cũ `faculty` và `classGroup` không có nguồn dữ liệu thật trong Course domain hiện tại, nên Course runtime không hiển thị hoặc hard-code hai field này.

Registration được migrate ở F12. Timetable, Dashboard real data và Notifications chưa được migrate thành API runtime riêng trong F12.

## Registration API contract sau F12

Endpoints da khoa cho frontend Registration runtime:

```text
GET /api/students/{studentId}/registrations
POST /api/students/{studentId}/registrations
DELETE /api/students/{studentId}/registrations/{courseId}
```

`studentId` nam tren path va phai lay tu sinh vien dang dang nhap. Frontend khong hard-code `SV001`.

### GET registrations

Tra phieu dang ky active cua sinh vien. Neu sinh vien chua co mon active, API van tra success voi `courses: []` va `totalCredits: 0`.

```json
{
  "success": true,
  "message": "Lay danh sach dang ky hoc phan thanh cong.",
  "data": {
    "registrationId": "REG-SV001-123456789",
    "studentId": "SV001",
    "status": "ACTIVE",
    "registeredAt": "2026-08-09T18:00:00",
    "details": [
      {
        "courseId": "OOP101"
      }
    ],
    "courses": [
      {
        "courseId": "OOP101",
        "courseName": "Lap trinh huong doi tuong",
        "credits": 3,
        "lecturerId": "GV001",
        "lecturer": {
          "lecturerId": "GV001",
          "fullName": "Tran Thi B",
          "faculty": "Khoa Cong nghe thong tin"
        },
        "maxCapacity": 60,
        "currentCapacity": 21,
        "schedules": [
          {
            "dayOfWeek": "MONDAY",
            "startTime": "07:30:00",
            "endTime": "09:30:00",
            "room": "A101"
          }
        ]
      }
    ],
    "totalCredits": 3
  }
}
```

### POST registration

Request:

```json
{
  "courseId": "OOP101"
}
```

Response thanh cong tra `RegistrationResponse` da cap nhat, cung shape voi GET.

Business error co the gap:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `COURSE_FULL`
- `DUPLICATE_REGISTRATION`
- `CREDIT_LIMIT_EXCEEDED`
- `SCHEDULE_CONFLICT`

### DELETE registration

Endpoint:

```text
DELETE /api/students/{studentId}/registrations/{courseId}
```

Response thanh cong tra `RegistrationResponse` da cap nhat. Neu huy mon cuoi cung, response co `courses: []`, `totalCredits: 0`
va registration status co the la `CANCELLED`.

Business error co the gap:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `REGISTRATION_NOT_FOUND`

### Frontend Registration API

Frontend dung:

- `registrationApi.getRegistrations(studentId)`
- `registrationApi.registerCourse(studentId, courseId)`
- `registrationApi.cancelCourse(studentId, courseId)`

Tat ca deu di qua shared `requestApi`; page/component khong goi `fetch` truc tiep va khong doc `data/*.json`.

Frontend hien thi loi bang message/errorCode backend tra ve. Cac rule duplicate, gioi han tin chi va trung lich do backend validator quyet dinh.

## Timetable API contract sau F13A

Endpoint:

```text
GET /api/students/{studentId}/timetable
```

Timetable khong co persistence rieng. Response duoc suy ra tu:

```text
Student
+ ACTIVE Registration
+ Course
+ Course.Schedule
+ Lecturer
```

Response thanh cong tra `ApiResponse<List<TimetableSlotResponse>>`.

Moi schedule cua mot course tao mot entry rieng. Course co 2 schedule se xuat hien 2 dong trong `data`.

Thu tu response duoc sort deterministic:

```text
DayOfWeek -> startTime -> courseId
```

Sinh vien chua co dang ky active se tra `data: []`, khong coi day la server error.

JSON item:

```json
{
  "courseId": "OOP101",
  "courseName": "Lap trinh huong doi tuong",
  "credits": 3,
  "lecturerName": "Tran Thi B",
  "dayOfWeek": "MONDAY",
  "startTime": "07:30:00",
  "endTime": "09:30:00",
  "room": "A101"
}
```

Backend giu `DayOfWeek` dang enum tieng Anh (`MONDAY`, `TUESDAY`, ...). Frontend chiu trach nhiem map sang text hien thi.

Business/data errors co the gap:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `LECTURER_NOT_FOUND`

### Frontend Timetable API sau F13

Frontend dung:

- `API_ENDPOINTS.TIMETABLE(studentId)`
- `timetableApi.getTimetable(studentId)`
- `TimetableWeeklyPage` nhan `studentId` tu `App`

Tat ca request di qua shared `requestApi`; page/component khong goi `fetch` truc tiep va khong doc `data/*.json`.

Mapping frontend:

- `courseId` -> `id`, `code`
- `courseName` -> `name`
- `credits` -> `credits`
- `lecturerName` -> `lecturer`
- `dayOfWeek/startTime/endTime/room` -> schedule presentation model dung chung voi Course mapper

Response `data: []` hien thi trang thai chua co lich hoc, khong fallback sang mock data.

## Frontend Dashboard composition sau F14

Khong tao endpoint `GET /api/dashboard/{studentId}` trong F14. Dashboard gom du lieu tu cac API da co:

- `currentStudent` tu Auth/Profile API cho thong tin sinh vien.
- `registrationApi.getRegistrations(studentId)` do `App` load de lay `totalCredits` va danh sach mon da dang ky.
- `courseApi.getCourses()` de dem so mon dang mo theo contract Course hien tai.
- `timetableApi.getTimetable(studentId)` de hien thi preview lich hoc.

Dashboard chi tinh metric presentation nhu `registeredCount` va `creditPercent`. Cac rule nghiep vu nhu gioi han tin chi, trung lich,
duplicate registration va capacity van thuoc backend validators/services.

Feature Dashboard khong goi `fetch` truc tiep, khong doc `data/*.json`, khong fallback sang mock course/registration/timetable va khong hard-code `SV001`.

## Notifications scope sau F14

Notifications khong thuoc persistence/business core trong phien ban do an hien tai. F14 khong tao:

- Notification model backend
- Notification repository
- Notification service
- Notification controller
- `data/notifications.json`

Notifications duoc giu la frontend demo/local state. Unread count, mark read va mark all read chi cap nhat state frontend, khong dong bo backend.
