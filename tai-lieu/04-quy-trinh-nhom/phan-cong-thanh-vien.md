# Phân công thành viên

File này dùng để nhóm cập nhật phân công chính thức.

Gợi ý module theo kiến trúc hiện tại:

- Frontend UI và API client.
- Backend model/service/validator.
- Repository JSON File IO.
- REST API/DTO/controller.
- Kiểm thử và tài liệu demo.

Các thành viên nên làm trên branch riêng từ `develop`, ví dụ `feature/course-ui` hoặc `feature/registration-service`.

Những contract dùng chung không tự ý đổi nếu chưa thống nhất:

- REST API paths trong `tai-lieu/03-thiet-ke/thiet-ke-api-rest.md`.
- Response envelope `ApiResponse` và `ApiErrorResponse`.
- Validator order trong `tai-lieu/03-thiet-ke/thiet-ke-validator.md`.
- JSON schema trong `tai-lieu/02-kien-truc/schema-json.md`.
- Luồng backend Controller -> Service -> Validator -> Repository -> JsonFileUtils.
