# Chiến lược kiểm thử

Backend dùng JUnit 5, Mockito và MockMvc. Test tập trung vào service, validator, repository JSON và controller API.

Test pyramid ở quy mô đồ án:

- Nhiều unit test cho service, validator, repository.
- Một lớp controller test với MockMvc để kiểm tra envelope và status code.
- Manual E2E qua browser để kiểm tra luồng thật frontend -> backend -> JSON.

Frontend chưa thêm framework test riêng. Kiểm tra bắt buộc là `npm run typecheck`, `npm run build` và browser/manual E2E.

