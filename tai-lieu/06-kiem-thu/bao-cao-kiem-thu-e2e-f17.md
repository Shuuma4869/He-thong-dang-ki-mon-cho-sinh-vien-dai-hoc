# Bao cao kiem thu E2E F17

## Pham vi

F17 kiem thu end-to-end tren trinh duyet that cho Full Solution local cua he thong dang ky mon hoc.

Branch kiem thu: `reference/full-solution`.

Khong push branch reference trong phase nay.

## Moi truong

Backend:

- URL: `http://localhost:8080`
- API base: `http://localhost:8080/api`
- Data source: `data/*.json`
- Khong dung database, JPA, Hibernate, JWT hoac Spring Security.

Frontend:

- URL: `http://localhost:3000`
- React + TypeScript + Vite
- API runtime mac dinh: `http://localhost:8080/api`

## Bao ve du lieu

Truoc khi chay thao tac ghi, da backup cac file:

- `data/students.json`
- `data/lecturers.json`
- `data/courses.json`
- `data/registrations.json`

Sau kiem thu, `data/*.json` da duoc restore ve baseline.

Baseline sau restore:

- `courses.json`: 10 hoc phan.
- `registrations.json`: 2 registration.
- SV001: `OOP101`, `WEB201`, tong 6 tin chi.
- DBS202: `currentCapacity = 28`.

## Cac loi da sua trong F17

1. Form login frontend hien thi tai khoan demo `21010045`, trong khi backend demo data dung `SV001`.
   Ket qua sua: default input, placeholder va hint demo doi ve `SV001`.

2. Frontend mac dinh goi `/api` neu khong co `.env.local`, gay loi khi chay Vite khong cau hinh proxy.
   Ket qua sua: default API base chuyen sang `http://localhost:8080/api`, van cho override bang `VITE_API_BASE_URL`.

3. Backend CORS chi cho `http://localhost:3000`.
   Ket qua sua: them `http://127.0.0.1:3000` vao default CORS de test local linh hoat hon.

## Ket qua browser E2E

| Nhom | Scenario | Ket qua |
|---|---|---|
| Auth | Login demo SV001 voi mat khau bat ky | PASS |
| Auth | Login SV999 | PASS, hien thi `Khong tim thay sinh vien: SV999` |
| Auth | Logout | PASS, quay ve man login |
| Dashboard | SV001 hien thi 2 mon, 6/10 tin chi baseline | PASS |
| Course | Danh sach mon hien thi 10/10 hoc phan | PASS |
| Course | Search `DBS202` | PASS, chi hien DBS202 |
| Course | Search keyword khong ton tai | PASS, hien empty state |
| Registration | Dang ky DBS202 cho SV001 | PASS, UI cap nhat 3 mon va JSON tang DBS202 len 29 |
| Registration | Duplicate DBS202 sau khi da dang ky | PASS, API tra `DUPLICATE_REGISTRATION`, khong mutate JSON |
| Registration | AI301 da day | PASS, UI disable nut dang ky; API tra `COURSE_FULL` |
| Registration | NET203 sau khi SV001 co 9/10 tin chi | PASS, UI canh bao trung lich, backend tu choi do `CREDIT_LIMIT_EXCEEDED`, khong mutate JSON |
| Registration | Huy DBS202 | PASS, UI ve 2 mon/6 tin chi va JSON DBS202 ve 28 |
| Persistence | Restart backend sau khi dang ky DBS202 | PASS, backend doc lai JSON va van co DBS202 |
| Timetable | DBS202 xuat hien trong thoi khoa bieu sau khi dang ky | PASS |
| Profile | Ho so SV001 hien dung id, ten, lop | PASS |
| Notifications | Thong bao demo/local render dung va khong dong bo backend | PASS |
| Multi-user | SV002 khong co mon dang ky, khong lo du lieu SV001 | PASS |
| Responsive | Desktop va mobile render khong crash | PASS |

## API error contract da xac nhan

| API | Ket qua |
|---|---|
| `POST /api/students/SV001/registrations` voi `DBS202` khi da dang ky | `400 DUPLICATE_REGISTRATION` |
| `POST /api/students/SV002/registrations` voi `AI301` | `400 COURSE_FULL` |
| `GET /api/students/SV999/registrations` | `400 STUDENT_NOT_FOUND` |

Tat ca negative case tren khong lam thay doi `courses.json` hoac `registrations.json`.

## Screenshot chung cu

- `ho-so-nop-bai/anh-demo/f17-desktop-sv002-registered-empty.png`
- `ho-so-nop-bai/anh-demo/f17-mobile-course-list.png`

## Ghi chu ky thuat

Browser automation sandbox khong expose truc tiep `localStorage`, `sessionStorage` va `performance`, nen storage/network duoc audit bang source va hanh vi:

- `frontend/src/app/App.tsx` chi luu `courseRegistration.studentId`.
- `frontend/src/shared/api/httpClient.ts` khong gan `Authorization`, `Bearer`, token hoac password vao header.
- Frontend khong doc truc tiep `data/*.json`; data di qua REST API backend.

## Ket luan

F17 PASS sau khi sua cac loi cau hinh/demo account. Full Solution local co the chay demo frontend-backend that voi JSON File IO, registration mutation/persistence va cac validator chinh.
