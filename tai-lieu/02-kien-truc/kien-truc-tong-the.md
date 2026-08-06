# Kiến trúc tổng thể

Dự án dùng cấu trúc monorepo:

- `frontend/`: giao diện React/TypeScript/Vite, hiện chạy bằng mock data.
- `backend/`: Spring Boot skeleton, chuẩn bị cho REST API và xử lý nghiệp vụ.
- `data/`: JSON starter, hiện là các mảng rỗng.
- `tai-lieu/`: tài liệu phân tích, thiết kế, quy trình và vận hành.

Ở starter này, frontend chưa kết nối backend. Backend chưa triển khai nghiệp vụ hoàn chỉnh và chưa dùng database.
