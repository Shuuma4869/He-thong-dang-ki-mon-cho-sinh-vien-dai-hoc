# Thành viên 1 - Student, đăng nhập và hồ sơ sinh viên

## Moc nen Student/Auth/Profile da khoa

- Sinh vien demo chinh la `23010690`, ho ten Nguyen Trong Tuan, lop `CNTT7 - K17`, nganh Cong nghe thong tin, gioi han 18 tin chi.
- Auth demo chi kiem tra `studentId` ton tai, khong luu password, khong JWT, khong Spring Security.
- Profile va dashboard phai lay du lieu sinh vien qua Student API, khong hard-code ten sinh vien trong component.

Đọc trước:

- [Hướng dẫn chung](00-doc-truoc-khi-bat-dau.md)
- [Quy trình Pull Request](04-quy-trinh-pull-request.md)

## 1. Branch làm việc

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/student-auth-profile
git branch --show-current
```

Kết quả cần là:

```text
feature/student-auth-profile
```

## 2. Phạm vi

Bạn phụ trách nhóm nghiệp vụ:

- `User`
- `Student`
- `StudentRepository`
- `JsonStudentRepository`
- `StudentService`
- `StudentController`
- `StudentResponse`
- `StudentMapper`
- `StudentNotFoundException`
- `AuthService`
- `AuthController`
- `LoginRequest`
- frontend auth
- frontend profile

Không sửa Course, Timetable, Registration hoặc Validator.

## 3. File ownership

| File/Folder | Trách nhiệm | Được sửa |
|---|---|---|
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java` | Lớp cha chung | READ ONLY nếu đã có sẵn |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java` | Domain sinh viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java` | Contract repository sinh viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonStudentRepository.java` | Đọc/ghi sinh viên qua `JsonFileUtils` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java` | Nghiệp vụ đọc sinh viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/StudentController.java` | REST API sinh viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/StudentResponse.java` | DTO trả dữ liệu sinh viên | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/StudentMapper.java` | Map `Student` sang `StudentResponse` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java` | Lỗi `STUDENT_NOT_FOUND` | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/LoginRequest.java` | DTO request đăng nhập | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/AuthService.java` | Đăng nhập demo | OWNED |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/AuthController.java` | REST API đăng nhập | OWNED |
| `frontend/src/features/auth/api/**` | Gọi API đăng nhập | OWNED |
| `frontend/src/features/auth/types/**` | Type request/form đăng nhập | OWNED |
| `frontend/src/features/auth/pages/LoginPage.tsx` | Nối submit/loading/error | INTEGRATION ONLY |
| `frontend/src/features/profile/api/**` | Gọi API hồ sơ | OWNED |
| `frontend/src/features/profile/types/**` | Type và mapper hồ sơ | OWNED |
| `frontend/src/features/profile/pages/ProfilePage.tsx` | Hiển thị dữ liệu Student thật | INTEGRATION ONLY |
| `frontend/public/assets/images/login-workspace-illustration.svg` | Ảnh trang đăng nhập | READ ONLY |
| `frontend/src/app/App.tsx` | Gắn current student, session, logout | INTEGRATION ONLY |
| `frontend/src/shared/constants/apiEndpoints.ts` | Thêm endpoint Auth/Student nếu thiếu | INTEGRATION ONLY |
| `frontend/src/shared/api/httpClient.ts` | HTTP envelope chung | READ ONLY |
| `frontend/src/shared/api/apiError.ts` | Lỗi API chung | READ ONLY, chỉ sửa khi có lỗi thật |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java` | Envelope API thành công | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java` | Envelope API lỗi | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java` | Xử lý lỗi chung | READ ONLY |
| `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` | Đọc/ghi JSON chung | READ ONLY |
| `data/*.json` | Demo seed | READ ONLY |

## 4. User và Student domain

`User` là abstract class, chỉ giữ thông tin chung:

```java
public abstract class User {
    private String id;
    private String fullName;
}
```

`Student` kế thừa `User` và có các field:

```java
public class Student extends User {
    private String className;
    private String major;
    private int maxCredits;
}
```

Yêu cầu:

- Field để `private`.
- Có constructor không tham số để Jackson đọc JSON.
- Có constructor đủ dữ liệu nếu cần dùng trong test.
- Có getter/setter cần thiết.
- Không thêm password vào `Student`.
- Không thêm token hoặc JWT.

## 5. Student repository

Contract cần giữ:

```java
public interface StudentRepository {
    Optional<Student> findById(String studentId);
    List<Student> findAll();
    void save(Student student);
}
```

`JsonStudentRepository` dùng `JsonFileUtils` để đọc/ghi file. Không đọc file trong controller hoặc service.

## 6. Student service

Chức năng chính:

- Tìm sinh viên theo mã.
- Trả danh sách sinh viên nếu cần.
- Nếu không tìm thấy sinh viên, ném lỗi nghiệp vụ có error code `STUDENT_NOT_FOUND`.

Luồng gợi ý:

```text
nhận studentId
-> gọi StudentRepository.findById
-> nếu có thì trả Student
-> nếu không có thì ném StudentNotFoundException
```

## 7. Student controller

API:

```text
GET /api/students/{studentId}
```

Response thành công nằm trong envelope:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "studentId": "23010690",
    "fullName": "...",
    "className": "...",
    "major": "...",
    "maxCredits": 18
  }
}
```

Không tạo controller profile riêng. Profile frontend dùng API Student.

## 8. Auth backend

API:

```text
POST /api/auth/login
```

Request:

```json
{
  "studentId": "23010690",
  "password": "..."
}
```

Quy định:

- `studentId` phải tồn tại.
- `password` chỉ để tương thích giao diện đăng nhập.
- Không lưu password.
- Không log password.
- Không dùng JWT.
- Không dùng Spring Security.

Nếu mã sinh viên không tồn tại, trả lỗi `STUDENT_NOT_FOUND`.

## 9. Frontend auth

Login UI đã có thiết kế. Không redesign login page.

Bạn chỉ nối behavior/API:

- `frontend/src/features/auth/api/authApi.ts`: gọi `POST /api/auth/login`.
- `frontend/src/features/auth/types/auth.types.ts`: giữ `studentId`, `password`, `rememberMe`.
- `frontend/src/features/auth/pages/LoginPage.tsx`: xử lý submit, loading, error.
- `frontend/src/app/App.tsx`: giữ current student, restore session, logout.

Với `LoginPage.tsx`, chỉ nối submit/loading/error. Không đổi layout, style, nội dung hình ảnh hoặc thiết kế tổng thể của trang đăng nhập.

Không lưu password vào `localStorage` hoặc `sessionStorage`. Nếu có remember me, chỉ lưu mã sinh viên.

## 10. Profile frontend

Profile dùng:

```text
GET /api/students/{studentId}
```

Các field frontend cần map:

| API field | Frontend field |
|---|---|
| `studentId` | `id` |
| `fullName` | `name` |
| `className` | `className` |
| `major` | `major` |
| `maxCredits` | `maxCredits` |

Các field mở rộng như email, phone, avatar nếu chưa có backend thì không tự bịa thành dữ liệu bắt buộc.

## 11. Trình tự thực hiện

Bước 1: kiểm tra branch và kéo `develop` mới nhất. Mục tiêu là bắt đầu từ nền chung sạch. Chạy `git branch --show-current` và `git status`; chưa commit ở bước này.

Bước 2: tạo branch `feature/student-auth-profile`. Mục tiêu là tách phần việc của bạn khỏi `develop`. Chạy `git branch --show-current`; chưa commit.

Bước 3: hoàn thiện `User.java` và `Student.java` nếu trên `develop` còn thiếu. Mục tiêu là domain Student có encapsulation, constructor và getter/setter cần thiết. Chạy test compile backend nếu có thay đổi domain. Chỉ commit khi domain compile được.

Bước 4: tạo hoặc sửa `StudentRepository.java` và `JsonStudentRepository.java`. Mục tiêu là đọc/ghi sinh viên qua `JsonFileUtils`. Chạy `JsonStudentRepositoryTest`. Nếu test pass, có thể commit phần domain/repository.

Bước 5: tạo `StudentNotFoundException.java`. Mục tiêu là thống nhất error code `STUDENT_NOT_FOUND`. Chạy test service liên quan nếu đã có.

Bước 6: tạo `StudentService.java`. Mục tiêu là tìm sinh viên theo mã và trả lỗi đúng khi không tồn tại. Chạy `StudentServiceTest`. Nếu pass, có thể commit phần service.

Bước 7: tạo `StudentResponse.java` và `StudentMapper.java`. Mục tiêu là không trả trực tiếp model ra API khi đã có DTO. Chạy lại `StudentServiceTest` hoặc test compile backend.

Bước 8: tạo `StudentController.java`. Mục tiêu là có `GET /api/students/{studentId}` đúng envelope. Chạy `StudentControllerTest`. Nếu pass, có thể commit phần Student API.

Bước 9: tạo `LoginRequest.java`. Mục tiêu là nhận `studentId` và `password`, trong đó `studentId` được validate không rỗng. Chạy test compile backend.

Bước 10: tạo `AuthService.java` và `AuthController.java`. Mục tiêu là đăng nhập demo bằng mã sinh viên, không lưu password và không dùng JWT. Chạy `AuthServiceTest` và `AuthControllerTest`. Nếu pass, có thể commit phần Auth.

Bước 11: cập nhật `frontend/src/shared/constants/apiEndpoints.ts` nếu thiếu endpoint Auth/Student. Mục tiêu là frontend dùng chung endpoint constants. Chạy `npm run typecheck`; chỉ commit nếu không lỗi type.

Bước 12: hoàn thiện `frontend/src/features/auth/api/authApi.ts` và `frontend/src/features/auth/types/auth.types.ts`. Mục tiêu là gọi API login và map response thành Student frontend. Chạy `npm run typecheck`.

Bước 13: nối `LoginPage.tsx`. Mục tiêu là submit/loading/error chạy đúng, không đổi giao diện. Chạy `npm run typecheck` và kiểm tra đăng nhập thủ công nếu có backend local.

Bước 14: nối `frontend/src/app/App.tsx` cho current student, remember/session restore và logout. Mục tiêu là login xong vào dashboard, reload vẫn khôi phục khi remember được bật. Chạy `npm run typecheck`.

Bước 15: hoàn thiện `profileApi`, `profile.types` và `ProfilePage.tsx`. Mục tiêu là Profile dùng `GET /api/students/{studentId}`. Chạy `npm run typecheck`.

Bước 16: chạy toàn bộ backend test và package. Mục tiêu là chắc phần Student/Auth không phá module khác. Chỉ commit nếu `clean test` và `clean package` pass.

Bước 17: chạy frontend typecheck/build. Mục tiêu là phần auth/profile compile và build được. Chỉ commit nếu cả hai pass.

Bước 18: kiểm tra `git diff --name-status origin/develop...HEAD`. Mục tiêu là chỉ có file thuộc Student/Auth/Profile và integration nhỏ. Nếu có file lạ, dừng lại và hỏi trưởng nhóm.

## 12. Hướng dẫn từng bước chi tiết

Các file READ ONLY trong phần này gồm `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java` nếu đã đủ contract, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/ApiErrorResponse.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/GlobalExceptionHandler.java`, `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/api/apiError.ts`, `frontend/public/assets/images/login-workspace-illustration.svg` và `data/*.json`. Nếu nghĩ cần sửa các file này, dừng lại và hỏi trưởng nhóm trước.

### Bước 1.1 — Chuẩn bị branch Student/Auth/Profile

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có.
**Mục tiêu:** bắt đầu từ `develop` sạch và tạo `feature/student-auth-profile`.
**Cần làm:** chạy đúng nhóm lệnh tạo branch, kiểm tra `git status`.
**Luồng xử lý:** `develop` mới nhất -> branch riêng -> kiểm tra branch hiện tại.
**Không được làm:** không commit file lạ, không làm trực tiếp trên `develop` hoặc `main`.
**Test:** kiểm tra branch.
**Lệnh kiểm tra:** `git branch --show-current`; `git status --short`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/student-auth-profile` và working tree sạch.
**Commit:** chưa commit.

### Bước 1.2 — Rà soát shared contract trước khi sửa

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`, `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** hiểu ranh giới shared để không sửa nhầm.
**Cần làm:** kiểm tra `User` là abstract, `JsonFileUtils` là điểm đọc ghi JSON, frontend gọi API qua `requestApi`.
**Luồng xử lý:** đọc shared foundation -> ghi chú contract -> chỉ sửa file owned/integration.
**Không được làm:** không đổi chữ ký shared utility, không thêm `fetch` trực tiếp trong page.
**Test:** không cần test vì chỉ đọc.
**Lệnh kiểm tra:** `git diff -- backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java frontend/src/shared/api/httpClient.ts`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có danh sách file READ ONLY không bị sửa.
**Commit:** chưa commit.

### Bước 1.3 — Kiểm tra `User`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java`.
**File cần tạo/sửa:** chỉ sửa file này nếu thiếu contract và đã hỏi trưởng nhóm.
**Mục tiêu:** bảo đảm lớp cha có `id`, `fullName`, constructor, getter/setter.
**Cần làm:** xác nhận `public abstract class User`, field private, constructor không tham số cho Jackson và constructor có `id`, `fullName`.
**Luồng xử lý:** Student kế thừa User -> repository đọc JSON -> service dùng Student.
**Không được làm:** không thêm logic Student, password, token hoặc field riêng của Lecturer vào `User`.
**Test:** compile model khi có sửa.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `User` đúng contract hoặc giữ nguyên nếu đã đúng.
**Commit:** đưa vào nhóm commit `feat(student): implement student domain and persistence` nếu có sửa.

### Bước 1.4 — Hoàn thiện domain `Student`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/User.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java`.
**Mục tiêu:** tạo domain sinh viên kế thừa `User`.
**Cần làm:** giữ field `className`, `major`, `maxCredits`; thêm constructor và getter/setter nếu thiếu.
**Luồng xử lý:** JSON -> `Student` -> repository -> service -> DTO.
**Không được làm:** không thêm password, role, token hoặc rule đăng ký môn.
**Test:** domain compile qua service test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `Student` đóng gói dữ liệu sinh viên, không chứa nghiệp vụ khác.
**Commit:** nhóm commit Student domain/persistence.

### Bước 1.5 — Khóa contract `StudentRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java`.
**Mục tiêu:** thống nhất cổng truy cập dữ liệu sinh viên.
**Cần làm:** giữ method `findById(String studentId)`, `findAll()`, `save(Student student)`.
**Luồng xử lý:** service chỉ gọi interface, không biết file JSON.
**Không được làm:** không đưa `Path`, `File`, `ObjectMapper` hoặc dữ liệu demo vào interface.
**Test:** compile repository qua test repository/service.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonStudentRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có interface đủ method, không phụ thuộc JSON.
**Commit:** nhóm commit Student domain/persistence.

### Bước 1.6 — Hoàn thiện `JsonStudentRepository`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/file/JsonStudentRepository.java`.
**Mục tiêu:** đọc/ghi sinh viên qua utility JSON chung.
**Cần làm:** inject đường dẫn cấu hình, dùng `JsonFileUtils` đọc/ghi `List<Student>`, cài `findById`, `findAll`, `save`.
**Luồng xử lý:** repository -> `JsonFileUtils` -> `data/*.json`.
**Không được làm:** không hard-code ổ đĩa cá nhân, không đọc file trong service/controller.
**Test:** repository test với file tạm.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonStudentRepositoryTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có repository JSON chạy độc lập và không phá seed data.
**Commit:** nhóm commit Student domain/persistence.

### Bước 1.7 — Tạo lỗi `StudentNotFoundException`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/BusinessException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java`.
**Mục tiêu:** chuẩn hóa lỗi sinh viên không tồn tại.
**Cần làm:** kế thừa `BusinessException`, dùng error code `STUDENT_NOT_FOUND`.
**Luồng xử lý:** service không tìm thấy Student -> exception -> `GlobalExceptionHandler` -> `ApiErrorResponse`.
**Không được làm:** không sửa `GlobalExceptionHandler` nếu lỗi đã được xử lý bởi `BusinessException`.
**Test:** service/controller test kiểm tra error code.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi nghiệp vụ đúng error code.
**Commit:** nhóm commit Student API hoặc Student domain/persistence.

### Bước 1.8 — Viết `StudentService.findById`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/exception/StudentNotFoundException.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java`.
**Mục tiêu:** tìm sinh viên theo mã và báo lỗi khi không có.
**Cần làm:** inject `StudentRepository`, cài `findById(String studentId)`.
**Luồng xử lý:** nhận `studentId` -> repository `findById` -> trả Student hoặc ném `StudentNotFoundException`.
**Không được làm:** không mở file JSON, không trả `null`, không swallow exception.
**Test:** success và not found.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có service trả đúng Student hoặc `STUDENT_NOT_FOUND`.
**Commit:** nhóm commit Student API sau khi test pass.

### Bước 1.9 — Viết `StudentService.findAll`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java`.
**Mục tiêu:** hỗ trợ đọc danh sách sinh viên khi cần test hoặc quản lý.
**Cần làm:** gọi `StudentRepository.findAll()` và trả danh sách.
**Luồng xử lý:** service -> repository -> danh sách Student.
**Không được làm:** không lọc business ngoài yêu cầu, không mutate danh sách gốc nếu không cần.
**Test:** danh sách trả đúng dữ liệu mock.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có `findAll()` đơn giản, dễ test.
**Commit:** nhóm commit Student API.

### Bước 1.10 — Tạo `StudentResponse`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/model/Student.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/StudentResponse.java`.
**Mục tiêu:** API không trả trực tiếp domain model.
**Cần làm:** khai báo field `studentId`, `fullName`, `className`, `major`, `maxCredits`.
**Luồng xử lý:** `Student` -> mapper -> `StudentResponse` -> `ApiResponse`.
**Không được làm:** không thêm password, token hoặc field chưa có nguồn dữ liệu bắt buộc.
**Test:** controller test kiểm tra JSON field.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO đúng contract response.
**Commit:** nhóm commit Student API.

### Bước 1.11 — Tạo `StudentMapper`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/response/StudentResponse.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/StudentMapper.java`.
**Mục tiêu:** gom logic chuyển `Student` sang DTO.
**Cần làm:** map `id` sang `studentId`, `fullName`, `className`, `major`, `maxCredits`.
**Luồng xử lý:** controller nhận Student từ service -> mapper -> response.
**Không được làm:** không gọi repository trong mapper, không tự tạo dữ liệu thiếu.
**Test:** controller test hoặc mapper test nếu có.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper không chứa nghiệp vụ.
**Commit:** nhóm commit Student API.

### Bước 1.12 — Tạo `StudentController`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/StudentService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/StudentMapper.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/StudentController.java`.
**Mục tiêu:** mở API `GET /api/students/{studentId}`.
**Cần làm:** dùng `@RequestMapping("/api/students")`, `@GetMapping("/{studentId}")`, trả `ApiResponse.success(...)`.
**Luồng xử lý:** HTTP -> controller -> service -> mapper -> envelope.
**Không được làm:** không đọc file, không trả `Student` trực tiếp, không tạo profile controller riêng.
**Test:** controller success và not found.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=StudentControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có endpoint profile backend dùng được.
**Commit:** nhóm commit Student API.

### Bước 1.13 — Tạo `LoginRequest`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/AuthController.java` nếu đã có.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/LoginRequest.java`.
**Mục tiêu:** chuẩn hóa request đăng nhập demo.
**Cần làm:** khai báo `studentId`, `password`; validate `studentId` không rỗng.
**Luồng xử lý:** JSON request -> `LoginRequest` -> `AuthService.login`.
**Không được làm:** không validate password như hệ thống thật, không lưu password.
**Test:** request blank trả validation error ở controller test.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=AuthControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có DTO nhận đúng request login.
**Commit:** nhóm commit Auth.

### Bước 1.14 — Viết `AuthService.login`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/repository/StudentRepository.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/dto/request/LoginRequest.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/AuthService.java`.
**Mục tiêu:** đăng nhập demo bằng mã sinh viên.
**Cần làm:** nhận `LoginRequest`, tìm Student theo `studentId`, trả Student nếu tồn tại.
**Luồng xử lý:** request -> repository `findById` -> Student hoặc `StudentNotFoundException`.
**Không được làm:** không kiểm tra mật khẩu thật, không log password, không dùng JWT hoặc Spring Security.
**Test:** login hợp lệ và mã sinh viên không tồn tại.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=AuthServiceTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có login demo trả Student đúng contract.
**Commit:** nhóm commit Auth.

### Bước 1.15 — Tạo `AuthController`

**File cần mở trước:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/service/AuthService.java`, `backend/src/main/java/vn/edu/phenikaa/courseregistration/mapper/StudentMapper.java`.
**File cần tạo/sửa:** `backend/src/main/java/vn/edu/phenikaa/courseregistration/controller/AuthController.java`.
**Mục tiêu:** mở API `POST /api/auth/login`.
**Cần làm:** dùng `@RequestMapping("/api/auth")`, `@PostMapping("/login")`, `@Valid LoginRequest`, trả `StudentResponse`.
**Luồng xử lý:** HTTP -> controller -> auth service -> mapper -> envelope.
**Không được làm:** không trả token, không tạo cookie, không expose password.
**Test:** login success, not found, blank studentId.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=AuthControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API login chạy qua envelope chung.
**Commit:** nhóm commit Auth.

### Bước 1.16 — Chạy cụm test backend Student/Auth

**File cần mở trước:** các test backend liên quan Student/Auth.
**File cần tạo/sửa:** chỉ sửa test hoặc code Student/Auth nếu test chỉ ra lỗi thật.
**Mục tiêu:** xác nhận backend Student/Auth ổn trước khi sang frontend.
**Cần làm:** chạy từng test, sửa trong phạm vi owned.
**Luồng xử lý:** repository test -> service test -> controller test.
**Không được làm:** không sửa shared exception/envelope để né test.
**Test:** toàn bộ test Student/Auth.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd -Dtest=JsonStudentRepositoryTest,StudentServiceTest,StudentControllerTest,AuthServiceTest,AuthControllerTest test`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có toàn bộ test Student/Auth pass.
**Commit:** có thể commit `feat(auth): implement student login and profile api`.

### Bước 1.17 — Kiểm tra endpoint constants frontend

**File cần mở trước:** `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** `frontend/src/shared/constants/apiEndpoints.ts` nếu thiếu `AUTH_LOGIN` hoặc `STUDENT_BY_ID`.
**Mục tiêu:** mọi API auth/profile dùng constant chung.
**Cần làm:** đảm bảo endpoint `/auth/login` và `/students/{studentId}` tồn tại.
**Luồng xử lý:** feature API -> endpoint constant -> `requestApi`.
**Không được làm:** không hard-code URL trong component.
**Test:** TypeScript compile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có endpoint constant đủ cho auth/profile.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.18 — Hoàn thiện type frontend auth

**File cần mở trước:** `frontend/src/features/auth/types/auth.types.ts`, `frontend/src/features/profile/types/profile.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/auth/types/auth.types.ts`.
**Mục tiêu:** form login và request login có type rõ.
**Cần làm:** giữ `LoginFormState` gồm `studentId`, `password`, `rememberMe`; `LoginRequest` gồm `studentId`, `password`.
**Luồng xử lý:** form state -> request -> `authApi.login`.
**Không được làm:** không đưa password vào model Student frontend sau login.
**Test:** TypeScript compile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có auth type khớp backend.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.19 — Hoàn thiện type và mapper profile

**File cần mở trước:** `frontend/src/features/profile/types/profile.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/profile/types/profile.types.ts`.
**Mục tiêu:** map `ApiStudent` sang `Student` frontend.
**Cần làm:** map `studentId -> id`, `fullName -> name`, giữ `className`, `major`, `maxCredits`.
**Luồng xử lý:** API response -> `mapApiStudentToStudent` -> state App/Profile.
**Không được làm:** không tự bịa email, phone, CPA thành dữ liệu bắt buộc nếu backend chưa trả.
**Test:** TypeScript compile và render profile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có mapper profile không lệch field.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.20 — Hoàn thiện `authApi.login`

**File cần mở trước:** `frontend/src/shared/api/httpClient.ts`, `frontend/src/shared/constants/apiEndpoints.ts`.
**File cần tạo/sửa:** `frontend/src/features/auth/api/authApi.ts`.
**Mục tiêu:** gọi backend login qua shared client.
**Cần làm:** dùng `requestApi<LoginResponse>` với `AUTH_LOGIN`, method `POST`, JSON body.
**Luồng xử lý:** LoginPage submit -> `authApi.login` -> `requestApi` -> backend.
**Không được làm:** không gọi `fetch` trực tiếp, không xử lý envelope lặp lại trong page.
**Test:** TypeScript compile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API adapter login dùng shared client.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.21 — Hoàn thiện `profileApi`

**File cần mở trước:** `frontend/src/shared/constants/apiEndpoints.ts`, `frontend/src/features/profile/types/profile.types.ts`.
**File cần tạo/sửa:** `frontend/src/features/profile/api/profileApi.ts`.
**Mục tiêu:** profile lấy dữ liệu Student thật.
**Cần làm:** gọi `STUDENT_BY_ID(studentId)` bằng `requestApi<ApiStudent>`, map sang `Student`.
**Luồng xử lý:** ProfilePage/App -> `profileApi` -> backend Student API -> mapper.
**Không được làm:** không đọc mock data trực tiếp trong API adapter.
**Test:** TypeScript compile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có API profile khớp `GET /api/students/{studentId}`.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.22 — Nối submit trong `LoginPage`

**File cần mở trước:** `frontend/src/features/auth/pages/LoginPage.tsx`, `frontend/src/features/auth/api/authApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/auth/pages/LoginPage.tsx`.
**Mục tiêu:** form login gọi API, có loading và error.
**Cần làm:** gọi callback submit hoặc `authApi.login` theo cấu trúc hiện có, disable nút khi loading, hiển thị lỗi backend.
**Luồng xử lý:** nhập mã sinh viên -> submit -> loading -> success vào App hoặc error trên form.
**Không được làm:** không redesign layout, không thay ảnh, không lưu password.
**Test:** TypeScript compile và kiểm tra thủ công login demo.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có login page giữ nguyên giao diện nhưng có behavior API.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.23 — Quản lý current student trong `App`

**File cần mở trước:** `frontend/src/app/App.tsx`, `frontend/src/features/auth/api/authApi.ts`, `frontend/src/features/profile/types/profile.types.ts`.
**File cần tạo/sửa:** `frontend/src/app/App.tsx`.
**Mục tiêu:** đăng nhập xong vào dashboard bằng Student thật.
**Cần làm:** lưu current student trong state, truyền xuống Header/Profile, xử lý logout.
**Luồng xử lý:** LoginPage success -> App set student -> render dashboard.
**Không được làm:** không hard-code `23010690` làm nguồn chính, không đổi routing thủ công ngoài phạm vi.
**Test:** TypeScript compile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có flow login -> dashboard chạy bằng state thật.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.24 — Xử lý remember/session restore

**File cần mở trước:** `frontend/src/app/App.tsx`, `frontend/src/features/profile/api/profileApi.ts`.
**File cần tạo/sửa:** `frontend/src/app/App.tsx`.
**Mục tiêu:** reload trang vẫn khôi phục sinh viên khi remember được bật.
**Cần làm:** chỉ lưu mã sinh viên, khi reload gọi profile API để lấy Student.
**Luồng xử lý:** remember true -> lưu studentId -> reload -> fetch profile -> set current student.
**Không được làm:** không lưu password hoặc toàn bộ credential trong storage.
**Test:** TypeScript compile và kiểm tra reload thủ công.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có restore session tối thiểu, không lưu thông tin nhạy cảm.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.25 — Nối `ProfilePage`

**File cần mở trước:** `frontend/src/features/profile/pages/ProfilePage.tsx`, `frontend/src/features/profile/api/profileApi.ts`.
**File cần tạo/sửa:** `frontend/src/features/profile/pages/ProfilePage.tsx`.
**Mục tiêu:** profile hiển thị dữ liệu Student từ API/state.
**Cần làm:** nhận student hiện tại hoặc fetch lại theo `studentId`, có loading/error nếu cần.
**Luồng xử lý:** tab Profile -> lấy Student -> render thông tin.
**Không được làm:** không tự thêm dữ liệu bắt buộc chưa có backend, không đổi layout lớn.
**Test:** TypeScript compile và kiểm tra tab Profile.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có Profile dùng `GET /api/students/{studentId}`.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.26 — Kiểm tra lỗi frontend API

**File cần mở trước:** `frontend/src/shared/api/apiError.ts`, `frontend/src/features/auth/pages/LoginPage.tsx`.
**File cần tạo/sửa:** chỉ sửa `LoginPage.tsx` hoặc feature adapter nếu hiển thị lỗi sai.
**Mục tiêu:** lỗi `STUDENT_NOT_FOUND` và `VALIDATION_ERROR` hiển thị dễ hiểu.
**Cần làm:** dùng error từ shared client, không tự parse response thô trong component.
**Luồng xử lý:** backend error -> `ApiError` -> state lỗi -> UI.
**Không được làm:** không sửa shared error nếu không có lỗi thật.
**Test:** TypeScript compile, thử mã sinh viên không tồn tại.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có lỗi login/profile rõ ràng.
**Commit:** nhóm commit Frontend auth/profile.

### Bước 1.27 — Chạy frontend typecheck sau auth/profile

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa file frontend Student/Auth/Profile nếu typecheck báo lỗi.
**Mục tiêu:** đảm bảo toàn bộ frontend compile type.
**Cần làm:** chạy typecheck, xử lý lỗi theo đúng phạm vi.
**Luồng xử lý:** typecheck -> đọc lỗi -> sửa file owned/integration -> chạy lại.
**Không được làm:** không tắt strict/type bằng cấu hình chung để né lỗi.
**Test:** frontend typecheck.
**Lệnh kiểm tra:** từ `frontend`: `npm run typecheck`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có typecheck pass.
**Commit:** có thể commit `feat(frontend): connect auth and profile`.

### Bước 1.28 — Chạy backend package cục bộ

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa backend Student/Auth nếu package lỗi do phần này.
**Mục tiêu:** bảo đảm backend đóng gói được.
**Cần làm:** chạy package sau khi test nhỏ đã pass.
**Luồng xử lý:** Maven compile -> test -> package.
**Không được làm:** không bỏ test để package pass.
**Test:** backend package.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd clean package`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có backend package thành công.
**Commit:** nhóm commit Tests/fixes nếu có sửa nhỏ.

### Bước 1.29 — Chạy frontend build

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa frontend Auth/Profile nếu build lỗi do phần này.
**Mục tiêu:** bảo đảm production build không lỗi.
**Cần làm:** chạy build, kiểm tra không có import sai hoặc asset lỗi.
**Luồng xử lý:** typecheck pass -> Vite build.
**Không được làm:** không xóa UI hoặc asset để né lỗi.
**Test:** frontend build.
**Lệnh kiểm tra:** từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có frontend build thành công.
**Commit:** nhóm commit Tests/fixes nếu có sửa nhỏ.

### Bước 1.30 — Kiểm tra luồng login thủ công

**File cần mở trước:** `frontend/src/features/auth/pages/LoginPage.tsx`, `frontend/src/app/App.tsx`.
**File cần tạo/sửa:** chỉ sửa file auth/app nếu flow sai.
**Mục tiêu:** xác nhận người dùng đăng nhập được bằng mã sinh viên có trong data.
**Cần làm:** chạy backend và frontend local nếu cần, thử login mã hợp lệ và mã sai.
**Luồng xử lý:** browser -> login -> backend -> dashboard/profile.
**Không được làm:** không sửa dữ liệu seed để làm test pass nếu seed đã đúng.
**Test:** kiểm tra thủ công.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd spring-boot:run`; từ `frontend`: `npm run dev`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có login success, login fail và logout hoạt động.
**Commit:** chưa commit riêng nếu không sửa.

### Bước 1.31 — Kiểm tra diff phạm vi backend

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có nếu diff đúng.
**Mục tiêu:** đảm bảo không động vào Course/Registration/Timetable.
**Cần làm:** xem danh sách file thay đổi.
**Luồng xử lý:** git diff -> so với bảng ownership -> xử lý file lạ.
**Không được làm:** không giữ file ngoài phạm vi trong branch.
**Test:** kiểm tra diff.
**Lệnh kiểm tra:** `git diff --name-status origin/develop...HEAD -- backend/`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải chỉ thấy file Student/Auth/Profile backend đúng phạm vi.
**Commit:** chưa commit, dùng để rà trước commit.

### Bước 1.32 — Kiểm tra diff phạm vi frontend

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có nếu diff đúng.
**Mục tiêu:** đảm bảo frontend chỉ sửa Auth/Profile và integration nhỏ.
**Cần làm:** xem danh sách file frontend thay đổi.
**Luồng xử lý:** git diff -> so với bảng ownership -> hỏi trưởng nhóm nếu có file lạ.
**Không được làm:** không sửa Course/Registration/Timetable trong nhánh này.
**Test:** kiểm tra diff.
**Lệnh kiểm tra:** `git diff --name-status origin/develop...HEAD -- frontend/`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có diff frontend đúng phạm vi.
**Commit:** chưa commit, dùng để rà trước commit.

### Bước 1.33 — Chạy bộ kiểm tra cuối

**File cần mở trước:** không có.
**File cần tạo/sửa:** chỉ sửa lỗi phát sinh trong phạm vi sở hữu.
**Mục tiêu:** xác nhận nhánh sẵn sàng tạo Pull Request.
**Cần làm:** chạy đủ backend test/package và frontend typecheck/build.
**Luồng xử lý:** backend test -> backend package -> frontend typecheck -> frontend build.
**Không được làm:** không bỏ qua lệnh nào.
**Test:** full local verification.
**Lệnh kiểm tra:** từ `backend`: `.\mvnw.cmd clean test`; từ `backend`: `.\mvnw.cmd clean package`; từ `frontend`: `npm run typecheck`; từ `frontend`: `npm run build`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có bốn lệnh đều pass.
**Commit:** commit Tests/fixes nếu có sửa sau kiểm tra.

### Bước 1.34 — Gom commit đúng nhóm

**File cần mở trước:** `git diff --name-status`.
**File cần tạo/sửa:** không có.
**Mục tiêu:** lịch sử commit dễ review.
**Cần làm:** gom theo Student domain/persistence, Student API, Auth, Frontend auth/profile, Tests/fixes.
**Luồng xử lý:** stage file cùng nhóm -> commit message rõ -> kiểm tra lại status.
**Không được làm:** không commit screenshot, `node_modules`, `dist`, file cấu hình máy cá nhân.
**Test:** kiểm tra status sau commit.
**Lệnh kiểm tra:** `git status --short`; `git log --oneline -5`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có các commit nhỏ, không có file lạ được stage.
**Commit:** dùng các message gợi ý ở mục commit plan.

### Bước 1.35 — Rà trước khi push Pull Request

**File cần mở trước:** không có.
**File cần tạo/sửa:** không có nếu mọi thứ đúng.
**Mục tiêu:** chỉ push branch feature khi đã đủ test và đúng phạm vi.
**Cần làm:** kiểm tra branch, status, log, diff với `origin/develop`.
**Luồng xử lý:** branch đúng -> status sạch -> test pass -> push branch feature.
**Không được làm:** không push `develop`, không push `main`, không push file ngoài phạm vi.
**Test:** kiểm tra cuối.
**Lệnh kiểm tra:** `git branch --show-current`; `git status --short`; `git diff --name-status origin/develop...HEAD`.
**Kết quả cần đạt:** Kết thúc bước này bạn phải có branch `feature/student-auth-profile` sẵn sàng Pull Request.
**Commit:** không tạo commit mới nếu không có thay đổi.

## 13. Test bắt buộc

Backend:

- `JsonStudentRepositoryTest`
- `StudentServiceTest`
- `StudentControllerTest`
- `AuthServiceTest`
- `AuthControllerTest`

Scenario tối thiểu:

- tìm sinh viên tồn tại;
- tìm sinh viên không tồn tại;
- login hợp lệ;
- login mã sinh viên không tồn tại;
- `studentId` blank;
- profile success;
- profile not found.

Không cần test getter/setter.

## 14. Commit plan

Gợi ý commit:

```text
feat(student): implement student domain and persistence
feat(auth): implement student login and profile api
feat(frontend): connect auth and profile
test(student): cover student and authentication flows
```

Chỉ commit khi phần tương ứng đã chạy được. Không tạo commit rỗng.

## 15. Kiểm tra trước khi push

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

## 16. Push và Pull Request

```powershell
git push -u origin feature/student-auth-profile
```

Tạo Pull Request:

- Base: `develop`
- Compare: `feature/student-auth-profile`
- Title: `[Student] Hoàn thiện sinh viên, đăng nhập và hồ sơ`

## Điều kiện để được tạo Pull Request

- [ ] Đúng branch `feature/student-auth-profile`
- [ ] Chỉ sửa file đúng phạm vi
- [ ] API đúng contract
- [ ] Không lưu password
- [ ] Không dùng JWT
- [ ] Không hard-code mã sinh viên
- [ ] Không debug/log tạm
- [ ] Backend test pass
- [ ] Backend package pass
- [ ] Frontend typecheck pass
- [ ] Frontend build pass
- [ ] Commit author đúng
- [ ] Git status sạch
- [ ] Không push `develop` hoặc `main`

Hoàn thành các bước trên rồi tạo Pull Request và chờ trưởng nhóm review.
