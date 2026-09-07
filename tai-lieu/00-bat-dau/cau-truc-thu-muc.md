# Cấu trúc thư mục

```text
.
+-- .github/           Cấu hình và biểu mẫu GitHub
+-- backend/           Spring Boot REST API; mã nguồn, cấu hình và test Maven
+-- frontend/          React + TypeScript + Vite; assets, app, features và shared
+-- data/              Dữ liệu JSON demo: sinh viên, giảng viên, học phần, đăng ký
+-- ho-so-nop-bai/     Ảnh minh chứng, báo cáo, slide, sơ đồ, use case và workflow
+-- kiem-thu/          Ma trận test, chiến lược, hướng dẫn và báo cáo kiểm thử
+-- scripts/           Script chạy backend, frontend và kiểm tra dự án
+-- tai-lieu/          Tài liệu yêu cầu, kiến trúc, thiết kế, vận hành và demo
+-- .env.example       Biến môi trường mẫu cấp root
+-- .gitignore         Loại trừ dependency và tệp build sinh ra
+-- pom.xml            Maven aggregator của repository
`-- README.md          Điểm bắt đầu và cây thư mục đầy đủ của bản nộp
```

Frontend không đọc trực tiếp `data/*.json`. Backend chỉ đọc/ghi JSON trong tầng repository/file qua `JsonFileUtils`.

`backend/target/`, `frontend/node_modules/` và `frontend/dist/` được sinh khi cài đặt hoặc build nên không thuộc cấu trúc bản nộp.
