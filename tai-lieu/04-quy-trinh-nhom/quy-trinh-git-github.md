# Quy trình Git/GitHub

Không code trực tiếp trên `main`.

## Clone repository

```powershell
cd D:\Projects
git clone <URL_REPOSITORY_MOI> he-thong-dang-ky-mon-hoc
cd he-thong-dang-ky-mon-hoc
git switch develop
git pull origin develop
```

Nên clone vào đường dẫn không dấu tiếng Việt, ví dụ `D:\Projects\he-thong-dang-ky-mon-hoc`, để tránh lỗi classpath Maven/Spring Boot trên Windows.

Luồng đề xuất:

```powershell
git switch main
git pull
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
