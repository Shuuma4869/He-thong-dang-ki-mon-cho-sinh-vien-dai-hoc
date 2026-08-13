# Kết quả frontend check

Lệnh chạy:

```powershell
cd frontend
npm run typecheck
npm run build
```

Kết quả gần nhất:

- `npm run typecheck`: pass.
- `npm run build`: pass khi chạy ngoài sandbox Windows.
- `scripts\kiem-tra-du-an.bat`: pass khi chạy ngoài sandbox; trong sandbox có thể dừng ở Vite/esbuild với lỗi `spawn EPERM`.
