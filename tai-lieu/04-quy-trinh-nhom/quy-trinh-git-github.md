# Quy trình Git/GitHub

Không code trực tiếp trên `main`.

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
