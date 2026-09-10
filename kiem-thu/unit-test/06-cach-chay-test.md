# Cách chạy test

Chạy toàn bộ backend test:

Các lệnh Maven trong tài liệu dùng Git Bash. Trong PowerShell, đổi tiền tố `./` thành `.\`.

```bash
cd backend
./mvnw.cmd test
```

Chạy integration test và build backend:

```bash
cd backend
./mvnw.cmd verify
```

Chạy một test class:

```bash
cd backend
./mvnw.cmd -Dtest=StudentServiceTest test
```

Chạy frontend check:

```powershell
cd frontend
npm ci
npm run typecheck
npm run build
npm run dev
```

`@WebMvcTest` thuộc nhóm unit/controller slice vì service được mock. Integration test `*IT.java` chỉ chạy ở lệnh `verify`.
