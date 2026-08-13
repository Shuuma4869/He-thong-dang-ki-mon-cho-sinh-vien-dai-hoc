# Kết quả kiểm thử

Kết quả backend test gần nhất:

```text
Tests run: 99
Failures: 0
Errors: 0
Skipped: 0
```

Backend package: pass.

Frontend:

- `npm run typecheck`: pass.
- `npm run build`: pass khi chạy ngoài sandbox Windows. Nếu sandbox chặn Vite/esbuild bằng `spawn EPERM`, chạy lại ngoài sandbox.
- `scripts\kiem-tra-du-an.bat`: pass khi chạy ngoài sandbox.

Không ghi phần trăm coverage vì dự án chưa cấu hình đo coverage.
