package vn.edu.phenikaa.courseregistration.interfaces;

/**
 * Contract dùng chung cho nghiệp vụ có khả năng thực hiện đăng ký học phần.
 *
 * <p>Interface này chỉ mô tả hành vi ở mức hợp đồng. Việc kiểm tra sinh viên,
 * học phần, sức chứa, tín chỉ và trùng lịch phải được triển khai trong service
 * và validator cụ thể ở các phase nghiệp vụ sau.</p>
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
