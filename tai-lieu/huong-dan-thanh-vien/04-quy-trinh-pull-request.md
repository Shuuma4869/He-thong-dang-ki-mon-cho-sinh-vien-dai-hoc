# Quy trình Pull Request

Tài liệu này dùng chung cho cả ba thành viên. Mỗi thành viên chỉ push feature branch của mình và tạo Pull Request vào `develop`.

## 1. Trước khi push

Kiểm tra branch:

```powershell
git branch --show-current
```

Branch phải có dạng:

```text
feature/...
```

Kiểm tra thay đổi:

```powershell
git status
git diff --check
```

Kiểm tra phạm vi file so với `develop`:

```powershell
git fetch origin
git diff --name-status origin/develop...HEAD
```

Danh sách này chỉ nên có file thuộc feature của bạn. Nếu có file lạ, không push và báo trưởng nhóm.

Chạy kiểm tra:

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

Không commit:

- `node_modules/`
- `dist/`
- `target/`
- `.env.local`
- `*.log`
- file IDE
- file tạm
- ảnh demo chưa được nhóm duyệt

## 2. Kiểm tra commit author

```powershell
git fetch origin
git log origin/develop..HEAD --format="%h | %an | %ae | %s"
```

Lệnh này chỉ xem các commit mà feature branch hiện tại thêm vào so với `develop`. Commit của bạn phải mang tên và email GitHub của bạn. Nếu sai, báo trưởng nhóm trước khi push.

Không tự rewrite lịch sử sau khi đã tạo Pull Request nếu chưa được hướng dẫn. Không tự rebase hoặc merge `develop` vào feature branch sau khi Pull Request đã mở nếu trưởng nhóm chưa hướng dẫn.

## 3. Push feature branch

Ví dụ:

```powershell
git push -u origin feature/student-auth-profile
git push -u origin feature/course-lecturer
git push -u origin feature/registration-validator
git push -u origin feature/timetable
```

Không chạy:

```powershell
git push origin develop
git push origin main
git push --force
git push --force-with-lease
```

## 4. Tạo Pull Request

Trên GitHub:

- Base: `develop`
- Compare: feature branch của bạn

Mẫu nội dung Pull Request:

```markdown
## Phần đã làm

## API liên quan

## File chính đã thay đổi

## Test đã chạy

## Kết quả

## File shared có sửa

## Vấn đề còn lại

## Checklist

- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Không commit file build
- [ ] Không commit .env.local
- [ ] Không sửa ngoài phạm vi feature
```

## 5. Sau khi tạo Pull Request

- Không tự merge.
- Không tiếp tục sửa trực tiếp `develop`.
- Chờ trưởng nhóm review.

Nếu trưởng nhóm yêu cầu chỉnh:

```text
sửa trên cùng feature branch
-> commit thêm
-> push lại feature branch
-> Pull Request tự cập nhật
```

## 6. Khi nào cần hỏi trưởng nhóm

Hỏi trước khi làm nếu cần:

- đổi API contract;
- đổi JSON schema;
- sửa shared utility;
- thêm dependency;
- sửa file ngoài phạm vi feature;
- chỉnh dữ liệu demo trong `data/`;
- xử lý conflict lớn.
