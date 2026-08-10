# Thành viên 3 - Registration và Validator

Đọc trước:

- [Hướng dẫn chung](00-doc-truoc-khi-bat-dau.md)
- [Quy trình Pull Request](04-quy-trinh-pull-request.md)

Chỉ bắt đầu sau khi Student/Auth/Profile và Course/Lecturer/Schedule đã được merge vào `develop`. Không cần chờ Timetable.

## 1. Branch làm việc

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/registration-validator
git branch --show-current
```

Kết quả cần là:

```text
feature/registration-validator
```

## 2. Phạm vi

Bạn phụ trách:

- `Registration`
- `RegistrationDetail`
- `RegistrationStatus`
- `RegistrationSummary`
- `RegistrationRepository`
- `JsonRegistrationRepository`
- `RegistrationService`
- `RegistrationController`
- `RegistrationRequest`
- `RegistrationResponse`
- `RegistrationDetailResponse`
- `RegisteredCourseResponse`
- `RegistrationMapper`
- 5 validator đăng ký
- frontend registration

Không sửa Student, Course, Lecturer hoặc Timetable trừ khi cần nối integration rất nhỏ và có lý do rõ.

## 3. File ownership

| File/Folder | Trách nhiệm | Được sửa |
|---|---|---|
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Registration.java` | Phiếu đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationDetail.java` | Dòng chi tiết học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/enums/RegistrationStatus.java` | Trạng thái đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java` | Composition response | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java` | Contract registration | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java` | JSON repository đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java` | Nghiệp vụ đăng ký/hủy | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/RegistrationController.java` | REST API đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/RegistrationRequest.java` | DTO request đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationResponse.java` | DTO response đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationDetailResponse.java` | DTO dòng chi tiết đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegisteredCourseResponse.java` | DTO học phần trong phiếu đăng ký | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/RegistrationMapper.java` | Map registration summary sang DTO | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseFullException.java` | Lỗi `COURSE_FULL` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CreditLimitExceededException.java` | Lỗi `CREDIT_LIMIT_EXCEEDED` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/DuplicateRegistrationException.java` | Lỗi `DUPLICATE_REGISTRATION` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/RegistrationNotFoundException.java` | Lỗi `REGISTRATION_NOT_FOUND` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/ScheduleConflictException.java` | Lỗi `SCHEDULE_CONFLICT` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/**` | 5 validator | OWNED |
| `frontend/src/features/registration/**` | Registration API, modal, page, types | OWNED |
| `frontend/src/app/App.tsx` | Gắn register/cancel/toast/refresh | INTEGRATION ONLY |
| `frontend/src/shared/constants/apiEndpoints.ts` | Thêm endpoint Registration nếu thiếu | INTEGRATION ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java` | Contract validator | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/Registrable.java` | Contract chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java` | Context validator | READ ONLY nếu đã có |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java` | Lỗi course dùng lại trong validator | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java` | Lỗi student dùng lại trong service | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java` | Envelope API thành công | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java` | Envelope API lỗi | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java` | Xử lý lỗi chung | READ ONLY |
| `frontend/src/shared/api/httpClient.ts` | HTTP envelope chung | READ ONLY |
| `frontend/src/shared/api/apiError.ts` | Lỗi API chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Đọc/ghi JSON chung | READ ONLY |
| `data/*.json` | Demo seed | READ ONLY |

## 4. Domain Registration

`Registration` có:

```java
public class Registration {
    private String registrationId;
    private String studentId;
    private RegistrationStatus status;
    private LocalDateTime registeredAt;
    private List<RegistrationDetail> details;
}
```

`RegistrationDetail` có:

```java
public class RegistrationDetail {
    private String courseId;
}
```

`RegistrationStatus`:

```java
ACTIVE
CANCELLED
```

## 5. Repository

Contract:

```java
public interface RegistrationRepository {
    List<Registration> findByStudentId(String studentId);
    Optional<Registration> findByStudentAndCourse(String studentId, String courseId);
    void save(Registration registration);
    void delete(String studentId, String courseId);
}
```

`JsonRegistrationRepository` dùng `JsonFileUtils`. Không đọc file trong service/controller.

## 6. Registrable

Nếu `Registrable` đã có trong shared foundation, chỉ dùng đúng contract hiện tại. Không tự redesign.

Dạng contract:

```java
void register(String studentId, String courseId);
```

## 7. Validation context

`RegistrationValidationContext` mang dữ liệu đã được service chuẩn bị:

```text
student
requestedCourseId
requestedCourse
registeredCourses
```

Validator chỉ đọc context và ném lỗi nghiệp vụ nếu vi phạm. Validator không đọc repository, không đọc JSON và không chứa logic persist.

## 8. 5 validator

1. `CourseExistenceValidator`

Rule: học phần yêu cầu phải tồn tại.
Error: `COURSE_NOT_FOUND`.

2. `DuplicateCourseValidator`

Rule: sinh viên không được đăng ký lại học phần đang active.
Error: `DUPLICATE_REGISTRATION`.

3. `CapacityValidator`

Rule:

```text
currentCapacity >= maxCapacity
```

Error: `COURSE_FULL`.

4. `CreditLimitValidator`

Rule:

```text
registered credits + requested credits > maxCredits
```

Error: `CREDIT_LIMIT_EXCEEDED`.

5. `ScheduleConflictValidator`

Rule:

```text
same day
AND newStart < existingEnd
AND newEnd > existingStart
```

Error: `SCHEDULE_CONFLICT`.

## 9. Thứ tự validator

Bắt buộc:

```java
@Order(10) CourseExistenceValidator
@Order(20) DuplicateCourseValidator
@Order(30) CapacityValidator
@Order(40) CreditLimitValidator
@Order(50) ScheduleConflictValidator
```

Duplicate phải được báo trước credit/capacity khi cùng lúc vi phạm nhiều rule. `RegistrationService` vẫn dùng `List<CourseValidator>`, không đổi sang if-chain.

## 10. Registration service

Luồng register:

```text
load student
-> load requested course
-> load current registration
-> resolve registered courses
-> create validation context
-> run validators
-> persist registration
-> update course capacity
```

Nếu validation fail:

- Không save registration.
- Không save course.
- Không tăng capacity.

Luồng cancel:

```text
load student
-> tìm registration active chứa courseId
-> xóa/hủy dòng chi tiết tương ứng
-> giảm currentCapacity đúng 1
-> không để capacity âm
-> trả state mới
```

Nếu môn chưa được đăng ký, trả `REGISTRATION_NOT_FOUND`.

## 11. Registration API

```text
GET /api/students/{studentId}/registrations
POST /api/students/{studentId}/registrations
DELETE /api/students/{studentId}/registrations/{courseId}
```

Request POST:

```json
{
  "courseId": "OOP101"
}
```

Nếu `courseId` blank, trả `VALIDATION_ERROR`.

Response:

```text
registrationId
studentId
status
registeredAt
details
courses
totalCredits
```

Empty state:

```json
{
  "courses": [],
  "totalCredits": 0
}
```

POST và DELETE trả state đã cập nhật.

## 12. Frontend Registration

Các file chính:

- `frontend/src/features/registration/api/registrationApi.ts`
- `frontend/src/features/registration/types/registration.types.ts`
- `frontend/src/features/registration/components/RegisterConfirmModal.tsx`
- `frontend/src/features/registration/pages/RegisteredCoursesPage.tsx`

API frontend:

```text
getRegistrations(studentId)
registerCourse(studentId, courseId)
cancelCourse(studentId, courseId)
```

Yêu cầu:

- Có loading state.
- Có submitting/cancelling state.
- Hiển thị lỗi backend trả về.
- Có empty state.
- Có toast sau register/cancel.
- Sau register/cancel phải đồng bộ lại course capacity bằng API/state contract cuối.
- Không lấy `enrolled++` ở frontend làm nguồn chính.
- Không tự viết lại business rule duplicate/credit/capacity ở frontend.

## 13. Trình tự thực hiện

Bước 1: kiểm tra `develop` sau khi Student và Course đã merge, rồi tạo branch `feature/registration-validator`. Mục tiêu là bắt đầu trên nền đã có StudentRepository và CourseRepository. Chạy `git branch --show-current`; chưa commit.

Bước 2: hoàn thiện `Registration.java`, `RegistrationDetail.java` và `RegistrationStatus.java`. Mục tiêu là domain đăng ký có phiếu, chi tiết và trạng thái. Chạy backend compile; chỉ commit khi compile pass.

Bước 3: tạo `RegistrationRepository.java`. Mục tiêu là khóa contract tìm registration theo sinh viên và học phần. Chạy test compile backend.

Bước 4: tạo `JsonRegistrationRepository.java`. Mục tiêu là đọc/ghi qua `JsonFileUtils`. Chạy `JsonRegistrationRepositoryTest`. Nếu pass, có thể commit domain/repository.

Bước 5: tạo các exception đăng ký: `DuplicateRegistrationException`, `CourseFullException`, `CreditLimitExceededException`, `ScheduleConflictException`, `RegistrationNotFoundException`. Mục tiêu là mỗi rule có error code rõ. Chạy test compile backend.

Bước 6: kiểm tra lại `CourseNotFoundException` và `StudentNotFoundException` chỉ được reuse. Mục tiêu là không tạo lỗi trùng chức năng. Chưa commit nếu chỉ đọc kiểm tra.

Bước 7: tạo hoặc dùng `RegistrationValidationContext`. Mục tiêu là gom dữ liệu cho validator, không đọc repository trong validator. Chạy test compile backend.

Bước 8: tạo `CourseExistenceValidator`. Mục tiêu là course không tồn tại trả `COURSE_NOT_FOUND`. Chạy `CourseExistenceValidatorTest`.

Bước 9: tạo `DuplicateCourseValidator`. Mục tiêu là course đã đăng ký trả `DUPLICATE_REGISTRATION`. Chạy `DuplicateCourseValidatorTest`.

Bước 10: tạo `CapacityValidator`. Mục tiêu là lớp đầy trả `COURSE_FULL`. Chạy `CapacityValidatorTest`.

Bước 11: tạo `CreditLimitValidator`. Mục tiêu là vượt số tín chỉ tối đa trả `CREDIT_LIMIT_EXCEEDED`. Chạy `CreditLimitValidatorTest`.

Bước 12: tạo `ScheduleConflictValidator`. Mục tiêu là bắt trùng lịch theo rule overlap. Chạy `ScheduleConflictValidatorTest`. Nếu 5 validator test pass, có thể commit phần validator.

Bước 13: thêm `@Order(10/20/30/40/50)` cho 5 validator. Mục tiêu là duplicate được báo trước credit/capacity khi cùng lúc vi phạm nhiều rule. Chạy `RegistrationValidatorOrderTest`.

Bước 14: tạo `RegistrationSummary.java`, `RegistrationResponse.java`, `RegistrationDetailResponse.java`, `RegisteredCourseResponse.java` và `RegistrationMapper.java`. Mục tiêu là GET/POST/DELETE trả state đăng ký đã resolve course. Chạy backend compile.

Bước 15: tạo `RegistrationService.java`. Mục tiêu là register/cancel đúng luồng, không mutate khi validation fail. Chạy `RegistrationServiceTest`. Nếu pass, có thể commit service/mapper.

Bước 16: tạo `RegistrationRequest.java` và `RegistrationController.java`. Mục tiêu là có GET/POST/DELETE đúng API, `courseId` blank trả `VALIDATION_ERROR`. Chạy `RegistrationControllerTest`. Nếu pass, có thể commit API.

Bước 17: cập nhật `apiEndpoints.ts` nếu thiếu endpoint Registration. Mục tiêu là frontend dùng endpoint chung. Chạy `npm run typecheck`.

Bước 18: hoàn thiện `registration.types.ts` và `registrationApi.ts`. Mục tiêu là gọi GET/POST/DELETE và map response thành `RegistrationSummary`. Chạy `npm run typecheck`.

Bước 19: nối `RegisterConfirmModal.tsx`, `RegisteredCoursesPage.tsx` và integration nhỏ trong `App.tsx`. Mục tiêu là register/cancel có loading, error, toast và refresh capacity. Chạy `npm run typecheck` và kiểm tra thủ công nếu backend local chạy được.

Bước 20: chạy backend `clean test`, `clean package`, frontend `typecheck`, `build`. Chỉ commit khi tất cả pass.

Bước 21: kiểm tra `git diff --name-status origin/develop...HEAD`. Mục tiêu là chỉ có file Registration/Validator và integration nhỏ. Nếu có file lạ, dừng lại và hỏi trưởng nhóm.

## 14. Test bắt buộc

Repository test:

- `JsonRegistrationRepositoryTest`

Validator tests:

- course existence;
- duplicate;
- capacity boundary;
- credit boundary;
- schedule boundary.

Schedule cases:

- khác ngày: pass;
- `existingEnd == newStart`: pass;
- `newEnd == existingStart`: pass;
- overlap một phần: fail;
- cùng interval: fail;
- lịch mới nằm trong lịch cũ: fail;
- lịch mới chứa lịch cũ: fail.

Service tests:

- register success;
- duplicate;
- full;
- credit exceeded;
- schedule conflict;
- student missing;
- course missing;
- cancel success;
- cancel not registered;
- capacity tăng đúng 1 khi register;
- capacity giảm đúng 1 khi cancel;
- không mutate khi validation fail.

Controller tests:

- GET success;
- POST success;
- DELETE success;
- business error code;
- validation error.

## 15. Regression test validator order

Bắt buộc có case:

```text
duplicate + credit exceeded -> DUPLICATE_REGISTRATION
duplicate + full -> DUPLICATE_REGISTRATION
```

Đây là test quan trọng để bảo vệ thứ tự validator.

## 16. Commit plan

Gợi ý commit:

```text
feat(registration): implement registration persistence
feat(registration): implement validation rules
feat(registration): implement registration service and api
feat(frontend): connect registration flow
test(registration): cover registration business rules
```

## 17. Kiểm tra trước khi push

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

## 18. Push và Pull Request

```powershell
git push -u origin feature/registration-validator
```

Tạo Pull Request:

- Base: `develop`
- Compare: `feature/registration-validator`
- Title: `[Registration] Hoàn thiện đăng ký môn học và kiểm tra nghiệp vụ`

## Điều kiện để được tạo Pull Request

- [ ] Đúng branch `feature/registration-validator`
- [ ] File đúng phạm vi
- [ ] Registration API đúng contract
- [ ] 5 validator đủ rule
- [ ] Validator order đúng
- [ ] `RegistrationService` dùng `List<CourseValidator>`
- [ ] Không mutate dữ liệu khi validation fail
- [ ] Cancel xử lý capacity đúng
- [ ] Frontend không tự quyết định business rule thay backend
- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Commit author đúng
- [ ] Git status sạch
- [ ] Không push `develop` hoặc `main`

Hoàn thành các bước trên rồi tạo Pull Request và chờ trưởng nhóm review.
