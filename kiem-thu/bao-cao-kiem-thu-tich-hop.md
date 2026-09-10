# Báo cáo kiểm thử tích hợp

## Phạm vi

Kiểm thử tích hợp tự động cho backend xác nhận request API đi qua controller, service, validator và JSON repository thật. Các controller slice `@WebMvcTest` không nằm trong nhóm này vì service của chúng được mock.

## Môi trường

Backend integration test:

- Spring Boot 3.3, JUnit 5 và MockMvc.
- Maven Failsafe chạy các lớp `*IT.java` khi thực hiện `mvnw.cmd verify`.
- Không mock controller, service, validator hoặc repository.
- Không mở HTTP port thật; smoke test riêng chịu trách nhiệm kiểm tra server socket.

## Bảo vệ dữ liệu

Fixture nằm trong `backend/src/test/resources/integration-data/`. Trước mỗi test, bốn file JSON được sao chép vào thư mục tạm do JUnit `@TempDir` quản lý. Property `app.data-dir` được override bằng `@DynamicPropertySource`, vì vậy test đăng ký/hủy đăng ký không chạm `data/` development và không cần backup thủ công.

## Integration test tự động

| Nhóm | Scenario | Kết quả |
|---|---|---|
| Course API | Danh sách đọc từ course/lecturer repository và trả schedule | PASS |
| Course detail | Trả đúng học phần, giảng viên và sĩ số | PASS |
| Course search | Tìm không phân biệt hoa thường | PASS |
| Course error | Course không tồn tại trả `COURSE_NOT_FOUND` | PASS |
| Registration | Đăng ký thành công, persistence và tăng sĩ số | PASS |
| Duplicate | Trả `DUPLICATE_REGISTRATION`, file không đổi | PASS |
| Capacity | Trả `COURSE_FULL` | PASS |
| Credit | Trả `CREDIT_LIMIT_EXCEEDED` | PASS |
| Schedule | Trả `SCHEDULE_CONFLICT` | PASS |
| Cancellation | Hủy đăng ký, persistence và giảm sĩ số | PASS |

Kết quả gần nhất: 10 test, 0 failure, 0 error, 0 skipped.

## Smoke test và E2E

Smoke test khởi động backend thật và gọi `/api/courses`, `/api/courses/OOP101`, `/api/courses/search?keyword=OOP` bằng `curl.exe`. E2E frontend vẫn là checklist thủ công trong `kiem-thu/kiem-thu-e2e.md` vì project chưa có Playwright hoặc Cypress.

## Ghi chú kỹ thuật

- `mvnw.cmd test` chạy nhóm Surefire gồm unit test, controller slice và regression test.
- `mvnw.cmd verify` chạy unit test, package và integration test.
- Frontend không đọc trực tiếp `data/*.json`.

## Kết luận

Kiểm thử tích hợp PASS. Luồng API đã được kiểm tra qua nhiều layer với JSON File IO cô lập khỏi dữ liệu development.
