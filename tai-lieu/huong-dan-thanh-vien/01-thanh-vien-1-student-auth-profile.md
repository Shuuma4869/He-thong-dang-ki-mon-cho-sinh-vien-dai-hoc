# THANH VIEN 1 - STUDENT / AUTH / PROFILE

Repo root: `D:\OOP\Hệ thống đăng kí môn học`

Tai lieu nay duoc viet lai tu dau sau audit Git ngay `14/08/2026`. Nguon chinh la commit history tu `2026-08-14 00:00 +07` den `2026-08-15 00:00 +07` va source hien tai tren branch `reference/full-solution`.

## 1. Pham vi phu trach hien tai

Thanh vien 1 phu trach nhom Student / Auth / Profile:

- Doc thong tin sinh vien tu backend.
- Dang nhap demo bang ma sinh vien.
- Hien thi profile sinh vien tren frontend.
- Dam bao UI login/profile dung du lieu backend tra ve.
- Chay va cap nhat test lien quan den `StudentService`, `AuthService`, `StudentController`, `AuthController`.

Thanh vien 1 khong so huu `data/students.json` theo nghia doc quyen vi day la data shared, nhung phai hieu file nay vi Student/Auth/Profile phu thuoc truc tiep vao no.

## 2. Nhung thay doi cua du an trong ngay 14/08/2026 lien quan den Thanh vien 1

| File | Trang thai | Noi dung thay doi hom nay | Vai tro |
| ---- | ---------- | ------------------------- | ------- |
| `data/students.json` | M | Sinh vien demo chinh doi tu `SV001 / Nguyen Minh An / CNTT-K16A / 10 tin chi` sang `23010690 / Nguyen Trong Tuan / CNTT7 - K17 / 18 tin chi`. | DATA RELATED |
| `frontend/src/features/auth/pages/LoginPage.tsx` | M | Default demo student id, placeholder va ghi chu tai khoan demo doi sang `23010690`. | OWNED |
| `backend/src/test/java/vn/edu/phenikaa/courseregistration/data/DemoDataIntegrityTest.java` | A/M | Them test khoa dataset demo; sau do cap nhat assertion className cua sinh vien `23010690` thanh `CNTT7 - K17`. | TEST_SHARED |
| `scripts/chay-backend.bat` | M | Health check backend doi endpoint demo tu `SV001` sang `23010690`; backend chay bang JAR sau package. | READ ONLY / SHARED |
| `scripts/chay-du-an.bat` | M | Health check backend doi sang `23010690`; script kiem tra Java/Node/npm, build frontend/backend va truyen backend port cho frontend. | READ ONLY / SHARED |
| `README.md` | M | Tai khoan demo doi sang `23010690`; bo sung baseline dang ky 15/18 tin chi. | DOCS |
| `tai-lieu/03-thiet-ke/thiet-ke-api-rest.md` | M | Vi du request/response Auth/Student cap nhat `studentId`, `className`; bo sung ghi chu dataset 40 hoc phan. | DOCS |
| `tai-lieu/05-api-va-du-lieu/schema-students.md` | M | Schema/example student cap nhat `23010690`, `Nguyen Trong Tuan`, `CNTT7 - K17`. | DOCS |
| `tai-lieu/02-kien-truc/schema-json.md` | M | Vi du JSON student dong bo voi student demo hien tai. | DOCS |
| `tai-lieu/05-api-va-du-lieu/du-lieu-demo.md` | M | Du lieu demo doi ma sinh vien sang `23010690` va baseline dang ky 15 tin chi. | DOCS |
| `kiem-thu/unit-test/01-student-auth-profile.md` | M | Cap nhat ket qua/test note lien quan tai khoan demo. | DOCS |
| `ho-so-nop-bai/so-do/sequence-login.md` | M | Sequence login dong bo ma sinh vien demo. | DOCS |
| `ho-so-nop-bai/so-do/sequence-login.mmd` | M | Mermaid sequence login dong bo ma sinh vien demo. | DOCS |
| `ho-so-nop-bai/workflow/dashboard-data-flow.md` | A/M | Tao workflow Dashboard va cap nhat lop hien thi cua student demo thanh `CNTT7 - K17`. | DOCS / INTEGRATION |

## 3. File OWNED

Thanh vien 1 duoc sua cac file sau khi lam Student/Auth/Profile:

| File | Chuc nang | Can lam gi |
| ---- | --------- | ---------- |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java` | Lop cha abstract cho user | Chi them field chung neu can; khong dua logic Student/Lecturer rieng vao day. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java` | Model sinh vien | Giu mapping field khop `data/students.json`: `id`, `fullName`, `className`, `major`, `maxCredits`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java` | Contract repository Student | Neu them method phai cap nhat implementation va test. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonStudentRepository.java` | Doc `data/students.json` | Bat buoc dung `JsonFileUtils`, khong doc file truc tiep trong service/controller. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java` | Nghiep vu doc student | `findById`, `findAll`; nem `StudentNotFoundException` khi khong co student. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/AuthService.java` | Dang nhap demo | `login(LoginRequest)` chi kiem tra `studentId` ton tai, khong xu ly password/JWT. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/StudentController.java` | API student | Endpoint hien tai: `GET /api/students/{studentId}`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/AuthController.java` | API login | Endpoint hien tai: `POST /api/auth/login`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/LoginRequest.java` | Request login | Giu validation cho `studentId`. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/StudentResponse.java` | Response student | Khong bo field frontend dang dung. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/StudentMapper.java` | Map Student -> StudentResponse | Neu them field profile, cap nhat mapper va test. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java` | Loi student khong ton tai | Giu error code dung contract API. |
| `frontend/src/features/auth/api/authApi.ts` | Goi login API | Goi `API_ENDPOINTS.AUTH_LOGIN`, tra ve Student da map. |
| `frontend/src/features/auth/pages/LoginPage.tsx` | Trang dang nhap | Demo id hien tai la `23010690`; khong hard-code className trong UI. |
| `frontend/src/features/auth/types/auth.types.ts` | Type auth frontend | Dong bo voi response backend. |
| `frontend/src/features/profile/api/profileApi.ts` | Goi student API | Goi `API_ENDPOINTS.STUDENT_BY_ID(studentId)`. |
| `frontend/src/features/profile/pages/ProfilePage.tsx` | Trang ho so | Hien thi `student.className`, `student.major`, `student.maxCredits` tu state/API. |
| `frontend/src/features/profile/types/profile.types.ts` | Type profile frontend | Mapping `ApiStudent` -> `Student`. |

## 4. File READ ONLY

Thanh vien 1 can doc nhung khong tu y sua:

| File | Ly do |
| ---- | ----- |
| `data/students.json` | Data shared; moi thay doi anh huong Auth, Profile, Registration va Timetable. |
| `frontend/src/app/App.tsx` | Noi ghep state dang nhap, profile, course, registration; sua o day la integration. |
| `frontend/src/shared/api/httpClient.ts` | HTTP client shared, co timeout va fallback backend port. |
| `frontend/src/shared/constants/apiEndpoints.ts` | Danh sach endpoint dung chung. |
| `frontend/src/shared/constants/app.ts` | Cau hinh app/API base shared. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java` | Response success shared. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java` | Response error shared. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java` | Mapping loi toan he thong. |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Utility doc/ghi JSON duy nhat. |
| `scripts/chay-du-an.bat` | Script run/build chung cho ca nhom. |

## 5. File INTEGRATION ONLY

| File | Khi nao can dung |
| ---- | ---------------- |
| `frontend/src/shared/components/layout/Header.tsx` | Kiem tra class/name student hien o header sau login. |
| `frontend/src/features/dashboard/pages/DashboardPage.tsx` | Dashboard hien thong tin student va du lieu registration/timetable. |
| `ho-so-nop-bai/workflow/dashboard-data-flow.md` | Doc luong dashboard sau thay doi student demo. |

Neu can sua cac file integration, tao PR rieng va thong bao truong nhom.

## 6. Du lieu lien quan

Student demo hien tai trong `data/students.json`:

```text
id: 23010690
fullName: Nguyen Trong Tuan
className: CNTT7 - K17
major: Cong nghe thong tin
maxCredits: 18
```

Baseline dang ky cua student nay trong `data/registrations.json`: `OOP101`, `WEB201`, `DSA102`, `DBS202`, `SE204`, tong `15/18` tin chi.

## 7. Nhung gi Member 1 phai thuc hien

1. Kiem tra `data/students.json` co student `23010690`.
2. Kiem tra `AuthService.login(LoginRequest)` trim `studentId` va nem `StudentNotFoundException` neu khong ton tai.
3. Kiem tra `StudentController.findById` tra `ApiResponse<StudentResponse>`.
4. Kiem tra `LoginPage.tsx` chi default demo id `23010690`, khong hard-code `className`.
5. Kiem tra `ProfilePage.tsx` hien class/name/major/maxCredits tu object `student`.
6. Neu doi schema student, cap nhat `Student`, `StudentResponse`, `StudentMapper`, frontend profile types va test tuong ung.

## 8. Backend can kiem tra

Endpoint can dung:

```text
POST /api/auth/login
GET /api/students/{studentId}
```

Expected voi `23010690`:

```text
HTTP 200
success: true
data.studentId: 23010690
data.fullName: Nguyen Trong Tuan
data.className: CNTT7 - K17
```

## 9. Frontend can kiem tra

1. Mo `http://localhost:3000`.
2. Login page mac dinh hien ma sinh vien `23010690`.
3. Nhap password bat ky khong rong.
4. Sau login, header/profile/dashboard hien dung ten va lop tu API.
5. Khong co vong xoay dang xac thuc keo dai neu backend dang chay dung port.

## 10. Unit test can chay

Chay tu repo root:

```powershell
cd backend
.\mvnw.cmd -Dtest=AuthServiceTest,StudentServiceTest,AuthControllerTest,StudentControllerTest test
```

Expected result:

```text
BUILD SUCCESS
Failures: 0
Errors: 0
```

Khi sua data demo, chay them:

```powershell
cd backend
.\mvnw.cmd -Dtest=DemoDataIntegrityTest test
```

## 11. Runtime test

Chay toan he thong:

```powershell
scripts\chay-du-an.bat
```

Neu port `8080` ban, script se dung backend port `18080` va truyen `VITE_API_BASE_URL=http://localhost:18080/api` cho frontend.

## 12. File khong duoc dung

Khong tu y sua:

- `data/courses.json`
- `data/lecturers.json`
- `data/registrations.json`
- `frontend/src/features/courses/**`
- `frontend/src/features/registration/**`
- `frontend/src/features/timetable/**`
- `backend/src/main/java/vn/edu/phenikaa/courseregistration/validator/**`
- `scripts/**`

Neu thay can sua, ghi ro ly do trong PR va nhan owner lien quan review.

## 13. Git workflow

Branch lam viec de xuat:

```text
feature/student-auth-profile
```

Quy trinh:

```powershell
git status --short
git switch -c feature/student-auth-profile
cd backend
.\mvnw.cmd -Dtest=AuthServiceTest,StudentServiceTest,AuthControllerTest,StudentControllerTest test
cd ..\frontend
npm run typecheck
npm run build
```

Khong commit `node_modules`, `dist`, `target`, `.env.local`.

## 14. Definition of Done

Member 1 hoan thanh khi:

- Login voi `23010690` thanh cong.
- Profile hien `Nguyen Trong Tuan`, `CNTT7 - K17`, `Cong nghe thong tin`.
- API `/api/auth/login` va `/api/students/23010690` tra dung envelope.
- Test Student/Auth pass.
- Frontend typecheck/build pass.
- Khong sua file shared/data ngoai pham vi neu chua co review.
