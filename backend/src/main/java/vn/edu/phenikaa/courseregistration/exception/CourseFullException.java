package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi học phần đã đạt sĩ số tối đa.
 */
public class CourseFullException extends BusinessException {
    public static final String ERROR_CODE = "COURSE_FULL";

    public CourseFullException(String courseId) {
        super(ERROR_CODE, "Học phần đã đầy: " + courseId);
    }
}
