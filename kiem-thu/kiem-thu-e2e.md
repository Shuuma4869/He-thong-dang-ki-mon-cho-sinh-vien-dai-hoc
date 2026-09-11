# Kiểm thử E2E

Luồng E2E cần kiểm tra sau khi chạy backend và frontend:

1. Mở `http://localhost:3000`.
2. Đăng nhập `23010690`.
3. Xem Dashboard.
4. Mở Hồ sơ sinh viên.
5. Mở Đăng ký môn học và kiểm tra tìm kiếm:
   - Gõ một phần mã học phần như `OOP`, chọn học phần được gợi ý và xác nhận modal chi tiết mở đúng.
   - Gõ `TS.`, xác nhận danh sách gợi ý có nhóm **Giảng viên** và **Học phần liên quan**.
   - Chọn một giảng viên, xác nhận trang danh sách chỉ còn các học phần của giảng viên đó.
   - Tìm tên giảng viên không dấu, ví dụ `pham quoc`, và xác nhận kết quả giống khi nhập tên có dấu.
   - Tìm bằng mã giảng viên như `GV001`, xác nhận các học phần liên quan xuất hiện.
6. Xem chi tiết một môn.
7. Thử môn trùng lịch và môn vượt giới hạn tín chỉ khi dữ liệu baseline còn nguyên.
8. Thử môn đầy và xác nhận nút đăng ký bị khóa.
9. Đăng ký một môn hợp lệ, kiểm tra cập nhật tổng tín chỉ.
10. Kiểm tra môn vừa đăng ký được đánh dấu `Đã đăng ký` (UI chủ động khóa đăng ký trùng); lỗi `DUPLICATE_REGISTRATION` được kiểm tra trong integration test/API.
11. Hủy môn vừa đăng ký.
12. Xem Thời khóa biểu.
13. Đăng xuất rồi đăng nhập lại `23010690`.
14. Đăng nhập `SV002` để kiểm tra empty state.
15. Thử `SV999` để kiểm tra lỗi.
