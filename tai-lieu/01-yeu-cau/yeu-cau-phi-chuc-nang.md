# Yêu cầu phi chức năng

- Dự án chạy local trên Windows với Java 21, Node.js và npm.
- Backend không phụ thuộc database ngoài.
- Dữ liệu JSON đọc/ghi bằng UTF-8.
- API trả response thống nhất qua `ApiResponse` và `ApiErrorResponse`.
- Frontend không treo vô hạn khi backend không phản hồi.
- Script dùng đường dẫn tương đối, không hard-code máy cá nhân.
- Không commit `node_modules`, `dist`, `target`, file `.env.local` hoặc log.

