# Kiến trúc File IO

Dữ liệu backend nằm trong thư mục `data/` ở root dự án:

- `students.json`.
- `lecturers.json`.
- `courses.json`.
- `registrations.json`.

Luồng đọc/ghi bắt buộc:

```text
Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

`JsonFileUtils` là điểm duy nhất thao tác trực tiếp với file. Utility này dùng Jackson, UTF-8, generic `List<T>`, xử lý file không tồn tại bằng danh sách rỗng và chặn tên file không hợp lệ bằng kiểm tra path sau khi normalize.

Controller, service, model và frontend không được mở file JSON trực tiếp.

