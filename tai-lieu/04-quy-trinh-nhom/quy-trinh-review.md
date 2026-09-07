# Quy trình review

Checklist review:

- Code đúng module được phân công.
- Không đọc JSON trực tiếp ngoài repository/file.
- Không đưa mock vào runtime core.
- Không commit `node_modules`, `dist`, `target`, log hoặc `.env.local`.
- Backend test pass nếu sửa backend.
- Frontend typecheck/build pass nếu sửa frontend.
- Tài liệu cập nhật khi đổi API hoặc nghiệp vụ.
