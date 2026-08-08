# Kiến trúc tổng thể

Dự án dùng cấu trúc monorepo:

- `frontend/`: giao diện React/TypeScript/Vite, hiện vẫn chạy bằng mock data.
- `backend/`: Spring Boot skeleton, đã khóa shared technical foundation.
- `data/`: JSON data starter, hiện là các mảng rỗng.
- `tai-lieu/`: tài liệu phân tích, kiến trúc, thiết kế, quy trình và vận hành.

## Trạng thái hiện tại

Starter đã có nền kỹ thuật dùng chung cho backend và frontend, nhưng chưa hoàn thành nghiệp vụ Student, Course và Registration.

Frontend chưa chuyển sang API thật. Các màn hình hiện tại tiếp tục dùng mock data để demo giao diện.

Backend chưa dùng database, JPA, Hibernate, JWT hoặc Spring Security. Dữ liệu phase sau được định hướng lưu trong JSON file.

## Luồng backend bắt buộc

Mọi nghiệp vụ backend phải đi theo thứ tự:

```text
Controller
-> Service
-> Validator nếu có
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

Không được phá vỡ luồng này.

## Ranh giới trách nhiệm

- Controller chỉ nhận request, gọi service và trả response DTO.
- Service chứa điều phối nghiệp vụ, không tự mở file.
- Validator chứa rule kiểm tra, không tự mở file.
- Repository interface định nghĩa thao tác dữ liệu.
- Json repository triển khai repository bằng JSON file.
- `JsonFileUtils` là điểm duy nhất đọc/ghi file JSON.
- Model chỉ biểu diễn dữ liệu, không đọc JSON.
- Frontend không đọc trực tiếp `data/*.json`.

