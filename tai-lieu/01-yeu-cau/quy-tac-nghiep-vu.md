# Quy tắc nghiệp vụ

## Đăng nhập

- `studentId` phải tồn tại trong `StudentRepository`.
- `password` chỉ giữ để tương thích giao diện demo, backend không lưu và không xác thực password thật.

## Đăng ký học phần

Validator chạy theo thứ tự:

1. `CourseExistenceValidator`.
2. `DuplicateCourseValidator`.
3. `CapacityValidator`.
4. `CreditLimitValidator`.
5. `ScheduleConflictValidator`.

Các lỗi nghiệp vụ chính:

- `COURSE_NOT_FOUND`.
- `DUPLICATE_REGISTRATION`.
- `COURSE_FULL`.
- `CREDIT_LIMIT_EXCEEDED`.
- `SCHEDULE_CONFLICT`.

Khi validation thất bại, service không được lưu registration và không được thay đổi sĩ số môn học.

## Trùng lịch

Hai lịch học trùng khi cùng ngày và:

```text
newStart < existingEnd
newEnd > existingStart
```

Nếu một lịch kết thúc đúng lúc lịch còn lại bắt đầu thì được phép đăng ký.

