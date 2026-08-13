# THANH VIEN 3 - REGISTRATION / VALIDATOR

Repo root: `D:\OOP\Hệ thống đăng kí môn học`

Tai lieu nay duoc viet lai tu dau sau audit Git ngay `14/08/2026`. Nguon chinh la commit history trong ngay va source hien tai tren branch `reference/full-solution`.

## 1. Pham vi phu trach

Thanh vien 3 phu trach:

- Dang ky hoc phan.
- Huy dang ky hoc phan.
- `Registration`, `RegistrationDetail`, `RegistrationSummary`.
- `Registrable`.
- `RegistrationService`.
- `RegistrationController`.
- Validator theo contract `CourseValidator`.
- Frontend Registered Courses va modal confirm dang ky.
- Test business rule: duplicate, capacity, credit limit, schedule conflict, cancel.

## 2. Nhung thay doi ngay 14/08/2026 lien quan Member 3

Khong phat hien thay doi source truc tiep thuoc `RegistrationService`, `RegistrationController`, `validator/**` hoac `frontend/src/features/registration/**` trong ngay 14/08/2026.

Tuy nhien co cac thay doi data/test/docs shared anh huong truc tiep den Registration/Validator:

| File | Trang thai | Noi dung thay doi | Vai tro |
| ---- | ---------- | ----------------- | ------- |
| `data/registrations.json` | M | Registration demo chinh doi sang `REG-23010690-DEMO`, `studentId = 23010690`, active details gom `OOP101`, `WEB201`, `DSA102`, `DBS202`, `SE204`. | DATA RELATED |
| `data/students.json` | M | Student demo doi thanh `23010690`, `maxCredits = 18`, `className = CNTT7 - K17`; anh huong `CreditLimitValidator`. | READ ONLY DEPENDENCY |
| `data/courses.json` | M | Dataset course len 40 mon; chuan hoa schedule; case demo: `AI301` day si so, `NET203` trung lich, `CLOUD301` vuot tin chi, `UX205` dang ky thanh cong. | READ ONLY DEPENDENCY |
| `data/lecturers.json` | M | Them `GV005` den `GV010`; can thiet de Registration response resolve lecturer cho course moi. | READ ONLY DEPENDENCY |
| `backend/src/test/java/vn/edu/phenikaa/courseregistration/data/DemoDataIntegrityTest.java` | A/M | Test khoa baseline registration 15 tin chi, khong trung lich; kiem tra case full/conflict/credit/success cho validator demo. | TEST_SHARED |
| `README.md` | M | Ghi ro baseline registration va cac case demo loi/thanh cong. | DOCS |
| `tai-lieu/03-thiet-ke/thiet-ke-api-rest.md` | M | Dong bo vi du Registration API va luong Course/Registration/Timetable. | DOCS |
| `tai-lieu/05-api-va-du-lieu/schema-registrations.md` | M | Dong bo schema registration voi `REG-23010690-DEMO` va 5 course active. | DOCS |
| `tai-lieu/05-api-va-du-lieu/du-lieu-demo.md` | M | Cap nhat baseline `23010690` da dang ky 5 course, tong 15 tin chi. | DOCS |
| `tai-lieu/02-kien-truc/kien-truc-du-lieu-va-file-io.md` | M | Bo sung ghi chu data/file IO lien quan dataset demo. | DOCS |
| `kiem-thu/bao-cao-kiem-thu-tich-hop.md` | M | Dong bo ket qua test tich hop voi dataset 40 course va registration demo. | DOCS |
| `kiem-thu/bao-cao-kiem-thu.md` | M | Cap nhat tong quan ket qua test. | DOCS |
| `kiem-thu/unit-test/07-ket-qua-kiem-thu.md` | M | Cap nhat tong so test backend len 99. | DOCS |
| `ho-so-nop-bai/minh-chung-kiem-thu/ket-qua-backend-test.md` | M | Cap nhat ket qua backend test. | DOCS |
| `ho-so-nop-bai/minh-chung-kiem-thu/ket-qua-e2e.md` | M | Cap nhat minh chung E2E theo luong demo moi. | DOCS |

## 3. Registration files OWNED

| File | Chuc nang | Ghi chu |
| ---- | --------- | ------- |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Registration.java` | Registration aggregate | Chua `registrationId`, `studentId`, `status`, `registeredAt`, `details`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationDetail.java` | Chi tiet course da dang ky | Hien gom `courseId`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/RegistrationSummary.java` | Summary tra ve service | Gom registration va danh sach course co lecturer. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/Registrable.java` | Contract dang ky | `RegistrationService` implements interface nay. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/RegistrationRepository.java` | Contract persistence registration | Neu doi save/find phai cap nhat JSON repository/test. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonRegistrationRepository.java` | Doc/ghi `data/registrations.json` | Bat buoc qua `JsonFileUtils`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/RegistrationService.java` | Dang ky/huy/tinh tong tin chi | Method hien tai: `register`, `registerCourse`, `registerCourseSummary`, `cancelCourse`, `cancelCourseSummary`, `findActiveRegistrationsByStudent`, `findActiveRegistrationSummary`, `calculateTotalCredits`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/RegistrationController.java` | API registration | Endpoint: `GET/POST /api/students/{studentId}/registrations`, `DELETE /api/students/{studentId}/registrations/{courseId}`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/RegistrationRequest.java` | Request dang ky | Field bat buoc: `courseId`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationResponse.java` | Response tong quan dang ky | Co courses va totalCredits. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegistrationDetailResponse.java` | Response detail | Dung khi can mo rong chi tiet. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/RegisteredCourseResponse.java` | Response course da dang ky | Dung mapping registered courses. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/RegistrationMapper.java` | Map RegistrationSummary -> RegistrationResponse | Khong doc file, khong chua business rule. |
| `frontend/src/features/registration/api/registrationApi.ts` | Goi registration API | `getRegistrations`, `registerCourse`, `cancelCourse`. |
| `frontend/src/features/registration/pages/RegisteredCoursesPage.tsx` | Man hinh mon da dang ky | Hien courses va tong tin chi. |
| `frontend/src/features/registration/components/RegisterConfirmModal.tsx` | Modal xac nhan dang ky | Goi callback register tu App. |
| `frontend/src/features/registration/types/registration.types.ts` | Type registration frontend | Dong bo voi DTO backend. |

## 4. Validator files OWNED

| File | Chuc nang | Error code |
| ---- | --------- | ---------- |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/interfaces/CourseValidator.java` | Contract validator | Moi validator implement `validate(RegistrationValidationContext context)`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/context/RegistrationValidationContext.java` | Context validation | Gom student, requested course id, optional requested course, registered courses. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CourseExistenceValidator.java` | Kiem tra course ton tai | `COURSE_NOT_FOUND` |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/DuplicateCourseValidator.java` | Chan dang ky trung course active | `DUPLICATE_REGISTRATION` |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CapacityValidator.java` | Chan course da day | `COURSE_FULL` |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/CreditLimitValidator.java` | Chan vuot `Student.maxCredits` | `CREDIT_LIMIT_EXCEEDED` |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/ScheduleConflictValidator.java` | Chan trung lich | `SCHEDULE_CONFLICT` |

## 5. Data files lien quan

| File | Vai tro | Ownership |
| ---- | ------- | --------- |
| `data/registrations.json` | Trang thai dang ky active/cancelled | DATA RELATED cho Member 3, shared |
| `data/students.json` | `maxCredits` va student ton tai | READ ONLY DEPENDENCY |
| `data/courses.json` | credits, capacity, schedule | READ ONLY DEPENDENCY |
| `data/lecturers.json` | Resolve lecturer khi tra response | READ ONLY DEPENDENCY |

## 6. Shared / Integration files

| File | Ly do |
| ---- | ----- |
| `frontend/src/app/App.tsx` | Dieu phoi register/cancel, toast, reload course/registration/timetable. |
| `frontend/src/shared/api/httpClient.ts` | Goi API va xu ly envelope/error shared. |
| `frontend/src/shared/constants/apiEndpoints.ts` | Endpoint registration dung chung. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java` | Base exception co `errorCode`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java` | Map BusinessException ra API error response. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Co che doc/ghi JSON duy nhat. |

## 7. Quy trinh xu ly dang ky

Theo source hien tai:

1. `RegistrationController.register(studentId, request)` nhan `courseId`.
2. `RegistrationService.registerCourseSummary(studentId, courseId)` goi `registerCourse`.
3. `registerCourse` kiem tra student ton tai qua `StudentRepository`.
4. Lay requested course qua `CourseRepository.findById`.
5. Lay registration active hien co qua `RegistrationRepository.findByStudentId`.
6. Resolve danh sach course da dang ky.
7. Tao `RegistrationValidationContext`.
8. Chay `validators.forEach(validator -> validator.validate(context))`.
9. Neu pass, them `RegistrationDetail(courseId)`, save registration.
10. Tang `course.currentCapacity` them 1 va save course.
11. Mapper tra `RegistrationResponse` co courses va totalCredits.

## 8. Validator order

Order hien tai trong source:

| Thu tu | Validator | Annotation |
| ------ | --------- | ---------- |
| 1 | `CourseExistenceValidator` | `@Order(10)` |
| 2 | `DuplicateCourseValidator` | `@Order(20)` |
| 3 | `CapacityValidator` | `@Order(30)` |
| 4 | `CreditLimitValidator` | `@Order(40)` |
| 5 | `ScheduleConflictValidator` | `@Order(50)` |

Test khoa order: `backend/src/test/java/vn/edu/phenikaa/courseregistration/validator/RegistrationValidatorOrderTest.java`.

## 9. Quy trinh xu ly huy

Theo source hien tai:

1. `RegistrationController.cancel(studentId, courseId)` nhan path variable.
2. `RegistrationService.cancelCourseSummary(studentId, courseId)` goi `cancelCourse`.
3. `cancelCourse` kiem tra student ton tai.
4. Kiem tra course ton tai.
5. Lay registration active.
6. Neu course khong nam trong details thi nem `RegistrationNotFoundException`.
7. Xoa detail co `courseId`.
8. Neu details rong thi set status `CANCELLED`.
9. Save registration.
10. Giam `course.currentCapacity`, khong nho hon 0.
11. Save course.

Cancel khong chay `CourseValidator`.

## 10. Unit test can chay

Registration:

```powershell
cd backend
.\mvnw.cmd -Dtest=RegistrationServiceTest,RegistrationControllerTest,JsonRegistrationRepositoryTest test
```

Validator:

```powershell
cd backend
.\mvnw.cmd -Dtest=CourseExistenceValidatorTest,DuplicateCourseValidatorTest,CapacityValidatorTest,CreditLimitValidatorTest,ScheduleConflictValidatorTest,RegistrationValidatorOrderTest test
```

Dataset shared:

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

## 11. Business rule test

Dung baseline hien tai:

| Case | Input | Expected |
| ---- | ----- | -------- |
| Dang ky thanh cong | `studentId=23010690`, `courseId=UX205` | HTTP 200, totalCredits khong vuot 18 |
| Duplicate | `studentId=23010690`, `courseId=OOP101` | Loi `DUPLICATE_REGISTRATION` |
| Full capacity | `studentId=23010690`, `courseId=AI301` | Loi `COURSE_FULL` |
| Trung lich | `studentId=23010690`, `courseId=NET203` | Loi `SCHEDULE_CONFLICT` neu chua bi rule truoc chan |
| Vuot tin chi | `studentId=23010690`, `courseId=CLOUD301` | Loi `CREDIT_LIMIT_EXCEEDED` |
| Huy course da dang ky | `studentId=23010690`, `courseId=WEB201` | HTTP 200, course bi xoa khoi details |
| Huy course chua dang ky | `studentId=23010690`, `courseId=UX205` khi chua dang ky | Loi `REGISTRATION_NOT_FOUND` |

## 12. Browser test

1. Chay `scripts\chay-du-an.bat`.
2. Login bang `23010690`.
3. Mo tab Dang ky mon hoc.
4. Thu dang ky `UX205`, expected thanh cong.
5. Thu dang ky lai `OOP101`, expected thong bao trung mon.
6. Thu course full/conflict/credit theo bang tren.
7. Mo tab Mon da dang ky, tong tin chi va danh sach cap nhat dung.
8. Mo tab Thoi khoa bieu, lich cap nhat sau dang ky/huy.

## 13. File khong duoc dung

Khong tu y sua:

- `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java`
- `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/AuthService.java`
- `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/CourseService.java`
- `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/TimetableService.java`
- `frontend/src/features/auth/**`
- `frontend/src/features/courses/**`
- `frontend/src/features/timetable/**`
- `data/students.json`
- `data/courses.json`
- `data/lecturers.json`
- `scripts/**`

Neu validator can data case moi, de xuat thay doi data trong PR rieng va yeu cau Member 1/2 review.

## 14. Git workflow

Branch lam viec:

```text
feature/registration-validator
```

Quy trinh:

```powershell
git status --short
git switch -c feature/registration-validator
cd backend
.\mvnw.cmd -Dtest=RegistrationServiceTest,RegistrationControllerTest,CourseExistenceValidatorTest,DuplicateCourseValidatorTest,CapacityValidatorTest,CreditLimitValidatorTest,ScheduleConflictValidatorTest,RegistrationValidatorOrderTest test
cd ..\frontend
npm run typecheck
npm run build
```

Khong commit file runtime sinh ra: `backend/target`, `frontend/dist`, `node_modules`, `.env.local`.

## 15. Definition of Done

Member 3 hoan thanh khi:

- Dang ky thanh cong cap nhat registration va capacity.
- Huy dang ky cap nhat registration va capacity.
- 5 validator chay dung order.
- Loi tra dung `errorCode`.
- Registered Courses frontend cap nhat sau register/cancel.
- Test Registration/Validator pass.
- Frontend typecheck/build pass.
- Khong sua data shared hoac source cua member khac neu chua co review.
