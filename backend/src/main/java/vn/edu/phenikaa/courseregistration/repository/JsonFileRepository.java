package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;

/**
 * Repository interface nền tảng cho các repository lưu dữ liệu bằng JSON file.
 *
 * @param <T> kiểu model được repository quản lý.
 */
public interface JsonFileRepository<T> {
    /**
     * Đọc toàn bộ bản ghi từ nguồn dữ liệu JSON tương ứng.
     *
     * @return danh sách bản ghi; trả về danh sách rỗng nếu file chưa tồn tại.
     */
    List<T> findAll();

    /**
     * Ghi đè toàn bộ danh sách bản ghi xuống nguồn dữ liệu JSON tương ứng.
     *
     * @param items danh sách bản ghi cần lưu.
     */
    void saveAll(List<T> items);
}
