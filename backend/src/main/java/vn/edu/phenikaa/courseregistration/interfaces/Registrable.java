package vn.edu.phenikaa.courseregistration.interfaces;

/**
 * Contract dùng chung cho nghiệp vụ có khả năng thực hiện đăng ký học phần.
 *
 * <p>Interface này chỉ mô tả hành vi chung. Các kiểm tra về sinh viên, học phần,
 * sức chứa, tín chỉ và trùng lịch được xử lý trong service và validator.</p>
 */
public interface Registrable {
    /**
     * Thực hiện yêu cầu đăng ký một học phần cho một sinh viên.
     *
     * @param studentId mã định danh sinh viên.
     * @param courseId mã định danh học phần/lớp học phần.
     */
    void register(String studentId, String courseId);
}
