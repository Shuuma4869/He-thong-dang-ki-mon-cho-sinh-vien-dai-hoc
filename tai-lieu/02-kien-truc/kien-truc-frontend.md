# Kiến trúc frontend

Frontend là ứng dụng React single-page dashboard. Routing hiện được điều khiển bằng state tab trong `frontend/src/app/App.tsx`, chưa dùng React Router.

## Cấu trúc

- `frontend/src/app`: entry, App và route/tab constants.
- `frontend/src/features/auth`: login demo và API auth.
- `frontend/src/features/courses`: danh sách, chi tiết, tìm kiếm môn học.
- `frontend/src/features/registration`: môn đã đăng ký, đăng ký và hủy đăng ký.
- `frontend/src/features/timetable`: thời khóa biểu.
- `frontend/src/features/dashboard`: dashboard composition.
- `frontend/src/features/profile`: hồ sơ sinh viên.
- `frontend/src/features/notifications`: thông báo demo/local.
- `frontend/src/shared`: API client, constants, layout, UI components và shared types.
- `frontend/src/mocks`: dữ liệu hỗ trợ notifications và fallback UI chưa thuộc backend persistence.
- `frontend/src/styles`: CSS chính.

## Shared API

Các file contract:

- `frontend/src/shared/api/httpClient.ts`
- `frontend/src/shared/api/apiError.ts`
- `frontend/src/shared/constants/apiEndpoints.ts`
- `frontend/src/shared/constants/app.ts`

`requestApi<T>` unwrap envelope `ApiResponse<T>` từ backend và trả về `data`. Khi response lỗi, `httpClient` ném `ApiError` có `status`, `errorCode` và `details`.

API base mặc định:

```text
http://localhost:8080/api
```

Có thể override bằng `VITE_API_BASE_URL`.

## Feature runtime API thật

- Auth: `authApi.login`.
- Profile: `profileApi.getStudentById`.
- Courses: `courseApi.getCourses`, `getCourseById`, `searchCourses`.
- Registration: `registrationApi.getRegistrations`, `registerCourse`, `cancelCourse`.
- Timetable: `timetableApi.getTimetable`.
- Dashboard: tổng hợp dữ liệu từ state/API đã có, không gọi backend endpoint riêng.

Course list hien dung dataset 40 hoc phan tu Course API. Search/filter ap dung tren toan bo ket qua API, sau do frontend phan trang toi da 10 hoc phan/trang. Backend chua co server-side pagination.

## Quy tắc frontend

- Page/component không gọi `fetch` trực tiếp cho flow đã có feature API.
- Frontend không đọc `data/*.json`.
- Không fallback sang mock cho auth/profile/course/registration/timetable runtime.
- `studentId` runtime lấy từ sinh viên đăng nhập trong `App`, không hard-code cho thao tác nghiệp vụ.
- Password không lưu trong localStorage/sessionStorage.
- Remember me chỉ lưu `courseRegistration.studentId`.

## Notifications

Notifications được giữ ở frontend demo/local state:

- unread count
- mark read
- mark all read

Không có backend persistence, realtime hoặc WebSocket.
