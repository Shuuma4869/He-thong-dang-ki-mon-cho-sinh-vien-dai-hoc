# Hệ thống đăng ký môn học

Dự án BTL cuối kỳ OOP nhóm 2 lớp CSE702051-1-1-26(N01) - Đại học Phenikaa.

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
+-- .github/                         # Cấu hình và biểu mẫu GitHub
+-- backend/                         # Ứng dụng Spring Boot
|   +-- src/main/java/...             # API, service, validator, repository, model, DTO
|   +-- src/main/resources/           # Cấu hình backend
|   +-- src/test/java/...             # Unit test, repository test, controller test
|   +-- src/test/resources/           # Cấu hình test
|   +-- mvnw, mvnw.cmd                # Maven Wrapper
|   `-- pom.xml
+-- frontend/                        # Ứng dụng React + TypeScript + Vite
|   +-- public/assets/                # Logo, ảnh minh họa và avatar
|   +-- src/app/                      # Điểm khởi tạo và định tuyến
|   +-- src/features/                 # Các chức năng giao diện theo nghiệp vụ
|   +-- src/shared/                   # API client, component và hằng số dùng chung
|   +-- package.json
|   `-- vite.config.ts
+-- data/                            # Dữ liệu JSON: sinh viên, giảng viên, học phần, đăng ký
+-- ho-so-nop-bai/                   # Thành phần bàn giao của bản nộp
|   +-- anh-demo/                     # Ảnh chụp màn hình minh chứng
|   +-- bao-cao/                      # Báo cáo Word
|   +-- slide/                        # Slide trình bày
|   +-- flowchart/, so-do/, use-case/ # Lưu đồ, sơ đồ và use case (Markdown/Mermaid)
|   +-- workflow/                     # Luồng xử lý chính
|   `-- minh-chung-kiem-thu/          # Kết quả kiểm thử và dataset demo
+-- kiem-thu/                        # Ma trận test, chiến lược và báo cáo kiểm thử
+-- scripts/                         # Script chạy backend, frontend và kiểm tra dự án
+-- tai-lieu/                        # Yêu cầu, kiến trúc, thiết kế, vận hành và hướng dẫn
+-- .env.example                     # Biến môi trường mẫu cấp root
+-- .gitignore
+-- pom.xml                          # Maven aggregator của repository
`-- README.md                        # Tài liệu bắt đầu và mô tả bản nộp
```

Các tệp sinh ra khi chạy dự án như `backend/target/` và `frontend/dist/` không thuộc bản nộp, nên không có trong cây thư mục trên.

## Cài đặt và chạy dự án

### 1. Chuẩn bị môi trường

Dự án hỗ trợ Windows 10/11 qua các script `.bat`. Cài các công cụ sau và mở một terminal mới sau khi cài để PATH được cập nhật:

- Git.
- JDK 21 (không phải JRE). `java -version` và `javac -version` phải hiển thị phiên bản `21`.
- Node.js 20 trở lên, kèm npm 10 trở lên.
- Internet cho lần cài đầu tiên: `npm ci` tải package frontend, Maven Wrapper tải Maven/dependency backend.

Không cần cài Maven riêng vì repository đã có Maven Wrapper tại `backend/mvnw.cmd`.

Kiểm tra môi trường trong PowerShell hoặc Command Prompt:

```powershell
git --version
java -version
javac -version
node -v
npm -v
```

### 2. Clone và cài dependency

Clone vào một đường dẫn ngắn, không dấu tiếng Việt để giảm rủi ro classpath trên Windows:

```powershell
mkdir C:\projects
cd C:\projects
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
```

Cài đúng phiên bản package frontend đã được khóa trong `package-lock.json`, rồi kiểm tra Maven Wrapper nhận đúng JDK 21:

```powershell
cd frontend
npm ci
cd ..
backend\mvnw.cmd -v
```

Không cần tạo `.env` hoặc `.env.local` để chạy mặc định. Frontend dùng API `http://localhost:8080/api`; script tổng tự đổi sang port `18080` khi `8080` đã bị chiếm.

### 3. Chạy toàn bộ bằng script

Từ thư mục gốc repository, chạy:

```powershell
.\scripts\chay-du-an.bat
```

Script tự cài `node_modules` nếu thiếu, chạy typecheck/build frontend, package backend, mở hai cửa sổ backend/frontend và mở trình duyệt tại `http://localhost:3000`.

- Frontend: `http://localhost:3000`
- Backend mặc định: `http://localhost:8080`
- API mặc định: `http://localhost:8080/api`
- Khi port `8080` bận: backend dùng `http://localhost:18080` và frontend tự nhận đúng API base.

Không đóng hai cửa sổ Backend/Frontend do script mở ra trong lúc đang demo. Dừng từng phần bằng `Ctrl+C` trong cửa sổ tương ứng.

### 4. Chạy từng phần

Mở hai terminal tại thư mục gốc repository.

Terminal 1 - backend:

```powershell
.\scripts\chay-backend.bat
```

Script tự package JAR nếu `backend/target/` chưa tồn tại. Ghi lại port in trên màn hình: mặc định là `8080`, hoặc `18080` nếu port mặc định bận.

Terminal 2 - frontend:

```powershell
.\scripts\chay-frontend.bat 8080
```

Nếu backend đang chạy ở `18080`, thay lệnh terminal 2 bằng:

```powershell
.\scripts\chay-frontend.bat 18080
```

`chay-frontend.bat` cũng tự chạy `npm ci` khi chưa có `frontend/node_modules`.

### 5. Kiểm tra trước khi sử dụng hoặc nộp bài

Chạy toàn bộ kiểm tra từ thư mục gốc:

```powershell
.\scripts\kiem-tra-du-an.bat
```

Script tự cài dependency frontend nếu cần, sau đó chạy `npm run typecheck`, `npm run build`, `backend\mvnw.cmd clean test` và `backend\mvnw.cmd clean package`.

Các thư mục `frontend/node_modules/`, `frontend/dist/` và `backend/target/` là tệp sinh ra khi cài/build, đã được `.gitignore` loại trừ và có thể xóa rồi tạo lại bằng các lệnh trên.

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

Kết quả kiểm thử của bản nộp:

- Backend: 99 tests pass, 0 failures, 0 errors, 0 skipped.
- Backend package: pass.
- Frontend typecheck: pass.
- Frontend build: pass.
- Kiểm thử tích hợp trình duyệt: pass.

## Giới hạn hiện tại

- JSON File IO phù hợp demo/đồ án, không có transaction hoặc xử lý concurrency như database.
- Auth là demo identification, không phải xác thực bảo mật.
- Notifications chỉ là state local ở frontend.
- Chưa có portal quản trị hoặc giảng viên.
- Chưa có phân quyền production.

Hướng phát triển sau đồ án: database, transaction, Spring Security, phân quyền role, notification backend, portal quản trị/giảng viên và kiểm thử mở rộng.
