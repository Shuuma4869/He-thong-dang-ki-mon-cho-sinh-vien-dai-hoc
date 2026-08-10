# Thành viên 1 - Student, đăng nhập và hồ sơ sinh viên

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
    "studentId": "SV001",
    "fullName": "...",
    "className": "...",
    "major": "...",
    "maxCredits": 10
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
  "studentId": "SV001",
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

## 12. Test bắt buộc

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

## 13. Commit plan

Gợi ý commit:

```text
feat(student): implement student domain and persistence
feat(auth): implement student login and profile api
feat(frontend): connect auth and profile
test(student): cover student and authentication flows
```

Chỉ commit khi phần tương ứng đã chạy được. Không tạo commit rỗng.

## 14. Kiểm tra trước khi push

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
cd ..\frontend
npm run typecheck
npm run build
cd ..
```

## 15. Push và Pull Request

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
