package vn.edu.phenikaa.courseregistration.interfaces;

import vn.edu.phenikaa.courseregistration.model.Course;

/**
 * Contract dùng chung cho các validator kiểm tra học phần trước khi đăng ký.
 *
 * <p>Interface này chỉ khóa phương thức kiểm tra. Các rule cụ thể như còn chỗ,
 * trùng môn, trùng lịch hoặc vượt tín chỉ sẽ được tạo ở phase nghiệp vụ riêng.</p>
 */
public interface CourseValidator {
    /**
     * Kiểm tra một học phần theo rule của validator cụ thể.
     *
     * @param course học phần cần kiểm tra.
     */
    void validate(Course course);
}
