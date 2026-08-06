# Hướng dẫn cho Codex

## Tên dự án

Hệ thống đăng ký môn học - Đại học Phenikaa.

## Mục tiêu

Xây dựng đồ án cuối kỳ môn Lập trình hướng đối tượng bằng Java, gồm frontend React dùng mock data và backend Spring Boot skeleton chuẩn bị cho REST API.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, lucide-react.
- Backend: Java 21, Spring Boot, Maven Wrapper, Spring Web, Validation, Jackson, JUnit 5, Mockito, MockMvc.
- Lưu trữ dự kiến: JSON File IO.

## Cấu trúc folder

- `frontend/`: giao diện React.
- `backend/`: skeleton Spring Boot.
- `data/`: file JSON rỗng ban đầu.
- `tai-lieu/`: tài liệu Markdown tiếng Việt cho người đọc.
- `thiet-ke/`: tài nguyên thiết kế, UML, PlantUML, ảnh.
- `ho-so-nop-bai/`: file DOCX, PPTX, PDF khi nộp bài.
- `scripts/`: script chạy dự án.

## Yêu cầu OOP

Backend phải thể hiện đóng gói, kế thừa, đa hình, trừu tượng, interface hoặc abstract class, collections, exception handling và File IO.

## Quy tắc kỹ thuật

- Đọc tài liệu trong `tai-lieu/` trước khi code.
- Không code trực tiếp trên `main`.
- Không tự ý đổi kiến trúc nền.
- Không tự ý đổi API khi chưa cập nhật tài liệu liên quan.
- Không thêm dependency tùy tiện.
- Không dùng database, JPA, Hibernate trong phạm vi starter này.
- Không thêm Spring Security hoặc JWT trong starter này.
- Không commit `node_modules`, `dist`, `target`, `coverage`.
- Không commit `.env.local` hoặc secret thật.
- Phải chạy build/test phù hợp trước khi báo hoàn thành.
- Không tự push. Chỉ tạo commit khi nhiệm vụ yêu cầu rõ và toàn bộ kiểm tra liên quan đã pass.
