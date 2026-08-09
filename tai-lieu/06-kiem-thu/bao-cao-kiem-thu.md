# Bao cao kiem thu

Tai lieu nay ghi nhan trang thai test hardening sau F16 cho Full Solution LOCAL.
Khong cong bo coverage % vi du an chua cau hinh cong cu do coverage.

## Framework

- Backend: JUnit 5, AssertJ, Mockito, Spring Boot Test, MockMvc.
- File IO tests: `@TempDir`, khong dung hoac mutate root `data/*.json`.
- Frontend: TypeScript typecheck va Vite production build.

## Tong quan test suite

| Module | Success tests | Failure tests | Boundary tests | Controller tests | Repository/File IO tests |
|---|---:|---:|---:|---:|---:|
| Auth | co | co | blank/trim studentId | co | n/a |
| Student | co | co | maxCredits serialization qua response/repository | co | co |
| Course | co | co | search blank, capacity data qua model | co | co |
| Registration | co | co | validator priority, capacity increment/decrement | co | co |
| Validator | co | co | capacity, credit, schedule overlap | n/a | n/a |
| Timetable | co | co | multi-schedule, cancelled excluded, ordering | co | n/a |
| JSON File IO | co | co | missing file, empty array, null list, UTF-8, malformed JSON, path traversal | n/a | co |

## Scenario quan trong

- Login thanh cong voi studentId hop le.
- Login unknown studentId tra `STUDENT_NOT_FOUND`.
- Login blank studentId tra `VALIDATION_ERROR` va khong goi repository.
- Course list, find by ID, search by ID/name, missing lecturer.
- Registration success tao/cap nhat registration va tang capacity dung 1.
- Registration fail khong goi `registrationRepository.save()` hoac `courseRepository.save()`.
- Cancel success xoa course khoi registration va giam capacity dung 1.
- Cancel khong lam capacity am.
- Timetable bo qua registration `CANCELLED`.
- Timetable tao entry cho moi schedule cua course.

## Validator boundaries

- Course existence: present pass, missing fail.
- Duplicate: not registered pass, registered fail.
- Capacity: `current < max` pass, `current == max` fail, `current > max` fail.
- Credit: `newTotal < max` pass, `newTotal == max` pass, `newTotal > max` fail.
- Schedule: different day pass, adjacent intervals pass, partial overlap fail, same interval fail, new contains existing fail, new inside existing fail, conflict with any registered course fail.

## F15 runtime verification

F15 da chay API-level verification voi demo data:

- Login/Profile/Course/Search/Registration/Timetable PASS.
- Register DBS202 PASS.
- Cancel DBS202 PASS.
- COURSE_FULL, DUPLICATE_REGISTRATION baseline, CREDIT_LIMIT_EXCEEDED, SCHEDULE_CONFLICT PASS.
- Persistence qua backend restart PASS.
- Sau mutation verification, root `data/*.json` da restore ve baseline.

## F15C regression

Bug F15:

- Expected: dang ky lai DBS202 sau khi da dang ky thanh cong phai tra `DUPLICATE_REGISTRATION`.
- Actual truoc fix: tra `CREDIT_LIMIT_EXCEEDED`.

Sau F15C:

- Validator order duoc khoa bang `@Order`.
- `RegistrationValidatorOrderTest` xac nhan Spring inject `List<CourseValidator>` dung thu tu.
- Service regression test duplicate + credit exceeded tra `DuplicateRegistrationException`.
- Service regression test duplicate + course full tra `DuplicateRegistrationException`.
- Runtime retest: DBS202 lan thu hai tra `DUPLICATE_REGISTRATION` va khong mutate file JSON.

## Error-code contract

Da co test cho cac error code chinh:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `LECTURER_NOT_FOUND`
- `COURSE_FULL`
- `DUPLICATE_REGISTRATION`
- `CREDIT_LIMIT_EXCEEDED`
- `SCHEDULE_CONFLICT`
- `REGISTRATION_NOT_FOUND`
- `VALIDATION_ERROR`

## Test isolation

- Repository va JsonFileUtils tests dung `@TempDir`.
- Unit tests khong phu thuoc `D:\OOP\...` hoac root demo data.
- Runtime verification co backup tam ngoai repo va restore baseline sau test.
- Sau test suite, `git diff -- data/` phai rong.

## Ket qua F16

Lenh da chay:

```text
backend\mvnw.cmd clean test
backend\mvnw.cmd clean package
cd frontend
npm run typecheck
npm run build
cd ..
scripts\kiem-tra-du-an.bat
```

Ket qua sau hardening:

```text
Tests run: 98, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Ghi chu moi truong: `npm run build` va `scripts\kiem-tra-du-an.bat` fail khi chay trong sandbox do Vite/esbuild bi chan `spawn EPERM`.
Khi rerun ngoai sandbox, ca hai PASS.
