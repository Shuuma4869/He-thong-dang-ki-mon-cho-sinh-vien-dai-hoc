# Kiểm thử

Thư mục này được đặt ở root để tách riêng tài liệu kiểm thử khỏi bộ tài liệu phân tích/thiết kế trong `tai-lieu/`.

Nội dung chính:

- `bao-cao-kiem-thu.md`: báo cáo kiểm thử tổng quan.
- `bao-cao-kiem-thu-tich-hop.md`: kiểm thử tích hợp frontend/backend.
- `chien-luoc-kiem-thu.md`: chiến lược kiểm thử.
- `ma-tran-test-case.md`: ma trận test case.
- `kiem-thu-api.md`, `kiem-thu-frontend.md`, `kiem-thu-e2e.md`: kiểm thử theo lớp.
- Kế hoạch chạy đầy đủ: `../tai-lieu/07-van-hanh/ke-hoach-kiem-tra-toan-he-thong.md`.
- `unit-test/`: tài liệu unit test theo module.

Các lệnh chính:

Các lệnh dưới đây dùng Git Bash. Trong PowerShell, dùng `.\mvnw.cmd` thay cho `./mvnw.cmd`.

```bash
cd backend
./mvnw.cmd test
./mvnw.cmd verify
```

`test` chạy 99 unit/controller-slice/regression test bằng Surefire. `verify` chạy lại nhóm này, build JAR và chạy thêm 10 integration test bằng Failsafe.
