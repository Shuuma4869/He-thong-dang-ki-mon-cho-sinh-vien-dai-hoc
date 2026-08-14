# API error

Response lỗi thống nhất:

```json
{
  "success": false,
  "message": "Thong diep loi",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2026-08-12T21:00:00"
}
```

Class tương ứng:

- `ApiErrorResponse`.
- `BusinessException`.
- `GlobalExceptionHandler`.

Các error code chính: `STUDENT_NOT_FOUND`, `COURSE_NOT_FOUND`, `LECTURER_NOT_FOUND`, `COURSE_FULL`, `DUPLICATE_REGISTRATION`, `CREDIT_LIMIT_EXCEEDED`, `SCHEDULE_CONFLICT`, `REGISTRATION_NOT_FOUND`, `VALIDATION_ERROR`.

