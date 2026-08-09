# Thiết kế validator

Validator kiểm tra các rule đăng ký học phần bằng `RegistrationValidationContext`.

## Validation chain

Luồng bắt buộc:

```text
RegistrationService
-> tạo RegistrationValidationContext
-> chạy List<CourseValidator>
```

`RegistrationValidationContext` chỉ mang dữ liệu validation:

- `Student student`
- `String requestedCourseId`
- `Optional<Course> requestedCourse`
- `List<Course> registeredCourses`

Context không đọc repository, không đọc JSON, không chứa ObjectMapper, không chứa persistence logic và không là Spring bean.

## CourseValidator contract

```java
void validate(RegistrationValidationContext context);
```

Nếu không hợp lệ, validator ném `BusinessException` phù hợp. Nếu hợp lệ, validator return bình thường.

Không dùng:

- boolean return.
- String error return.
- Một method chứa toàn bộ rule thay cho validator chain.

## Thứ tự validator dự kiến

1. `CourseExistenceValidator`
2. `CapacityValidator`
3. `DuplicateCourseValidator`
4. `CreditLimitValidator`
5. `ScheduleConflictValidator`

Từng validator không được phụ thuộc nguy hiểm vào thứ tự. Những validator cần học phần mới có thể gọi `context.requireRequestedCourse()` để an toàn nếu thứ tự bị thay đổi.

## Rule cụ thể

`CourseExistenceValidator`:

- Kiểm tra `context.getRequestedCourse().isPresent()`.
- Nếu rỗng, ném `CourseNotFoundException`.

`CapacityValidator`:

- Lấy course qua `context.requireRequestedCourse()`.
- Nếu `currentCapacity >= maxCapacity`, ném `CourseFullException`.

`DuplicateCourseValidator`:

- So `context.getRequestedCourseId()` với `courseId` của `context.getRegisteredCourses()`.
- Nếu đã có, ném `DuplicateRegistrationException`.

`CreditLimitValidator`:

- Tính tổng tín chỉ từ `registeredCourses`.
- Cộng tín chỉ của course mới.
- So với `student.maxCredits`.
- Nếu vượt, ném `CreditLimitExceededException`.

`ScheduleConflictValidator`:

- So lịch course mới với lịch của các course đã đăng ký.
- Trùng lịch khi cùng `DayOfWeek` và `newStart < existingEnd` và `newEnd > existingStart`.
- So sánh bằng `LocalTime.isBefore`, không convert sang String.

## Trạng thái F12

F12 chỉ tích hợp frontend Registration với backend API hiện có.

Không thay đổi validator, không thêm rule đăng ký mới và không thay đổi business logic Student, Course hoặc Registration trong phase này.

## Trang thai F12

F12 khong them rule validator moi va khong thay doi business logic dang ky.

Frontend Registration sau F12 chi hien thi canh bao UI neu co thong tin ve trung lich hoac vuot tin chi, nhung khong duoc coi do la validation
co tham quyen. Quyet dinh thanh cong/that bai luon den tu backend validator chain trong `RegistrationService`.

Register flow bat buoc:

```text
RegistrationService
-> tao RegistrationValidationContext
-> chay List<CourseValidator>
-> neu hop le moi save Registration va Course capacity
-> tra RegistrationResponse da cap nhat cho frontend
```

Cancel flow khong chay `CourseValidator`, nhung van phai kiem tra sinh vien, hoc phan va registration ton tai trong service.
