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

## 14. Hướng dẫn từng bước chi tiết

Các file READ ONLY trong phần này gồm `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/Registrable.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/api/apiError.ts` và `data/*.json`. Nếu nghĩ cần sửa các file này, dừng lại và hỏi trưởng nhóm trước.

### Bước 3.1 — Chuẩn bị branch Registration

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có.
**Mục tiêu:** tạo branch `feature/registration-validator` sau khi Student và Course đã có trên `develop`.
**Cần làm:** pull `develop`, tạo branch, kiểm tra status.
**Luồng xử lý:** nền có Student/Course -> branch Registration -> bắt đầu.
**Không được làm:** không làm trên `develop` hoặc `main`.
**Test:** kiểm tra branch.
**Lệnh kiểm tra:** `git branch --show-current`; `git status --short`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/registration-validator` sạch.
**Commit:** chưa commit.

### Bước 3.2 — Rà shared contracts Registration

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/Registrable.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** hiểu luồng bắt buộc Controller -> Service -> Validator -> Repository -> Json Repository -> JsonFileUtils.
**Cần làm:** xác nhận `CourseValidator.validate(RegistrationValidationContext context)` và `Registrable.register(String studentId, String courseId)`.
**Luồng xử lý:** service chuẩn bị context -> validator đọc context -> repository persist.
**Không được làm:** không đổi shared interface nếu đã đúng.
**Test:** diff shared rỗng.
**Lệnh kiểm tra:** `git diff -- backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải biết file nào chỉ được đọc.
**Commit:** chưa commit.

### Bước 3.3 — Hoàn thiện `RegistrationStatus`

**File cần mở trước:** không có.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/enums/RegistrationStatus.java`.
**Mục tiêu:** khóa trạng thái phiếu đăng ký.
**Cần làm:** giữ enum `ACTIVE` và `CANCELLED`.
**Luồng xử lý:** service tạo/cancel registration -> status cập nhật -> response.
**Không được làm:** không thêm trạng thái mới nếu chưa có contract.
**Test:** compile qua repository/service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có enum đúng hai trạng thái.
**Commit:** nhóm commit Registration persistence.

### Bước 3.4 — Hoàn thiện `RegistrationDetail`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationDetail.java`.
**Mục tiêu:** lưu courseId trong từng dòng đăng ký.
**Cần làm:** giữ field `courseId`, constructor không tham số và getter/setter.
**Luồng xử lý:** Registration chứa details -> service resolve course -> response courses.
**Không được làm:** không nhét toàn bộ Course vào detail.
**Test:** repository test đọc/ghi detail.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có detail nhẹ, chỉ tham chiếu học phần.
**Commit:** nhóm commit Registration persistence.

### Bước 3.5 — Hoàn thiện `Registration`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationDetail.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/enums/RegistrationStatus.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Registration.java`.
**Mục tiêu:** biểu diễn phiếu đăng ký của sinh viên.
**Cần làm:** giữ `registrationId`, `studentId`, `status`, `registeredAt`, `List<RegistrationDetail> details`.
**Luồng xử lý:** service tạo/cập nhật registration -> repository save -> response summary.
**Không được làm:** không đọc JSON trong model, không chứa rule duplicate/credit.
**Test:** repository test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có domain registration không chứa persistence logic.
**Commit:** nhóm commit Registration persistence.

### Bước 3.6 — Khóa `RegistrationRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Registration.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java`.
**Mục tiêu:** định nghĩa contract tìm/lưu/xóa đăng ký.
**Cần làm:** giữ `findByStudentId`, `findByStudentAndCourse`, `save`, `delete`.
**Luồng xử lý:** service -> repository interface -> JSON repository.
**Không được làm:** không thêm tham số file/path vào interface.
**Test:** compile qua repository test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có contract repository đủ cho register/cancel.
**Commit:** nhóm commit Registration persistence.

### Bước 3.7 — Hoàn thiện `JsonRegistrationRepository.findByStudentId`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**Mục tiêu:** tìm mọi phiếu đăng ký của một sinh viên.
**Cần làm:** đọc `List<Registration>` qua `JsonFileUtils`, lọc theo `studentId`.
**Luồng xử lý:** repository -> utility -> `data/registrations.json` -> filter.
**Không được làm:** không hard-code đường dẫn máy cá nhân.
**Test:** repository test find by student.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải lấy đúng registrations của sinh viên.
**Commit:** nhóm commit Registration persistence.

### Bước 3.8 — Hoàn thiện `JsonRegistrationRepository.findByStudentAndCourse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**Mục tiêu:** tìm registration active chứa courseId.
**Cần làm:** lọc theo `studentId`, `status`, và `details.courseId`.
**Luồng xử lý:** service kiểm tra duplicate/cancel -> repository tìm registration theo course.
**Không được làm:** không trả registration đã `CANCELLED` như đăng ký active.
**Test:** repository test find by student and course.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải tìm đúng đăng ký active theo course.
**Commit:** nhóm commit Registration persistence.

### Bước 3.9 — Hoàn thiện `JsonRegistrationRepository.save`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**Mục tiêu:** thêm mới hoặc cập nhật phiếu đăng ký.
**Cần làm:** đọc list, thay bản ghi cùng `registrationId` nếu có, ghi lại bằng `JsonFileUtils`.
**Luồng xử lý:** service register/cancel -> repository save -> JSON file.
**Không được làm:** không append trùng phiếu cùng id.
**Test:** repository save/update.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải save/update registration ổn định.
**Commit:** nhóm commit Registration persistence.

### Bước 3.10 — Hoàn thiện `JsonRegistrationRepository.delete`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java`.
**Mục tiêu:** hỗ trợ xóa/hủy course khỏi registration theo contract.
**Cần làm:** xử lý theo `studentId` và `courseId`, không làm mất dữ liệu sinh viên khác.
**Luồng xử lý:** service cancel -> repository delete/save -> JSON file.
**Không được làm:** không xóa toàn bộ file hoặc toàn bộ registration của sinh viên nếu chỉ hủy một course.
**Test:** repository delete.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có delete đúng phạm vi.
**Commit:** có thể commit Registration persistence khi repository test pass.

### Bước 3.11 — Tạo `DuplicateRegistrationException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/DuplicateRegistrationException.java`.
**Mục tiêu:** báo lỗi đăng ký trùng.
**Cần làm:** dùng error code `DUPLICATE_REGISTRATION`.
**Luồng xử lý:** validator phát hiện duplicate -> exception -> API error.
**Không được làm:** không trả boolean thay lỗi nghiệp vụ.
**Test:** validator duplicate.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=DuplicateCourseValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi duplicate rõ ràng.
**Commit:** nhóm commit Validators.

### Bước 3.12 — Tạo `CourseFullException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseFullException.java`.
**Mục tiêu:** báo lỗi lớp đầy.
**Cần làm:** dùng error code `COURSE_FULL`.
**Luồng xử lý:** capacity validator -> exception -> API error.
**Không được làm:** không sửa Course API để tự chặn capacity.
**Test:** capacity validator.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CapacityValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi capacity đúng.
**Commit:** nhóm commit Validators.

### Bước 3.13 — Tạo `CreditLimitExceededException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CreditLimitExceededException.java`.
**Mục tiêu:** báo lỗi vượt tín chỉ tối đa.
**Cần làm:** dùng error code `CREDIT_LIMIT_EXCEEDED`.
**Luồng xử lý:** credit validator -> exception -> API error.
**Không được làm:** không hard-code maxCredits trong validator.
**Test:** credit validator.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CreditLimitValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi credit đúng.
**Commit:** nhóm commit Validators.

### Bước 3.14 — Tạo `ScheduleConflictException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/ScheduleConflictException.java`.
**Mục tiêu:** báo lỗi trùng lịch.
**Cần làm:** dùng error code `SCHEDULE_CONFLICT`.
**Luồng xử lý:** schedule validator -> exception -> API error.
**Không được làm:** không đặt rule overlap ở frontend.
**Test:** schedule conflict validator.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=ScheduleConflictValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi trùng lịch đúng.
**Commit:** nhóm commit Validators.

### Bước 3.15 — Tạo `RegistrationNotFoundException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/RegistrationNotFoundException.java`.
**Mục tiêu:** báo lỗi hủy môn chưa đăng ký.
**Cần làm:** dùng error code `REGISTRATION_NOT_FOUND`.
**Luồng xử lý:** cancel không tìm thấy active course -> exception.
**Không được làm:** không im lặng khi hủy course chưa đăng ký.
**Test:** service cancel not registered.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi cancel đúng.
**Commit:** nhóm commit Registration service/API.

### Bước 3.16 — Reuse lỗi Student/Course sẵn có

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** không tạo lỗi trùng chức năng.
**Cần làm:** kiểm tra error code `STUDENT_NOT_FOUND`, `COURSE_NOT_FOUND`.
**Luồng xử lý:** service/validator dùng lại lỗi hiện có.
**Không được làm:** không tạo `RegistrationStudentNotFoundException` hoặc `RequestedCourseNotFoundException`.
**Test:** service missing student/course.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest,CourseExistenceValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải reuse đúng lỗi chung.
**Commit:** chưa commit nếu chỉ đọc.

### Bước 3.17 — Kiểm tra `RegistrationValidationContext`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java`.
**File cần tạo/sửa:** chỉ sửa file này nếu thiếu contract và đã hỏi trưởng nhóm.
**Mục tiêu:** context chứa dữ liệu service đã chuẩn bị.
**Cần làm:** kiểm tra `student`, `requestedCourseId`, `requestedCourse`, `registeredCourses`, `requireRequestedCourse()`.
**Luồng xử lý:** service build context -> validators đọc context.
**Không được làm:** không inject repository vào context.
**Test:** validator tests.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseExistenceValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có context đủ cho 5 validator.
**Commit:** nhóm commit Validators nếu có sửa hợp lệ.

### Bước 3.18 — Tạo `CourseExistenceValidator`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CourseExistenceValidator.java`.
**Mục tiêu:** chặn course không tồn tại.
**Cần làm:** implement `CourseValidator`, dùng `@Order(10)`, ném `CourseNotFoundException` khi requested course rỗng.
**Luồng xử lý:** context -> validator -> lỗi hoặc pass.
**Không được làm:** không gọi `CourseRepository` trong validator.
**Test:** course existence.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseExistenceValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có validator tồn tại course.
**Commit:** nhóm commit Validators.

### Bước 3.19 — Tạo `DuplicateCourseValidator`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/DuplicateCourseValidator.java`.
**Mục tiêu:** chặn đăng ký trùng course active.
**Cần làm:** implement `CourseValidator`, dùng `@Order(20)`, so `requestedCourseId` với registered courses.
**Luồng xử lý:** context registered courses -> duplicate check -> lỗi hoặc pass.
**Không được làm:** không kiểm tra duplicate ở frontend thay backend.
**Test:** duplicate validator.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=DuplicateCourseValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi `DUPLICATE_REGISTRATION` đúng.
**Commit:** nhóm commit Validators.

### Bước 3.20 — Tạo `CapacityValidator`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CapacityValidator.java`.
**Mục tiêu:** chặn course đã đầy.
**Cần làm:** implement `CourseValidator`, dùng `@Order(30)`, kiểm tra `currentCapacity >= maxCapacity`.
**Luồng xử lý:** requested course -> capacity rule -> lỗi hoặc pass.
**Không được làm:** không tăng/giảm capacity trong validator.
**Test:** capacity boundary.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CapacityValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi `COURSE_FULL` đúng boundary.
**Commit:** nhóm commit Validators.

### Bước 3.21 — Tạo `CreditLimitValidator`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CreditLimitValidator.java`.
**Mục tiêu:** chặn vượt `maxCredits`.
**Cần làm:** implement `CourseValidator`, dùng `@Order(40)`, tính tổng credits đã đăng ký + course mới.
**Luồng xử lý:** registered courses -> sum credits -> cộng requested course -> so với student maxCredits.
**Không được làm:** không hard-code giới hạn tín chỉ trong code.
**Test:** credit boundary.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CreditLimitValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi `CREDIT_LIMIT_EXCEEDED` đúng.
**Commit:** nhóm commit Validators.

### Bước 3.22 — Tạo `ScheduleConflictValidator`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/ScheduleConflictValidator.java`.
**Mục tiêu:** chặn trùng lịch theo rule overlap.
**Cần làm:** implement `CourseValidator`, dùng `@Order(50)`, kiểm tra cùng ngày và `newStart < existingEnd` và `newEnd > existingStart`.
**Luồng xử lý:** requested schedules -> registered schedules -> overlap -> lỗi hoặc pass.
**Không được làm:** không coi `existingEnd == newStart` là trùng.
**Test:** các ca schedule boundary.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=ScheduleConflictValidatorTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có validator trùng lịch đúng rule.
**Commit:** nhóm commit Validators.

### Bước 3.23 — Kiểm tra thứ tự validator

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CourseExistenceValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/DuplicateCourseValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CapacityValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CreditLimitValidator.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/ScheduleConflictValidator.java`.
**File cần tạo/sửa:** chỉ sửa annotation `@Order` nếu sai.
**Mục tiêu:** duplicate được báo trước capacity/credit khi cùng vi phạm.
**Cần làm:** giữ thứ tự 10, 20, 30, 40, 50.
**Luồng xử lý:** Spring inject `List<CourseValidator>` theo order -> service chạy lần lượt.
**Không được làm:** không đổi sang if-chain trong service.
**Test:** validator order.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationValidatorOrderTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có order ổn định.
**Commit:** có thể commit Validators khi 5 validator pass.

### Bước 3.24 — Chạy toàn bộ validator tests

**File cần mở trước:** các test validator.
**File cần tạo/sửa:** chỉ sửa validators nếu test chỉ ra lỗi thật.
**Mục tiêu:** khóa rules trước khi viết service.
**Cần làm:** chạy đủ 5 validator và order test.
**Luồng xử lý:** existence -> duplicate -> capacity -> credit -> schedule -> order.
**Không được làm:** không sửa test để hợp thức hóa rule sai.
**Test:** validator suite.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseExistenceValidatorTest,DuplicateCourseValidatorTest,CapacityValidatorTest,CreditLimitValidatorTest,ScheduleConflictValidatorTest,RegistrationValidatorOrderTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có toàn bộ validator pass.
**Commit:** `feat(registration): implement validation rules`.

### Bước 3.25 — Tạo `RegistrationSummary`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Registration.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/CourseWithLecturer.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java`.
**Mục tiêu:** gom registration với courses đã resolve.
**Cần làm:** giữ `Registration registration` và `List<CourseWithLecturer> courses`.
**Luồng xử lý:** service -> summary -> mapper -> response.
**Không được làm:** không trả JSON trực tiếp từ service.
**Test:** service/mapper compile.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có composition response cho Registration.
**Commit:** nhóm commit Registration service/API.

### Bước 3.26 — Tạo `RegistrationDetailResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationDetail.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationDetailResponse.java`.
**Mục tiêu:** response chi tiết chỉ cần `courseId`.
**Cần làm:** khai báo field `courseId`.
**Luồng xử lý:** Registration detail -> mapper -> response.
**Không được làm:** không nhét toàn bộ Course vào detail response.
**Test:** controller response.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO detail rõ ràng.
**Commit:** nhóm commit Registration service/API.

### Bước 3.27 — Tạo `RegisteredCourseResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/CourseResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegisteredCourseResponse.java`.
**Mục tiêu:** response course trong phiếu đăng ký đủ cho frontend.
**Cần làm:** giữ các field tương thích CourseResponse gồm course, lecturer, capacity, schedules.
**Luồng xử lý:** CourseWithLecturer -> mapper -> registered course response.
**Không được làm:** không bỏ capacity vì frontend cần refresh sau register/cancel.
**Test:** controller response.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO course đã đăng ký.
**Commit:** nhóm commit Registration service/API.

### Bước 3.28 — Tạo `RegistrationResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationDetailResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegisteredCourseResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationResponse.java`.
**Mục tiêu:** response GET/POST/DELETE thống nhất.
**Cần làm:** khai báo `registrationId`, `studentId`, `status`, `registeredAt`, `details`, `courses`, `totalCredits`.
**Luồng xử lý:** summary -> mapper -> response.
**Không được làm:** không trả response khác nhau tùy method.
**Test:** controller GET/POST/DELETE.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO tổng hợp đúng contract.
**Commit:** nhóm commit Registration service/API.

### Bước 3.29 — Tạo `RegistrationMapper`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/RegistrationMapper.java`.
**Mục tiêu:** map summary sang response.
**Cần làm:** map details, courses, tính hoặc nhận `totalCredits` đúng từ courses active.
**Luồng xử lý:** RegistrationSummary -> DTO -> API.
**Không được làm:** không gọi repository trong mapper.
**Test:** controller/service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper không chứa persistence logic.
**Commit:** nhóm commit Registration service/API.

### Bước 3.30 — Tạo `RegistrationService` skeleton

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/Registrable.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** service là nơi điều phối nghiệp vụ đăng ký.
**Cần làm:** inject Student/Course/Registration repository và `List<CourseValidator>`.
**Luồng xử lý:** controller -> service -> validators -> repositories.
**Không được làm:** không đọc file JSON, không chuyển validators thành if-chain.
**Test:** service compile.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có service đúng dependency.
**Commit:** nhóm commit Registration service/API.

### Bước 3.31 — Cài load student/course trong service

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** service chuẩn bị dữ liệu cho register/cancel.
**Cần làm:** load Student theo `studentId`, requested Course theo `courseId`, dùng lỗi shared khi thiếu.
**Luồng xử lý:** studentId/courseId -> repositories -> Student/Course hoặc exception.
**Không được làm:** không để validator tự load repository.
**Test:** missing student/course.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có load dữ liệu đúng lỗi.
**Commit:** nhóm commit Registration service/API.

### Bước 3.32 — Cài build validation context

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** gom dữ liệu active registrations cho validators.
**Cần làm:** lấy registrations active, resolve registered courses, tạo context.
**Luồng xử lý:** service load current state -> context -> validators.
**Không được làm:** không truyền dữ liệu thiếu khiến validator phải tự đi tìm.
**Test:** validator/service integration.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có context đầy đủ trước validate.
**Commit:** nhóm commit Registration service/API.

### Bước 3.33 — Cài `registerCourse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** đăng ký course sau khi validation pass.
**Cần làm:** chạy validators, tạo/cập nhật registration active, tăng `currentCapacity` đúng 1, save registration và course.
**Luồng xử lý:** validate pass -> persist registration -> update capacity -> trả registration.
**Không được làm:** không mutate dữ liệu nếu validation fail.
**Test:** register success và validation fail không mutate.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có register đúng nghiệp vụ và capacity.
**Commit:** nhóm commit Registration service/API.

### Bước 3.34 — Cài `registerCourseSummary`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** POST trả state đăng ký đã resolve course.
**Cần làm:** sau `registerCourse`, build summary gồm registration và courses active.
**Luồng xử lý:** register -> load active state -> summary -> mapper.
**Không được làm:** không để controller tự resolve courses.
**Test:** service/controller POST.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest,RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có summary sau đăng ký.
**Commit:** nhóm commit Registration service/API.

### Bước 3.35 — Cài `cancelCourse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** hủy course đã đăng ký.
**Cần làm:** tìm registration active chứa course, xóa detail hoặc cập nhật trạng thái khi cần, giảm capacity đúng 1.
**Luồng xử lý:** studentId/courseId -> find active -> update registration -> update course capacity -> save.
**Không được làm:** không để capacity âm, không hủy course chưa đăng ký silently.
**Test:** cancel success, not registered, capacity giảm đúng.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có cancel đúng state và capacity.
**Commit:** nhóm commit Registration service/API.

### Bước 3.36 — Cài `cancelCourseSummary`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** DELETE trả state sau khi hủy.
**Cần làm:** gọi cancel, load lại active registration summary.
**Luồng xử lý:** cancel -> summary mới -> mapper -> response.
**Không được làm:** không trả course vừa bị hủy trong active courses.
**Test:** controller DELETE.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có response hủy đồng bộ.
**Commit:** nhóm commit Registration service/API.

### Bước 3.37 — Cài `findActiveRegistrationsByStudent`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** lấy registration active cho GET và Timetable sau này.
**Cần làm:** lọc theo `studentId` và `RegistrationStatus.ACTIVE`.
**Luồng xử lý:** repository list -> filter active -> service result.
**Không được làm:** không trả registration đã hủy như active.
**Test:** active/cancelled filter.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có danh sách active chính xác.
**Commit:** nhóm commit Registration service/API.

### Bước 3.38 — Cài `findActiveRegistrationSummary`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** GET trả state hiện tại, kể cả empty.
**Cần làm:** load active registration, resolve courses, trả summary rỗng khi chưa có đăng ký.
**Luồng xử lý:** studentId -> active registrations -> resolve courses -> summary.
**Không được làm:** không trả lỗi khi sinh viên chưa đăng ký môn nào.
**Test:** GET empty và success.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest,RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có empty state `{ courses: [], totalCredits: 0 }`.
**Commit:** nhóm commit Registration service/API.

### Bước 3.39 — Cài `calculateTotalCredits`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`.
**Mục tiêu:** tổng tín chỉ active chính xác.
**Cần làm:** cộng credits của courses active đã resolve.
**Luồng xử lý:** active registrations -> details -> courses -> sum.
**Không được làm:** không cộng course đã hủy hoặc course không resolve được.
**Test:** total credits.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có totalCredits đúng.
**Commit:** nhóm commit Registration service/API.

### Bước 3.40 — Chạy service tests Registration

**File cần mở trước:** `backend/src/test/java/vn/edu/phenikaa/courseregistration/service/RegistrationServiceTest.java`.
**File cần tạo/sửa:** chỉ sửa service/validators nếu test chỉ ra lỗi thật.
**Mục tiêu:** khóa nghiệp vụ register/cancel.
**Cần làm:** kiểm tra success, duplicate, full, credit, conflict, missing, cancel, no mutate.
**Luồng xử lý:** test từng rule -> sửa đúng lớp chịu trách nhiệm.
**Không được làm:** không sửa frontend hoặc controller để né lỗi service.
**Test:** service suite.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có Registration service pass.
**Commit:** có thể commit `feat(registration): implement registration service and api`.

### Bước 3.41 — Tạo `RegistrationRequest`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/RegistrationController.java` nếu đã có.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/RegistrationRequest.java`.
**Mục tiêu:** nhận courseId khi đăng ký.
**Cần làm:** khai báo `courseId` và validate không rỗng.
**Luồng xử lý:** POST body -> request DTO -> controller -> service.
**Không được làm:** không lấy `studentId` từ body làm nguồn chính khi URL đã có path variable.
**Test:** blank courseId.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có request DTO đúng validation.
**Commit:** nhóm commit Registration service/API.

### Bước 3.42 — Tạo `RegistrationController`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/RegistrationMapper.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/RegistrationController.java`.
**Mục tiêu:** mở GET/POST/DELETE registration.
**Cần làm:** dùng `@RequestMapping("/api/students/{studentId}/registrations")`, `@GetMapping`, `@PostMapping`, `@DeleteMapping("/{courseId}")`.
**Luồng xử lý:** HTTP -> controller -> service summary -> mapper -> `ApiResponse`.
**Không được làm:** không đọc repository trong controller.
**Test:** controller tests.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API registration đúng contract.
**Commit:** nhóm commit Registration service/API.

### Bước 3.43 — Chạy controller tests Registration

**File cần mở trước:** `backend/src/test/java/vn/edu/phenikaa/courseregistration/controller/RegistrationControllerTest.java`.
**File cần tạo/sửa:** chỉ sửa controller/mapper/request nếu lỗi thuộc API layer.
**Mục tiêu:** xác nhận envelope, validation và business error.
**Cần làm:** chạy GET, POST, DELETE, business error, validation error.
**Luồng xử lý:** mock HTTP -> controller -> response JSON.
**Không được làm:** không đổi `ApiResponse` hoặc `ApiErrorResponse`.
**Test:** controller suite.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=RegistrationControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API test pass.
**Commit:** commit API nếu chưa commit.

### Bước 3.44 — Thêm endpoint Registration frontend

**File cần mở trước:** `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** `frontend/src/shared/constants/apiEndpoints.ts` nếu thiếu Registration endpoints.
**Mục tiêu:** frontend dùng constant chung cho GET/POST/DELETE.
**Cần làm:** đảm bảo có `REGISTRATIONS(studentId)`, `REGISTER_COURSE(studentId)`, `CANCEL_REGISTRATION(studentId, courseId)`.
**Luồng xử lý:** registrationApi -> endpoint constant -> requestApi.
**Không được làm:** không hard-code URL trong component.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có endpoint Registration đủ.
**Commit:** nhóm commit Frontend Registration.

### Bước 3.45 — Hoàn thiện `registration.types.ts`

**File cần mở trước:** `frontend/src/features/registration/types/registration.types.ts`, `frontend/src/features/courses/types/course.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/registration/types/registration.types.ts`.
**Mục tiêu:** type frontend khớp response backend.
**Cần làm:** giữ `RegistrationRequest`, `RegistrationResponse`, `RegistrationSummary`, `RegisteredCourseResponse`, `RegistrationStatus`.
**Luồng xử lý:** backend response -> types -> API adapter -> UI.
**Không được làm:** không bỏ `totalCredits`, `courses`, `details`.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có type Registration đầy đủ.
**Commit:** nhóm commit Frontend Registration.

### Bước 3.46 — Hoàn thiện `registrationApi`

**File cần mở trước:** `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/constants/apiEndpoints.ts`, `frontend/src/features/registration/types/registration.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/registration/api/registrationApi.ts`.
**Mục tiêu:** gọi GET/POST/DELETE qua shared client.
**Cần làm:** cài `getRegistrations(studentId)`, `registerCourse(studentId, courseId)`, `cancelCourse(studentId, courseId)`.
**Luồng xử lý:** UI -> registrationApi -> requestApi -> RegistrationSummary.
**Không được làm:** không tự tăng `enrolled++` làm nguồn chính.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API adapter Registration đầy đủ.
**Commit:** nhóm commit Frontend Registration.

### Bước 3.47 — Nối `RegisterConfirmModal`

**File cần mở trước:** `frontend/src/features/registration/components/RegisterConfirmModal.tsx`, `frontend/src/features/registration/api/registrationApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/registration/components/RegisterConfirmModal.tsx`.
**Mục tiêu:** modal đăng ký gọi API và hiển thị trạng thái submit.
**Cần làm:** gọi register callback/API, disable khi submitting, hiển thị lỗi backend.
**Luồng xử lý:** chọn course -> confirm -> POST -> success/error.
**Không được làm:** không tự validate duplicate/credit/capacity ở frontend.
**Test:** typecheck và kiểm tra thủ công.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có modal đăng ký dùng backend rule.
**Commit:** nhóm commit Frontend Registration.

### Bước 3.48 — Nối `RegisteredCoursesPage`

**File cần mở trước:** `frontend/src/features/registration/pages/RegisteredCoursesPage.tsx`, `frontend/src/features/registration/api/registrationApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/registration/pages/RegisteredCoursesPage.tsx`.
**Mục tiêu:** trang môn đã đăng ký dùng API thật.
**Cần làm:** load registrations, hiển thị loading/error/empty, gọi cancel và refresh state.
**Luồng xử lý:** mở tab registered -> GET -> render courses -> DELETE khi hủy -> reload summary.
**Không được làm:** không đọc mock registration trực tiếp.
**Test:** typecheck và kiểm tra thủ công.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có trang Registered Courses đồng bộ backend.
**Commit:** nhóm commit Frontend Registration.

### Bước 3.49 — Nối integration nhỏ trong `App`

**File cần mở trước:** `frontend/src/app/App.tsx`, `frontend/src/features/courses/pages/CourseListPage.tsx`, `frontend/src/features/registration/pages/RegisteredCoursesPage.tsx`.
**File cần tạo/sửa:** `frontend/src/app/App.tsx` nếu cần.
**Mục tiêu:** register/cancel có toast và refresh capacity theo state cuối.
**Cần làm:** truyền `studentId`, callback refresh course/registration, hiển thị toast success/error.
**Luồng xử lý:** Course detail -> register -> summary mới -> refresh course list/registered page.
**Không được làm:** không rewrite toàn bộ App, không tự xử lý business rule thay backend.
**Test:** typecheck và manual flow.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có register/cancel chạy xuyên UI.
**Commit:** có thể commit `feat(frontend): connect registration flow`.

### Bước 3.50 — Kiểm tra cuối Registration

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa lỗi đúng phạm vi Registration/Validator.
**Mục tiêu:** đủ điều kiện tạo Pull Request.
**Cần làm:** chạy backend test/package, frontend typecheck/build, rà diff.
**Luồng xử lý:** validator tests -> service/controller tests -> full backend -> frontend -> diff.
**Không được làm:** không bỏ test, không push file ngoài phạm vi, không sửa Student/Course/Timetable nếu không có lý do rõ và chưa hỏi trưởng nhóm.
**Test:** full verification.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonRegistrationRepositoryTest,CourseExistenceValidatorTest,DuplicateCourseValidatorTest,CapacityValidatorTest,CreditLimitValidatorTest,ScheduleConflictValidatorTest,RegistrationValidatorOrderTest,RegistrationServiceTest,RegistrationControllerTest test`; từ `backend`: `.\mvnw.cmd clean test`; từ `backend`: `.\mvnw.cmd clean package`; từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`; `git diff --name-status origin/develop...HEAD`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có test/build pass, diff đúng phạm vi và các commit theo nhóm persistence, validators, service/API, frontend, tests.
**Commit:** dùng commit plan phần Registration.

## 15. Test bắt buộc

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

## 16. Regression test validator order

Bắt buộc có case:

```text
duplicate + credit exceeded -> DUPLICATE_REGISTRATION
duplicate + full -> DUPLICATE_REGISTRATION
```

Đây là test quan trọng để bảo vệ thứ tự validator.

## 17. Commit plan

Gợi ý commit:

```text
feat(registration): implement registration persistence
feat(registration): implement validation rules
feat(registration): implement registration service and api
feat(frontend): connect registration flow
test(registration): cover registration business rules
```

## 18. Kiểm tra trước khi push

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

## 19. Push và Pull Request

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
