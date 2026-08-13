# Quy ước code

- Backend dùng package `vn.edu.phenikaa.courseregistration`.
- Model dùng private fields và getter/setter để Jackson mapping ổn định.
- Controller chỉ nhận request, gọi service và trả response.
- Service xử lý nghiệp vụ, không tự mở file.
- Validator chỉ kiểm tra một rule.
- Frontend gọi API qua `frontend/src/shared/api/httpClient.ts`.
- Không để lại lệnh in log/debug tạm thời trong source.
