package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi không tìm thấy sinh viên.
 */
public class StudentNotFoundException extends BusinessException {
    public static final String ERROR_CODE = "STUDENT_NOT_FOUND";

    public StudentNotFoundException(String studentId) {
        super(ERROR_CODE, "Không tìm thấy sinh viên: " + studentId);
    }
}
