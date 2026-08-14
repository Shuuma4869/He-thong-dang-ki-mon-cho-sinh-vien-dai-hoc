# Hệ thống đăng ký môn học

Đồ án cuối kỳ OOP nhóm 2 - Đại học Phenikaa.

Dự án là một hệ thống đăng ký môn học dạng full-stack local. Frontend React hiển thị dashboard sinh viên, danh sách môn học, đăng ký/hủy đăng ký, thời khóa biểu và hồ sơ. Backend Spring Boot cung cấp REST API, kiểm tra nghiệp vụ đăng ký bằng validator chain và lưu dữ liệu bằng JSON File IO.

Dự án phục vụ học tập/demo OOP, chưa phải hệ thống production.

## Công nghệ

Frontend:

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- lucide-react
- npm

Backend:

- Java 21
- Spring Boot 3.3.5
- Maven Wrapper
- Jackson JSON
- JUnit 5, Mockito, MockMvc

Lưu trữ:

- JSON File IO trong `data/*.json`
- Không dùng database, JPA, Hibernate, Spring Security hoặc JWT

## Chức năng

Core:

- Đăng nhập demo bằng mã sinh viên.
- Xem thông tin sinh viên.
- Xem danh sách, tìm kiếm và xem chi tiết môn học.
- Danh sach hoc phan demo co 40 mon, phan trang frontend toi da 10 mon/trang.
- Đăng ký môn học.
- Hủy đăng ký môn học.
- Kiểm tra trùng môn, đầy sĩ số, vượt số tín chỉ và trùng lịch.
- Xem môn đã đăng ký và tổng số tín chỉ.
- Xem thời khóa biểu được tính từ đăng ký hiện tại.

Support:

- Dashboard tổng quan ở frontend.
- Thông báo demo/local ở frontend.
- Hồ sơ sinh viên.

## Kiến trúc

Luồng backend bắt buộc:

```text
Controller
-> Service
-> Validator nếu có
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

Frontend gọi backend qua shared API layer:

```text
React Page/Component
-> feature api
-> shared requestApi/httpClient
-> REST API
```

Frontend không đọc trực tiếp `data/*.json`. Controller, service và model backend không tự mở file JSON.

## Cấu trúc thư mục

```text
.
+-- frontend/          # React + TypeScript + Vite
+-- backend/           # Spring Boot backend
+-- data/              # students, lecturers, courses, registrations
+-- tai-lieu/          # Tài liệu phân tích, kiến trúc, thiết kế, vận hành, báo cáo
+-- kiem-thu/          # Tài liệu kiểm thử, ma trận test case, kết quả kiểm thử
+-- thiet-ke/          # Tài nguyên thiết kế và thư mục UML
+-- ho-so-nop-bai/     # Hồ sơ nộp bài và ảnh demo đã chọn
+-- scripts/           # Script chạy backend/frontend/kiểm tra
+-- .github/           # Mẫu GitHub
+-- .env.example       # Ghi chú cấu hình môi trường cấp root
+-- frontend/.env.example
+-- README.md
```

## Yêu cầu môi trường

- Git
- JDK 21
- Node.js 20 trở lên
- npm 10 trở lên

Không cần cài Maven hệ thống vì backend dùng Maven Wrapper.

Kiểm tra nhanh:

```powershell
git --version
java -version
javac -version
node -v
npm -v
```

## Cách chạy nhanh

Clone repository:

```powershell
mkdir projects
cd projects
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
```

Nên clone vào thư mục không dấu tiếng Việt để giảm rủi ro lỗi classpath trên Windows.

Chạy toàn bộ dự án bằng một lệnh:

```powershell
scripts\chay-du-an.bat
```

Script sẽ kiểm tra/build frontend, package backend, mở backend, mở frontend và mở trình duyệt tại `http://localhost:3000`.

Nếu port `8080` đang bị ứng dụng khác chiếm, script sẽ tự chạy backend ở `18080` và truyền `VITE_API_BASE_URL=http://localhost:18080/api` cho frontend.

Nếu muốn chạy từng phần:

Chạy backend:

```powershell
scripts\chay-backend.bat
```

Chạy frontend ở terminal khác:

```powershell
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

Backend mặc định chạy tại:

```text
http://localhost:8080
```

Khi port `8080` bận, script `.bat` dùng port dự phòng:

```text
http://localhost:18080
```

API base:

```text
http://localhost:8080/api
```

## Demo account

- Mã sinh viên: `23010690`
- Mật khẩu: nhập chuỗi bất kỳ không rỗng trên giao diện

Baseline demo cua `23010690`: `OOP101`, `WEB201`, `DSA102`, `DBS202`, `SE204`, tong 15/18 tin chi. Case dang ky thanh cong nen demo bang `UX205`; cac case loi giu nguyen la `OOP101` duplicate, `AI301` day si so, `NET203` trung lich, `CLOUD301` vuot tin chi.

Authentication hiện là demo identification cho đồ án: backend kiểm tra `studentId` có tồn tại trong `StudentRepository`. Backend không xác thực mật khẩu thật, không tạo JWT và frontend không lưu password.

## Kiểm thử

Chạy kiểm tra backend:

```powershell
backend\mvnw.cmd clean test
backend\mvnw.cmd clean package
```

Chạy kiểm tra frontend:

```powershell
cd frontend
npm run typecheck
npm run build
cd ..
```

Chạy toàn bộ:

```powershell
scripts\kiem-tra-du-an.bat
```

Kết quả kiểm thử gần nhất của bản tham chiếu local:

- Backend: 99 tests pass, 0 failures, 0 errors, 0 skipped.
- Backend package: pass.
- Frontend typecheck: pass.
- Frontend build: pass khi chạy ngoài sandbox nếu môi trường chặn Vite/esbuild bằng `spawn EPERM`.
- Kiểm thử tích hợp trình duyệt: pass.

## Phân công tổng quan

Nhóm có thể chia theo module:

- Frontend UI và API client.
- Backend model/service/validator.
- Repository JSON File IO.
- REST API/DTO/controller.
- Kiểm thử, tài liệu và demo.

Chi tiết xem `tai-lieu/04-quy-trinh-nhom/phan-cong-thanh-vien.md`.

## Tài liệu chi tiết

- `tai-lieu/00-bat-dau/muc-luc-tai-lieu.md`
- `tai-lieu/00-bat-dau/gioi-thieu-du-an.md`
- `tai-lieu/02-kien-truc/kien-truc-tong-the.md`
- `tai-lieu/02-kien-truc/kien-truc-frontend.md`
- `tai-lieu/02-kien-truc/kien-truc-backend.md`
- `tai-lieu/02-kien-truc/kien-truc-du-lieu-va-file-io.md`
- `tai-lieu/03-thiet-ke/thiet-ke-lop-va-doi-tuong.md`
- `tai-lieu/03-thiet-ke/thiet-ke-api-rest.md`
- `tai-lieu/03-thiet-ke/thiet-ke-validator.md`
- `kiem-thu/bao-cao-kiem-thu.md`
- `kiem-thu/bao-cao-kiem-thu-tich-hop.md`
- `tai-lieu/07-van-hanh/huong-dan-chay-backend.md`
- `tai-lieu/07-van-hanh/huong-dan-chay-frontend.md`
- `tai-lieu/08-bao-cao-va-demo/kich-ban-du-lieu-demo.md`
- `tai-lieu/08-bao-cao-va-demo/kich-ban-demo-he-thong.md`
- `tai-lieu/08-bao-cao-va-demo/cau-hoi-bao-ve.md`

## Giới hạn hiện tại

- JSON File IO phù hợp demo/đồ án, không có transaction hoặc xử lý concurrency như database.
- Auth là demo identification, không phải xác thực bảo mật.
- Notifications chỉ là state local ở frontend.
- Chưa có portal quản trị hoặc giảng viên.
- Chưa có phân quyền production.

Hướng phát triển sau đồ án: database, transaction, Spring Security, phân quyền role, notification backend, portal quản trị/giảng viên và kiểm thử mở rộng.