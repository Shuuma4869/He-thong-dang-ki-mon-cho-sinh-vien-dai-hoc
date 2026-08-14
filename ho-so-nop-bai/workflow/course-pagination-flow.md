# Workflow course pagination

Mục tiêu: danh sách học phần dùng dataset thật 40 môn, nhưng mỗi trang chỉ hiển thị tối đa 10 môn để giao diện dễ đọc.

Luồng xử lý:

1. `CourseListPage` gọi `courseApi.getCourses()` hoặc `courseApi.searchCourses(keyword)`.
2. `courseApi` gọi REST API qua `requestApi`.
3. Backend trả danh sách học phần từ `data/courses.json`.
4. Frontend map response sang `Course`, sort theo `course.code`.
5. Search/filter luôn chạy trên toàn bộ kết quả đang có, không chạy trên trang hiện tại.
6. Khi keyword/filter đổi, `currentPage` reset về 1.
7. UI lấy `visibleCourses = filteredCourses.slice(startIndex, startIndex + 10)`.
8. Pagination render `Trước`, `Sau`, và số trang 1-4 khi có 40 môn.

Kiểm tra nhanh:

- Page 1 không cho bấm `Trước`.
- Page 4 không cho bấm `Sau`.
- Search `UX205` vẫn tìm được dù không nằm ở trang đầu.
- Xóa search thì danh sách quay lại 40 môn và 4 trang.
