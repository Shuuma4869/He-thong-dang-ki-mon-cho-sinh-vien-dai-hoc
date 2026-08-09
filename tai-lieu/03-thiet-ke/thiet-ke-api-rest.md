# Thiết kế API REST

REST API hiện mới khóa contract dùng chung. Chưa triển khai hoàn chỉnh API Student, Course và Registration.

## Prefix API

Các endpoint backend đi dưới prefix:

```text
/api
```

Frontend shared constants hiện khóa `API_BASE_PATH = '/api'`. Feature frontend chưa chuyển sang gọi API thật, mock data vẫn chạy.

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

Course, Registration và Timetable chưa chuyển sang API thật trong phase này.
