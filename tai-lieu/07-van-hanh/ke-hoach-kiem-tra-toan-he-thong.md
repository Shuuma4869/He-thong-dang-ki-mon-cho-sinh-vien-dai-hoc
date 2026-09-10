# Kế hoạch kiểm tra toàn hệ thống

Quy trình áp dụng cho repository hiện tại:

`clone → môi trường → dependency → unit test → integration test → build → chạy BE → health/smoke → chạy frontend → E2E → kết luận`

Các lệnh dùng PowerShell trên Windows. Maven dùng `backend/mvnw.cmd`, không cần cài Maven riêng.

## 0. Bức tranh hệ thống trước khi chạy

- Frontend React/Vite chạy ở port `3000`, gọi REST API qua `VITE_API_BASE_URL`.
- Backend Spring Boot chạy ở port `8080`, nhận request tại `/api`, áp dụng service và validator rồi đọc/ghi JSON qua repository/file.
- Dữ liệu runtime development nằm trong `data/`: `students.json`, `lecturers.json`, `courses.json` và `registrations.json`.
- Unit test kiểm tra từng lớp hoặc controller slice; integration test `*IT.java` khởi động Spring context và dùng fixture riêng trong `backend/src/test/resources/integration-data/`.
- `mvnw.cmd verify` là mốc kiểm tra backend đầy đủ: Surefire → package → Failsafe.
- `scripts\kiem-tra-du-an.bat` và `scripts\chay-du-an.bat` là launcher tùy chọn. Hiểu và chạy các lệnh thủ công trong tài liệu này giúp chẩn đoán từng tầng khi launcher dừng ở một bước.

## 1. Clone repository

```powershell
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
git branch --show-current
git status --short
```

Mục đích: tạo working copy sạch và xác nhận đúng repository. Kỳ vọng: clone thành công, có `backend/`, `frontend/`, `data/`, `scripts/`, `kiem-thu/`, branch mặc định thường là `main`, và clone mới không có thay đổi.

## 2. Kiểm tra môi trường

```powershell
git --version
java -version
javac -version
node -v
npm -v
```

Mục đích: xác nhận toolchain. Kỳ vọng: JDK/Javac major version `21`, Node.js `20` trở lên, npm `10` trở lên; Git trả về phiên bản cài đặt. Nếu Java trỏ tới bản cũ, chuyển `JAVA_HOME` sang JDK 21 rồi mở terminal mới.

## 3. Cài dependency

```powershell
cd frontend
npm ci
cd ..
```

Mục đích: cài đúng dependency theo lockfile. Kỳ vọng: exit code `0`, tạo `frontend/node_modules/`, không sửa `package-lock.json`. Maven sẽ tự tải dependency Java ở lần chạy đầu tiên.

## 4. Unit test và regression test

```powershell
cd backend
.\mvnw.cmd test
cd ..
```

Mục đích: kiểm tra service, validator, repository/file IO, controller slice `@WebMvcTest` và context regression. `@WebMvcTest` có mock service nên không phải integration test.

Kỳ vọng:

```text
Tests run: 99
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

Báo cáo ở `backend/target/surefire-reports/`.

## 5. Integration test và build backend

```powershell
cd backend
.\mvnw.cmd verify
cd ..
```

Mục đích: chạy lại Surefire, package backend và chạy các lớp `*IT.java` bằng Failsafe. Test đi qua controller → service → validator → JSON repository thật; fixture được chép vào thư mục tạm và không ghi `data/` development.

Kỳ vọng:

```text
Surefire: Tests run: 99, Failures: 0, Errors: 0, Skipped: 0
Failsafe: Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Phải có `backend/target/course-registration-0.0.1-SNAPSHOT.jar`, `surefire-reports/` và `failsafe-reports/`.

## 6. Build frontend

```powershell
cd frontend
npm run typecheck
npm run build
cd ..
```

Mục đích: kiểm tra TypeScript và tạo build production. Kỳ vọng: typecheck không lỗi, build exit code `0` và tạo `frontend/dist/`.

## 7. Backup dữ liệu trước E2E

### Vì sao kế hoạch có bước backup và khôi phục?

Dự án dùng JSON File IO thay cho database. Khi chạy backend thật, các thao tác E2E như đăng ký `UX205` và hủy `UX205` sẽ ghi trực tiếp vào `data/registrations.json` và cập nhật sĩ số trong `data/courses.json`. Đây là mutation thật của dữ liệu development, không phải dữ liệu giả chỉ tồn tại trên giao diện.

Nếu không khôi phục sau E2E, dữ liệu baseline có thể không còn trạng thái 5 môn và 15/18 tín chỉ. Những lần demo hoặc kiểm tra tiếp theo khi đó có thể cho kết quả khác, đồng thời `git diff -- data` sẽ xuất hiện thay đổi ngoài ý muốn. Vì vậy backup/restore là bước bảo vệ tính lặp lại của quy trình kiểm thử, không phải một chức năng mới của ứng dụng.

Integration test tự động không cần backup thủ công vì các lớp `*IT.java` sao chép fixture vào thư mục tạm `@TempDir` và override `app.data-dir`; chúng không đọc/ghi `data/` development. Các health/smoke request trong kế hoạch đều là thao tác đọc nên cũng không làm thay đổi dữ liệu. Bước backup chỉ cần thiết trước nhóm E2E thủ công có đăng ký hoặc hủy đăng ký qua backend đang chạy thật.

Tạo bản sao baseline ngoài repository:

```powershell
$backupDir = Join-Path $env:TEMP 'course-registration-data-backup'
New-Item -ItemType Directory -Force $backupDir | Out-Null
Copy-Item data\*.json $backupDir -Force
```

Mục đích: khôi phục dữ liệu demo sau các test có mutation.

## 8. Chạy backend

Mở Terminal 1 tại root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Mục đích: chạy API thật. Kỳ vọng: Spring Boot báo started tại `http://localhost:8080`; giữ terminal mở.

Nếu port 8080 bận:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=18080"
```

Khi đó thay `8080` bằng `18080` trong các URL và cấu hình frontend.

## 9. Health check và smoke test API

Mở Terminal 2 tại root. Repository chưa cấu hình Actuator, nên dùng API thật làm health probe:

```powershell
curl.exe -i http://localhost:8080/api/students/23010690
curl.exe -i http://localhost:8080/api/courses
curl.exe -i http://localhost:8080/api/courses/OOP101
curl.exe -i "http://localhost:8080/api/courses/search?keyword=OOP"
```

Kỳ vọng cả bốn request: HTTP `200`, JSON có `success: true`; danh sách có 40 học phần; chi tiết có `OOP101`; tìm kiếm `OOP` có `OOP101`.

## 10. Chạy frontend

Mở Terminal 3 tại root:

```powershell
cd frontend
npm run dev
```

Kỳ vọng: Vite tại `http://localhost:3000`, mở được màn hình đăng nhập và gọi đúng backend. Nếu BE dùng 18080:

```powershell
$env:VITE_API_BASE_URL = 'http://localhost:18080/api'
npm run dev
```

## 11. E2E thủ công

Thực hiện tuần tự trên `http://localhost:3000`, ghi PASS/FAIL sau mỗi case.

| Mã | Thao tác | Kỳ vọng |
|---|---|---|
| E2E-01 | Mở ứng dụng | Màn hình đăng nhập, không trắng trang. |
| E2E-02 | Đăng nhập `23010690` với mật khẩu không rỗng | Vào dashboard, đúng sinh viên. |
| E2E-03 | Quan sát dashboard | Baseline: `15/18` tín chỉ, 5 môn, 40 học phần. |
| E2E-04 | Mở Hồ sơ | Đúng mã SV, họ tên, lớp, ngành. |
| E2E-05 | Mở Đăng ký môn học | Tải đủ 40 học phần, phân trang hoạt động. |
| E2E-06 | Tìm `OOP101` và `oop101` | Tìm được `OOP101`, không phụ thuộc hoa thường. |
| E2E-07 | Xem rồi đóng chi tiết `OOP101` | Đúng môn/giảng viên/lịch/sĩ số; đóng không mất bộ lọc. |
| E2E-08 | Đăng ký `UX205` và xác nhận | Thành công; tín chỉ 15 → 17; môn và sĩ số cập nhật. |
| E2E-09 | Đăng ký lại `UX205` | `DUPLICATE_REGISTRATION`; dữ liệu không đổi. |
| E2E-10 | Thử đăng ký `AI301` | `COURSE_FULL`; không thêm môn, không tăng sĩ số. |
| E2E-11 | Thử `NET203` khi `OOP101` active | `SCHEDULE_CONFLICT`; tổng tín chỉ không đổi. |
| E2E-12 | Thử `CLOUD301` | `CREDIT_LIMIT_EXCEEDED`; không ghi registration. |
| E2E-13 | Hủy `UX205` | Thành công; tín chỉ 17 → 15; sĩ số hoàn lại. |
| E2E-14 | Mở Thời khóa biểu | Chỉ có môn active, đúng ngày/giờ/phòng. |
| E2E-15 | Đăng xuất rồi đăng nhập lại `23010690` | Session cũ bị xóa; dashboard tải lại được. |
| E2E-16 | Đăng nhập `SV002` | Đăng nhập được; empty state hoặc 0 tín chỉ. |
| E2E-17 | Đăng nhập `SV999` | Bị từ chối; không vào dashboard. |

## 12. Khôi phục dữ liệu

Dừng frontend/backend rồi chạy tại root. Thao tác này đưa dữ liệu development về đúng trạng thái trước E2E để người tiếp theo có thể lặp lại cùng test case với cùng kết quả mong đợi:

```powershell
$backupDir = Join-Path $env:TEMP 'course-registration-data-backup'
Copy-Item "$backupDir\*.json" data -Force
git diff -- data
```

Kỳ vọng: `git diff -- data` không trả về diff. Nếu còn diff, chưa được kết luận PASS.

## 13. Kết luận

Kết luận `PASS` khi môi trường đúng phiên bản, `npm ci` thành công, `mvnw.cmd test` có 99 test pass, `mvnw.cmd verify` có 10 integration test pass và tạo JAR, frontend typecheck/build pass, smoke test trả HTTP 200, E2E-01 đến E2E-17 đạt kỳ vọng và dữ liệu đã restore sạch.

Trên Windows, `scripts\kiem-tra-du-an.bat` tương đương frontend check + `backend\mvnw.cmd clean verify`; `scripts\chay-du-an.bat` verify trước khi mở backend/frontend. Hai script không thay thế E2E thủ công.
