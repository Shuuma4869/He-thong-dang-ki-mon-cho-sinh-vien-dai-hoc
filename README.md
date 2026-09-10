# Hệ thống đăng ký môn học

Dự án BTL cuối kỳ OOP nhóm 2 lớp CSE702051-1-1-26(N01) - Đại học Phenikaa.

Dự án là một hệ thống đăng ký môn học dạng full-stack local. Frontend React hiển thị dashboard sinh viên, danh sách môn học, đăng ký/hủy đăng ký, thời khóa biểu và hồ sơ. Backend Spring Boot cung cấp REST API, kiểm tra nghiệp vụ đăng ký bằng validator chain và lưu dữ liệu bằng JSON File IO.

Dự án phục vụ học tập/demo OOP, chưa phải hệ thống production.

## Công nghệ

- Frontend: React 19, TypeScript, Vite và Tailwind CSS.
- Backend: Java 21, Spring Boot 3.3 và Maven Wrapper.
- Dữ liệu: JSON File IO với Jackson.
- Kiểm thử: JUnit 5, Mockito, MockMvc, Maven Surefire và Maven Failsafe.

## Chức năng

- Đăng nhập demo, xem dashboard và hồ sơ sinh viên.
- Danh sách 40 học phần, có tìm kiếm, xem chi tiết và phân trang.
- Đăng ký hoặc hủy đăng ký; theo dõi môn đã chọn và tổng tín chỉ.
- Kiểm tra trùng môn, đầy sĩ số, vượt tín chỉ và trùng lịch.
- Xem thời khóa biểu và nhận thông báo local.

## Cấu trúc thư mục

```text
.
+-- backend/          Spring Boot API, mã nguồn và kiểm thử
+-- frontend/         Ứng dụng React
+-- data/             Dữ liệu JSON demo
+-- scripts/          Các script Windows chạy và kiểm tra toàn hệ thống
+-- kiem-thu/         Tài liệu kiểm thử
+-- tai-lieu/         Tài liệu dự án
`-- ho-so-nop-bai/    Báo cáo, slide và minh chứng
```

## Quy trình chạy và kiểm tra

Máy cần Git, JDK 21, Node.js 20 trở lên và npm 10 trở lên. Maven được chạy bằng Wrapper trong `backend/`; lần chạy đầu cần Internet để tải dependency.

Kế hoạch đầy đủ theo từng bước, lệnh chạy và kết quả mong đợi nằm tại [`tai-lieu/07-van-hanh/ke-hoach-kiem-tra-toan-he-thong.md`](tai-lieu/07-van-hanh/ke-hoach-kiem-tra-toan-he-thong.md).

### 1. Clone repository

```powershell
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
```

### 2. Kiểm tra môi trường

```powershell
git --version
java -version
node -v
npm -v
```

`java -version` phải hiển thị Java 21.

### 3. Cài frontend dependency

```powershell
cd frontend
npm ci
cd ..
```

### 4. Chạy unit test

Các lệnh Maven trong hướng dẫn dùng cú pháp Git Bash. Nếu dùng PowerShell, thay `./mvnw.cmd` bằng `.\mvnw.cmd`.

```bash
cd backend
./mvnw.cmd test
cd ..
```

Lệnh này chạy 99 test thuộc nhóm Surefire, gồm unit test cho service/validator/repository, controller slice `@WebMvcTest` và context regression. Controller slice không được tính là integration test.

### 5. Chạy integration test và build backend

```bash
cd backend
./mvnw.cmd verify
cd ..
```

Failsafe chạy 10 integration test `*IT.java` sau unit test. Các test khởi động Spring context và đi qua controller, service, JSON repository với dữ liệu tạm riêng. `verify` cũng tạo JAR trong `backend/target/` và fail nếu integration test fail.

### 6. Build frontend

```powershell
cd frontend
npm run typecheck
npm run build
cd ..
```

### 7. Chạy backend

Mở terminal thứ nhất:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Backend chạy tại `http://localhost:8080` và đọc dữ liệu development trong `data/`.

### 8. Smoke test API

Mở terminal thứ hai tại root repository:

```powershell
curl.exe -i http://localhost:8080/api/courses
curl.exe -i http://localhost:8080/api/courses/OOP101
curl.exe -i "http://localhost:8080/api/courses/search?keyword=OOP"
```

Kết quả mong đợi là HTTP `200`, JSON có `success: true` và dữ liệu học phần.

### 9. Chạy frontend

Trong terminal thứ hai:

```powershell
cd frontend
npm run dev
```

Frontend chạy tại `http://localhost:3000` và gọi API tại `http://localhost:8080/api`.

### 10. Kiểm tra E2E thủ công

Mở `http://localhost:3000`, đăng nhập bằng `23010690`, sau đó kiểm tra dashboard, danh sách học phần, tìm kiếm, chi tiết, đăng ký/hủy đăng ký, thời khóa biểu, hồ sơ và đăng xuất. Checklist đầy đủ nằm tại `kiem-thu/kiem-thu-e2e.md`.

### 11. Kết luận

Quy trình đạt yêu cầu khi unit test, integration test, backend build, frontend typecheck/build và smoke test đều pass; các luồng trong checklist E2E hoạt động đúng.

### Script Windows tùy chọn

Nếu dùng Windows, các wrapper trong `scripts/` thực hiện cùng quy trình bằng một lệnh:

```powershell
.\scripts\kiem-tra-du-an.bat
.\scripts\chay-du-an.bat
```

`kiem-tra-du-an.bat` chạy frontend typecheck/build và `backend\mvnw.cmd clean verify`, bao gồm cả integration test. `chay-du-an.bat` cũng chạy bước verify trước khi mở backend và frontend. Có thể chạy riêng `scripts\chay-backend.bat` hoặc `scripts\chay-frontend.bat [backend-port]` khi cần.

## Tài khoản demo

- Mã sinh viên: `23010690`
- Mật khẩu: nhập chuỗi bất kỳ không rỗng trên giao diện.

Đăng nhập chỉ dùng để nhận diện sinh viên demo, không xác thực mật khẩu thật và không dùng JWT.

## Lưu ý

Dự án dùng JSON File IO, chưa có transaction, xử lý đồng thời, chưa có e2e testing tự động, phân quyền production hoặc cổng quản trị/giảng viên.
