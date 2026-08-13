# Unit test Registration/Validator

Test class:

- `RegistrationServiceTest`.
- `RegistrationControllerTest`.
- `JsonRegistrationRepositoryTest`.
- `CourseExistenceValidatorTest`.
- `DuplicateCourseValidatorTest`.
- `CapacityValidatorTest`.
- `CreditLimitValidatorTest`.
- `ScheduleConflictValidatorTest`.
- `RegistrationValidatorOrderTest`.

Case quan trọng:

- Đăng ký thành công tăng sĩ số.
- Hủy đăng ký giảm sĩ số.
- Duplicate được ưu tiên trước full/credit.
- Validation fail không gọi `registrationRepository.save`.
- Validation fail không gọi `courseRepository.save`.
- Trùng lịch xử lý đúng các boundary start/end.

