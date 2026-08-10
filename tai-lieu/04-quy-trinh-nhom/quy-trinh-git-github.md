# Quy trình Git/GitHub

Không code trực tiếp trên `main`.

## Clone repository

```powershell
mkdir projects
cd projects
git clone https://github.com/Shuuma4869/He-thong-dang-ki-mon-cho-sinh-vien-dai-hoc.git he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
git switch develop
git pull origin develop
```

Nên clone vào thư mục không dấu tiếng Việt, ví dụ `<thu-muc-lam-viec>\he-thong-dang-ky-mon-hoc`, để tránh lỗi classpath Maven/Spring Boot trên Windows.

Luồng đề xuất:

```powershell
git switch develop
git pull origin develop
git switch -c feature/<ten-module>
```

Sau khi hoàn thành:

```powershell
scripts\kiem-tra-du-an.bat
git add .
git commit -m "feat(module): mo ta ngan gon"
git push -u origin feature/<ten-module>
```

Tạo Pull Request về `main` và chờ review.

Branch tham chiếu hoàn chỉnh của trưởng nhóm chỉ dùng local, không push lên GitHub.
