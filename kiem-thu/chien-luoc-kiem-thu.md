# Chiến lược kiểm thử

Backend dùng JUnit 5, Mockito và MockMvc. Maven Surefire chạy unit test; Maven Failsafe chạy integration test `*IT.java` trong phase `integration-test` và kiểm tra kết quả ở phase `verify`.

Test pyramid ở quy mô đồ án:

- Nhiều unit test cho service, validator, repository.
- Controller slice `@WebMvcTest` có mock service để kiểm tra request, response và status code; nhóm này vẫn là unit test.
- Integration test dùng `@SpringBootTest` và MockMvc không mock service/repository, đi qua controller -> service -> JSON repository -> test data.
- Smoke test chạy backend thật và gọi API bằng `curl.exe`.
- Manual E2E qua browser kiểm tra frontend -> backend -> JSON.

Frontend chưa thêm framework test riêng. Kiểm tra bắt buộc là `npm run typecheck`, `npm run build` và browser/manual E2E.

Integration test sao chép fixture từ `backend/src/test/resources/integration-data/` vào thư mục tạm trước từng test. Test có thể ghi dữ liệu nhưng không thay đổi `data/*.json` của môi trường development.
