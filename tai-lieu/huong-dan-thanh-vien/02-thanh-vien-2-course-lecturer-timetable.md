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

### 9. Test bắt buộc phần A

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

### 10. Commit plan phần A

```text
feat(course): implement course lecturer persistence
feat(course): expose course lecturer api
feat(frontend): connect course list and detail
test(course): cover course lecturer flows
```

### 11. Push và Pull Request phần A

```powershell
git push -u origin feature/course-lecturer
```

Pull Request:

- Base: `develop`
- Compare: `feature/course-lecturer`
- Title: `[Course] Hoàn thiện học phần, giảng viên và lịch học`

Sau khi tạo Pull Request phần A, dừng lại và chờ trưởng nhóm review. Không làm Timetable trên branch này.

## Phần B - Timetable

### 12. Khi nào bắt đầu

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

### 13. Phạm vi phần B

Bạn phụ trách:

- `TimetableEntry`
- `TimetableService`
- `TimetableController`
- `TimetableSlotResponse`
- `TimetableMapper`
- frontend timetable
- timetable tests

Timetable phụ thuộc Registration và Course. Không tạo file JSON riêng cho Timetable.

### 14. File ownership phần B

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

### 15. Timetable backend

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

### 16. Frontend Timetable

Các file chính:

- `frontend/src/features/timetable/api/timetableApi.ts`
- `frontend/src/features/timetable/types/timetable.types.ts`
- `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`

Frontend dùng API timetable. Không tự đọc `data/registrations.json`, `data/courses.json` hoặc `data/lecturers.json`.

### 17. Trình tự thực hiện phần B

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

### 18. Test bắt buộc phần B

- `TimetableServiceTest`
- `TimetableControllerTest`

Scenario tối thiểu:

- timetable empty khi sinh viên chưa đăng ký;
- timetable có dữ liệu từ registration active;
- course nhiều schedule tạo nhiều slot;
- registration đã hủy không xuất hiện;
- slot có lecturer name, room, ngày và giờ đúng.

### 19. Commit plan phần B

```text
feat(timetable): expose student timetable api
feat(frontend): connect timetable view
test(timetable): cover timetable flow
```

### 20. Push và Pull Request phần B

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
