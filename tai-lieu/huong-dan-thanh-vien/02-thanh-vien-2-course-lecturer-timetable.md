# Thành viên 2 - Course, Lecturer và Timetable

Đọc trước:

- [Hướng dẫn chung](00-doc-truoc-khi-bat-dau.md)
- [Quy trình Pull Request](04-quy-trinh-pull-request.md)

Chỉ bắt đầu sau khi phần Student/Auth/Profile đã được merge vào `develop`.

## 1. Branch làm việc

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/course-lecturer-timetable
git branch --show-current
```

Kết quả cần là:

```text
feature/course-lecturer-timetable
```

## 2. Phạm vi

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
- `TimetableEntry`
- `TimetableService`
- `TimetableController`
- `TimetableSlotResponse`
- frontend courses
- frontend timetable

Không sửa Student/Auth/Profile và không triển khai Registration.

## 3. File ownership

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
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java` | Suy ra thời khóa biểu | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/TimetableController.java` | REST API thời khóa biểu | OWNED |
| `frontend/src/features/courses/**` | Course API, mapper, page, modal | OWNED |
| `frontend/src/features/timetable/**` | Timetable API/types/page | OWNED |
| `frontend/src/app/App.tsx` | Gắn course/timetable state vào UI | INTEGRATION ONLY |
| `frontend/src/shared/constants/apiEndpoints.ts` | Thêm endpoint Course/Timetable nếu thiếu | INTEGRATION ONLY |
| `frontend/src/shared/api/httpClient.ts` | HTTP envelope chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Đọc/ghi JSON chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java` | Nghiệp vụ đăng ký | READ ONLY |

## 4. Domain Course/Lecturer/Schedule

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
- Không thêm persistence riêng cho thời khóa biểu.

## 5. Repository

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

## 6. Course service

Chức năng:

- Lấy tất cả học phần, kèm thông tin giảng viên.
- Lấy chi tiết học phần theo `courseId`.
- Tìm kiếm học phần theo keyword.

Lỗi:

- Không tìm thấy học phần: `COURSE_NOT_FOUND`.
- Học phần có `lecturerId` không khớp dữ liệu giảng viên: `LECTURER_NOT_FOUND`.

## 7. Course API

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

`lecturer` gồm:

```text
lecturerId
fullName
faculty
```

`schedules[]` gồm:

```text
dayOfWeek
startTime
endTime
room
```

## 8. Frontend Course

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

## 9. Timetable backend

Thời khóa biểu được suy ra từ đăng ký đang active của sinh viên. Không có file JSON riêng cho timetable.

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

## 10. Frontend Timetable

Các file chính:

- `frontend/src/features/timetable/api/timetableApi.ts`
- `frontend/src/features/timetable/types/timetable.types.ts`
- `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx`

Frontend dùng API timetable. Không tự đọc `data/registrations.json`, `data/courses.json` hoặc `data/lecturers.json`.

## 11. Test bắt buộc

Backend:

- `JsonCourseRepositoryTest`
- `JsonLecturerRepositoryTest`
- `CourseServiceTest`
- `CourseControllerTest`
- `TimetableServiceTest`
- `TimetableControllerTest`

Scenario tối thiểu:

- list course trả dữ liệu;
- detail course tồn tại;
- detail course không tồn tại;
- search theo mã/tên;
- lecturer được map đúng;
- lecturer thiếu trả lỗi đúng;
- timetable empty khi sinh viên chưa đăng ký;
- timetable có dữ liệu từ registration active;
- course nhiều schedule tạo nhiều slot;
- registration đã hủy không xuất hiện.

## 12. Commit plan

Gợi ý commit:

```text
feat(course): implement course and lecturer api
feat(frontend): connect course list and detail
feat(timetable): expose timetable api
feat(frontend): connect timetable view
test(course): cover course lecturer and timetable flows
```

## 13. Kiểm tra trước khi push

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

## 14. Push và Pull Request

```powershell
git push -u origin feature/course-lecturer-timetable
```

Tạo Pull Request:

- Base: `develop`
- Compare: `feature/course-lecturer-timetable`
- Title: `[Course] Hoàn thiện học phần, giảng viên và thời khóa biểu`

## Điều kiện để được tạo Pull Request

- [ ] Đúng branch `feature/course-lecturer-timetable`
- [ ] File đúng phạm vi
- [ ] Course API đúng contract
- [ ] Lecturer mapping đúng
- [ ] Timetable không có persistence riêng
- [ ] Frontend không dùng mock course
- [ ] Không gọi `fetch` trực tiếp trong page
- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Commit author đúng
- [ ] Git status sạch
- [ ] Không push `develop` hoặc `main`

Hoàn thành các bước trên rồi tạo Pull Request và chờ trưởng nhóm review.
