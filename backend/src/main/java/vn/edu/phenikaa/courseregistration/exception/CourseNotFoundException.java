package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi dùng chung khi không tìm thấy học phần.
 */
public class CourseNotFoundException extends BusinessException {
    public static final String ERROR_CODE = "COURSE_NOT_FOUND";

    public CourseNotFoundException(String courseId) {
        super(ERROR_CODE, "Không tìm thấy học phần: " + courseId);
    }
}
