# Hệ thống đăng ký môn học

Dự án BTL cuối kỳ OOP nhóm 2 lớp CSE702051-1-1-26(N01) - Đại học Phenikaa.

Dự án là một hệ thống đăng ký môn học dạng full-stack local. Frontend React hiển thị dashboard sinh viên, danh sách môn học, đăng ký/hủy đăng ký, thời khóa biểu và hồ sơ. Backend Spring Boot cung cấp REST API, kiểm tra nghiệp vụ đăng ký bằng validator chain và lưu dữ liệu bằng JSON File IO.

Dự án phục vụ học tập/demo OOP, chưa phải hệ thống production.

## Công nghệ

- Frontend: React 19, TypeScript, Vite và Tailwind CSS.
- Backend: Java 21, Spring Boot 3.3 và Maven Wrapper.
- Dữ liệu: JSON File IO với Jackson.
- Kiểm thử: JUnit 5, Mockito và MockMvc.

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
+-- scripts/          Script chạy và kiểm tra trên Windows
+-- kiem-thu/         Tài liệu kiểm thử
+-- tai-lieu/         Tài liệu dự án
`-- ho-so-nop-bai/    Báo cáo, slide và minh chứng
```

## Chạy dự án

Script `.bat` hỗ trợ Windows. Máy cần Git, JDK 21 và Node.js 20 trở lên; không cần cài Maven riêng vì repository có Maven Wrapper. Lần chạy đầu cần Internet để tải dependency.

```powershell
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
.\scripts\chay-du-an.bat
```

Nên clone vào đường dẫn ngắn, không dấu tiếng Việt. Script tự chạy `npm ci` nếu cần, build cả hai phần và mở ứng dụng tại `http://localhost:3000`.

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- API: `http://localhost:8080/api`

Nếu port `8080` đang bận, script tự chuyển backend sang `18080` và cấu hình frontend theo port mới.

### Chạy từng phần

Mở hai terminal tại thư mục gốc:

```powershell
# Terminal 1
.\scripts\chay-backend.bat

# Terminal 2
.\scripts\chay-frontend.bat 8080
```

Nếu backend chạy ở `18080`, truyền `18080` cho `chay-frontend.bat`. Hai script tự package backend hoặc cài dependency frontend khi cần.

### Kiểm tra

```powershell
.\scripts\kiem-tra-du-an.bat
```

Script chạy typecheck/build frontend, test/package backend và tự cài dependency frontend nếu thiếu. Bộ test backend hiện có 99 test.

## Tài khoản demo

- Mã sinh viên: `23010690`
- Mật khẩu: nhập chuỗi bất kỳ không rỗng trên giao diện.

Đăng nhập chỉ dùng để nhận diện sinh viên demo, không xác thực mật khẩu thật và không dùng JWT.

## Lưu ý

Dự án dùng JSON File IO, phù hợp học tập và demo. Chưa có transaction, xử lý đồng thời, phân quyền production hoặc cổng quản trị/giảng viên.
