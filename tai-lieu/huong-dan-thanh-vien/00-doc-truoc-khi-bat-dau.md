# Hướng dẫn chung trước khi làm

Tài liệu này dùng cho các thành viên bắt đầu triển khai phần việc của mình trên nhánh riêng. Bạn làm lần lượt các bước dưới đây, chạy kiểm tra trước khi commit và chỉ tạo Pull Request khi phần của mình đã ổn.

## 1. Cách nhóm làm việc

Nhóm dùng ba loại nhánh:

- `main`: bản ổn định.
- `develop`: nhánh tích hợp để gom code của các thành viên.
- `feature/*`: nhánh cá nhân cho từng phần chức năng.

Không commit trực tiếp lên `main` hoặc `develop`. Mọi code của thành viên đi theo luồng:

```text
feature branch
-> Pull Request
-> develop
```

## 2. Thứ tự triển khai

Các phần làm theo thứ tự sau:

```text
Develop nền
   |
   v
Student/Auth/Profile
   |
   v
Course/Lecturer/Schedule
   |
   v
Registration/Validators
   |
   v
Timetable
   |
   v
Develop hoàn chỉnh
```

Thứ tự làm việc của nhóm:

1. Thành viên 1 hoàn thiện Student/Auth/Profile.
2. Trưởng nhóm review và merge vào `develop`.
3. Thành viên 2 cập nhật `develop` mới nhất.
4. Thành viên 2 hoàn thiện Course/Lecturer/Schedule trên branch `feature/course-lecturer`.
5. Trưởng nhóm review và merge vào `develop`.
6. Thành viên 3 cập nhật `develop` mới nhất.
7. Thành viên 3 hoàn thiện Registration/Validators.
8. Trưởng nhóm review và merge vào `develop`.
9. Thành viên 2 cập nhật `develop` mới nhất.
10. Thành viên 2 hoàn thiện Timetable trên branch mới `feature/timetable`.
11. Trưởng nhóm review và merge vào `develop`.

Registration làm sau vì cần Student và Course. Timetable cần Registration và Course nên được hoàn thiện sau Registration. Khi branch `feature/course-lecturer` đã merge, không dùng lại branch đó cho Timetable; hãy tạo branch mới.

## 3. Clone project

```powershell
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git
cd He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc
git switch develop
git pull --ff-only origin develop
```

Nên clone vào thư mục không dấu tiếng Việt để giảm lỗi đường dẫn khi chạy Maven hoặc Node trên Windows.

## 4. Cấu hình Git identity

Kiểm tra tên và email đang dùng cho commit:

```powershell
git config user.name
git config user.email
```

Nếu cần đặt riêng cho repository này:

```powershell
git config user.name "Ten thanh vien"
git config user.email "email-cua-thanh-vien"
```

Commit phải dùng tên và email GitHub của chính thành viên. Không commit bằng tài khoản của trưởng nhóm và không nhờ người khác commit hộ phần mình làm.

## 5. Kiểm tra project ban đầu

Sau khi clone và checkout `develop`, chạy kiểm tra một lần để biết máy đã sẵn sàng.

Backend:

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..
```

Frontend:

```powershell
cd frontend
npm ci
npm run typecheck
npm run build
cd ..
```

Nếu dùng script kiểm tra chung:

```powershell
scripts\kiem-tra-du-an.bat
```

## 6. Nguyên tắc code

- Không sửa feature của người khác.
- Không đổi API tùy ý.
- Không đổi cấu trúc JSON tùy ý.
- Không thêm database.
- Không thêm Spring Security hoặc JWT.
- Không thêm dependency nếu chưa báo trưởng nhóm.
- Không hard-code mã sinh viên.
- Không hard-code `localhost` ngoài shared config.
- Frontend không đọc trực tiếp `data/*.json`.
- Controller không đọc file trực tiếp.
- Service không tự mở file JSON.
- Test không được sửa root demo data trong `data/`.

## 7. Quy định comment

Không comment từng dòng. Chỉ viết comment khi logic khó hiểu hoặc cần giải thích lý do.

Không viết comment kiểu:

```java
// lấy dữ liệu
// kiểm tra
// trả response
```

Tên class, method và biến rõ ràng thì không cần comment thêm.

## 8. Trước mỗi commit

Chạy:

```powershell
git status
git diff
git diff --check
```

Sau đó stage theo file hoặc folder cụ thể. Không dùng `git add .` một cách máy móc, vì dễ đưa nhầm file build, file môi trường hoặc ảnh demo chưa duyệt vào commit.

## 9. Tài liệu theo từng thành viên

- [Thành viên 1 - Student, đăng nhập và hồ sơ sinh viên](01-thanh-vien-1-student-auth-profile.md)
- [Thành viên 2 - Course, Lecturer và Timetable](02-thanh-vien-2-course-lecturer-timetable.md)
- [Thành viên 3 - Registration và Validator](03-thanh-vien-3-registration-validator.md)
- [Quy trình Pull Request](04-quy-trinh-pull-request.md)
