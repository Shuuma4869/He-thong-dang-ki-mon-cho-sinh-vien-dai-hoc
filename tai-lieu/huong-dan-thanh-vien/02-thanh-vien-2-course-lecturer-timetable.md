# Thành viên 2 - Course, Lecturer, Schedule và Timetable

Đọc trước:

- [Hướng dẫn chung](00-doc-truoc-khi-bat-dau.md)
- [Quy trình Pull Request](04-quy-trinh-pull-request.md)

Thành viên 2 làm hai lượt riêng:

- Phần A: Course/Lecturer/Schedule trên branch `feature/course-lecturer`.
- Phần B: Timetable trên branch mới `feature/timetable`.

Không dùng lại branch `feature/course-lecturer` sau khi branch đó đã merge.

## Phần A - Course / Lecturer / Schedule

### 1. Khi nào bắt đầu

Bắt đầu phần A sau khi Student/Auth/Profile đã được merge vào `develop`.

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/course-lecturer
git branch --show-current
```

Kết quả cần là:

```text
feature/course-lecturer
```

### 2. Phạm vi phần A

Bạn phụ trách:

- `Lecturer`
- `Course`
- `Schedule`
- `CourseWithLecturer`
- `CourseRepository`
- `LecturerRepository`
- `JsonCourseRepository`
- `JsonLecturerRepository`
- `CourseService`
- `CourseController`
- `CourseResponse`, `LecturerResponse`, `ScheduleResponse`
- `CourseMapper`
- frontend courses
- course tests

Không triển khai Timetable trong branch này. Không sửa Student/Auth/Profile và không triển khai Registration.

### 3. File ownership phần A

| File/Folder | Trách nhiệm | Được sửa |
|---|---|---|
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java` | Domain giảng viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java` | Domain học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java` | Lịch học của học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/CourseWithLecturer.java` | Composition course + lecturer | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java` | Contract học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/LecturerRepository.java` | Contract giảng viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonCourseRepository.java` | JSON repository học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonLecturerRepository.java` | JSON repository giảng viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java` | Nghiệp vụ học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/CourseController.java` | REST API học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/CourseResponse.java` | DTO học phần | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/LecturerResponse.java` | DTO giảng viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ScheduleResponse.java` | DTO lịch học | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/CourseMapper.java` | Map Course/Lecturer/Schedule sang DTO | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/LecturerNotFoundException.java` | Lỗi `LECTURER_NOT_FOUND` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java` | Lỗi `COURSE_NOT_FOUND` | READ ONLY / REUSE EXISTING |
| `frontend/src/features/courses/**` | Course API, mapper, page, modal | OWNED |
| `frontend/src/app/App.tsx` | Gắn danh sách course vào UI | INTEGRATION ONLY |
| `frontend/src/shared/constants/apiEndpoints.ts` | Thêm endpoint Course nếu thiếu | INTEGRATION ONLY |
| `frontend/src/shared/api/httpClient.ts` | HTTP envelope chung | READ ONLY |
| `frontend/src/shared/api/apiError.ts` | Lỗi API chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Đọc/ghi JSON chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java` | Envelope API thành công | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java` | Envelope API lỗi | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java` | Xử lý lỗi chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java` | Nghiệp vụ đăng ký | READ ONLY |
| `frontend/src/features/timetable/**` | Timetable frontend | READ ONLY trong phần A |
| `data/*.json` | Demo seed | READ ONLY |

`CourseNotFoundException` đã thuộc contract dùng chung cho Course API và phần validation đăng ký. Không xóa, không đổi package, không đổi `errorCode`, không tạo exception khác cùng chức năng.

### 4. Domain Course/Lecturer/Schedule

`Lecturer` kế thừa `User`:

```java
public class Lecturer extends User {
    private String faculty;
}
```

`Course` có các field:

```java
public class Course {
    private String courseId;
    private String courseName;
    private int credits;
    private String lecturerId;
    private int maxCapacity;
    private int currentCapacity;
    private List<Schedule> schedules;
}
```

`Schedule` có:

```java
public class Schedule {
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
}
```

Quy định:

- Không đặt rule đăng ký trong model.
- Không tự tăng/giảm capacity trong Course API.
- Không thêm persistence riêng cho Timetable ở phần A.

### 5. Repository

Contract học phần:

```java
public interface CourseRepository {
    Optional<Course> findById(String courseId);
    List<Course> findAll();
    List<Course> search(String keyword);
    void save(Course course);
}
```

Contract giảng viên:

```java
public interface LecturerRepository {
    Optional<Lecturer> findById(String lecturerId);
    List<Lecturer> findAll();
    void save(Lecturer lecturer);
}
```

`JsonCourseRepository` và `JsonLecturerRepository` dùng `JsonFileUtils`. Không đọc JSON ở service/controller.

### 6. Course service và API

Chức năng:

- Lấy tất cả học phần, kèm thông tin giảng viên.
- Lấy chi tiết học phần theo `courseId`.
- Tìm kiếm học phần theo keyword.

API:

```text
GET /api/courses
GET /api/courses/{courseId}
GET /api/courses/search?keyword=...
```

`CourseResponse` gồm:

```text
courseId
courseName
credits
lecturerId
lecturer
maxCapacity
currentCapacity
schedules
```

`lecturer` gồm `lecturerId`, `fullName`, `faculty`. `schedules[]` gồm `dayOfWeek`, `startTime`, `endTime`, `room`.

Lỗi:

- Không tìm thấy học phần: `COURSE_NOT_FOUND`.
- Học phần có `lecturerId` không khớp dữ liệu giảng viên: `LECTURER_NOT_FOUND`.

### 7. Frontend Course

Các file chính:

- `frontend/src/features/courses/api/courseApi.ts`
- `frontend/src/features/courses/types/course.types.ts`
- `frontend/src/features/courses/utils/courseMappers.ts`
- `frontend/src/features/courses/pages/CourseListPage.tsx`
- `frontend/src/features/courses/components/CourseDetailModal.tsx`

Frontend gọi API qua shared `requestApi`, không gọi `fetch` trực tiếp trong page.

Course mapper cần chuyển:

| Backend | Frontend |
|---|---|
| `courseId` | `id`, `code` |
| `courseName` | `name` |
| `lecturer.fullName` | `lecturer` |
| `currentCapacity` | `enrolled` |
| `maxCapacity` | `capacity` |
| `schedules` | `ClassSchedule[]` |

Không hard-code danh sách môn học trong frontend.

### 8. Trình tự thực hiện phần A

Bước 1: kiểm tra `develop` và tạo branch `feature/course-lecturer`. Mục tiêu là bắt đầu đúng nền sau Student/Auth/Profile. Chạy `git branch --show-current`; chưa commit.

Bước 2: hoàn thiện `Lecturer.java`, `Course.java`, `Schedule.java`. Mục tiêu là domain đúng field và không chứa rule đăng ký. Chạy backend compile hoặc test hiện có. Chỉ commit khi compile pass.

Bước 3: tạo hoặc sửa `CourseRepository.java` và `LecturerRepository.java`. Mục tiêu là contract repository đúng. Chạy test compile backend.

Bước 4: tạo `JsonCourseRepository.java` và `JsonLecturerRepository.java`. Mục tiêu là đọc/ghi qua `JsonFileUtils`. Chạy `JsonCourseRepositoryTest` và `JsonLecturerRepositoryTest`. Nếu pass, có thể commit domain/repository.

Bước 5: kiểm tra `CourseNotFoundException.java` đang dùng đúng error code. Mục tiêu là reuse class sẵn có, không tạo lỗi trùng chức năng. Chạy test compile backend.

Bước 6: tạo `LecturerNotFoundException.java`. Mục tiêu là báo lỗi khi course trỏ tới lecturer không tồn tại. Chạy service test nếu đã có.

Bước 7: tạo `CourseWithLecturer.java`. Mục tiêu là service có object trung gian để trả course kèm lecturer. Chạy test compile backend.

Bước 8: tạo `CourseResponse.java`, `LecturerResponse.java`, `ScheduleResponse.java` và `CourseMapper.java`. Mục tiêu là API trả DTO đúng contract. Chạy `CourseServiceTest` nếu mapper đã được service dùng.

Bước 9: tạo `CourseService.java`. Mục tiêu là list/detail/search và resolve lecturer đúng. Chạy `CourseServiceTest`. Nếu pass, có thể commit service/mapper.

Bước 10: tạo `CourseController.java`. Mục tiêu là đủ 3 endpoint course. Chạy `CourseControllerTest`. Nếu pass, có thể commit Course API.

Bước 11: cập nhật `apiEndpoints.ts` nếu thiếu endpoint Course. Mục tiêu là frontend không hard-code URL rải rác. Chạy `npm run typecheck`.

Bước 12: hoàn thiện `course.types.ts`, `courseApi.ts` và `courseMappers.ts`. Mục tiêu là map response backend sang model frontend. Chạy `npm run typecheck`.

Bước 13: nối `CourseListPage.tsx` và `CourseDetailModal.tsx`. Mục tiêu là list/search/detail dùng API thật. Chạy `npm run typecheck` và kiểm tra thủ công nếu backend local chạy được.

Bước 14: cập nhật `App.tsx` hoặc `Header.tsx` chỉ khi cần gắn course state/search. Mục tiêu là integration nhỏ, không rewrite shared architecture. Chạy `npm run typecheck`.

Bước 15: chạy backend `clean test`, `clean package`, frontend `typecheck`, `build`. Chỉ commit khi tất cả pass.

Bước 16: kiểm tra `git diff --name-status origin/develop...HEAD`. Mục tiêu là chỉ có file Course/Lecturer/Schedule và integration nhỏ. Nếu có file lạ, dừng lại và hỏi trưởng nhóm.

### 9. Hướng dẫn từng bước chi tiết phần A

Các file READ ONLY trong phần A gồm `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`, `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/api/apiError.ts`, `frontend/src/features/timetable/**` và `data/*.json`. Nếu nghĩ cần sửa các file này, dừng lại và hỏi trưởng nhóm trước.

### Bước 2A.1 — Chuẩn bị branch Course/Lecturer

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có.
**Mục tiêu:** tạo branch `feature/course-lecturer` từ `develop` mới nhất.
**Cần làm:** pull `develop`, tạo branch, kiểm tra status.
**Luồng xử lý:** `develop` sạch -> branch riêng -> bắt đầu phần A.
**Không được làm:** không làm Timetable hoặc Registration trong branch này.
**Test:** kiểm tra branch và status.
**Lệnh kiểm tra:** `git branch --show-current`; `git status --short`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/course-lecturer` sạch.
**Commit:** chưa commit.

### Bước 2A.2 — Rà soát file READ ONLY phần A

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java`, `frontend/src/shared/api/httpClient.ts`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** hiểu contract chung trước khi viết Course.
**Cần làm:** xác nhận repository dùng `JsonFileUtils`, frontend dùng `requestApi`, lỗi course dùng `COURSE_NOT_FOUND`.
**Luồng xử lý:** shared contract -> repository/service/controller -> frontend adapter.
**Không được làm:** không đổi shared utility hoặc error code chung.
**Test:** kiểm tra diff shared rỗng.
**Lệnh kiểm tra:** `git diff -- backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java frontend/src/shared/api/httpClient.ts`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có các file shared không bị sửa.
**Commit:** chưa commit.

### Bước 2A.3 — Hoàn thiện `Lecturer`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java`.
**Mục tiêu:** tạo domain giảng viên kế thừa `User`.
**Cần làm:** giữ field `faculty`, constructor không tham số, constructor đủ dữ liệu, getter/setter.
**Luồng xử lý:** JSON lecturer -> `Lecturer` -> `LecturerRepository` -> `CourseService`.
**Không được làm:** không thêm danh sách course vào model, không đặt rule thời khóa biểu trong Lecturer.
**Test:** compile qua course service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `Lecturer` chỉ chứa dữ liệu giảng viên.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.4 — Hoàn thiện `Schedule`

**File cần mở trước:** không có.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java`.
**Mục tiêu:** biểu diễn một buổi học của học phần.
**Cần làm:** giữ `DayOfWeek dayOfWeek`, `LocalTime startTime`, `LocalTime endTime`, `String room`.
**Luồng xử lý:** Course chứa nhiều Schedule -> mapper chuyển sang `ScheduleResponse`.
**Không được làm:** không đặt rule trùng lịch ở đây.
**Test:** compile qua course service/controller test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `Schedule` đọc được từ JSON.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.5 — Hoàn thiện `Course`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`.
**Mục tiêu:** tạo domain học phần đúng field.
**Cần làm:** giữ `courseId`, `courseName`, `credits`, `lecturerId`, `maxCapacity`, `currentCapacity`, `List<Schedule> schedules`.
**Luồng xử lý:** JSON course -> repository -> service resolve lecturer -> DTO.
**Không được làm:** không tự tăng/giảm capacity trong Course API, không chứa logic đăng ký.
**Test:** compile qua repository/service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonCourseRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `Course` đúng dữ liệu nguồn.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.6 — Khóa `CourseRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java`.
**Mục tiêu:** định nghĩa cổng truy cập học phần.
**Cần làm:** giữ `findById(String courseId)`, `findAll()`, `search(String keyword)`, `save(Course course)`.
**Luồng xử lý:** service -> interface -> JSON repository.
**Không được làm:** không đưa xử lý file vào interface.
**Test:** compile repository.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonCourseRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có contract Course rõ ràng.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.7 — Khóa `LecturerRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/LecturerRepository.java`.
**Mục tiêu:** định nghĩa cổng truy cập giảng viên.
**Cần làm:** giữ `findById(String lecturerId)`, `findAll()`, `save(Lecturer lecturer)`.
**Luồng xử lý:** CourseService resolve lecturer qua repository.
**Không được làm:** không tìm lecturer bằng cách đọc file trong service.
**Test:** compile repository.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonLecturerRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có contract Lecturer rõ ràng.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.8 — Hoàn thiện `JsonCourseRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonCourseRepository.java`.
**Mục tiêu:** đọc/ghi học phần qua JSON utility.
**Cần làm:** cài `findAll`, `findById`, `search`, `save` qua `JsonFileUtils`.
**Luồng xử lý:** repository -> utility -> `data/courses.json`.
**Không được làm:** không hard-code đường dẫn máy cá nhân, không tự parse JSON.
**Test:** repository test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonCourseRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có repository course chạy bằng file JSON cấu hình.
**Commit:** nhóm commit Course/Lecturer persistence.

### Bước 2A.9 — Hoàn thiện `JsonLecturerRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/LecturerRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonLecturerRepository.java`.
**Mục tiêu:** đọc/ghi giảng viên qua JSON utility.
**Cần làm:** cài `findAll`, `findById`, `save` qua `JsonFileUtils`.
**Luồng xử lý:** repository -> utility -> `data/lecturers.json`.
**Không được làm:** không đọc lecturer trong CourseService bằng file trực tiếp.
**Test:** repository test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonLecturerRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có repository lecturer chạy độc lập.
**Commit:** có thể commit Course/Lecturer persistence khi bước 2A.8 và 2A.9 pass.

### Bước 2A.10 — Reuse `CourseNotFoundException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/CourseNotFoundException.java`.
**File cần tạo/sửa:** không có, trừ khi file thiếu và trưởng nhóm đồng ý.
**Mục tiêu:** dùng đúng lỗi `COURSE_NOT_FOUND`.
**Cần làm:** kiểm tra class kế thừa `BusinessException` và error code không đổi.
**Luồng xử lý:** service không thấy course -> exception -> handler.
**Không được làm:** không tạo exception khác cùng chức năng.
**Test:** service/controller not found.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest,CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải reuse đúng lỗi course chung.
**Commit:** chưa commit nếu chỉ đọc.

### Bước 2A.11 — Tạo `LecturerNotFoundException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/LecturerNotFoundException.java`.
**Mục tiêu:** báo lỗi khi `lecturerId` trong course không resolve được.
**Cần làm:** kế thừa `BusinessException`, dùng error code `LECTURER_NOT_FOUND`.
**Luồng xử lý:** CourseService resolve lecturer -> không thấy -> exception.
**Không được làm:** không bỏ qua lecturer thiếu bằng chuỗi rỗng.
**Test:** service test lecturer missing.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi lecturer rõ ràng.
**Commit:** nhóm commit Course API hoặc service.

### Bước 2A.12 — Tạo `CourseWithLecturer`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/CourseWithLecturer.java`.
**Mục tiêu:** có object trung gian cho course kèm lecturer.
**Cần làm:** giữ course và lecturer cùng nhau để mapper tạo DTO.
**Luồng xử lý:** CourseService -> `CourseWithLecturer` -> CourseMapper.
**Không được làm:** không nhét lecturer object trực tiếp vào `Course`.
**Test:** service test kiểm tra lecturer được resolve.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có composition không làm bẩn domain Course.
**Commit:** nhóm commit Course API hoặc service.

### Bước 2A.13 — Tạo `LecturerResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/LecturerResponse.java`.
**Mục tiêu:** response giảng viên có field ổn định.
**Cần làm:** khai báo `lecturerId`, `fullName`, `faculty`.
**Luồng xử lý:** Lecturer -> mapper -> `LecturerResponse`.
**Không được làm:** không trả toàn bộ `User` hoặc field không có nguồn.
**Test:** controller test kiểm tra JSON lecturer.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO lecturer đúng contract.
**Commit:** nhóm commit Course API.

### Bước 2A.14 — Tạo `ScheduleResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ScheduleResponse.java`.
**Mục tiêu:** response lịch học có ngày, giờ và phòng.
**Cần làm:** khai báo `dayOfWeek`, `startTime`, `endTime`, `room`.
**Luồng xử lý:** Schedule -> mapper -> `ScheduleResponse`.
**Không được làm:** không đổi enum ngày sang text tùy ý ở backend.
**Test:** controller test kiểm tra schedule.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO schedule đọc được bởi frontend.
**Commit:** nhóm commit Course API.

### Bước 2A.15 — Tạo `CourseResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/LecturerResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ScheduleResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/CourseResponse.java`.
**Mục tiêu:** response course đủ dữ liệu cho list/detail.
**Cần làm:** khai báo `courseId`, `courseName`, `credits`, `lecturerId`, `lecturer`, `maxCapacity`, `currentCapacity`, `schedules`.
**Luồng xử lý:** CourseWithLecturer -> mapper -> `CourseResponse`.
**Không được làm:** không bỏ `lecturerId`, không tự tính capacity ở DTO.
**Test:** controller test list/detail.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO course đúng contract.
**Commit:** nhóm commit Course API.

### Bước 2A.16 — Tạo `CourseMapper`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/CourseWithLecturer.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/CourseResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/CourseMapper.java`.
**Mục tiêu:** tập trung map course, lecturer, schedule.
**Cần làm:** map đầy đủ field từ domain/composition sang DTO.
**Luồng xử lý:** service trả `CourseWithLecturer` -> mapper -> controller response.
**Không được làm:** không gọi repository trong mapper, không xử lý đăng ký.
**Test:** service/controller test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest,CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper thuần chuyển dữ liệu.
**Commit:** nhóm commit Course API.

### Bước 2A.17 — Cài `CourseService.findAll`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/LecturerRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`.
**Mục tiêu:** lấy tất cả course kèm lecturer.
**Cần làm:** inject hai repository, resolve lecturer cho từng course.
**Luồng xử lý:** CourseRepository `findAll` -> LecturerRepository `findById` -> `CourseWithLecturer`.
**Không được làm:** không trả course thiếu lecturer mà không báo lỗi.
**Test:** list course.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có list course kèm lecturer đúng.
**Commit:** nhóm commit Course API.

### Bước 2A.18 — Cài `CourseService.findById`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`.
**Mục tiêu:** lấy chi tiết course theo mã.
**Cần làm:** gọi `CourseRepository.findById(String courseId)`, ném `CourseNotFoundException` nếu không có.
**Luồng xử lý:** courseId -> repository -> resolve lecturer -> composition.
**Không được làm:** không trả `null`, không dùng dữ liệu mock trong service.
**Test:** detail success và not found.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có detail course đúng lỗi và dữ liệu.
**Commit:** nhóm commit Course API.

### Bước 2A.19 — Cài `CourseService.search`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`.
**Mục tiêu:** tìm kiếm theo keyword qua repository.
**Cần làm:** gọi `CourseRepository.search(String keyword)` và resolve lecturer cho kết quả.
**Luồng xử lý:** keyword -> repository search -> resolve lecturer -> list composition.
**Không được làm:** không hard-code điều kiện search trong controller.
**Test:** search theo mã/tên.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có search trả list course kèm lecturer.
**Commit:** nhóm commit Course API.

### Bước 2A.20 — Tạo `CourseController`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/CourseMapper.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/CourseController.java`.
**Mục tiêu:** mở 3 endpoint course.
**Cần làm:** khai báo `@RequestMapping("/api/courses")`, `GET /api/courses`, `GET /api/courses/{courseId}`, `GET /api/courses/search?keyword=...`.
**Luồng xử lý:** HTTP -> controller -> service -> mapper -> `ApiResponse`.
**Không được làm:** không đọc file, không trả domain trực tiếp.
**Test:** controller list/detail/search.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API Course đúng contract.
**Commit:** có thể commit `feat(course): expose course lecturer api`.

### Bước 2A.21 — Chạy cụm test backend Course

**File cần mở trước:** các test Course/Lecturer.
**File cần tạo/sửa:** chỉ sửa file phần A nếu test báo lỗi thật.
**Mục tiêu:** khóa backend Course trước khi nối frontend.
**Cần làm:** chạy repository, service, controller test.
**Luồng xử lý:** repository -> service -> controller.
**Không được làm:** không sửa Registration hoặc Timetable.
**Test:** backend Course.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonCourseRepositoryTest,JsonLecturerRepositoryTest,CourseServiceTest,CourseControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có test backend Course pass.
**Commit:** commit service/API nếu chưa commit.

### Bước 2A.22 — Kiểm tra endpoint constants Course

**File cần mở trước:** `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** `frontend/src/shared/constants/apiEndpoints.ts` nếu thiếu endpoint Course.
**Mục tiêu:** frontend dùng constant cho course.
**Cần làm:** đảm bảo `COURSES`, `COURSE_BY_ID(courseId)`, `COURSE_SEARCH(keyword)` tồn tại.
**Luồng xử lý:** Course API adapter -> endpoint constant -> shared client.
**Không được làm:** không hard-code `/api/courses` trong page.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có endpoint Course đủ dùng.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.23 — Hoàn thiện `course.types.ts`

**File cần mở trước:** `frontend/src/features/courses/types/course.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/courses/types/course.types.ts`.
**Mục tiêu:** type frontend khớp `CourseResponse`.
**Cần làm:** giữ `CourseResponse`, `LecturerResponse`, `CourseScheduleResponse`, `BackendDayOfWeek`, `Course`, `ClassSchedule`.
**Luồng xử lý:** backend response -> mapper -> model UI.
**Không được làm:** không bỏ field capacity hoặc schedules.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có type Course không lệch backend.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.24 — Hoàn thiện `courseMappers`

**File cần mở trước:** `frontend/src/features/courses/types/course.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/courses/utils/courseMappers.ts`.
**Mục tiêu:** map response backend sang model hiển thị.
**Cần làm:** dùng `mapCourseResponse` và `mapScheduleResponse`, map `courseId` sang `id/code`, `currentCapacity` sang `enrolled`.
**Luồng xử lý:** `CourseResponse` -> `Course` -> page/modal.
**Không được làm:** không tự tạo course mock trong mapper.
**Test:** typecheck và kiểm tra UI.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper Course dùng được cho list/detail.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.25 — Hoàn thiện `courseApi`

**File cần mở trước:** `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/constants/apiEndpoints.ts`, `frontend/src/features/courses/utils/courseMappers.ts`.
**File cần tạo/sửa:** `frontend/src/features/courses/api/courseApi.ts`.
**Mục tiêu:** gọi list/detail/search qua shared client.
**Cần làm:** cài `getCourses()`, `getCourseById(courseId)`, `searchCourses(keyword)`.
**Luồng xử lý:** page -> courseApi -> requestApi -> mapper -> UI.
**Không được làm:** không gọi `fetch` trực tiếp, không đọc mock data.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API adapter Course đầy đủ.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.26 — Nối `CourseListPage`

**File cần mở trước:** `frontend/src/features/courses/pages/CourseListPage.tsx`, `frontend/src/features/courses/api/courseApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/courses/pages/CourseListPage.tsx`.
**Mục tiêu:** danh sách course dùng API thật.
**Cần làm:** load list, search, loading/error/empty state theo cấu trúc hiện có.
**Luồng xử lý:** mở tab course -> fetch list -> search keyword -> render cards/table.
**Không được làm:** không viết lại giao diện lớn, không hard-code course.
**Test:** typecheck và kiểm tra thủ công.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có Course List lấy dữ liệu từ API adapter.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.27 — Nối `CourseDetailModal`

**File cần mở trước:** `frontend/src/features/courses/components/CourseDetailModal.tsx`, `frontend/src/features/courses/api/courseApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/courses/components/CourseDetailModal.tsx`.
**Mục tiêu:** modal chi tiết hiển thị course, lecturer, schedule, capacity.
**Cần làm:** dùng dữ liệu từ list hoặc gọi detail theo `courseId` nếu cấu trúc hiện có cần.
**Luồng xử lý:** chọn course -> mở modal -> render chi tiết.
**Không được làm:** không tự quyết định đăng ký trong modal phần A.
**Test:** typecheck và kiểm tra modal.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có detail modal đúng dữ liệu API.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.28 — Nối integration nhỏ trong `App`

**File cần mở trước:** `frontend/src/app/App.tsx`, `frontend/src/features/courses/pages/CourseListPage.tsx`.
**File cần tạo/sửa:** `frontend/src/app/App.tsx` nếu cần.
**Mục tiêu:** Course tab nhận state/search phù hợp.
**Cần làm:** chỉ truyền props/callback cần thiết theo kiến trúc hiện có.
**Luồng xử lý:** App active tab -> CourseListPage -> courseApi.
**Không được làm:** không rewrite routing, không sửa Registration/Timetable.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có tab Course hoạt động với thay đổi nhỏ nhất.
**Commit:** nhóm commit Frontend Course.

### Bước 2A.29 — Kiểm tra không còn mock course làm nguồn chính

**File cần mở trước:** `frontend/src/features/courses/**`, `frontend/src/mocks/**`.
**File cần tạo/sửa:** chỉ sửa Course page/api nếu vẫn lấy mock làm nguồn chính.
**Mục tiêu:** Course dùng API thật.
**Cần làm:** tìm import mock trong Course feature, loại bỏ nguồn chính nếu còn.
**Luồng xử lý:** UI -> courseApi -> backend, mock chỉ còn fallback được thống nhất nếu có.
**Không được làm:** không xóa mock chung nếu module khác còn dùng.
**Test:** typecheck.
**Lệnh kiểm tra:** `rg -n "mock|mockData|courses" frontend/src/features/courses`; từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải biết Course feature không phụ thuộc mock làm nguồn chính.
**Commit:** nhóm commit Frontend Course hoặc Tests/fixes.

### Bước 2A.30 — Chạy frontend build phần Course

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa Course frontend nếu build lỗi do phần này.
**Mục tiêu:** xác nhận production build ổn.
**Cần làm:** chạy typecheck rồi build.
**Luồng xử lý:** typecheck pass -> Vite build.
**Không được làm:** không tắt lỗi type bằng cấu hình.
**Test:** frontend build.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có frontend pass cho Course.
**Commit:** có thể commit `feat(frontend): connect course list and detail`.

### Bước 2A.31 — Kiểm tra thủ công Course API

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/CourseController.java`.
**File cần tạo/sửa:** chỉ sửa Course nếu API trả sai contract.
**Mục tiêu:** xác nhận endpoint list/detail/search trả envelope đúng.
**Cần làm:** chạy backend local và gọi các endpoint bằng browser hoặc công cụ HTTP.
**Luồng xử lý:** request -> controller -> service -> mapper -> response.
**Không được làm:** không sửa data seed tùy tiện.
**Test:** manual API.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd spring-boot:run`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải thấy `success`, `message`, `data` đúng.
**Commit:** chưa commit riêng nếu không sửa.

### Bước 2A.32 — Kiểm tra thủ công Course UI

**File cần mở trước:** `frontend/src/features/courses/pages/CourseListPage.tsx`.
**File cần tạo/sửa:** chỉ sửa Course frontend nếu UI sai.
**Mục tiêu:** xác nhận list/search/detail hoạt động trong browser.
**Cần làm:** chạy frontend, mở tab Course, thử search và detail.
**Luồng xử lý:** browser -> Course tab -> backend Course API.
**Không được làm:** không chỉnh rộng sang tab khác.
**Test:** manual UI.
**Lệnh kiểm tra:** từ `frontend`: `npm run dev`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có list/search/detail hiển thị đúng.
**Commit:** Tests/fixes nếu có sửa nhỏ.

### Bước 2A.33 — Rà diff phần A

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có nếu diff đúng.
**Mục tiêu:** đảm bảo chỉ sửa Course/Lecturer/Schedule và integration nhỏ.
**Cần làm:** kiểm tra diff backend/frontend.
**Luồng xử lý:** git diff -> so bảng ownership -> xử lý file lạ.
**Không được làm:** không giữ thay đổi Timetable/Registration trong phần A.
**Test:** kiểm tra diff.
**Lệnh kiểm tra:** `git diff --name-status origin/develop...HEAD`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có diff đúng phạm vi phần A.
**Commit:** chưa commit nếu chỉ rà.

### Bước 2A.34 — Chạy kiểm tra cuối phần A

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa lỗi trong phạm vi phần A.
**Mục tiêu:** đủ điều kiện tạo Pull Request phần A.
**Cần làm:** chạy đủ backend và frontend.
**Luồng xử lý:** backend test -> backend package -> frontend typecheck -> frontend build.
**Không được làm:** không bỏ qua lệnh nào.
**Test:** full verification.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd clean test`; từ `backend`: `.\mvnw.cmd clean package`; từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có bốn lệnh đều pass.
**Commit:** `test(course): cover course lecturer flows` nếu có thêm/sửa test.

### Bước 2A.35 — Gom commit và chuẩn bị Pull Request phần A

**File cần mở trước:** `git diff --name-status`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** lịch sử phần A dễ review.
**Cần làm:** gom commit theo persistence, API, frontend, tests.
**Luồng xử lý:** stage đúng nhóm -> commit -> kiểm tra status -> push feature branch khi được phép.
**Không được làm:** không push `develop` hoặc `main`, không push file ngoài phạm vi.
**Test:** kiểm tra status/log.
**Lệnh kiểm tra:** `git status --short`; `git log --oneline -5`; `git branch --show-current`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/course-lecturer` sẵn sàng Pull Request.
**Commit:** dùng commit plan phần A.

### 10. Test bắt buộc phần A

Backend:

- `JsonCourseRepositoryTest`
- `JsonLecturerRepositoryTest`
- `CourseServiceTest`
- `CourseControllerTest`

Scenario tối thiểu:

- list course trả dữ liệu;
- detail course tồn tại;
- detail course không tồn tại;
- search theo mã/tên;
- lecturer được map đúng;
- lecturer thiếu trả lỗi đúng.

Frontend:

- course list load được từ API;
- search gọi API đúng;
- course detail hiển thị lecturer/schedule/capacity;
- empty/error/loading state ổn.

### 11. Commit plan phần A

```text
feat(course): implement course lecturer persistence
feat(course): expose course lecturer api
feat(frontend): connect course list and detail
test(course): cover course lecturer flows
```

### 12. Push và Pull Request phần A

```powershell
git push -u origin feature/course-lecturer
```

Pull Request:

- Base: `develop`
- Compare: `feature/course-lecturer`
- Title: `[Course] Hoàn thiện học phần, giảng viên và lịch học`

Sau khi tạo Pull Request phần A, dừng lại và chờ trưởng nhóm review. Không làm Timetable trên branch này.

## Phần B - Timetable

### 13. Khi nào bắt đầu

Chỉ bắt đầu phần B sau khi trưởng nhóm thông báo Registration/Validators đã được merge vào `develop`.

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/timetable
git branch --show-current
```

Kết quả cần là:

```text
feature/timetable
```

### 14. Phạm vi phần B

Bạn phụ trách:

- `TimetableEntry`
- `TimetableService`
- `TimetableController`
- `TimetableSlotResponse`
- `TimetableMapper`
- frontend timetable
- timetable tests

Timetable phụ thuộc Registration và Course. Không tạo file JSON riêng cho Timetable.

### 15. File ownership phần B

| File/Folder | Trách nhiệm | Được sửa |
|---|---|---|
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java` | Composition cho một dòng thời khóa biểu | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java` | Suy ra thời khóa biểu | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/TimetableController.java` | REST API thời khóa biểu | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/TimetableSlotResponse.java` | DTO thời khóa biểu | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/TimetableMapper.java` | Map timetable entry sang DTO | OWNED |
| `frontend/src/features/timetable/**` | Timetable API/types/page | OWNED |
| `frontend/src/app/App.tsx` | Gắn timetable view nếu cần | INTEGRATION ONLY |
| `frontend/src/shared/constants/apiEndpoints.ts` | Thêm endpoint Timetable nếu thiếu | INTEGRATION ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java` | Nguồn registration active | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java` | Repository đăng ký | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Đọc/ghi JSON chung | READ ONLY |
| `frontend/src/shared/api/httpClient.ts` | HTTP envelope chung | READ ONLY |

### 16. Timetable backend

API:

```text
GET /api/students/{studentId}/timetable
```

Response item:

```text
courseId
courseName
credits
lecturerName
dayOfWeek
startTime
endTime
room
```

Luồng gợi ý:

```text
kiểm tra student tồn tại
-> lấy registration active của sinh viên
-> resolve course và lecturer
-> bung mỗi schedule thành một dòng timetable
-> sort theo ngày và giờ bắt đầu nếu cần
```

### 17. Frontend Timetable

Các file chính:

- `frontend/src/features/timetable/api/timetableApi.ts`
- `frontend/src/features/timetable/types/timetable.types.ts`
- `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`

Frontend dùng API timetable. Không tự đọc `data/registrations.json`, `data/courses.json` hoặc `data/lecturers.json`.

### 18. Trình tự thực hiện phần B

Bước 1: cập nhật `develop` sau khi Registration đã merge và tạo branch `feature/timetable`. Mục tiêu là Timetable nhìn thấy contract Registration mới nhất. Chạy `git branch --show-current`; chưa commit.

Bước 2: tạo `TimetableEntry.java`. Mục tiêu là biểu diễn một dòng thời khóa biểu đã resolve course, lecturer và schedule. Chạy backend compile.

Bước 3: tạo `TimetableSlotResponse.java` và `TimetableMapper.java`. Mục tiêu là response không trả model trực tiếp. Chạy test compile backend.

Bước 4: tạo `TimetableService.java`. Mục tiêu là lấy registration active, resolve course/lecturer và tạo slot. Chạy `TimetableServiceTest`. Nếu pass, có thể commit service/mapper.

Bước 5: tạo `TimetableController.java`. Mục tiêu là có `GET /api/students/{studentId}/timetable`. Chạy `TimetableControllerTest`. Nếu pass, có thể commit API.

Bước 6: cập nhật `apiEndpoints.ts` nếu thiếu endpoint Timetable. Mục tiêu là frontend dùng constant chung. Chạy `npm run typecheck`.

Bước 7: hoàn thiện `timetable.types.ts` và `timetableApi.ts`. Mục tiêu là gọi API và map response đúng. Chạy `npm run typecheck`.

Bước 8: nối `TimetableWeeklyPage.tsx`. Mục tiêu là loading/error/empty và lịch tuần hiển thị từ API. Chạy `npm run typecheck` và kiểm tra thủ công nếu có backend local.

Bước 9: chạy backend `clean test`, `clean package`, frontend `typecheck`, `build`. Chỉ commit khi tất cả pass.

Bước 10: kiểm tra `git diff --name-status origin/develop...HEAD`. Mục tiêu là chỉ có file Timetable và integration nhỏ. Nếu có file lạ, dừng lại và hỏi trưởng nhóm.

### 19. Hướng dẫn từng bước chi tiết phần B

Các file READ ONLY trong phần B gồm `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `frontend/src/shared/api/httpClient.ts` và mọi file Course/Registration không thuộc integration đã thống nhất. Nếu nghĩ cần sửa các file này, dừng lại và hỏi trưởng nhóm trước.

### Bước 2B.1 — Chuẩn bị branch Timetable

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có.
**Mục tiêu:** tạo branch `feature/timetable` sau khi Registration đã có trên `develop`.
**Cần làm:** pull `develop`, tạo branch, kiểm tra status.
**Luồng xử lý:** nền đã có Registration -> branch Timetable -> bắt đầu.
**Không được làm:** không dùng lại branch Course/Lecturer.
**Test:** kiểm tra branch.
**Lệnh kiểm tra:** `git branch --show-current`; `git status --short`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/timetable` sạch.
**Commit:** chưa commit.

### Bước 2B.2 — Rà contract Registration/Course trước khi viết Timetable

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java` nếu đã có.
**File cần tạo/sửa:** không có.
**Mục tiêu:** xác định Timetable chỉ suy ra từ đăng ký active, không có persistence riêng.
**Cần làm:** đọc method lấy registration active và course/lecturer đã resolve.
**Luồng xử lý:** studentId -> registration active -> course/lecturer/schedule -> timetable slot.
**Không được làm:** không tạo `timetables.json`, không đọc `data/*.json` trực tiếp.
**Test:** diff shared rỗng.
**Lệnh kiểm tra:** `git diff -- backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java data/`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải biết nguồn dữ liệu timetable.
**Commit:** chưa commit.

### Bước 2B.3 — Tạo `TimetableEntry`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java`.
**Mục tiêu:** biểu diễn một dòng lịch đã resolve.
**Cần làm:** giữ record hoặc class chứa `Course`, `Lecturer`, `Schedule`.
**Luồng xử lý:** service bung mỗi schedule thành một `TimetableEntry`.
**Không được làm:** không thêm field persistence riêng.
**Test:** service test compile.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có model trung gian cho từng slot lịch.
**Commit:** nhóm commit Timetable backend.

### Bước 2B.4 — Tạo `TimetableSlotResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/TimetableSlotResponse.java`.
**Mục tiêu:** response timetable không trả domain trực tiếp.
**Cần làm:** khai báo `courseId`, `courseName`, `credits`, `lecturerName`, `dayOfWeek`, `startTime`, `endTime`, `room`.
**Luồng xử lý:** TimetableEntry -> mapper -> DTO.
**Không được làm:** không bỏ `lecturerName` hoặc `room`.
**Test:** controller test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO timetable đúng contract.
**Commit:** nhóm commit Timetable backend.

### Bước 2B.5 — Tạo `TimetableMapper`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/TimetableSlotResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/TimetableMapper.java`.
**Mục tiêu:** chuyển mỗi entry thành response slot.
**Cần làm:** map course, lecturer, schedule sang DTO.
**Luồng xử lý:** service trả entry -> mapper -> controller response.
**Không được làm:** không gọi repository trong mapper.
**Test:** controller/service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableServiceTest,TimetableControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper thuần dữ liệu.
**Commit:** nhóm commit Timetable backend.

### Bước 2B.6 — Cài `TimetableService.findRegisteredCourses`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java`.
**Mục tiêu:** lấy course đã đăng ký active của sinh viên.
**Cần làm:** dùng dữ liệu registration active, resolve `Course` qua repository/service hiện có.
**Luồng xử lý:** studentId -> registration active -> courseId -> Course.
**Không được làm:** không tự đọc registrations JSON.
**Test:** timetable empty và có dữ liệu.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có danh sách course active đúng.
**Commit:** nhóm commit Timetable backend.

### Bước 2B.7 — Cài `TimetableService.findTimetableEntries`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java`.
**Mục tiêu:** bung course schedule thành slot lịch.
**Cần làm:** resolve lecturer, duyệt `schedules`, tạo entry cho từng buổi, sort theo ngày và giờ nếu có.
**Luồng xử lý:** registered courses -> schedules -> timetable entries.
**Không được làm:** không tạo business rule đăng ký mới.
**Test:** course nhiều schedule tạo nhiều slot.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có list entry đúng lịch active.
**Commit:** nhóm commit Timetable backend.

### Bước 2B.8 — Tạo `TimetableController`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/TimetableMapper.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/TimetableController.java`.
**Mục tiêu:** mở `GET /api/students/{studentId}/timetable`.
**Cần làm:** dùng `@RequestMapping("/api/students/{studentId}/timetable")`, trả list `TimetableSlotResponse`.
**Luồng xử lý:** HTTP -> controller -> service -> mapper -> `ApiResponse`.
**Không được làm:** không đọc repository trong controller.
**Test:** controller success và empty.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API timetable đúng envelope.
**Commit:** có thể commit Timetable backend.

### Bước 2B.9 — Chạy test backend Timetable

**File cần mở trước:** các test Timetable.
**File cần tạo/sửa:** chỉ sửa Timetable nếu test báo lỗi thật.
**Mục tiêu:** khóa backend Timetable trước frontend.
**Cần làm:** chạy service và controller test.
**Luồng xử lý:** service test -> controller test.
**Không được làm:** không sửa Registration để test timetable pass nếu lỗi nằm ở Timetable.
**Test:** backend Timetable.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=TimetableServiceTest,TimetableControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có test Timetable pass.
**Commit:** `feat(timetable): expose student timetable api` nếu chưa commit.

### Bước 2B.10 — Thêm endpoint Timetable frontend

**File cần mở trước:** `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** `frontend/src/shared/constants/apiEndpoints.ts` nếu thiếu `TIMETABLE(studentId)`.
**Mục tiêu:** frontend dùng endpoint chung.
**Cần làm:** endpoint trỏ `/students/{studentId}/timetable`.
**Luồng xử lý:** timetableApi -> endpoint constant -> requestApi.
**Không được làm:** không hard-code URL trong page.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có constant Timetable.
**Commit:** nhóm commit Frontend Timetable.

### Bước 2B.11 — Hoàn thiện `timetable.types.ts`

**File cần mở trước:** `frontend/src/features/timetable/types/timetable.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/timetable/types/timetable.types.ts`.
**Mục tiêu:** type frontend khớp response backend.
**Cần làm:** giữ `TimetableEntryResponse` với course, lecturer, day/time/room.
**Luồng xử lý:** backend response -> type -> mapper/page.
**Không được làm:** không dùng type Registration thay cho Timetable slot.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có type slot lịch đúng contract.
**Commit:** nhóm commit Frontend Timetable.

### Bước 2B.12 — Hoàn thiện `timetableApi`

**File cần mở trước:** `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/constants/apiEndpoints.ts`, `frontend/src/features/timetable/types/timetable.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/timetable/api/timetableApi.ts`.
**Mục tiêu:** gọi API timetable qua shared client.
**Cần làm:** cài `getTimetable(studentId)` và mapper nội bộ nếu page cần `Course[]`.
**Luồng xử lý:** page -> timetableApi -> requestApi -> response.
**Không được làm:** không đọc `data/registrations.json`, `data/courses.json`, `data/lecturers.json`.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API adapter Timetable.
**Commit:** nhóm commit Frontend Timetable.

### Bước 2B.13 — Nối `TimetableWeeklyPage`

**File cần mở trước:** `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`, `frontend/src/features/timetable/api/timetableApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`.
**Mục tiêu:** trang thời khóa biểu hiển thị dữ liệu API.
**Cần làm:** thêm loading, error, empty state và render slot theo cấu trúc hiện có.
**Luồng xử lý:** mở tab timetable -> fetch API -> render tuần.
**Không được làm:** không tự đọc mock data làm nguồn chính.
**Test:** typecheck và kiểm tra thủ công.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có timetable page dùng API thật.
**Commit:** nhóm commit Frontend Timetable.

### Bước 2B.14 — Nối integration nhỏ trong `App`

**File cần mở trước:** `frontend/src/app/App.tsx`, `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`.
**File cần tạo/sửa:** `frontend/src/app/App.tsx` nếu cần truyền `studentId`.
**Mục tiêu:** Timetable biết sinh viên hiện tại.
**Cần làm:** truyền `currentStudent.id` hoặc props cần thiết theo kiến trúc hiện có.
**Luồng xử lý:** App current student -> Timetable page -> API.
**Không được làm:** không rewrite login/profile hoặc registration.
**Test:** typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có Timetable gọi đúng studentId.
**Commit:** nhóm commit Frontend Timetable.

### Bước 2B.15 — Kiểm tra thủ công Timetable API

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/TimetableController.java`.
**File cần tạo/sửa:** chỉ sửa Timetable nếu response sai.
**Mục tiêu:** xác nhận API trả slot đúng cho sinh viên.
**Cần làm:** chạy backend local, gọi endpoint với sinh viên có và chưa có đăng ký.
**Luồng xử lý:** request -> service -> response slot.
**Không được làm:** không chỉnh data seed tùy tiện.
**Test:** manual API.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd spring-boot:run`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải thấy empty state và slot có dữ liệu đúng.
**Commit:** chưa commit riêng nếu không sửa.

### Bước 2B.16 — Kiểm tra thủ công Timetable UI

**File cần mở trước:** `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`.
**File cần tạo/sửa:** chỉ sửa Timetable frontend nếu UI sai.
**Mục tiêu:** xác nhận lịch tuần render ổn trong browser.
**Cần làm:** chạy frontend, login, mở tab Timetable.
**Luồng xử lý:** browser -> App -> Timetable page -> backend.
**Không được làm:** không sửa Course/Registration để né lỗi UI.
**Test:** manual UI.
**Lệnh kiểm tra:** từ `frontend`: `npm run dev`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lịch tuần hiển thị slot đúng ngày/giờ.
**Commit:** Tests/fixes nếu có sửa nhỏ.

### Bước 2B.17 — Chạy frontend Timetable

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa Timetable frontend nếu lỗi do phần này.
**Mục tiêu:** đảm bảo typecheck/build pass.
**Cần làm:** chạy typecheck rồi build.
**Luồng xử lý:** typecheck -> build.
**Không được làm:** không tắt lỗi type bằng cấu hình.
**Test:** frontend typecheck/build.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có frontend pass cho Timetable.
**Commit:** `feat(frontend): connect timetable view` nếu chưa commit.

### Bước 2B.18 — Rà diff phần B

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có nếu diff đúng.
**Mục tiêu:** đảm bảo chỉ có Timetable và integration nhỏ.
**Cần làm:** xem file thay đổi so với `origin/develop`.
**Luồng xử lý:** git diff -> so bảng ownership -> hỏi trưởng nhóm nếu file lạ.
**Không được làm:** không giữ thay đổi Course/Registration ngoài phạm vi.
**Test:** kiểm tra diff.
**Lệnh kiểm tra:** `git diff --name-status origin/develop...HEAD`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có diff đúng phạm vi phần B.
**Commit:** chưa commit nếu chỉ rà.

### Bước 2B.19 — Chạy kiểm tra cuối phần B

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa lỗi trong phạm vi Timetable.
**Mục tiêu:** đủ điều kiện tạo Pull Request phần B.
**Cần làm:** chạy đủ backend và frontend.
**Luồng xử lý:** backend test -> backend package -> frontend typecheck -> frontend build.
**Không được làm:** không bỏ qua lệnh nào.
**Test:** full verification.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd clean test`; từ `backend`: `.\mvnw.cmd clean package`; từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có bốn lệnh đều pass.
**Commit:** `test(timetable): cover timetable flow` nếu có thêm/sửa test.

### Bước 2B.20 — Gom commit và chuẩn bị Pull Request phần B

**File cần mở trước:** `git diff --name-status`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** branch Timetable dễ review.
**Cần làm:** gom commit backend, frontend, tests; kiểm tra status/log.
**Luồng xử lý:** stage đúng nhóm -> commit -> kiểm tra -> push feature branch khi được phép.
**Không được làm:** không push `develop` hoặc `main`, không push file ngoài phạm vi.
**Test:** kiểm tra status/log.
**Lệnh kiểm tra:** `git status --short`; `git log --oneline -5`; `git branch --show-current`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/timetable` sẵn sàng Pull Request.
**Commit:** dùng commit plan phần B.

### 20. Test bắt buộc phần B

- `TimetableServiceTest`
- `TimetableControllerTest`

Scenario tối thiểu:

- timetable empty khi sinh viên chưa đăng ký;
- timetable có dữ liệu từ registration active;
- course nhiều schedule tạo nhiều slot;
- registration đã hủy không xuất hiện;
- slot có lecturer name, room, ngày và giờ đúng.

### 21. Commit plan phần B

```text
feat(timetable): expose student timetable api
feat(frontend): connect timetable view
test(timetable): cover timetable flow
```

### 22. Push và Pull Request phần B

```powershell
git push -u origin feature/timetable
```

Pull Request:

- Base: `develop`
- Compare: `feature/timetable`
- Title: `[Timetable] Hoàn thiện thời khóa biểu sinh viên`

## Điều kiện để được tạo Pull Request

### Phần A

- [ ] Đúng branch `feature/course-lecturer`
- [ ] File đúng phạm vi Course/Lecturer/Schedule
- [ ] Course API đúng contract
- [ ] Lecturer mapping đúng
- [ ] Frontend không dùng mock course
- [ ] Không gọi `fetch` trực tiếp trong page
- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Commit author đúng
- [ ] Git status sạch
- [ ] Không push `develop` hoặc `main`

### Phần B

- [ ] Đúng branch `feature/timetable`
- [ ] Registration đã merge vào `develop` trước khi bắt đầu
- [ ] Timetable không có persistence riêng
- [ ] Timetable API đúng contract
- [ ] Frontend Timetable dùng API thật
- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Commit author đúng
- [ ] Git status sạch
- [ ] Không push `develop` hoặc `main`

Hoàn thành từng phần rồi tạo Pull Request riêng và chờ trưởng nhóm review.
