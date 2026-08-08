# Thiết kế API REST

REST API hiện mới khóa contract dùng chung. Chưa triển khai hoàn chỉnh API Student, Course và Registration.

## Prefix API

Các endpoint backend đi dưới prefix:

```text
/api
```

Frontend shared constants hiện khóa `API_BASE_PATH = '/api'`. Feature frontend chưa chuyển sang gọi API thật, mock data vẫn chạy.

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

