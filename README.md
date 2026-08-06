# Hệ thống đăng ký môn học

Đồ án cuối kỳ OOP nhóm 2 - Đại học Phenikaa.

Đây là starter project cho hệ thống đăng ký môn học theo cấu trúc monorepo. Frontend đã có giao diện React chạy bằng mock data. Backend hiện là Spring Boot skeleton để nhóm tiếp tục phát triển model, service, validator, repository JSON File IO và REST API ở các phase sau.

Project chưa production-ready.

## Trạng thái hiện tại

- Frontend: đã có UI đăng nhập demo, dashboard, danh sách môn học, môn đã đăng ký, thời khóa biểu, thông báo và hồ sơ sinh viên.
- Backend: skeleton compile được, có Spring context test tối thiểu.
- File IO: mới ở mức starter/skeleton, chưa triển khai đầy đủ.
- REST API: chưa hoàn thiện và chưa kết nối frontend.
- Database/JPA/Hibernate/Spring Security/JWT: chưa sử dụng trong starter này.

## Công nghệ

### Frontend

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- lucide-react
- npm

### Backend

- Java 21
- Spring Boot 3.3.5
- Maven Wrapper 3.3.4, tải Maven 3.9.9
- JSON File IO định hướng cho phase sau
- JUnit 5
- Mockito, thông qua `spring-boot-starter-test`

## Yêu cầu môi trường

- Git
- Node.js 20 trở lên
- npm 10 trở lên
- JDK 21

Thành viên khác không bắt buộc cài Maven hệ thống vì project đã có Maven Wrapper trong `backend/`.

Kiểm tra nhanh:

```powershell
node -v
npm -v
java -version
javac -version
```

## Clone dự án

```powershell
cd D:\Projects
git clone <URL_REPOSITORY_MOI> he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
```

Nên clone vào thư mục không dấu tiếng Việt, ví dụ `D:\Projects\he-thong-dang-ky-mon-hoc`, để tránh lỗi classpath Maven/Spring Boot trên Windows.

Không cần tạo file secret để build starter.

## Cấu hình môi trường

Root hiện chưa có biến môi trường bắt buộc. File mẫu nằm ở:

```text
.env.example
```

Frontend có file mẫu riêng:

```text
frontend/.env.example
```

Nếu cần cấu hình frontend local:

```powershell
cd frontend
copy .env.example .env.local
```

Không commit `.env`, `.env.local` hoặc secret thật lên GitHub.

## Chạy frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite mặc định chạy tại:

```text
http://localhost:3000
```

Kiểm tra frontend:

```powershell
cd frontend
npm run typecheck
npm run build
```

## Chạy backend

Từ root repository:

```powershell
scripts\chay-backend.bat
```

Kiểm tra backend:

```powershell
backend\mvnw.cmd clean test
backend\mvnw.cmd clean package
```

Backend dự kiến chạy tại:

```text
http://localhost:8080
```

Root `/` có thể trả 404 trong starter vì API thật chưa được triển khai.

Nếu chạy trực tiếp `backend\mvnw.cmd spring-boot:run` trong một đường dẫn Windows có dấu tiếng Việt và gặp lỗi classpath, hãy dùng `scripts\chay-backend.bat`. Script này tự map project sang một drive-letter tạm thời rồi gỡ ra khi dừng server.

## Chạy toàn bộ kiểm tra

```powershell
scripts\kiem-tra-du-an.bat
```

Script này chạy frontend typecheck, frontend build, backend test và backend package. Script dừng ngay khi có bước lỗi.

## Cấu trúc thư mục

```text
.
+-- frontend/          # React + TypeScript + Vite
+-- backend/           # Spring Boot starter
+-- data/              # JSON data starter
+-- tai-lieu/          # Tài liệu phân tích, thiết kế, quy trình, vận hành
+-- thiet-ke/          # Tài nguyên thiết kế và ghi chú asset
+-- ho-so-nop-bai/     # Hồ sơ nộp bài
+-- scripts/           # Script hỗ trợ chạy/kiểm tra
+-- .github/           # Issue template và pull request template
+-- .env.example       # Env template cấp root
+-- .gitattributes     # Quy tắc line ending
+-- .editorconfig      # Quy tắc editor
+-- AGENTS.md          # Hướng dẫn làm việc với Codex
+-- LICENSE
+-- pom.xml            # Maven aggregator để chạy wrapper từ root
+-- README.md
```

## Tài liệu liên quan

- `tai-lieu/00-bat-dau/muc-luc-tai-lieu.md`
- `tai-lieu/00-bat-dau/gioi-thieu-du-an.md`
- `tai-lieu/02-kien-truc/kien-truc-tong-the.md`
- `tai-lieu/04-quy-trinh-nhom/quy-trinh-git-github.md`
- `tai-lieu/07-van-hanh/huong-dan-chay-frontend.md`
- `tai-lieu/07-van-hanh/huong-dan-chay-backend.md`
- `tai-lieu/07-van-hanh/xu-ly-loi-thuong-gap.md`

## Tính năng đã có trong frontend mock

- Đăng nhập demo bằng mã sinh viên.
- Dashboard tổng quan.
- Tìm kiếm và lọc môn học.
- Xem chi tiết môn học.
- Đăng ký/hủy đăng ký ở mock state.
- Xem môn học đã đăng ký.
- Xem thời khóa biểu tuần.
- Xem và đánh dấu thông báo.
- Xem hồ sơ sinh viên.

## Phần chưa triển khai

- Business logic đăng ký môn học thật ở backend.
- JSON File IO hoàn chỉnh.
- REST API thật.
- Kết nối frontend với backend.
- Unit test nghiệp vụ.
- Phân quyền/xác thực thật.
- Trang quản trị/giảng viên.

## Quy trình Git cho nhóm

Không code trực tiếp trên `main`.

Quy trình đề xuất:

```powershell
git switch main
git pull
git switch -c feature/<ten-module>
```

Sau khi code:

```powershell
scripts\kiem-tra-du-an.bat
git status
git add .
git commit -m "feat(module): mo ta ngan gon"
git push -u origin feature/<ten-module>
```

Sau đó tạo Pull Request về `main`.

Trước khi mở Pull Request, cần kiểm tra:

- Không commit `.env.local`.
- Không commit `node_modules/`, `dist/`, `target/`.
- Không thêm secret.
- Không đổi API hoặc kiến trúc trái tài liệu nếu chưa thống nhất.
- Nếu sửa frontend, bổ sung ảnh giao diện trong Pull Request.
