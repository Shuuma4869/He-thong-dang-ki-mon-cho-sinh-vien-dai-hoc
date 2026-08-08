# Thiết kế API REST

REST API hiện mới khóa contract dùng chung. Chưa triển khai hoàn chỉnh API Student, Course và Registration.

## Prefix API

Các endpoint backend đi dưới prefix:

```text
/api
```

Frontend shared constants hiện khóa `API_BASE_PATH = '/api'`. Feature frontend chưa chuyển sang gọi API thật, mock data vẫn chạy.

## Student API

Endpoint đã triển khai trong Full Solution local:

```text
GET /api/students/{studentId}
```

Mục đích:

- Trả thông tin sinh viên theo mã sinh viên.
- Không thực hiện đăng nhập.
- Không trả dữ liệu đăng ký môn học.

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
