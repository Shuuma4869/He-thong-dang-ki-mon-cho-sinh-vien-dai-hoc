# Cấu trúc thư mục

```text
.
+-- frontend/          React + TypeScript + Vite
+-- backend/           Spring Boot REST API
+-- data/              Dữ liệu JSON demo
+-- tai-lieu/          Tài liệu phân tích, thiết kế, vận hành, báo cáo
+-- kiem-thu/          Tài liệu kiểm thử và kết quả kiểm thử
+-- thiet-ke/          Tài nguyên thiết kế và UML
+-- ho-so-nop-bai/     Sơ đồ, ảnh demo, minh chứng kiểm thử
+-- scripts/           Script chạy và kiểm tra dự án
+-- .github/           Mẫu GitHub
+-- README.md          Hướng dẫn ngắn ở root
```

Frontend không đọc trực tiếp `data/*.json`. Backend chỉ đọc/ghi JSON trong tầng repository/file qua `JsonFileUtils`.