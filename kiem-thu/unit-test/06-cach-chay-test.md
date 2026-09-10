# Cách chạy test

Chạy toàn bộ backend test:

```powershell
cd backend
.\mvnw.cmd test
```

Chạy integration test và build backend:

```powershell
cd backend
.\mvnw.cmd verify
```

Chạy một test class:

```powershell
cd backend
.\mvnw.cmd -Dtest=StudentServiceTest test
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
