# Cách chạy test

Chạy toàn bộ backend test:

```powershell
cd backend
.\mvnw.cmd clean test
```

Chạy package backend:

```powershell
cd backend
.\mvnw.cmd clean package
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

