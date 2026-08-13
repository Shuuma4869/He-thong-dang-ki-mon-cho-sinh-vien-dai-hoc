# Unit test JSON File IO

Test class:

- `JsonFileUtilsTest`.
- `JsonStudentRepositoryTest`.
- `JsonCourseRepositoryTest`.
- `JsonLecturerRepositoryTest`.
- `JsonRegistrationRepositoryTest`.

Case `JsonFileUtils`:

- File không tồn tại trả danh sách rỗng.
- File rỗng hoặc malformed JSON ném lỗi phù hợp.
- Dữ liệu UTF-8 đọc được.
- `null` được xử lý thành danh sách rỗng khi ghi.
- Chặn path traversal.
- Ghi rồi đọc lại giữ đúng dữ liệu.

