# Thiết kế validator

Validator kiểm tra các rule đăng ký học phần bằng `RegistrationValidationContext`.

## Validation chain

```text
RegistrationService
-> tạo RegistrationValidationContext
-> chạy List<CourseValidator>
-> nếu hợp lệ mới ghi Registration và Course capacity
```

`RegistrationValidationContext` mang dữ liệu:

- `Student student`
- `String requestedCourseId`
- `Optional<Course> requestedCourse`
- `List<Course> registeredCourses`

Context không đọc repository, không đọc JSON và không là Spring bean.

## CourseValidator contract

```java
void validate(RegistrationValidationContext context);
```

Nếu không hợp lệ, validator ném `BusinessException` hoặc subclass. Nếu hợp lệ, method return bình thường.

## Thứ tự validator

Thứ tự là contract bắt buộc:

| Thứ tự | Validator | Annotation | ErrorCode |
|---:|---|---|---|
| 1 | `CourseExistenceValidator` | `@Order(10)` | `COURSE_NOT_FOUND` |
| 2 | `DuplicateCourseValidator` | `@Order(20)` | `DUPLICATE_REGISTRATION` |
| 3 | `CapacityValidator` | `@Order(30)` | `COURSE_FULL` |
| 4 | `CreditLimitValidator` | `@Order(40)` | `CREDIT_LIMIT_EXCEEDED` |
| 5 | `ScheduleConflictValidator` | `@Order(50)` | `SCHEDULE_CONFLICT` |

Không dựa vào tên class, thứ tự file, reflection order hoặc thứ tự component scan ngầm định.

## Vì sao thứ tự validator quan trọng

Trong quá trình kiểm thử, nhóm từng gặp trường hợp một request vừa duplicate vừa làm vượt số tín chỉ. Nếu thứ tự validator không ổn định, hệ thống có thể trả `CREDIT_LIMIT_EXCEEDED` thay vì `DUPLICATE_REGISTRATION`.

Expected contract hiện tại:

- Nếu course đã đăng ký, trả `DUPLICATE_REGISTRATION` trước.
- Không chạy các rule phía sau theo cách làm thay đổi error ưu tiên.
- Không mutate JSON khi validator fail.

`RegistrationValidatorOrderTest` khóa thứ tự Spring inject `List<CourseValidator>`.

## Business rules

| Rule | Validator/service | ErrorCode |
|---|---|---|
| Course tồn tại | `CourseExistenceValidator` | `COURSE_NOT_FOUND` |
| Không đăng ký trùng course active | `DuplicateCourseValidator` | `DUPLICATE_REGISTRATION` |
| Course chưa đầy sĩ số | `CapacityValidator` | `COURSE_FULL` |
| Tổng tín chỉ không vượt `Student.maxCredits` | `CreditLimitValidator` | `CREDIT_LIMIT_EXCEEDED` |
| Lịch học không trùng | `ScheduleConflictValidator` | `SCHEDULE_CONFLICT` |
| Hủy course chưa đăng ký | `RegistrationService.cancelCourse` | `REGISTRATION_NOT_FOUND` |
| Student không tồn tại | `AuthService`, `StudentService`, `RegistrationService`, `TimetableService` | `STUDENT_NOT_FOUND` |
| Lecturer reference không tồn tại | `CourseService`, `RegistrationService`, `TimetableService` | `LECTURER_NOT_FOUND` |

## Rule trùng lịch

Hai lịch học conflict khi:

```text
same day
AND newStart < existingEnd
AND newEnd > existingStart
```

Boundary không conflict:

```text
existingEnd == newStart
newEnd == existingStart
```

Code dùng `LocalTime.isBefore` và `LocalTime.isAfter`, không so sánh chuỗi.

## Register và cancel

Register chạy validator chain trước khi ghi dữ liệu. Nếu validator fail, không gọi `registrationRepository.save()` hoặc `courseRepository.save()`.

Cancel không chạy `CourseValidator`, nhưng vẫn kiểm tra:

- sinh viên tồn tại
- học phần tồn tại
- active registration có course cần hủy
