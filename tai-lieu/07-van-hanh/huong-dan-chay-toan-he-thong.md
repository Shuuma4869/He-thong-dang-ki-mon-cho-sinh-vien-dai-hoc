# Hướng dẫn chạy toàn hệ thống

Cách nhanh nhất:

```powershell
scripts\chay-du-an.bat
```

Script sẽ:

1. Kiểm tra/cài frontend dependency nếu thiếu.
2. Chạy `npm run typecheck`.
3. Chạy `npm run build`.
4. Chạy `backend\mvnw.cmd clean package`.
5. Mở backend.
6. Mở frontend.
7. Mở trình duyệt tại `http://localhost:3000`.

Không đóng cửa sổ backend/frontend khi đang demo.

