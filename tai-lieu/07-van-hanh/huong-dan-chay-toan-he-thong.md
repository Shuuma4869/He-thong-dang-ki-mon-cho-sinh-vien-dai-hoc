# Hướng dẫn chạy toàn hệ thống

Cách nhanh nhất:

```powershell
scripts\chay-du-an.bat
```

Script sẽ:

1. Kiểm tra Java, Node.js, npm, `frontend/package.json` và `backend/mvnw.cmd`.
2. Kiểm tra/cài frontend dependency nếu thiếu.
3. Chạy `npm run typecheck`.
4. Chạy `npm run build`.
5. Chạy `backend\mvnw.cmd clean package`.
6. Mở backend.
7. Mở frontend.
8. Mở trình duyệt tại `http://localhost:3000`.

Backend mặc định chạy tại `http://localhost:8080`. Nếu port `8080` đang bị ứng dụng khác chiếm, script sẽ tự chạy backend ở `http://localhost:18080` và truyền API base tương ứng cho frontend:

```text
VITE_API_BASE_URL=http://localhost:18080/api
```

Không đóng cửa sổ backend/frontend khi đang demo.
