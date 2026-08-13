# THANH VIEN 2 - COURSE / LECTURER / SCHEDULE / TIMETABLE

Repo root: `D:\OOP\Hệ thống đăng kí môn học`

Tai lieu nay duoc viet lai tu dau sau audit Git ngay `14/08/2026`. Nguon chinh la commit history trong ngay va source hien tai tren branch `reference/full-solution`.

## 1. Pham vi phu trach

### Course / Lecturer / Schedule

Thanh vien 2 phu trach:

- Model Course, Lecturer, Schedule.
- API danh sach hoc phan, tim kiem hoc phan, chi tiet hoc phan.
- Frontend Course List, Course Detail, filter, search va pagination.
- Mapping schedule tu backend sang UI.
- Data lien quan truc tiep: `data/courses.json`, `data/lecturers.json`.

### Timetable

Thanh vien 2 cung phu trach:

- `TimetableService` tao thoi khoa bieu tu registration active.
- `TimetableController` tra response lich hoc theo sinh vien.
- Frontend weekly timetable.
- Kiem tra lich hoc sau khi data course/registration thay doi.

## 2. Nhung thay doi ngay 14/08/2026 lien quan Member 2

| File | Trang thai | Hom nay sua gi | Feature | Vai tro |
| ---- | ---------- | -------------- | ------- | ------- |
| `data/courses.json` | M | Mo rong dataset len dung 40 hoc phan; chuan hoa `startTime/endTime` dang `HH:mm`; sua `DSA102` con 3 tin chi; doi ten `SE204`, `UX205`; them cac course demo cho case full/conflict/credit/success. | Course / Schedule / Timetable | DATA RELATED |
| `data/lecturers.json` | M | Them giang vien `GV005` den `GV010` de course moi co lecturer reference hop le. | Lecturer | DATA RELATED |
| `data/registrations.json` | M | Registration demo cua `23010690` gom 5 course: `OOP101`, `WEB201`, `DSA102`, `DBS202`, `SE204`; anh huong timetable hien tai. | Timetable dependency | READ ONLY |
| `frontend/src/features/courses/api/courseApi.ts` | M | Them sort course theo `code` cho `getCourses()` va `searchCourses()`. | Course | OWNED |
| `frontend/src/features/courses/pages/CourseListPage.tsx` | M | Them `COURSE_PAGE_SIZE = 10`, state `currentPage`, cache catalog, `visibleCourses`, nut Truoc/Sau, page number, reset page khi doi filter/search, ho tro filter Chu nhat. | Course / Pagination | OWNED |
| `frontend/src/features/courses/utils/courseMappers.ts` | M | Sua label thu trong tu tieng Viet khong dau sang co dau: `Thu Hai` -> `Thứ Hai`, ... `Chu Nhat` -> `Chủ Nhật`. | Course / Schedule | OWNED |
| `backend/src/test/java/vn/edu/phenikaa/courseregistration/data/DemoDataIntegrityTest.java` | A/M | Test khoa dataset: 40 course, 10 lecturer, lecturer reference hop le, capacity hop le, schedule hop le, baseline 15 tin chi, `UX205` khong trung lich. | Course / Timetable | TEST_SHARED |
| `frontend/vite.config.ts` | M | Them `server.strictPort = true` de frontend khong tu doi port 3000 khi demo. | Runtime frontend | READ ONLY / SHARED |
| `scripts/chay-frontend.bat` | M | Nhan backend port tu `chay-du-an.bat`, set `VITE_API_BASE_URL`, kiem tra npm/package/node_modules. | Runtime frontend | READ ONLY / SHARED |
| `scripts/chay-du-an.bat` | M | Build frontend/backend, phat hien backend fallback port `18080`, mo frontend voi API base dung port. | Runtime integration | READ ONLY / SHARED |
| `README.md` | M | Ghi ro dataset 40 hoc phan, pagination 10 mon/trang, backend fallback port. | DOCS |
| `ho-so-nop-bai/workflow/course-pagination-flow.md` | A | Them workflow phan trang hoc phan. | DOCS |
| `ho-so-nop-bai/flowchart/flowchart-phan-trang-hoc-phan.md` | A | Them flowchart pagination ban markdown. | DOCS |
| `ho-so-nop-bai/flowchart/flowchart-phan-trang-hoc-phan.mmd` | A | Them flowchart pagination Mermaid. | DOCS |
| `ho-so-nop-bai/so-do/sequence-course-list.md` | A | Them sequence Course List lay API, sort, filter, pagination. | DOCS |
| `ho-so-nop-bai/so-do/sequence-course-list.mmd` | A | Them Mermaid sequence Course List. | DOCS |
| `ho-so-nop-bai/minh-chung-kiem-thu/dataset-40-courses.md` | A | Them minh chung dataset 40 course. | DOCS |
| `tai-lieu/05-api-va-du-lieu/schema-courses.md` | M | Dong bo schema/ghi chu dataset 40 course va 10 course/page. | DOCS |
| `tai-lieu/02-kien-truc/kien-truc-frontend.md` | M | Bo sung ghi chu Course List sort/filter/pagination frontend. | DOCS |
| `tai-lieu/03-thiet-ke/thiet-ke-api-rest.md` | M | Bo sung contract Course API: backend tra full list, frontend sort va pagination. | DOCS |
| `kiem-thu/kiem-thu-frontend.md` | M | Cap nhat ghi chu kiem thu frontend sau pagination. | DOCS |

## 3. Course files OWNED

| File | Chuc nang | Ghi chu |
| ---- | --------- | ------- |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Course.java` | Model hoc phan | Field phai khop `data/courses.json`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Lecturer.java` | Model giang vien | Dung cho attach lecturer vao course response. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Schedule.java` | Model lich hoc | `dayOfWeek`, `startTime`, `endTime`, `room`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/CourseWithLecturer.java` | View model noi Course + Lecturer | Dung trong service/mapper. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/CourseRepository.java` | Contract course repository | Neu doi search/findAll phai cap nhat implementation. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/LecturerRepository.java` | Contract lecturer repository | Dung de resolve lecturer. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonCourseRepository.java` | Doc/ghi `data/courses.json` | Bat buoc qua `JsonFileUtils`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonLecturerRepository.java` | Doc `data/lecturers.json` | Bat buoc qua `JsonFileUtils`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java` | Nghiep vu Course | Method hien tai: `findAll`, `findById`, `search`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/CourseController.java` | API Course | Endpoint: `GET /api/courses`, `GET /api/courses/{courseId}`, `GET /api/courses/search?keyword=`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/CourseMapper.java` | Map Course -> CourseResponse | Giu lecturer/schedule dung UI. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/CourseResponse.java` | DTO Course | Khong bo field frontend dang dung. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/LecturerResponse.java` | DTO Lecturer | Dung trong course response. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ScheduleResponse.java` | DTO Schedule | Dung cho Course va Timetable. |
| `frontend/src/features/courses/api/courseApi.ts` | Goi Course API | Hien sort theo `code` sau khi map. |
| `frontend/src/features/courses/pages/CourseListPage.tsx` | Danh sach hoc phan | Dang co pagination 10 course/page. |
| `frontend/src/features/courses/components/CourseDetailModal.tsx` | Chi tiet hoc phan | Kiem tra schedule/capacity/status. |
| `frontend/src/features/courses/utils/courseMappers.ts` | Map API schedule sang UI | Dung label thu va period number. |
| `frontend/src/features/courses/types/course.types.ts` | Type Course frontend | Dong bo voi backend DTO. |

## 4. Timetable files OWNED

| File | Chuc nang | Ghi chu |
| ---- | --------- | ------- |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/TimetableEntry.java` | Record Course + Lecturer + Schedule | Dung noi bo cho timetable response. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java` | Tao thoi khoa bieu | Method hien tai: `findRegisteredCourses`, `findTimetableEntries`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/TimetableController.java` | API timetable | Endpoint: `GET /api/students/{studentId}/timetable`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/TimetableMapper.java` | Map TimetableEntry -> TimetableSlotResponse | Sap xep theo thu, gio bat dau, ma mon. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/TimetableSlotResponse.java` | DTO timetable | Frontend consume qua `timetableApi`. |
| `frontend/src/features/timetable/api/timetableApi.ts` | Goi timetable API | Map entry ve `Course[]` cho UI weekly grid. |
| `frontend/src/features/timetable/pages/TimetableWeeklyPage.tsx` | Man hinh thoi khoa bieu | Reload khi `studentId` doi. |
| `frontend/src/features/timetable/types/timetable.types.ts` | Type timetable frontend | Dong bo voi response backend. |

## 5. Data files lien quan

| File | Vai tro | Ownership |
| ---- | ------- | --------- |
| `data/courses.json` | Dataset 40 hoc phan, schedule, capacity, credit | DATA RELATED cho Member 2, shared voi Member 3 |
| `data/lecturers.json` | 10 giang vien de resolve lecturer | DATA RELATED cho Member 2 |
| `data/registrations.json` | Course active cua sinh vien, anh huong timetable | READ ONLY DEPENDENCY |

## 6. Shared / Integration files

| File | Ly do |
| ---- | ----- |
| `frontend/src/app/App.tsx` | Noi Course List, Registration, Timetable va Dashboard. |
| `frontend/src/shared/api/httpClient.ts` | HTTP client dung fallback API. |
| `frontend/src/shared/constants/apiEndpoints.ts` | Endpoint Course/Timetable dung chung. |
| `frontend/vite.config.ts` | Port frontend strict `3000`. |
| `scripts/chay-du-an.bat` | Script build/run ca frontend/backend. |
| `scripts/chay-frontend.bat` | Set `VITE_API_BASE_URL` theo backend port. |

## 7. Quy trinh thuc hien Course

1. Neu sua schema course, cap nhat `Course.java`, `CourseResponse.java`, `CourseMapper.java`, `course.types.ts`.
2. Neu sua search, cap nhat `CourseRepository.search`, `JsonCourseRepository`, `CourseService.search`.
3. Neu sua schedule, kiem tra `courseMappers.ts`, `TimetableMapper.java`, `ScheduleConflictValidator`.
4. Chay test Course va Data Integrity.

## 8. Quy trinh thuc hien Pagination

Pagination that su da thay doi trong `CourseListPage.tsx` ngay 14/08/2026.

Quy tac hien tai:

```text
COURSE_PAGE_SIZE = 10
totalPages = ceil(filteredCourses.length / 10)
visibleCourses = filteredCourses.slice(startIndex, startIndex + 10)
reset currentPage = 1 khi search/filter thay doi
```

Can test:

- Dataset 40 course tao toi thieu 4 trang khi khong filter.
- Search/filter lam reset ve trang 1.
- Nut `Truoc` disable o trang 1.
- Nut `Sau` disable o trang cuoi.

## 9. Quy trinh thuc hien Timetable

1. `TimetableController.findByStudentId` nhan `studentId`.
2. `TimetableService.findTimetableEntries(studentId)` kiem tra student ton tai.
3. Service lay registration active tu `RegistrationRepository`.
4. Service resolve course tu `CourseRepository` va lecturer tu `LecturerRepository`.
5. Service tao `TimetableEntry` cho tung schedule.
6. Service sort theo dayOfWeek, startTime, courseId.
7. `TimetableMapper.toEntryResponses` tra ve `TimetableSlotResponse`.

## 10. Unit test can chay

Course:

```powershell
cd backend
.\mvnw.cmd -Dtest=CourseServiceTest,CourseControllerTest,JsonCourseRepositoryTest,JsonLecturerRepositoryTest test
```

Timetable:

```powershell
cd backend
.\mvnw.cmd -Dtest=TimetableServiceTest,TimetableControllerTest test
```

Dataset:

```powershell
cd backend
.\mvnw.cmd -Dtest=DemoDataIntegrityTest test
```

Expected result:

```text
BUILD SUCCESS
Failures: 0
Errors: 0
```

## 11. Browser test

1. Chay `scripts\chay-du-an.bat`.
2. Login bang `23010690`.
3. Mo tab Dang ky mon hoc.
4. Xac nhan tong dataset hien 40 mon khi khong filter.
5. Xac nhan moi trang hien toi da 10 mon.
6. Chuyen trang 1 -> 2 -> 3 -> 4, danh sach khong blank.
7. Search keyword va filter thu/tin chi/trang thai, page reset ve 1.
8. Mo tab Thoi khoa bieu, lich cua 5 course baseline hien dung va khong trung lich.

## 12. File khong duoc dung

Khong tu y sua:

- `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java`
- `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/**`
- `frontend/src/features/registration/**`
- `data/students.json`
- `scripts/**`
- `frontend/src/app/App.tsx`

Neu course change lam anh huong validator/registration, can thong bao Member 3 review.

## 13. Git workflow

Course/Lecturer/Schedule:

```text
feature/course-lecturer
```

Timetable:

```text
feature/timetable
```

Khong gom Course va Timetable vao mot branch neu task co the tach doc lap.

Lenh can chay truoc PR:

```powershell
cd backend
.\mvnw.cmd -Dtest=CourseServiceTest,CourseControllerTest,TimetableServiceTest,TimetableControllerTest,DemoDataIntegrityTest test
cd ..\frontend
npm run typecheck
npm run build
```

## 14. Definition of Done

Member 2 hoan thanh khi:

- Course API tra danh sach/chi tiet/search dung envelope.
- Dataset course/lecturer khong bi reference loi.
- Course List sort, search, filter va pagination dung.
- Moi trang Course List toi da 10 mon.
- Timetable lay tu registration active va sort dung.
- Test Course/Timetable/Data Integrity pass.
- Frontend typecheck/build pass.
