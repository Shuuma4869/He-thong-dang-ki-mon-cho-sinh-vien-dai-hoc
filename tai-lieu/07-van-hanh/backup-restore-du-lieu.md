# Backup và restore dữ liệu

Dữ liệu runtime nằm trong:

- `data/students.json`.
- `data/lecturers.json`.
- `data/courses.json`.
- `data/registrations.json`.

Trước khi demo đăng ký/hủy nhiều lần, có thể copy thư mục `data/` sang nơi khác. Sau demo, restore bằng cách chép lại các file JSON baseline.

Sau khi restore, kiểm tra:

```powershell
git diff -- data
```

Kết quả mong muốn: không có diff.

