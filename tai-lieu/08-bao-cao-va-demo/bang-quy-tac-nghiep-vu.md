# Bảng quy tắc nghiệp vụ

| Quy tắc | Error code | Validator/Service |
|---|---|---|
| Môn phải tồn tại | `COURSE_NOT_FOUND` | `CourseExistenceValidator` |
| Không đăng ký trùng | `DUPLICATE_REGISTRATION` | `DuplicateCourseValidator` |
| Môn còn chỗ | `COURSE_FULL` | `CapacityValidator` |
| Không vượt tín chỉ tối đa | `CREDIT_LIMIT_EXCEEDED` | `CreditLimitValidator` |
| Không trùng lịch | `SCHEDULE_CONFLICT` | `ScheduleConflictValidator` |
| Sinh viên phải tồn tại | `STUDENT_NOT_FOUND` | `StudentRepository` qua service |
| Hủy môn đã đăng ký | `REGISTRATION_NOT_FOUND` | `RegistrationService` |

