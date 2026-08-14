# Báo cáo kiểm thử

Tài liệu này ghi nhận trạng thái kiểm thử của bản tham chiếu local.

Không công bố coverage phần trăm vì dự án chưa cấu hình công cụ đo coverage.

## Công cụ

- Backend: JUnit 5, AssertJ, Mockito, Spring Boot Test, MockMvc.
- Repository/File IO: `@TempDir`, không mutate root `data/*.json`.
- Frontend: TypeScript typecheck và Vite production build.
- Kiểm thử tích hợp trình duyệt: kiểm tra luồng người dùng thật trên frontend + backend local.

## Kết quả regression

Backend:

```text
Tests run: 99, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Backend package:

```text
BUILD SUCCESS
```

Frontend:

```text
npm run typecheck PASS
npm run build PASS
```

Ghi chú môi trường: trong sandbox, Vite/esbuild có thể lỗi `spawn EPERM`. Khi chạy ngoài sandbox, build pass; lỗi này là đặc thù môi trường, không phải source-code failure.

## Nhóm test

| Module | Nội dung |
|---|---|
| Auth | login thành công, student không tồn tại, studentId blank/trim |
| Student | đọc profile, lỗi `STUDENT_NOT_FOUND`, serialization |
| Course | list, detail, search, missing course, lecturer integrity |
| Registration | register, cancel, total credits, capacity mutation, failure không ghi file |
| Validator | existence, duplicate, capacity, credit, schedule conflict, deterministic order |
| Timetable | empty state, active registration, multi-schedule, cancelled excluded, ordering |
| Repository/File IO | read/write JSON, missing file, malformed JSON, UTF-8, path traversal |
| Controller | response envelope và error envelope qua MockMvc |

## Error-code contract

Đã có test cho:

- `STUDENT_NOT_FOUND`
- `COURSE_NOT_FOUND`
- `LECTURER_NOT_FOUND`
- `COURSE_FULL`
- `DUPLICATE_REGISTRATION`
- `CREDIT_LIMIT_EXCEEDED`
- `SCHEDULE_CONFLICT`
- `REGISTRATION_NOT_FOUND`
- `VALIDATION_ERROR`

## Validator boundaries

- Capacity: `current < max` pass, `current == max` fail, `current > max` fail.
- Credit: `newTotal < max` pass, `newTotal == max` pass, `newTotal > max` fail.
- Schedule: different day pass, adjacent intervals pass, partial overlap fail, same interval fail, new contains existing fail, new inside existing fail.

Rule schedule conflict:

```text
same day
AND newStart < existingEnd
AND newEnd > existingStart
```

## Regression quan trọng

Validator priority bug:

- Expected: request duplicate trả `DUPLICATE_REGISTRATION`.
- Bug cũ: trong trường hợp duplicate đồng thời vi phạm rule khác, error ưu tiên có thể sai.
- Fix hiện tại: 5 validator khóa thứ tự bằng `@Order(10/20/30/40/50)` và có `RegistrationValidatorOrderTest`.

Request courseId validation:

- `RegistrationRequest.courseId` có `@NotBlank`.
- Request thiếu/blank courseId trả `VALIDATION_ERROR`.

## Test isolation

- Unit/repository tests không phụ thuộc đường dẫn máy cá nhân.
- Repository tests dùng thư mục tạm.
- Runtime verification có backup/restore baseline data.
- Sau kiểm thử, `git diff -- data/` phải rỗng.
